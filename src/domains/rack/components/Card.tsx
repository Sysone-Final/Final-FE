interface RackCardProps {
  value: number;
  label: "총 U 수" | "사용 중";
}

function Card({ value, label }: RackCardProps) {
  return (
    <div className="flex flex-col justify-center items-center bg-[#1e253f] rounded-lg p-4 w-32 h-24 shadow-md">
      <span className="text-gray-400 text-sm mb-1">{label}</span>
      <span className="text-white text-2xl font-semibold">
        {value}
        <span className="text-white/70 text-xl ml-1">U</span>
      </span>
    </div>
  );
}

export default Card;
