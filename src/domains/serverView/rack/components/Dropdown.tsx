import { useEffect, useRef } from "react";
import type { DeviceCard } from "../types";

interface DropdownProps {
  open: boolean;
  position: { x: number; y: number };
  items: DeviceCard[];
  onSelect: (item: DeviceCard) => void;
  onClose: () => void;
}

function Dropdown({ open, position, items, onSelect, onClose }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("contextmenu", handleContextMenu);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [open, onClose]);

  if (!open) return null;

  // createPortal이 없어야 합니다!
  return (
    <div
      ref={dropdownRef}
      className="absolute z-[9999] w-[160px] bg-[#2a2e3a] border border-slate-300/40 rounded-lg shadow-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateX(calc(-100% - 12px))",
      }}
    >
      <div className="py-1 max-h-[300px] overflow-y-auto [scrollbar-width:thin]">
        {items.map((item, index) => (
          <button
            key={`${item.type}-${item.height}-${index}`}
            onClick={() => {
              onSelect(item);
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-600/50 transition-colors duration-150"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
