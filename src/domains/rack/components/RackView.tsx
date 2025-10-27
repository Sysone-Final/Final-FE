import Rack from "../components/Rack";
import { useRackManager } from "../hooks/useRackManager";
import Sidebar from "./Sidebar";
import Button from "./Button";
import { useState } from "react";

function RackView() {
  const rackManager = useRackManager();
  const [frontView, setFrontView] = useState(true);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-dvh flex justify-center items-center text-white p-6">
      <div className="flex flex-col bg-[#1a1f35] rounded-xl shadow-lg overflow-hidden">
        {/* 상단바 */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          {/* 왼쪽: 타이틀 */}
          <h1 className="text-lg font-bold">랙 상세보기</h1>

          {/* 오른쪽: 버튼 그룹 */}
          <div className="flex items-center gap-4">
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

          {/* 랙 영역 */}
          <div className="flex justify-center items-center p-8">
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
      </div>
    </div>
  );
}

export default RackView;
