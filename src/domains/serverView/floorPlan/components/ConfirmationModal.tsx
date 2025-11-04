import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useModalStore } from '../hooks/useConfirmationModal';

// 모달 UI 컴포넌트
export const ConfirmationModal: React.FC = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    confirmAction, 
    cancelAction,  
  } = useModalStore();

  if (!isOpen) return null;

  const isDestructive =
    confirmText.includes('삭제') || confirmText.includes('나가기');

  return (
    // Backdrop (어두운 반투명 배경)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={cancelAction} // 배경 클릭 시 닫기
    >
      {/* Modal Panel (스타일 적용) */}
      <div
        className="w-full max-w-md p-6 bg-gray-800/90 border border-gray-700 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-600">
          <div className="flex items-center gap-2">
            {isDestructive && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={cancelAction}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 text-gray-200 text-base">{message}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
          <button
            onClick={cancelAction}
            className="px-4 py-2 font-medium text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={confirmAction}
            className={`px-4 py-2 font-medium text-white rounded-md transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500' // 위험한 작업
                : 'bg-blue-600 hover:bg-blue-500' // 일반 확인
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};