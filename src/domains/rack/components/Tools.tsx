import type { DeviceCard } from "../types";

interface ToolsProps {
  deviceCards: DeviceCard[];
}

function Tools({ deviceCards }: ToolsProps) {
  return (
    <div className="text-white">
      <div className="flex flex-col items-start justify-center p-8 pl-3 w-[300px] h-[120px] rounded-2xl border border-white shadow-md m-6 text-left bg-transparent leading-relaxed">
        <span className="text-[15px] font-semibold">장비 추가</span>
        <span className="text-[14px] mt-1">장비를 드래그하여 클릭하세요.</span>
      </div>

      {deviceCards.map(({ key, label, size, img, borderColor }) => (
        <div
          key={key}
          className={`flex flex-row items-center justify-start p-6 w-[300px] h-[120px] rounded-2xl bg-white text-black border border-white shadow-md m-6 border-l-[8px] ${borderColor} gap-3`}
        >
          <img src={img} alt={`${label} icon`} className="w-7 h-7" />
          <div className="flex flex-col items-start">
            <span className="text-[15px] font-medium">{label}</span>
            <span className="text-[14px]">{size}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tools;
