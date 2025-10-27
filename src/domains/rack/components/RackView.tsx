import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import RackHeader from "./RackHeader";
import Button from "./Button";
import { useState } from "react";
import { typeColorMap } from "../utils/colorMap";

interface RackViewProps {
  onClose?: () => void;
  rackName?: string;
}

function RackView({ rackName }: RackViewProps = {}) {
  const rackManager = useRackManager();
  const [frontView, setFrontView] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const deviceLegend = [
    { type: "server", label: "서버" },
    { type: "switch", label: "스위치" },
    { type: "router", label: "라우터" },
    { type: "storage", label: "스토리지" },
    { type: "firewall", label: "방화벽" },
    { type: "loadbalancer", label: "로드밸런서" },
    { type: "kvm", label: "KVM" },
  ];

  return (
    <div className="min-h-dvh flex justify-center items-center text-white p-6">
      <div className="flex flex-col bg-[#404452]/90 backdrop-blur-sm border border-slate-300/40 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
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
        <div className="flex">
          {/* 사이드바 */}
          <Sidebar
            onCardClick={rackManager.handleCardClick}
            isOpen={editMode}
          />

          {/* 랙 + 범례 영역 */}
          <div className="flex flex-col flex-1">
            {/* 랙 영역 - 패딩 줄임 */}
            <div className="flex justify-center items-center px-8 pt-8 pb-2">
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

            {/* Footer - 범례 */}
            {editMode && (
              <footer className="px-3 py-3 border-t border-slate-700 bg-slate-800/30 flex justify-center items-center">
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {deviceLegend.map((item) => (
                    <div key={item.type} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-sm"
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
