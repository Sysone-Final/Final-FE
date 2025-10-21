import Tools from "./components/Tools";
import Rack from "./components/Rack";
import type { RackDevice, FloatingDevice, DeviceCard } from "./types";
import { useState } from "react";
import { typeColorMap } from "./utils/colorMap";

function RackPage() {
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

  //카드 클릭 핸들러
  const handleCardClick = (card: DeviceCard) => {
    setFloatingDevice({
      card,
      mouseY: 0,
    });
  };

  //마우스 이동
  const handleMouseMove = (mouseY: number) => {
    if (floatingDevice) {
      setFloatingDevice({
        ...floatingDevice,
        mouseY,
      });
    }
  };

  //랙 클릭 핸들러
  const handleRackClick = (position: number) => {
    if (!floatingDevice) return;

    const color = typeColorMap[floatingDevice.card.type] || "#334155";

    //충돌 검사 (장비가 있을 경우)
    const hasCollision = installedDevices.some((device) => {
      const deviceBottom = device.position;
      const deviceTop = device.position + device.height - 1;
      const newBottom = position;
      const newTop = position + floatingDevice.card.height - 1;
      const collision = !(newTop < deviceBottom || newBottom > deviceTop);
      return collision;
    });

    if (hasCollision) {
      console.log("이미 장비가 있습니다.");
      return;
    }

    //새 장비 추가
    const newDevice: RackDevice = {
      id: Date.now(),
      name: floatingDevice.card.label,
      type: floatingDevice.card.type,
      position,
      height: floatingDevice.card.height,
      color,
    };
    console.log("생성된 newDevice:", newDevice);
    setInstalledDevices([...installedDevices, newDevice]);
    setFloatingDevice(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#20233e] text-white overflow-y-auto">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[#111] px-8 py-3 text-[1.2rem] font-medium rounded-tl-[10px]">
        렉 상세보기
      </header>

      {/* 메인 콘텐츠 */}
      <main className="grid grid-cols-3 gap-5 px-4 pt-4 pb-4 box-border">
        {/* 왼쪽 상세 */}
        <section className="flex flex-col justify-start items-start rounded-[16px] bg-white/20 p-6 box-border min-h-[80vh]">
          {/* 왼쪽 패널 내용 */}
        </section>

        {/* 중앙 렉 뷰 */}
        <section className="flex flex-col justify-center items-center rounded-[16px] bg-white/20 px-4 py-6 box-border min-h-[80vh]">
          <Rack
            devices={installedDevices}
            floatingDevice={floatingDevice}
            onMouseMove={handleMouseMove}
            onRackClick={handleRackClick}
          />
        </section>

        {/* 오른쪽 툴 영역 */}
        <section className="flex flex-col justify-center items-center rounded-[16px] bg-white/20 p-6 box-border min-h-[80vh] ">
          <Tools onCardClick={handleCardClick} />
        </section>
      </main>
    </div>
  );
}

export default RackPage;
