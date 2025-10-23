import Rack from "../components/Rack";
import type { RackDevice, FloatingDevice, DeviceCard } from "../types";
import { useState } from "react";
import { typeColorMap } from "../utils/colorMap";
import Sidebar from "../components/Sidebar";
import { checkCollision } from "../utils/rackCollistionDetection";

function RackView() {
  const [installedDevices, setInstalledDevices] = useState<RackDevice[]>([
    {
      id: 1,
      name: "Server_1",
      type: "server",
      position: 1,
      height: 1,
      color: typeColorMap["server"],
    },
    {
      id: 2,
      name: "Firewall_1",
      type: "firewall",
      position: 3,
      height: 1,
      color: typeColorMap["firewall"],
    },
    {
      id: 3,
      name: "UPS_5F",
      type: "other",
      position: 4,
      height: 3,
      color: typeColorMap["other"],
    },
  ]);

  const [floatingDevice, setFloatingDevice] = useState<FloatingDevice | null>(
    null
  );
  const [resetKey, setResetKey] = useState(0);

  // 카드 클릭 핸들러
  const handleCardClick = (card: DeviceCard) => {
    setFloatingDevice({
      card,
      mouseY: 0,
    });
  };

  // 마우스 이동
  const handleMouseMove = (mouseY: number) => {
    if (floatingDevice) {
      setFloatingDevice({
        ...floatingDevice,
        mouseY,
      });
    }
  };

  // 드래그 종료 핸들러
  const handleDeviceDragEnd = (deviceId: number, newPosition: number) => {
    const draggedDevice = installedDevices.find((d) => d.id === deviceId);
    if (!draggedDevice) return;

    // 위치가 변경되지 않았으면 무시
    if (draggedDevice.position === newPosition) {
      return;
    }

    // 충돌 검사
    const hasCollision = checkCollision(
      {
        position: newPosition,
        height: draggedDevice.height,
      },
      installedDevices,
      deviceId
    );

    if (hasCollision) {
      console.log("이동할 수 없습니다. 다른 장비와 겹칩니다.");
      setResetKey((prev) => prev + 1);
      return;
    }

    // 장비 위치 업데이트
    setInstalledDevices(
      installedDevices.map((device) =>
        device.id === deviceId ? { ...device, position: newPosition } : device
      )
    );
  };

  // 랙 클릭 핸들러
  const handleRackClick = (position: number) => {
    if (!floatingDevice) return;

    const color = typeColorMap[floatingDevice.card.type] || "#334155";

    // 충돌 검사
    const hasCollision = checkCollision(
      {
        position,
        height: floatingDevice.card.height,
      },
      installedDevices
    );

    if (hasCollision) {
      console.log("이미 장비가 있습니다.");
      return;
    }

    // 새 장비 추가
    const newDevice: RackDevice = {
      id: Date.now(),
      name: floatingDevice.card.label,
      type: floatingDevice.card.type,
      position,
      height: floatingDevice.card.height,
      color,
    };

    setInstalledDevices([...installedDevices, newDevice]);
    setFloatingDevice(null);
  };

  return (
    <div className="min-h-dvh flex flex-col text-white">
      <main className="flex flex-1 justify-center items-center pb-20">
        <div className="flex bg-[#1a1f35] rounded-xl shadow-lg overflow-hidden my-6">
          <Sidebar onCardClick={handleCardClick} />
          <div className="flex justify-center items-center">
            <Rack
              key={resetKey}
              devices={installedDevices}
              floatingDevice={floatingDevice}
              onMouseMove={handleMouseMove}
              onRackClick={handleRackClick}
              onDeviceDragEnd={handleDeviceDragEnd}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RackView;
