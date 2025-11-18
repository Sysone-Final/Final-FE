import { useEffect, useRef } from "react";
import type { DeviceCard } from "../types";

interface DropdownProps {
  open: boolean;
  position: { x: number; y: number };
  items: DeviceCard[];
  onSelect: (item: DeviceCard) => void;
  onClose: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown>;
  isFetchingNextPage?: boolean;
}

function Dropdown({
  open,
  position,
  items,
  onSelect,
  onClose,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      console.log("❌ scrollContainer가 없음!");
      return;
    }

    console.log("✅ scrollContainer 찾음:", scrollContainer);
    console.log("콘텐츠 실제 높이:", scrollContainer.scrollHeight);
    console.log("보이는 높이:", scrollContainer.clientHeight);

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

      if (scrollHeight - scrollTop - clientHeight < 20) {
        console.log("🎯 끝에 도달! fetchNextPage 호출");
        if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
          fetchNextPage();
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    console.log("스크롤 이벤트 리스너 등록 완료");
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      console.log("스크롤 이벤트 리스너 제거");
    };
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      <div
        ref={scrollContainerRef}
        className="py-1 max-h-[270px] overflow-y-auto [scrollbar-width:thin]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isLoading ? (
          <div className="px-4 py-2 text-sm text-gray-400 text-center">
            로딩 중...
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400 text-center">
            할당 가능한 장비가 없습니다
          </div>
        ) : (
          <>
            {items.map((item) => (
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
            ))}

            {/* 로딩 인디케이터 */}
            {isFetchingNextPage && (
              <div className="px-4 py-2 text-center">
                <span className="text-xs text-gray-400">로딩 중...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
