import React from 'react';
import { create } from 'zustand';
import { X, AlertTriangle } from 'lucide-react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  confirmAction: () => void | Promise<void>; 
  cancelAction: () => void;
  open: (options: {
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    confirmAction: () => void | Promise<void>; 
    cancelAction?: () => void;
  }) => void;
  close: () => void;
}

// 1. 모달 상태 관리를 위한 Zustand 스토어
const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  confirmAction: () => {}, 
  cancelAction: () => {}, 

  open: ({
    title,
    message,
    confirmText,
    confirmAction: onConfirm, 
    cancelAction: onCancel,   
  }) =>
    set({
      isOpen: true,
      title,
      message,
      confirmText: confirmText || '확인',

      // 3. 비동기 처리를 위해 confirmAction(스토어 상태)을 async 함수로 래핑
      confirmAction: async () => {
        try {
          await onConfirm(); // 4. 전달받은 onConfirm 함수를 await
        } catch (error) {
          console.error('Modal confirm action failed:', error);
          // (선택 사항) 여기서 작업 실패 토스트 알림을 띄울 수 있습니다.
          // toast.error('작업에 실패했습니다.');
        } finally {
          set({ isOpen: false }); // 5. 작업이 성공/실패하든 완료되면 모달을 닫음
        }
      },

      // 6. cancelAction(스토어 상태)도 래핑
      cancelAction: () => {
        if (onCancel) onCancel(); // 7. 전달받은 onCancel 함수 실행
        set({ isOpen: false });
      },
    }),

  close: () => set({ isOpen: false }),
}));

// 2. 다른 컴포넌트에서 쉽게 사용할 수 있도록 커스텀 훅 export
export const useConfirmationModal = () => {
  const { open } = useModalStore();
  return { confirm: open };
};

// 3. 모달 UI 컴포넌트 (이 부분은 이전과 동일합니다)
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