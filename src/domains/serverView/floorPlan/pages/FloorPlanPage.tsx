import React, { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import Canvas from '../components/Canvas'; 
import FloatingSidebarPanel from '../components/FloatingSidebarPanel'; 
import { useFloorPlanDragDrop } from '../hooks/useFloorPlanDragDrop';
import { useFloorPlanNavigationGuard } from '../hooks/useFloorPlanNavigationGuard';
import { useFloorPlanStore, initialState } from '../store/floorPlanStore';
import { useSidebarStore } from '../store/useSidebarStore';
import RackModal from '@/domains/serverView/components/RackModal';
import { useServerRoomEquipment } from '@/domains/serverView/view3d/hooks/useServerRoomEquipment';
import { transform3DTo2DAssets } from '../utils/dataTransformer';


import LeftSidebar from '../components/LeftSidebar'; 
import StatusLegendAndFilters from '../components/LeftSidebar/StatusLegendAndFilters'; 
import TopNWidget from '../components/TopNWidget'; 
import AssetLibrary from '../components/LeftSidebar/AssetLibrary';
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
  const { setLeftSidebarOpen, setRightSidebarOpen } = useSidebarStore();
  
  useEffect(() => {
    console.log('Initializing 2D FloorPlan Store...');
    // A. 2D 스토어 상태를 초기값으로 리셋
    useFloorPlanStore.setState(initialState, true);
    useFloorPlanStore.temporal.getState().clear();

    // B. 사이드바 상태를 초기값으로 리셋
    setLeftSidebarOpen(true);
    setRightSidebarOpen(false);
  }, [setLeftSidebarOpen, setRightSidebarOpen]); // 최초 1회 실행

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
    isRightSidebarOpen,
    toggleRightSidebar,
  } = useSidebarStore();

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
        <Canvas containerRef={containerRef} />
        {mode === 'view' && !isLayoutView && <TopNWidget />}

        {/* 왼쪽 사이드바: 보기 모드에서는 필터, 편집 모드에서는 속성 편집 */}
        <FloatingSidebarPanel 
          isOpen={isLeftSidebarOpen} 
          onToggle={toggleLeftSidebar} 
          position="left" 
          title={mode === 'edit' ? '속성 편집' : '보기 옵션 및 필터'}
        >
          {mode === 'view' ? <StatusLegendAndFilters /> : <LeftSidebar />}
        </FloatingSidebarPanel>
        
        {/* 오른쪽 사이드바: 편집 모드에서만 자산 라이브러리 표시 */}
        {mode === 'edit' && (
          <FloatingSidebarPanel 
            isOpen={isRightSidebarOpen} 
            onToggle={toggleRightSidebar} 
            position="right" 
            title={'자산 라이브러리'}
          >
            <AssetLibrary />
          </FloatingSidebarPanel>
        )}
        
        <RackModal />
        <FloorPlanConfirmationModal />
      </div>
    </DndContext>
  );
};

export default FloorPlanPage;