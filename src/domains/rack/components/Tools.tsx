import serverImg from "../assets/server.svg";
import storageImg from "../assets/storage.svg";
import switchImg from "../assets/switch.svg";
import routerImg from "../assets/router.svg";
import kvmImg from "../assets/kvm.svg";
import firewallImg from "../assets/firewall.svg";
import loadBalanceImg from "../assets/loadbalance.svg";

import type { DeviceCard } from "../types";
import { typeColorMap } from "../utils/colorMap";

interface ToolsProps {
  onCardClick: (card: DeviceCard) => void;
}

function Tools({ onCardClick }: ToolsProps) {
  const deviceCards: DeviceCard[] = [
    {
      key: "server",
      label: "서버",
      size: "2U",
      img: serverImg,
      height: 2,
      type: "SERVER",
    },
    {
      key: "storage",
      label: "스토리지",
      size: "2U",
      img: storageImg,
      height: 2,
      type: "STORAGE",
    },
    {
      key: "switch",
      label: "스위치",
      size: "1U",
      img: switchImg,
      height: 1,
      type: "SWITCH",
    },
    {
      key: "router",
      label: "라우터",
      size: "1U",
      img: routerImg,
      height: 1,
      type: "ROUTER",
    },
    {
      key: "kvm",
      label: "kvm",
      size: "1U",
      img: kvmImg,
      height: 1,
      type: "KVM",
    },
    {
      key: "firewall",
      label: "방화벽",
      size: "1U",
      img: firewallImg,
      height: 1,
      type: "FIREWALL",
    },
    {
      key: "loadbalancer",
      label: "로드발란스",
      size: "1U",
      img: loadBalanceImg,
      height: 1,
      type: "LOAD_BALANCER",
    },
  ];

  return (
    <div className="text-white flex flex-col items-start">
      {deviceCards.map((card) => {
        const color = typeColorMap[card.type] || "#64748b";
        return (
          <div
            key={card.key}
            onClick={() => onCardClick(card)}
            className="
              flex items-center justify-center
              w-10 h-10 m-2 p-2
              rounded-[4px]
              transition-transform duration-150
              cursor-pointer
              hover:scale-105 active:scale-95
              shadow-md
            "
            style={{
              backgroundColor: color,
            }}
          >
            <img
              src={card.img}
              alt={`${card.label} icon`}
              className="w-7 h-7 filter brightness-0 invert"
            />
          </div>
        );
      })}
    </div>
  );
}

export default Tools;
