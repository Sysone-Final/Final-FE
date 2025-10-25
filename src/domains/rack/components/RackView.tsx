import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import ToggleButton from "./ToggleButton";
import { useState } from "react";
import type { ViewMode } from "../types";

function RackView() {
  const rackManager = useRackManager();
  const [viewMode, setViewMode] = useState<ViewMode>("front");
  const toggleView = () =>
    setViewMode((prev) => (prev === "front" ? "back" : "front"));

  return (
    <div className="min-h-dvh flex flex-col text-white">
      <main className="flex flex-1 justify-center items-center pb-20">
        <div className="flex bg-[#1a1f35] rounded-xl shadow-lg overflow-hidden my-6">
          <Sidebar onCardClick={rackManager.handleCardClick} />
          <div className="relative flex justify-center items-center pt-16">
            <ToggleButton viewMode={viewMode} onToggle={toggleView} />
            <Rack
              key={rackManager.resetKey}
              devices={rackManager.installedDevices}
              floatingDevice={rackManager.floatingDevice}
              onMouseMove={rackManager.handleMouseMove}
              onRackClick={rackManager.handleRackClick}
              onDeviceDragEnd={rackManager.handleDeviceDragEnd}
              viewMode={viewMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RackView;
