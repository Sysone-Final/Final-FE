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




  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ServerViewHeader
        serverRoomId={id}
        viewDimension={viewDimension}
        onViewDimensionChange={setViewDimension}
      />

      {viewDimension === '3D' ? (
        <div className="flex-1 overflow-hidden">
          <BabylonDatacenterView mode="view" serverRoomId={id} />
        </div>
      ) : (
        <FloorPlanPage containerRef={canvasContainerRef} serverRoomId={id} />
      )}

      {/* RackModal은 2D/3D 모두에서 사용 */}
      <RackModal />
    </div>
  );
}

export default ServerViewPage;

