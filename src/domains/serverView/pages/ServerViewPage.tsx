import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { useFloorPlanStore } from '../floorPlan/store/floorPlanStore';
import ServerViewHeader from '../components/ServerViewHeader';
import LeftSidebar from '../floorPlan/components/LeftSidebar';
import Canvas from '../floorPlan/components/Canvas';
import RightSidebar from '../floorPlan/components/RightSidebar';
import BabylonDatacenterView from '../view3d/components/BabylonDatacenterView';
import RackModal from '../view3d/components/RackModal';
import { useFloorPlanDragDrop } from '../floorPlan/pages/FloorPlanPage';

function ServerViewPage() {
  const { id } = useParams<{ id: string }>();
  const [viewDimension, setViewDimension] = useState<'2D' | '3D'>('3D');

  const { handleDragEnd } = useFloorPlanDragDrop();
  const mode = useFloorPlanStore((state) => state.mode);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/*헤더 (3d 2d 둘다 사용)*/}
      <ServerViewHeader
        serverRoomId={id}
        viewDimension={viewDimension}
        onViewDimensionChange={setViewDimension}
      />

{       /* 뷰 */}
      {viewDimension === '3D' ? (
        <>
          <div className="flex-1 overflow-hidden">
            <BabylonDatacenterView mode="view" serverRoomId={id} />
          </div>
          <RackModal />
        </>
      ) : (
        // 2d뷰
        <DndContext onDragEnd={handleDragEnd}>
          <div
            className={`grid ${
              mode === 'view'
                ? 'grid-cols-[280px_1fr]' // 뷰 모드: 2단
                : 'grid-cols-[280px_1fr_320px]' // 편집 모드: 3단
            } flex-grow gap-4 overflow-hidden`}
          >
            <LeftSidebar />
            <Canvas />
            {/* 편집 모드일 때만 RightSidebar를 렌더링합니다. */}
            {mode === 'edit' && <RightSidebar />}
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default ServerViewPage;
