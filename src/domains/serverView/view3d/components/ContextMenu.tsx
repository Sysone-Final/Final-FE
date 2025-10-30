import { useEffect, useRef } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

function ContextMenu({ x, y, onClose, onDelete }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // 다음 틱에 이벤트 리스너 등록 (현재 클릭 이벤트와 겹치지 않도록)
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-50/30 backdrop-blur-md shadow-lg rounded-md border border-slate-300/40 z-50 min-w-[120px]"
      style={{
        left: `${x+20}px`,
        top: `${y-110}px`,
      }}
    >
      <button
        type="button"
        onClick={handleDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-400/50 backdrop-blur-sm hover:rounded-md flex items-center"
      >
        <span><DeleteOutlinedIcon/> 삭제</span>
      </button>
    </div>
  );
}

export default ContextMenu;
