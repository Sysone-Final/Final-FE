import React, { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import Canvas from '../components/Canvas';
import FloatingSidebarPanel from '../components/FloatingSidebarPanel';
import { useFloorPlanDragDrop } from '../hooks/useFloorPlanDragDrop';
import { useFloorPlanNavigationGuard } from '../hooks/useFloorPlanNavigationGuard';
import { useFloorPlanStore, initialState } from '../store/floorPlanStore';
import { useSidebarStore } from '../store/useSidebarStore';

import { useServerRoomEquipment } from '@/domains/serverView/view3d/hooks/useServerRoomEquipment';
import { transform3DTo2DAssets } from '../utils/dataTransformer';

// Sidebar components
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import StatusLegendAndFilters from '../components/LeftSidebar/StatusLegendAndFilters';
import TopNWidget from '../components/TopNWidget';

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
    
    //  'if (apiData)' 대신 'equipment3D'가 있는지 확인합니다.
    // 'equipment3D'는 훅에서 '?? []'로 처리되므로 null/undefined 체크가 필요 없을 수 있지만,
    // 'gridConfig'는 null일 수 있으므로 로딩이 끝난 시점(loading: false)을 기준으로 합니다.
    if (!loading && !error) {
      console.log('2D API Hook: Data received', { equipment3D, gridConfig });

      try {
        // 'equipment3D'는 이미 '[]'로 보장되므로 '|| []'가 필요 없습니다.
        const assets2D = transform3DTo2DAssets(equipment3D);
        console.log('Transformed 2D Assets:', assets2D);

        //  2D 스토어 상태 업데이트
        useFloorPlanStore.setState({
          assets: assets2D,
          gridCols: gridConfig?.columns || 15,
          gridRows: gridConfig?.rows || 8,
          isLoading: false, // (중요) 로딩 상태 false로 변경
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
  //  useEffect 의존성 배열에 'apiData' 대신 'equipment3D'와 'gridConfig'를 추가합니다.
  }, [equipment3D, gridConfig, loading, error]);


  // 페이지 이탈 방지
  useFloorPlanNavigationGuard();
  
  const { handleDragEnd } = useFloorPlanDragDrop(containerRef);
  const mode = useFloorPlanStore((state) => state.mode);
  const displayMode = useFloorPlanStore((state) => state.displayMode);
  
  const {
    isLeftSidebarOpen,
    toggleLeftSidebar,
    isRightSidebarOpen,
    toggleRightSidebar,
  } = useSidebarStore();

  const isDashboardView = mode === 'view' && displayMode === 'status';

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
        
        {isDashboardView && <TopNWidget />}

        <FloatingSidebarPanel 
          isOpen={isLeftSidebarOpen} 
          onToggle={toggleLeftSidebar} 
          position="left" 
          title={isDashboardView ? '상태 범례 및 필터' : mode === 'edit' ? '자산 라이브러리' : '표시 옵션'}
        >
          {isDashboardView ? <StatusLegendAndFilters /> : <LeftSidebar />}
        </FloatingSidebarPanel>
        
        {!isDashboardView && (
          <FloatingSidebarPanel 
            isOpen={isRightSidebarOpen} 
            onToggle={toggleRightSidebar} 
            position="right" 
            title={mode === 'edit' ? '속성 편집' : '속성 정보'}
          >
            <RightSidebar />
          </FloatingSidebarPanel>
        )}
      </div>
    </DndContext>
  );
};

export default FloorPlanPage;