interface DashboardProps {
  deviceId: number;
  deviceName: string;
  onClose: () => void;
  isOpen: boolean;
}

function ServerDashboard({ deviceName }: DashboardProps) {
  return (
    <div className="h-full w-full bg-[#404452]/70 backdrop-blur-md border border-slate-300/40 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-300/20">
        <div>
          <h2 className="text-2xl font-bold text-white">{deviceName}</h2>
          <p className="text-sm text-slate-400 mt-1">
            실시간 모니터링 대시보드
          </p>
        </div>
      </div>

      {/* 대시보드 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-center h-full text-slate-400">
          <p className="text-lg">대시보드 컨텐츠 영역</p>
        </div>
      </div>
    </div>
  );
}

export default ServerDashboard;
