import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import RackHeader from "./RackHeader";
import Button from "./Button";
import { useState } from "react";
import ServerDashboard from "../../serverDashboard/components/serverDashboard";

interface RackViewProps {
  onClose?: () => void;
  rackName?: string;
  serverRoomId: number;
}

function RackView({ rackName, serverRoomId }: RackViewProps) {
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
    <>
      {/* 대시보드 - 전체 화면 오버레이 (왼쪽만) */}
      {dashboardOpen && selectedDevice && (
        <div className="fixed top-[72px] left-2 bottom-2 right-2 z-30 pr-[420px]">
          <div className="h-full bg-[#404452]/70 backdrop-blur-md border border-slate-300/40 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden mr-4">
            <ServerDashboard
              deviceId={selectedDevice.id}
              deviceName={selectedDevice.name}
              onClose={handleDashboardClose}
              isOpen={dashboardOpen}
            />
          </div>
        </div>
      )}
      <div className="h-full flex justify-center items-center text-white p-2 overflow-auto">
        <div className="flex flex-col bg-[#404452]/70 backdrop-blur-md border border-slate-300/40 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] max-h-full w-full overflow-hidden">
          {/* 상단바 */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-slate-300/40">
            {/* 왼쪽: RackHeader (전체 너비 차지) */}
            <div className="flex-1">
              <RackHeader rackName={displayRackName} />
            </div>

            {/* 오른쪽: 버튼 그룹 */}
            <div className="flex items-center gap-4 ml-4">
              {/* 편집/뷰어 토글 */}
              <Button
                label={editMode ? "보기" : "편집"}
                onClick={() => setEditMode(!editMode)}
                active={editMode}
              />

              {/* 앞/뒤 전환 버튼 */}
              <Button
                label={frontView ? "뒷면" : "앞면"}
                onClick={() => setFrontView(!frontView)}
                active={frontView}
              />
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <div className="flex flex-1 min-h-0">
            {/* 사이드바 */}
            <Sidebar
              onCardClick={rackManager.handleCardClick}
              isOpen={editMode}
            />

            {/* 랙 + 범례 영역 */}
            <div className="flex flex-col flex-1 min-h-0">
              {/* 랙 영역 - 패딩 줄임 */}
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
    </>
  );
}

export default RackView;
