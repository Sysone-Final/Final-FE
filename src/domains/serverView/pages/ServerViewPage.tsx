import { useState, useEffect } from 'react';
import { useParams, useBlocker } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import {
  useFloorPlanStore,
  fetchFloorPlan,
  initialState,
  useHasUnsavedChanges,
} from '../floorPlan/store/floorPlanStore';
import ServerViewHeader from '../components/ServerViewHeader';
import Canvas from '../floorPlan/components/Canvas';
import BabylonDatacenterView from '../view3d/components/BabylonDatacenterView';
import RackModal from '../view3d/components/RackModal';
import { useFloorPlanDragDrop } from '../floorPlan/pages/FloorPlanPage';

import FloatingSidebarPanel from '../floorPlan/components/FloatingSidebarPanel';
import { useSidebarStore } from '../floorPlan/store/useSidebarStore';

import AssetLibrary from '../floorPlan/components/LeftSidebar/AssetLibrary';
import DisplayOptions from '../floorPlan/components/LeftSidebar/DisplayOptions';
import PropertiesEditor from '../floorPlan/components/RightSidebar/PropertiesEditor';
import PropertiesViewer from '../floorPlan/components/RightSidebar/PropertiesViewer';
import StatusLegendAndFilters from '../floorPlan/components/LeftSidebar/StatusLegendAndFilters';
import TopNWidget from '../floorPlan/components/TopNWidget';

function ServerViewPage() {
  const { id } = useParams<{ id: string }>();
  const [viewDimension, setViewDimension] = useState<'2D' | '3D'>('3D');
  const { handleDragEnd } = useFloorPlanDragDrop();
  const mode = useFloorPlanStore((state) => state.mode);
  const displayMode = useFloorPlanStore((state) => state.displayMode);
  const hasUnsavedChanges = useHasUnsavedChanges();
  // 편집 모드이고, 저장 안한게 있으면 true
 const shouldBlock = mode === 'edit' && hasUnsavedChanges;

 const isDashboardView = mode === 'view' && displayMode === 'status';
// 1. React Router 이탈 방지 (헤더의 다른 탭 등)v6.7+ (useBlocker) 기준으로 작성
 // v6.7 이상: useBlocker 훅,  v6.4: <Prompt> 컴포넌트 (구현 방식이 다름)
 const blocker = useBlocker(
  ({ nextLocation }) =>
   shouldBlock &&
   !window.confirm(
    '저장하지 않은 변경 사항이 있습니다.\n정말로 이 페이지를 벗어나시겠습니까?',
   )
 );
// const isDashboardView = mode === 'view' && displayMode === 'status';
  const {
  isLeftSidebarOpen, toggleLeftSidebar, isRightSidebarOpen, toggleRightSidebar,
  setLeftSidebarOpen, setRightSidebarOpen 
 } = useSidebarStore();
 const [is2dLoaded, setIs2dLoaded] = useState(false);
// 2. 브라우저 이탈 방지 (새로고침, 탭 닫기)
 useEffect(() => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
   if (shouldBlock) {
    event.preventDefault();
    // (Chrome에서는 이 메시지가 표시되지 않지만, 표준을 위해 필요)
    event.returnValue = '저장하지 않은 변경 사항이 있습니다.';
   }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 }, [shouldBlock]); // shouldBlock이 바뀔 때마다 리스너 재등록

  useEffect(() => {
  if (viewDimension === '2D' && id && !is2dLoaded) {
   // 2D 뷰 첫 로드 시
   console.log('Initializing 2D View State...');
   
   // A. 스토어 상태를 초기값으로 리셋
   useFloorPlanStore.setState(initialState, true, 'Init 2D View'); // Zundo 히스토리도 초기화
   useFloorPlanStore.temporal.getState().clear(); // 만약을 위해 temporal 히스토리도 클리어

   // B. 사이드바 상태를 초기값으로 리셋 (Req 4)
   setLeftSidebarOpen(true);
   setRightSidebarOpen(false);

   // C. 데이터 페칭
   fetchFloorPlan(id);
   setIs2dLoaded(true);

  } else if (viewDimension === '3D') {
   // 3D로 돌아갈 때 2D 로드 상태를 리셋 (Req 3)
   setIs2dLoaded(false);
  }
 }, [viewDimension, id, is2dLoaded]);


let LeftSidebarContent;
  let leftTitle;
  let RightSidebarContent = null; // 기본값 null
  let rightTitle = ''; // 기본값 ''
if (isDashboardView) {
    LeftSidebarContent = <StatusLegendAndFilters />; // 새로 만들 컴포넌트
    leftTitle = '상태 범례 및 필터';
    // RightSidebarContent는 null (숨김)
  } else if (mode === 'edit') {
    LeftSidebarContent = <AssetLibrary />;
    leftTitle = '자산 라이브러리';
    RightSidebarContent = <PropertiesEditor />;
    rightTitle = '속성 편집';
  } else { // 'view' 모드이면서 'customColor' (상면도) 모드
    LeftSidebarContent = <DisplayOptions />;
    leftTitle = '표시 옵션';
    RightSidebarContent = <PropertiesViewer />;
    rightTitle = '속성 정보';
  }

  return (
    // 최상위 div: h-full w-full flex flex-col overflow-hidden
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header: flex-shrink-0 필요 */}
      <ServerViewHeader
        serverRoomId={id}
        viewDimension={viewDimension}
        onViewDimensionChange={setViewDimension}
      />

      {viewDimension === '3D' ? (
        <>
          {/* 3D View Container: flex-1 */}
          <div className="flex-1 overflow-hidden">
            <BabylonDatacenterView mode="view" serverRoomId={id} />
          </div>
          <RackModal />
        </>
      ) : (
        // 2D View
        <DndContext onDragEnd={handleDragEnd}>
          {/* Canvas Container: flex-1 */}
          <div className="flex-1 relative overflow-hidden">
            <Canvas />
            
{isDashboardView && <TopNWidget />}

            <FloatingSidebarPanel 
              isOpen={isLeftSidebarOpen} 
              onToggle={toggleLeftSidebar} 
              position="left" 
              title={leftTitle} 
            >
              {LeftSidebarContent}
            </FloatingSidebarPanel>
            
            {RightSidebarContent && (
              <FloatingSidebarPanel 
                isOpen={isRightSidebarOpen} 
                onToggle={toggleRightSidebar} 
                position="right" 
                title={rightTitle}
              >
                {RightSidebarContent}
              </FloatingSidebarPanel>
            )}
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default ServerViewPage;

