import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ServerViewHeader from '../components/ServerViewHeader';
import BabylonDatacenterView from '../view3d/components/BabylonDatacenterView';
import RackModal from '../components/RackModal';
import FloorPlanPage from '../floorPlan/pages/FloorPlanPage';

function ServerViewPage() {
  const { id } = useParams<{ id: string }>();
  const [viewDimension, setViewDimension] = useState<'2D' | '3D'>('3D');
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // URL 파라미터를 number로 변환
  const datacenterId = id ? parseInt(id, 10) : undefined;
  
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ServerViewHeader
        serverRoomId={id}
        viewDimension={viewDimension}
        onViewDimensionChange={setViewDimension}
      />

      {viewDimension === '3D' ? (
        <>
          {/* 3D View Container: flex-1 */}
          <div className="flex-1 overflow-hidden">
            <BabylonDatacenterView mode="view" datacenterId={datacenterId} />
          </div>
          <RackModal />
        </>
      ) : (
        <FloorPlanPage containerRef={canvasContainerRef} serverRoomId={id} />
      )}
    </div>
  );
}

export default ServerViewPage;

