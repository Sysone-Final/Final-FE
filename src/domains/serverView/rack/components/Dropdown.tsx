import { useEffect, useRef } from "react";
import type { DeviceCard } from "../types";

interface DropdownProps {
  open: boolean;
  position: { x: number; y: number };
  items: DeviceCard[];
  onSelect: (item: DeviceCard) => void;
  onClose: () => void;
  isLoading?: boolean; // 추가
}

function Dropdown({
  open,
  position,
  items,
  onSelect,
  onClose,
  isLoading,
}: DropdownProps) {
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

  return (
    <div
      ref={dropdownRef}
      className="absolute z-[9999] min-w-[200px] bg-[#2a2e3a] border border-slate-300/40 rounded-lg shadow-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateX(calc(-100% - 12px))",
      }}
    >
      <div className="py-1 max-h-[300px] overflow-y-auto [scrollbar-width:thin]">
        {isLoading ? (
          <div className="px-4 py-2 text-sm text-gray-400 text-center">
            로딩 중...
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400 text-center">
            할당 가능한 장비가 없습니다
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id || item.key}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-600/50 transition-colors duration-150 flex items-center gap-3"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-6 h-6 object-contain"
              />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-400">{item.size}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default Dropdown;
