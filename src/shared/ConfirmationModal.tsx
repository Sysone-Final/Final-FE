import { X, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

// Props만 받는 인터페이스
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  children: React.ReactNode; 
}

// 이 파일은 store를 전혀 모릅니다.
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText = '취소',
  isDestructive = false,
  isLoading = false,
  children,
}: ConfirmationModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;


  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="modal-bg animate-fadeIn"
      onClick={handleClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-md p-6 modal animate-modalFadeIn"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-600">
          <div className="flex items-center gap-2">
            {isDestructive && (
              <AlertTriangle className="text-red-500" size={20} />
            )}
            <h3 id="modal-title" className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose} 
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            disabled={isLoading}
            aria-label="모달 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 text-gray-200 text-base">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
          <button
            onClick={handleClose} 
            className="px-4 py-2 font-medium text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm} 
            className={`px-4 py-2 font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}