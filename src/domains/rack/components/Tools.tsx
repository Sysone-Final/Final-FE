import serverImg from "../assets/server.svg";
import storageImg from "../assets/storage.svg";
import switchImg from "../assets/switch.svg";
import routerImg from "../assets/router.svg";
import type { DeviceCard } from "../types";
import { colorMap } from "../utils/colorMap";

interface ToolsProps {
  onCardClick: (card: DeviceCard) => void;
}

function Tools({ onCardClick }: ToolsProps) {
  const deviceCards = [
    {
      key: "server",
      label: "서버",
      size: "2U",
      img: serverImg,
      borderColor: "border-l-sky-400",
      height: 2,
    },
    {
      key: "storage",
      label: "스토리지",
      size: "2U",
      img: storageImg,
      borderColor: "border-l-emerald-400",
      height: 2,
    },
    {
      key: "switch",
      label: "스위치",
      size: "1U",
      img: switchImg,
      borderColor: "border-l-[#E80054]",
      height: 1,
    },
    {
      key: "router",
      label: "라우터",
      size: "1U",
      img: routerImg,
      borderColor: "border-l-amber-400",
      height: 1,
    },
  ];

  return (
    <div className="text-white">
      <div className="flex flex-col items-start justify-center p-8 pl-3 w-[300px] h-[120px] rounded-2xl border border-white shadow-md m-6 text-left bg-transparent leading-relaxed">
        <span className="text-[15px] font-semibold">장비 추가</span>
        <span className="text-[14px] mt-1">장비를 드래그하여 클릭하세요.</span>
      </div>

      {deviceCards.map((card) => {
        const borderLeftColor = colorMap[card.borderColor] || "#ffffff";

        return (
          <div
            key={card.key}
            onClick={() => onCardClick(card)}
            className="flex flex-row items-center justify-start p-6 w-[300px] h-[120px] rounded-2xl bg-white text-black border border-white shadow-md m-6 gap-3 cursor-pointer hover:scale-105 transition-transform active:scale-95"
            style={{ borderLeft: `8px solid ${borderLeftColor}` }}
          >
            <img
              src={card.img}
              alt={`${card.label} icon`}
              className="w-7 h-7"
            />
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-medium">{card.label}</span>
              <span className="text-[14px]">{card.size}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Tools;
