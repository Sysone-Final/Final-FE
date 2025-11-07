
import React from 'react';
// 1. 방금 수정한 "진짜" 공통 모달(Props 기반)을 가져옵니다.
import { ConfirmationModal } from '../../../../components/ConfirmationModal'; 
// 2. serverView의 전용 스토어를 가져옵니다.
import { useModalStore } from '../hooks/useConfirmationModal';

/**
 * serverView(floorPlan) 전용으로 사용되는
 * 'useModalStore' 기반의 모달 Wrapper입니다.
 */
export const FloorPlanConfirmationModal: React.FC = () => {
  // 3. 스토어에서 모든 상태와 액션을 가져옵니다.
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

  // 4. "진짜" 공통 모달(UI)에 스토어의 상태와 액션을 Props로 연결합니다.
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={cancelAction}  // Store의 'cancel'을 공통 모달의 'onClose'에 연결
      onConfirm={confirmAction} // Store의 'confirm'을 공통 모달의 'onConfirm'에 연결
      title={title}
      confirmText={confirmText}
      isDestructive={isDestructive}
    >
      {message} 
    </ConfirmationModal>
  );
};