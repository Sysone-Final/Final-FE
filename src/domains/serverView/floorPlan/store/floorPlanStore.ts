import { create, type StateCreator } from 'zustand';
import { temporal } from 'zundo';
import { useStore } from 'zustand';
import { CELL_SIZE, HEADER_PADDING } from '../utils/constants';
import type {
  FloorPlanState,
  Asset,
  DisplayOptionsType,
  // DisplayMode,
  DashboardMetricView,
  AssetLayer,
  AssetStatus,
} from '../types';
import { updateEquipment, deleteEquipment } from '@/domains/serverView/view3d/api/serverRoomEquipmentApi';
// import { getDeviceTypeId } from '@/domains/serverView/view3d/constants/deviceTypes';
import type { Equipment3D } from '@/domains/serverView/view3d/types';
import toast from 'react-hot-toast';

export const initialState: FloorPlanState = {
  mode: 'view',
  // displayMode: 'status',
  dashboardMetricView: 'default',
  visibleLayers: {
    floor: true,
    wall: true,
    overhead: true,
  },
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
  gridCols: 15,
  gridRows: 8,
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
      // displayMode: state.displayMode,
      dashboardMetricView: state.dashboardMetricView,
      visibleLayers: state.visibleLayers,
      visibleSeverities: state.visibleSeverities,
    }),
  }),
);


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
  useFloorPlanStore.setState((state) => ({
    assets: state.assets.map((asset) =>
      asset.id === id
        ? { ...asset, ...newProps, updatedAt: new Date().toISOString() }
        : asset,
    ),
  }));

  try {
    const updatedAsset = useFloorPlanStore.getState().assets.find(a => a.id === id);
    if (!updatedAsset) return;

    // 2D Asset -> 3D Equipment 포맷으로 변환 (API 호환용)
    // 실제로는 API가 id와 변경할 필드만 요구하므로 필요한 정보만 매핑합니다.
    const equipmentPayload: Equipment3D = {
      id: updatedAsset.id,
      equipmentId: updatedAsset.id, // ID 매핑 주의
      type: 'server', // 기본값, 실제로는 assetType 매핑 필요하지만 update API는 주로 ID사용
      gridX: updatedAsset.gridX - 1, // 2D(padded) -> 3D(raw) 좌표 변환
      gridY: updatedAsset.gridY - 1,
      gridZ: 0,
      // degree -> radian 변환 (API는 내부적으로 degree를 기대할 수 있으나, 
      // 제공해주신 3D 코드는 radian을 받아서 degree로 변환해 보냄.
      // 여기서는 2D가 degree를 쓰므로 API 스펙에 맞춰 조정 필요.
      // serverRoomEquipmentApi.ts의 buildUpdateDeviceRequest가 radianToDegree를 수행하므로
      // 여기서는 Radian으로 변환해서 줘야 함)
      rotation: (updatedAsset.rotation || 0) * (Math.PI / 180), 
      metadata: {
        name: updatedAsset.name,
        status: updatedAsset.status,
      }
    };
    await updateEquipment(equipmentPayload);

  } catch (err) {
    console.error('Error updating asset:', err);
    useFloorPlanStore.setState({ assets: originalAssets }); // 롤백
    toast.error('자산 업데이트에 실패했습니다.');
  }
};

export const deleteAsset = async (id: string) => {
  const { assets: originalAssets, selectedAssetIds: originalSelectedIds } =
    useFloorPlanStore.getState();

  const assetToDelete = originalAssets.find((asset) => asset.id === id);
  const assetName = assetToDelete?.name ?? '자산';

  // Optimistic Update
  useFloorPlanStore.setState((state) => ({
    assets: state.assets.filter((asset) => asset.id !== id),
    selectedAssetIds: state.selectedAssetIds.filter((sid) => sid !== id),
  }));

  toast.success(`"${assetName}"이(가) 삭제되었습니다.`);

  try {
    // 공통 API 호출
    // deleteEquipment는 타입과 rackId 등을 확인하므로 최소한의 정보 구성
    const equipmentPayload: Equipment3D = {
      id: id,
      equipmentId: id,
      type: assetToDelete?.assetType === 'rack' ? 'server' : 'door', // 단순 매핑
      gridX: 0, gridY: 0, gridZ: 0, rotation: 0,
      rackId: assetToDelete?.data?.rackServerId?.toString() // rackId가 있다면 전달
    };

    await deleteEquipment(equipmentPayload);

  } catch (err) {
    console.error('Error deleting asset:', err);
    // 롤백
    useFloorPlanStore.setState({
      assets: originalAssets,
      selectedAssetIds: originalSelectedIds,
    });
    toast.error(`"${assetName}" 삭제에 실패했습니다.`);
  }
};

