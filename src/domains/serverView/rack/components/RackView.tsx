import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import RackHeader from "./RackHeader";
import Button from "./Button";
import { useState } from "react";
import { typeColorMap } from "../utils/colorMap";
import { useRackEquipments } from "../hooks/useRackEquipments";

interface RackViewProps {
  onClose?: () => void;
  rackName?: string;
}

function RackView({ rackName }: RackViewProps = {}) {
  const [frontView, setFrontView] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const rackId = rackName
    ? parseInt(rackName.split("-").pop() || "0", 10)
    : undefined;

  const {
    data: rackEquipmentData,
    isLoading,
    error,
  } = useRackEquipments(rackId || 0, {});

  const rackManager = useRackManager({
    initialDevices: rackEquipmentData?.data || [],
  });

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center text-white">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="h-full flex justify-center items-center text-white">
        <div className="text-lg text-red-400">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }
  const deviceLegend = [
    { type: "SERVER", label: "서버" },
    { type: "SWITCH", label: "스위치" },
    { type: "ROUTER", label: "라우터" },
    { type: "STORAGE", label: "스토리지" },
    { type: "FIREWALL", label: "방화벽" },
    { type: "LOAD_BALANCER", label: "로드밸런서" },
    { type: "KVM", label: "KVM" },
  ];

  return (
    <div className="h-full flex justify-center items-center text-white p-2 overflow-auto">
      <div className="flex flex-col bg-[#404452]/70 backdrop-blur-md border border-slate-300/40 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] max-h-full w-full overflow-hidden">
        {/* 상단바 */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-300/40">
          {/* 왼쪽: RackHeader (전체 너비 차지) */}
          <div className="flex-1">
            <RackHeader rackName={rackName} />
          </div>

          {/* 오른쪽: 버튼 그룹 */}
          <div className="flex items-center gap-4 ml-4">
            {/* 편집/뷰어 토글 */}
            <Button
              label={editMode ? "편집" : "보기"}
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
                  onDeviceDelete={rackManager.removeDevice}
                  frontView={!frontView}
                  editMode={editMode}
                />
              </div>
            </div>

            {/* Footer - 범례 */}
            {editMode && (
              <footer className="px-2 py-2 border-t border-slate-700 bg-slate-800/30 flex justify-center items-center">
                <div className="flex items-center gap-2 justify-center">
                  {deviceLegend.map((item) => (
                    <div
                      key={item.type}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      <div
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: typeColorMap[item.type] }}
                      />
                      <span className="text-xs text-slate-300">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RackView;
