import React from 'react';
import { create } from 'zustand';

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

// 모달 상태 관리를 위한 Zustand 스토어
export const useModalStore = create<ModalState>((set) => ({
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

      // 비동기 처리를 위해 confirmAction(스토어 상태)을 async 함수로 래핑
      confirmAction: async () => {
        try {
          await onConfirm(); // 전달받은 onConfirm 함수를 await
        } catch (error) {
          console.error('Modal confirm action failed:', error);
          // (선택 사항) 여기서 작업 실패 토스트 알림을 띄울 수 있습니다.
          // toast.error('작업에 실패했습니다.');
        } finally {
          set({ isOpen: false }); // 작업이 성공/실패하든 완료되면 모달을 닫음
        }
      },

      // cancelAction(스토어 상태)도 래핑
      cancelAction: () => {
        if (onCancel) onCancel(); // 전달받은 onCancel 함수 실행
        set({ isOpen: false });
      },
    }),

  close: () => set({ isOpen: false }),
}));

// 다른 컴포넌트에서 쉽게 사용할 수 있도록 커스텀 훅 export
export const useConfirmationModal = () => {
  const { open } = useModalStore();
  return { confirm: open };
};
