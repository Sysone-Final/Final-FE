import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

interface CanvasContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({ x, y, onClose, onDelete }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // 이벤트 버블링 이슈 방지를 위해 setTimeout 사용
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800/90 backdrop-blur-md shadow-2xl rounded-md border border-gray-600 z-50 min-w-[140px] overflow-hidden"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
      >
        <Trash2 size={16} />
        <span>삭제</span>
      </button>
    </div>
  );
};

export default CanvasContextMenu;