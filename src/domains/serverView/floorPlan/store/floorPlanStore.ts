import { create, type StateCreator } from 'zustand';
import { temporal } from 'zundo';
import { useStore } from 'zustand';
import type {
  FloorPlanState,
  Asset,
  DisplayOptionsType,
  DisplayMode,
  Mode,
  DashboardMetricView, 
 AssetLayer,     
 AssetStatus,   
} from '../types';

export const initialState: FloorPlanState = {
  mode: 'view',
  displayMode: 'status',
  //  지표 뷰 기본값
  dashboardMetricView: 'default', 
 //  레이어 필터 기본값
 visibleLayers: {
  floor: true,
  wall: true,
  overhead: true,
 },
 //  심각도 필터 기본값
 visibleSeverities: {
  normal: true,
  warning: true,
  danger: true,
 },
  displayOptions: {
    showName: true,
    showStatusIndicator: true,
    showTemperature: true,
    showUUsage: false,
    showPowerStatus: false,
    showAisle: false,
    showPUE: false,
    showFacilities: false,
    showSensors: false,
    useLOD: true,
    showGridLine: true,
  },
  gridCols: 15, // Adjusted default
  gridRows: 8, // Adjusted default
  stage: { scale: 1, x: 0, y: 0 },
  
  assets: [],
  isLoading: true,
  error: null,
  selectedAssetIds: [],
};

const storeCreator: StateCreator<FloorPlanState> = () => initialState;

export const useFloorPlanStore = create<FloorPlanState>()(
  temporal(storeCreator, {
    partialize: (state: FloorPlanState) => ({
      assets: state.assets,
      selectedAssetIds: state.selectedAssetIds,
      gridCols: state.gridCols,
      gridRows: state.gridRows,
      mode: state.mode,
      displayMode: state.displayMode,
      dashboardMetricView: state.dashboardMetricView,
   visibleLayers: state.visibleLayers,
   visibleSeverities: state.visibleSeverities,
    }),
  }),
);

// --- Actions ---

/**
 * (Action) 서버실 ID로 평면도 데이터를 API에서 가져옵니다.
 */
export const fetchFloorPlan = async (roomId: string) => {
  useFloorPlanStore.setState({ isLoading: true, error: null });
  try {
    // --- 경로 handlers.ts와일치---
    const response = await fetch(`/api/server-rooms/${roomId}/floorplan`);

    if (!response.ok) {
        // 응답 상태가 'ok'가 아닐 때 응답 내용을 텍스트로 확인
        const errorText = await response.text();
        console.error('Fetch error response:', errorText);
        throw new Error(`Failed to fetch floor plan data. Status: ${response.status}`);
    }

    // 응답이 성공적일 때만 JSON 파싱 시도
    const data = await response.json();

    useFloorPlanStore.setState({
      assets: data.assets,
      gridCols: data.gridCols,
      gridRows: data.gridRows,
      isLoading: false,
    });
  } catch (err) {
    // JSON 파싱 오류 포함 모든 에러 처리
    console.error('Error in fetchFloorPlan:', err);
    useFloorPlanStore.setState({
      isLoading: false,
      // err 객체가 Error 인스턴스인지 확인 후 메시지 사용
      error: err instanceof Error ? err.message : String(err),
    });
  }
};



export const addAsset = async (newAsset: Omit<Asset, 'id'>) => {
  try {
    const response = await fetch('/api/floorplan/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsset),
    });
    if (!response.ok) throw new Error('Failed to add asset');

    const savedAsset = await response.json();
    useFloorPlanStore.setState((state) => ({
      assets: [...state.assets, savedAsset],
    }));
  } catch (err) {
    console.error('Error adding asset:', err);
    // TODO: 사용자에게 에러 알림
  }
};

