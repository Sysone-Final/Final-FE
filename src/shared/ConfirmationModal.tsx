import { X, AlertTriangle } from 'lucide-react';

// Props만 받는 인터페이스
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  isDestructive?: boolean;
  children: React.ReactNode; 
}

// 이 파일은 store를 전혀 모릅니다.
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  isDestructive = false,
  children,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div
        className="w-full max-w-md p-6 modal"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-600">
          <div className="flex items-center gap-2">
            {isDestructive && (
              <AlertTriangle className="text-red-500" />
            )}
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 text-gray-200 text-base">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
          <button
            onClick={onClose} 
            className="px-4 py-2 font-medium text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm} 
            className={`px-4 py-2 font-medium text-white rounded-md transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}