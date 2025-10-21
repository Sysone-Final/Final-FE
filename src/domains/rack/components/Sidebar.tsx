import Tools from "./Tools";
import type { DeviceCard } from "../types";

interface SidebarProps {
  onCardClick: (card: DeviceCard) => void;
}

function Sidebar({ onCardClick }: SidebarProps) {
  return (
    <div
      className="
      flex flex-col items-center justify-start
      w-[56px] h-[850px]
      bg-black
      pt-10
      space-y-3
    "
    >
      <Tools onCardClick={onCardClick} />
    </div>
  );
}

export default Sidebar;