export const updateAsset = async (
  id: string,
  newProps: Partial<Omit<Asset, 'id'>>,
) => {
  const originalAssets = useFloorPlanStore.getState().assets;
  // Optimistic Update
  useFloorPlanStore.setState((state) => ({
    assets: state.assets.map((asset) =>
      asset.id === id
        ? { ...asset, ...newProps, updatedAt: new Date().toISOString() }
        : asset,
    ),
  }));

  try {
    const response = await fetch(`/api/floorplan/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProps),
    });
    if (!response.ok) throw new Error('Failed to update asset');
  } catch (err) {
    console.error('Error updating asset:', err);
    // 롤백
    useFloorPlanStore.setState({ assets: originalAssets });
    // TODO: 사용자에게 에러 알림
  }
};

export const deleteAsset = async (id: string) => {
  const { assets: originalAssets, selectedAssetIds: originalSelectedIds } =
    useFloorPlanStore.getState();

  useFloorPlanStore.setState((state) => ({
    assets: state.assets.filter((asset) => asset.id !== id),
    selectedAssetIds: state.selectedAssetIds.filter((sid) => sid !== id),
  }));

  try {
    const response = await fetch(`/api/floorplan/assets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete asset');
  } catch (err) {
    console.error('Error deleting asset:', err);
    useFloorPlanStore.setState({
      assets: originalAssets,
      selectedAssetIds: originalSelectedIds,
    });
    // TODO: 사용자에게 에러 알림
  }
};

export const duplicateAsset = async (id: string) => {
  const original = useFloorPlanStore.getState().assets.find((a) => a.id === id);
  if (!original) return;

  const { id: _, createdAt: __, updatedAt: ___, ...template } = original;
  const newAssetTemplate = {
    ...template,
    name: `${original.name} (Copy)`,
    gridX: original.gridX + 1,
    gridY: original.gridY + 1,
  };

  try {
    const response = await fetch('/api/floorplan/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAssetTemplate),
    });
    if (!response.ok) throw new Error('Failed to duplicate asset');
    const savedAsset = await response.json();
    useFloorPlanStore.setState((state) => ({
      assets: [...state.assets, savedAsset],
    }));
  } catch (err) {
    console.error('Error duplicating asset:', err);
    // TODO: 사용자에게 에러 알림
  }
};

export const toggleMode = () =>
  useFloorPlanStore.setState((state) => ({
    mode: state.mode === 'view' ? 'edit' : 'view',
  }));

// 지표 뷰 변경
export const setDashboardMetricView = (view: DashboardMetricView) =>
 useFloorPlanStore.setState({ dashboardMetricView: view });

// 레이어 가시성 토글
export const toggleLayerVisibility = (layer: AssetLayer) =>
 useFloorPlanStore.setState((state) => ({
  visibleLayers: {
   ...state.visibleLayers,
   [layer]: !state.visibleLayers[layer],
  },
 }));

// 심각도 가시성 토글
export const toggleSeverityVisibility = (status: AssetStatus) =>
 useFloorPlanStore.setState((state) => ({
  visibleSeverities: {
   ...state.visibleSeverities,
   [status]: !state.visibleSeverities[status],
  },
 }));

export const setDisplayOptions = (newOptions: Partial<DisplayOptionsType>) =>
  useFloorPlanStore.setState((state) => ({
    displayOptions: { ...state.displayOptions, ...newOptions },
  }));

export const setDisplayMode = (newMode: DisplayMode) =>
  useFloorPlanStore.setState({ displayMode: newMode });

export const  setGridSize = (cols: number, rows: number) =>
  useFloorPlanStore.setState({ gridCols: cols, gridRows: rows });

// --- 서버실 상세 정보 API 업데이트 액션 ---
export const updateServerRoomDetails = async (
 roomId: string,
 newDetails: { gridCols?: number; gridRows?: number },
) => {
 const { gridCols: oldCols, gridRows: oldRows } = useFloorPlanStore.getState();
 const oldSettings = { gridCols: oldCols, gridRows: oldRows };
 
 // 1. 낙관적 업데이트 (UI 즉시 반영)
 useFloorPlanStore.setState(newDetails);

 try {
  // 2. API 호출
  const response = await fetch(`/api/server-rooms/${roomId}/floorplan/details`, {
   method: 'PUT',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(newDetails),
  });
  if (!response.ok) throw new Error('Failed to update server room details');
 
  console.log('Server room details updated successfully');
 
 } catch (err) {
  console.error('Error updating server room details:', err);
  // 3. 롤백
  useFloorPlanStore.setState(oldSettings);
  alert('서버실 크기 저장에 실패했습니다.'); // TODO: 사용자에게 에러 알림
 }
};

