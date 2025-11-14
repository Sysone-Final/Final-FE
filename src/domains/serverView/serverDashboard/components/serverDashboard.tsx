interface DashboardProps {
  deviceId: number;
  deviceName: string;
  onClose: () => void;
}

function ServerDashboard({ deviceName }: DashboardProps) {
  return (
    <div className="h-full w-full rounded-xl flex flex-col border border-white/20 overflow-hidden">
      {/* 헤더 */}
      <div className="flex justify-between items-center h-14 border-b border-slate-300/20 w-full px-0">
        <h2 className="text-2xl font-bold text-white ml-4">{deviceName}</h2>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center h-full text-slate-400">
          <p className="text-lg">대시보드 컨텐츠 영역</p>
        </div>
      </div>
    </div>
  );
}

export default ServerDashboard;
