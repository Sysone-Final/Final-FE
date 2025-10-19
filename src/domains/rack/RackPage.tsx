import serverImg from "/src/assets/server.svg";
import storageImg from "/src/assets/storage.svg";
import switchImg from "/src/assets/switch.svg";
import routerImg from "/src/assets/router.svg";
import Tools from "./components/Tools";
import Rack from "./components/Rack";

function RackPage() {
  const devices = [
    { id: 1, name: "Server_1", position: 1, height: 1 },
    { id: 2, name: "Firewall_1", position: 3, height: 1 },
    { id: 3, name: "UPS_5F", position: 4, height: 3 },
  ];
  const deviceCards = [
    {
      key: "server",
      label: "서버",
      size: "2U",
      img: serverImg,
      borderColor: "border-l-sky-400",
    },
    {
      key: "storage",
      label: "스토리지",
      size: "2U",
      img: storageImg,
      borderColor: "border-l-emerald-400",
    },
    {
      key: "switch",
      label: "스위치",
      size: "1U",
      img: switchImg,
      borderColor: "border-l-[#E80054]",
    },
    {
      key: "router",
      label: "라우터",
      size: "1U",
      img: routerImg,
      borderColor: "border-l-amber-400",
    },
  ];

  return (
    <div className="flex flex-col h-screen rounded-tl-[25px] bg-[#20233e] text-white">
      <div className="flex items-center px-8 py-6 rounded-tl-[25px] bg-[#111] text-[1.2rem] font-medium">
        렉 상세보기
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 px-4 py-6 box-border overflow-hidden">
        <div className="flex flex-col justify-center items-start rounded-[20px] bg-white/20 p-8 h-full box-border">
          {/* 왼쪽 상세 */}
        </div>

        <div className="flex flex-col justify-center items-start rounded-[20px] bg-white/20 px-4 py-8 h-full box-border">
          <Rack devices={devices} />
        </div>

        <div className="flex flex-col justify-center items-start rounded-[20px] bg-white/20 p-8 h-full box-border">
          <Tools deviceCards={deviceCards} />
        </div>
      </div>
    </div>
  );
}

export default RackPage;