export const setStage = (newStage: FloorPlanState['stage']) =>
  useFloorPlanStore.setState({ stage: newStage });

export const selectAsset = (id: string, isMultiSelect = false) =>
  useFloorPlanStore.setState((state) => {
    const { selectedAssetIds } = state;
    if (isMultiSelect) {
      const newSelection = selectedAssetIds.includes(id)
        ? selectedAssetIds.filter((sid) => sid !== id)
        : [...selectedAssetIds, id];
      return { selectedAssetIds: newSelection };
    }
    if (selectedAssetIds.length === 1 && selectedAssetIds[0] === id)
      return { selectedAssetIds: [] };
    return { selectedAssetIds: [id] };
  });

export const deselectAll = () =>
  useFloorPlanStore.setState({ selectedAssetIds: [] });

export const groupSelectedAssets = () => {
  const { selectedAssetIds } = useFloorPlanStore.getState();
  if (selectedAssetIds.length < 2) return;
  const groupId = `group_${crypto.randomUUID()}`;
  useFloorPlanStore.setState((state) => ({
    assets: state.assets.map((asset) =>
      selectedAssetIds.includes(asset.id) ? { ...asset, groupId } : asset,
    ),
  }));
  // TODO: 그룹 변경 사항 API 업데이트 (여러 자산을 한번에)
};

export const ungroupSelectedAssets = () => {
  const { selectedAssetIds, assets } = useFloorPlanStore.getState();
  const groupIds = new Set(
    assets
      .filter((a) => selectedAssetIds.includes(a.id))
      .map((a) => a.groupId)
      .filter(Boolean),
  );
  if (groupIds.size === 0) return;
  useFloorPlanStore.setState((state) => ({
    assets: state.assets.map((asset) =>
      groupIds.has(asset.groupId) ? { ...asset, groupId: undefined } : asset,
    ),
  }));
  // TODO: 그룹 해제 사항 API 업데이트 (여러 자산을 한번에)
};


// --- (신규) 저장 안 된 변경 사항 확인용 훅 ---
/**
* Zundo 히스토리에 'pastStates' (되돌리기 스택)가 1개 이상 있으면 
* 저장되지 않은 변경 사항이 있는 것으로 간주합니다.
*/
export const zoom = (direction: 'in' | 'out') => {
 const { stage } = useFloorPlanStore.getState();
 const zoomFactor = 0.25;
 const newScale =
  direction === 'in'
   ? stage.scale + zoomFactor
   : Math.max(0.1, stage.scale - zoomFactor);
 useFloorPlanStore.setState({ stage: { ...stage, scale: newScale } });
};

/**
* Zundo 히스토리에 'pastStates' (되돌리기 스택)가 1개 이상 있으면 
* 저장되지 않은 변경 사항이 있는 것으로 간주합니다.
*/
export const useHasUnsavedChanges = () => {
 const pastStatesCount = useStore(
  useFloorPlanStore.temporal,
  (state) => state.pastStates.length,
 );
 return pastStatesCount > 0;
};

//  특정 자산으로 줌하는 액션
export const zoomToAsset = (assetId: string) => {
 const { assets, } = useFloorPlanStore.getState();
 const stageNode = document.querySelector('.canvas-container'); // 캔버스 컨테이너 크기 참조
 if (!stageNode) return;

 const asset = assets.find((a) => a.id === assetId);
 if (!asset) return;

 const { width: stageWidth, height: stageHeight } = stageNode.getBoundingClientRect();

 // (이 값들은 floorPlanHooks.ts와 일치해야 함)
 const CELL_SIZE = 160; 
 const HEADER_PADDING = 80;

 const assetCenterX =
  HEADER_PADDING +
  (asset.gridX + asset.widthInCells / 2) * CELL_SIZE;
 const assetCenterY =
  HEADER_PADDING +
  (asset.gridY + asset.heightInCells / 2) * CELL_SIZE;

 const newScale = 1.0; // 100% 줌으로 설정 (조정 가능)

 const newX = stageWidth / 2 - assetCenterX * newScale;
 const newY = stageHeight / 2 - assetCenterY * newScale;

 setStage({ scale: newScale, x: newX, y: newY });

 useFloorPlanStore.setState({ selectedAssetIds: [assetId] });
};


