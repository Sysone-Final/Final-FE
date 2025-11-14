import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import RackHeader from "./RackHeader";
import Button from "./Button";
import { useState } from "react";
import ServerDashboard from "@domains/serverView/serverDashboard/components/serverDashboard";

interface RackViewProps {
  onClose?: () => void;
  rackName?: string;
  serverRoomId: number;
}

function RackView({ rackName, serverRoomId, onClose }: RackViewProps) {
  const [frontView, setFrontView] = useState(true);
  const [editMode, setEditMode] = useState(false);
  // 대시보드 상태 추가
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const rackId = rackName
    ? parseInt(rackName.split("-").pop() || "0", 10)
    : undefined;

  const rackManager = useRackManager({
    rackId: rackId || 0,
    serverRoomId: serverRoomId,
    frontView,
  });

  const displayRackName = rackManager.rack?.rackName || rackName || "N/A";

  const handleDeviceClick = (deviceId: number, deviceName: string) => {
    setSelectedDevice({ id: deviceId, name: deviceName });
    setDashboardOpen(true);
  };

  //대시보드 닫기 핸들러
  const handleDashboardClose = () => {
    setDashboardOpen(false);
  };

  if (rackManager.isLoading) {
    return (
      <div className="h-full flex justify-center items-center text-white">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 에러 발생
  if (rackManager.error) {
    return (
      <div className="h-full flex justify-center items-center text-white">
        <div className="text-lg text-red-400">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex text-white gap-2 p-2">
      {/* 왼쪽: 대시보드 영역 - 항상 2 비율 유지 */}
      <div
        className="flex-[2] overflow-auto"
        onClick={() => {
          if (!dashboardOpen && onClose) {
            onClose();
          }
        }}
      >
        {dashboardOpen && selectedDevice && (
          <div
            className="h-full bg-[#404452]/70 backdrop-blur-md rounded-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ServerDashboard
              deviceId={selectedDevice.id}
              deviceName={selectedDevice.name}
              onClose={handleDashboardClose}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="h-full flex flex-col bg-[#404452]/70 backdrop-blur-md border border-slate-300/40 rounded-xl">
          <header className="flex justify-between items-center px-6 py-4 border-b border-slate-300/40 flex-shrink-0">
            <div className="flex-1">
              <RackHeader rackName={displayRackName} />
            </div>

            <div className="flex items-center gap-4 ml-4">
              <Button
                label={editMode ? "보기" : "편집"}
                onClick={() => setEditMode(!editMode)}
                active={editMode}
              />
              <Button
                label={frontView ? "뒷면" : "앞면"}
                onClick={() => setFrontView(!frontView)}
                active={frontView}
              />
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <div className="flex flex-1 min-h-0">
            <Sidebar
              onCardClick={rackManager.handleCardClick}
              isOpen={editMode}
            />

            <div className="flex-1 flex justify-center items-start pt-4 pb-2 overflow-y-auto min-h-0">
              <div className="w-full h-full min-h-0">
                <Rack
                  key={rackManager.resetKey}
                  devices={rackManager.installedDevices}
                  floatingDevice={rackManager.floatingDevice}
                  onMouseMove={rackManager.handleMouseMove}
                  onRackClick={rackManager.handleRackClick}
                  onDeviceDragEnd={rackManager.handleDeviceDragEnd}
                  onDeviceDelete={rackManager.handleDeviceDelete}
                  onDeviceClick={handleDeviceClick}
                  frontView={frontView}
                  editMode={editMode}
                  editingDeviceId={rackManager.editingDeviceId}
                  getDeviceName={rackManager.getDeviceName}
                  onDeviceNameChange={rackManager.handleDeviceNameChange}
                  onDeviceNameConfirm={rackManager.handleDeviceNameConfirm}
                  onDeviceNameCancel={rackManager.handleDeviceNameCancel}
                  rackId={rackId || 0}
                  serverRoomId={serverRoomId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RackView;
