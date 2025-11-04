import React from 'react';
import { DndContext } from '@dnd-kit/core';
import Canvas from '../components/Canvas';
import FloatingSidebarPanel from '../components/FloatingSidebarPanel';
import { useFloorPlanDragDrop } from '../hooks/useFloorPlanDragDrop';
import { useFloorPlanInitializer } from '../hooks/useFloorPlanInitializer';
import { useFloorPlanNavigationGuard } from '../hooks/useFloorPlanNavigationGuard';
import { useFloorPlanStore } from '../store/floorPlanStore';
import { useSidebarStore } from '../store/useSidebarStore';

// Sidebar components
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import StatusLegendAndFilters from '../components/LeftSidebar/StatusLegendAndFilters';
import TopNWidget from '../components/TopNWidget';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface FloorPlanPageProps {
  containerRef: React.RefObject<HTMLDivElement>;
  serverRoomId: string | undefined;
}

const FloorPlanPage: React.FC<FloorPlanPageProps> = ({ containerRef, serverRoomId }) => {
  // FloorPlan 초기화
  useFloorPlanInitializer(serverRoomId);
  
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <ConfirmationModal />
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