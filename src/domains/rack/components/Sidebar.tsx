import Tools from "./Tools";
import type { DeviceCard } from "../types";

interface SidebarProps {
  onCardClick: (card: DeviceCard) => void;
  isOpen: boolean;
}

function Sidebar({ onCardClick, isOpen }: SidebarProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-start
        bg-black
        pt-10
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-[56px] opacity-100" : "w-0 opacity-0"}
        overflow-hidden
      `}
    >
      <Tools onCardClick={onCardClick} />
    </div>
  );
}

export default Sidebar;
