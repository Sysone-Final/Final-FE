import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";

function RackView() {
  const rackManager = useRackManager();

  return (
    <div className="min-h-dvh flex flex-col text-white">
      <main className="flex flex-1 justify-center items-center pb-20">
        <div className="flex bg-[#1a1f35] rounded-xl shadow-lg overflow-hidden my-6">
          <Sidebar onCardClick={rackManager.handleCardClick} />
          <div className="flex justify-center items-center">
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
      </main>
    </div>
  );
}

export default RackView;