export const duplicateAsset = async (id: string) => {
  const original = useFloorPlanStore.getState().assets.find((a) => a.id === id);
  if (!original) return;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, createdAt: __, updatedAt: ___, ...template } = original;
  const newAssetTemplate = {
    ...template,
    name: `${original.name} (Copy)`,
    gridX: original.gridX + 1,
    gridY: original.gridY + 1,
  };

  try {
    //  경로가 소문자 'floorplan'인지 확인
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
  useFloorPlanStore.setState((state) => {
    const nextMode = state.mode === 'view' ? 'edit' : 'view';
    
    return {
      mode: nextMode,
      dashboardMetricView: nextMode === 'edit' ? 'layout' : state.dashboardMetricView,
      selectedAssetIds: [],
      isRackModalOpen: false,
    };
  });

export const setDashboardMetricView = (view: DashboardMetricView) =>
  useFloorPlanStore.setState({ dashboardMetricView: view });

export const toggleLayerVisibility = (layer: AssetLayer) =>
  useFloorPlanStore.setState((state) => ({
    visibleLayers: {
      ...state.visibleLayers,
      [layer]: !state.visibleLayers[layer],
    },
  }));

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

// export const setDisplayMode = (newMode: DisplayMode) =>
//   useFloorPlanStore.setState({ displayMode: newMode });

export const setGridSize = (cols: number, rows: number) =>
  useFloorPlanStore.setState({ gridCols: cols, gridRows: rows });
export const updateServerRoomDetails = async (
 roomId: string,
 newDetails: { gridCols?: number; gridRows?: number },
) => {
 const { gridCols: oldCols, gridRows: oldRows } = useFloorPlanStore.getState();
 const oldSettings = { gridCols: oldCols, gridRows: oldRows };
 
 useFloorPlanStore.setState(newDetails);

 try {
  const response = await fetch(`/api/server-rooms/${roomId}/floorplan/details`, {
   method: 'PUT',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(newDetails),
  });
  if (!response.ok) throw new Error('Failed to update server room details');
 
  console.log('Server room details updated successfully');
  
  //성공 토스트로
  toast.success('서버실 크기가 저장되었습니다.');
 
 } catch (err) {
  console.error('Error updating server room details:', err);
  useFloorPlanStore.setState(oldSettings);
  
  toast.error('서버실 크기 저장에 실패했습니다.');
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
};

export const zoom = (direction: 'in' | 'out') => {
  const { stage } = useFloorPlanStore.getState();
  const zoomFactor = 0.25;
  const newScale =
    direction === 'in'
      ? stage.scale + zoomFactor
      : Math.max(0.1, stage.scale - zoomFactor);
  useFloorPlanStore.setState({ stage: { ...stage, scale: newScale } });
};

export const useHasUnsavedChanges = () => {
  const pastStatesCount = useStore(
    useFloorPlanStore.temporal,
    (state) => state.pastStates.length,
  );
  return pastStatesCount > 0;
};

export const zoomToAsset = (assetId: string) => {
  const { assets } = useFloorPlanStore.getState();
  const stageNode = document.querySelector('.canvas-container');
  if (!stageNode) return;

  const asset = assets.find((a) => a.id === assetId);
  if (!asset) return;

  const { width: stageWidth, height: stageHeight } =
    stageNode.getBoundingClientRect();

  const assetCenterX =
    HEADER_PADDING + (asset.gridX + asset.widthInCells / 2) * CELL_SIZE;
  const assetCenterY =
    HEADER_PADDING + (asset.gridY + asset.heightInCells / 2) * CELL_SIZE;

  const newScale = 1.0;
  const newX = stageWidth / 2 - assetCenterX * newScale;
  const newY = stageHeight / 2 - assetCenterY * newScale;

  setStage({ scale: newScale, x: newX, y: newY });
  useFloorPlanStore.setState({ selectedAssetIds: [assetId] });
};