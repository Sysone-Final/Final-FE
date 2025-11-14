import DoubleArrow from "../assets/doubleArrow.svg";

interface ServerDashboardHeaderProps {
  deviceName: string;
  onClose: () => void;
}
function ServerDashboardHeader({
  deviceName,
  onClose,
}: ServerDashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center h-14 w-full">
      <h2 className="text-xl font-semibold text-white ml-4">{deviceName}</h2>
      <button
        onClick={onClose}
        className="text-white hover:text-slate-300 transition-colors p-2 hover:bg-white/10 rounded"
        title="닫기"
      >
        <img src={DoubleArrow} alt="닫기" className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ServerDashboardHeader;
