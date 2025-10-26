import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import RackHeader from "./RackHeader";

interface RackViewProps {
  onClose?: () => void;
  rackName?: string;
}

function RackView({ onClose, rackName }: RackViewProps = {}) {
  const rackManager = useRackManager();

  return (
    <div className="h-full w-full flex flex-col text-white overflow-hidden">
      <main className="flex-1 flex justify-center items-center p-6 overflow-hidden">
        <div className="flex flex-col rounded-xl backdrop-blur-md bg-white/20 max-h-full max-w-full overflow-hidden">
          <div className="flex-shrink-0">
            <RackHeader rackName={rackName} onClose={onClose} />
          </div>
          <div className="flex flex-1 overflow-y-auto overflow-x-hidden">
            <Sidebar onCardClick={rackManager.handleCardClick} />
            <div className="flex justify-center items-start py-4">
              <Rack
                key={rackManager.resetKey}
                devices={rackManager.installedDevices}
                floatingDevice={rackManager.floatingDevice}
                onMouseMove={rackManager.handleMouseMove}
                onRackClick={rackManager.handleRackClick}
                onDeviceDragEnd={rackManager.handleDeviceDragEnd}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RackView;
