import ServerDashboardHeader from "./ServerDashboardHeader";

interface ServerDashboardProps {
  deviceId: number;
  deviceName: string;
  onClose: () => void;
  isOpen: boolean;
}

function ServerDashboard({
  deviceName,
  isOpen,
  onClose,
}: ServerDashboardProps) {
  return (
    <div
      className={`
        absolute top-0 right-0
        h-full w-full
        rounded-xl flex flex-col overflow-hidden
        bg-[#404452]/70 backdrop-blur-md border border-slate-300/40
        transition-transform duration-300 ease-out
        px-6 py-3
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <ServerDashboardHeader deviceName={deviceName} onClose={onClose} />
      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center h-full text-slate-400">
          <div className="text-lg">장비를 클릭해주세요.</div>
        </div>
      </div>
    </div>
  );
}

export default ServerDashboard;
