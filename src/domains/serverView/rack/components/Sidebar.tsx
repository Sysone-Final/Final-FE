import { useState } from "react";
import Tools from "./Tools";
import Dropdown from "./Dropdown";
import type { DeviceCard } from "../types";

interface SidebarProps {
  onCardClick: (card: DeviceCard) => void;
  isOpen: boolean;
}

function Sidebar({ onCardClick, isOpen }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedCard, setSelectedCard] = useState<DeviceCard | null>(null);

  const handleContextMenu = (e: React.MouseEvent, card: DeviceCard) => {
    e.preventDefault();
    e.stopPropagation();

    const iconRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const sidebarRect = (e.currentTarget as HTMLElement)
      .closest(".relative.flex-col")
      ?.getBoundingClientRect();

    if (sidebarRect) {
      setDropdownPosition({
        x: iconRect.left - sidebarRect.left,
        y: iconRect.top - sidebarRect.top,
      });
    }

    setSelectedCard(card);
    setDropdownOpen(true);
  };

  const handleDropdownSelect = (item: DeviceCard) => {
    onCardClick(item);
    setDropdownOpen(false);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  return (
    <div
      className={`
        relative
        flex-col items-center justify-start flex-shrink-0
        bg-[#404452]/90 backdrop-blur-sm
        border-r border-slate-300/40
        rounded-lb-xl
        pt-10 transition-all duration-300 ease-in-out
        ${isOpen ? "w-[56px] opacity-100" : "w-0 opacity-0"}
        overflow-visible
      `}
    >
      <Tools onCardClick={onCardClick} onContextMenu={handleContextMenu} />

      <Dropdown
        open={dropdownOpen}
        position={dropdownPosition}
        items={selectedCard ? [selectedCard] : []}
        onSelect={handleDropdownSelect}
        onClose={handleDropdownClose}
      />
    </div>
  );
}

export default Sidebar;
