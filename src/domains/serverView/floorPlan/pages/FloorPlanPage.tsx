import React, { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import Canvas from '../components/Canvas'; 
import FloatingSidebarPanel from '../components/FloatingSidebarPanel'; 
import { useFloorPlanDragDrop } from '../hooks/useFloorPlanDragDrop';
import { useFloorPlanNavigationGuard } from '../hooks/useFloorPlanNavigationGuard';
import { useFloorPlanStore, initialState, addAsset } from '../store/floorPlanStore';
import { useSidebarStore } from '../store/useSidebarStore';
import RackModal from '@/domains/serverView/components/RackModal';
import { useServerRoomEquipment } from '@/domains/serverView/view3d/hooks/useServerRoomEquipment';
import { transform3DTo2DAssets } from '../utils/dataTransformer';
import EquipmentPalette3D from '@/domains/serverView/view3d/components/EquipmentPalette3D';
import type { EquipmentType } from '@/domains/serverView/view3d/types';
import type { AssetType, AssetLayer } from '../types';

import StatusLegendAndFilters from '../components/LeftSidebar/StatusLegendAndFilters'; 
import TopNWidget from '../components/TopNWidget'; 
import { FloorPlanConfirmationModal } from '../components/FloorPlanConfirmationModal';

interface FloorPlanPageProps {
  containerRef: React.RefObject<HTMLDivElement>;
  serverRoomId: string | undefined;
}

const FloorPlanPage: React.FC<FloorPlanPageProps> = ({ containerRef, serverRoomId }) => {
  // 훅의 반환 값에 맞게 구조분해 할당을 수정합니다.
  // 'data: apiData'가 아니라 'equipment: equipment3D'와 'gridConfig'를 직접 받습니다.
  const { equipment: equipment3D, gridConfig, loading, error } = useServerRoomEquipment(serverRoomId);

  // 스토어 상태 및 사이드바 초기화 (최초 마운트 시 1회)
  const { setLeftSidebarOpen } = useSidebarStore();
  
  useEffect(() => {
    console.log('Initializing 2D FloorPlan Store...');
    // A. 2D 스토어 상태를 초기값으로 리셋
    useFloorPlanStore.setState(initialState, true);
    useFloorPlanStore.temporal.getState().clear();

    // B. 사이드바 상태를 초기값으로 리셋
    setLeftSidebarOpen(true);
  }, [setLeftSidebarOpen]); // 최초 1회 실행

  // API 데이터가 로드되면 2D 스토어에 반영
  useEffect(() => {
    if (loading) {
      console.log('2D API Hook: Loading...');
      useFloorPlanStore.setState({ isLoading: true, error: null });
      return;
    }
    if (error) {
      console.error('2D API Hook: Error', error);
      useFloorPlanStore.setState({ isLoading: false, error: error.message });
      return;
    }
    
  
  if (!loading && !error) {
    
    const sourceGridConfig = gridConfig ?? { columns: 15, rows: 8, cellSize: 2 };

    try {
      const assets2D = transform3DTo2DAssets(
        equipment3D,
        sourceGridConfig,
      );
      console.log('Transformed 2D Assets:', assets2D);

      useFloorPlanStore.setState({
        assets: assets2D,
        gridCols: sourceGridConfig.columns + 2, 
        gridRows: sourceGridConfig.rows + 2,    
        isLoading: false, 
        error: null,
      });
      } catch (transformError) {
        //  transform3DTo2DAssets에서 에러가 나도 로딩이 멈추지 않도록 처리
        console.error('Failed to transform 3D data to 2D:', transformError);
        useFloorPlanStore.setState({ 
          isLoading: false, 
          error: '데이터 변환 중 오류가 발생했습니다.' 
        });
      }
    }
  }, [equipment3D, gridConfig, loading, error]);


  // 페이지 이탈 방지
  useFloorPlanNavigationGuard();
  
  const { handleDragEnd } = useFloorPlanDragDrop(containerRef, serverRoomId);
  const mode = useFloorPlanStore((state) => state.mode);
  // const displayMode = useFloorPlanStore((state) => state.displayMode);
  const dashboardMetricView = useFloorPlanStore((state) => state.dashboardMetricView);
  const isLayoutView = dashboardMetricView === 'layout';
  
  const {
    isLeftSidebarOpen,
    toggleLeftSidebar,
  } = useSidebarStore();

  // 3D -> 2D 타입 매핑 함수
  const map3DTypeTo2DType = (type3D: EquipmentType): AssetType | null => {
    const typeMap: Record<EquipmentType, AssetType | null> = {
      server: 'rack',
      door: 'door_single',
      climatic_chamber: 'crac',
      fire_extinguisher: 'fire_suppression',
      aircon: 'in_row_cooling',
      thermometer: 'leak_sensor',
    };
    return typeMap[type3D] || null;
  };

  // 3D 장비 팔레트에서 자산 추가
  const handleAddEquipment = (type3D: EquipmentType) => {
    const assetType2D = map3DTypeTo2DType(type3D);
    if (!assetType2D) {
      console.warn(`Cannot map 3D type ${type3D} to 2D asset type`);
      return;
    }

    // 자산 추가 로직 (중앙에 배치)
    const newAsset = {
      name: type3D,
      gridX: Math.floor(gridCols / 2),
      gridY: Math.floor(gridRows / 2),
      widthInCells: 1,
      heightInCells: 1,
      assetType: assetType2D,
      layer: 'floor' as AssetLayer,
      rotation: 0,
    };

    addAsset(newAsset, serverRoomId);
  };

  const gridCols = useFloorPlanStore((state) => state.gridCols);
  const gridRows = useFloorPlanStore((state) => state.gridRows);

  // const isDashboardView = mode === 'view' && displayMode === 'status';

  // 훅에서 가져온 로딩/에러 상태를 렌더링에 반영
  const isLoadingFromStore = useFloorPlanStore((state) => state.isLoading);
  const errorFromStore = useFloorPlanStore((state) => state.error);

  //  로딩 및 에러 UI 반환
  if (isLoadingFromStore) {
    return (
     <div className="flex-1 relative overflow-hidden flex items-center justify-center text-white bg-gray-900">
       2D 평면도 로딩 중...
     </div>
    );
  }

  if (errorFromStore) {
    return (
     <div className="flex-1 relative overflow-hidden flex items-center justify-center text-red-400 bg-gray-900">
       오류가 발생했습니다: {errorFromStore}
     </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex-1 relative overflow-hidden">
        <Canvas containerRef={containerRef} serverRoomId={serverRoomId} />
        {mode === 'view' && !isLayoutView && <TopNWidget />}

        {/* 왼쪽 사이드바: 보기 모드에서만 필터 표시 */}
        {mode === 'view' && (
          <FloatingSidebarPanel 
            isOpen={isLeftSidebarOpen} 
            onToggle={toggleLeftSidebar} 
            position="left" 
            title="보기 옵션 및 필터"
          >
            <StatusLegendAndFilters />
          </FloatingSidebarPanel>
        )}

        {/* 편집 모드에서 3D 장비 팔레트 표시 */}
        {mode === 'edit' && <EquipmentPalette3D onAddEquipment={handleAddEquipment} />}
        
        <RackModal />
        <FloorPlanConfirmationModal />
      </div>
    </DndContext>
  );
};

export default FloorPlanPage;