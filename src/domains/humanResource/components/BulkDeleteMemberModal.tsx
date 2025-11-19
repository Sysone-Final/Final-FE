import { ConfirmationModal } from '@/shared/ConfirmationModal';

interface BulkDeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  isLoading?: boolean;
}

export default function BulkDeleteMemberModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
}: BulkDeleteMemberModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="회원 대량 삭제"
      confirmText="삭제"
      isDestructive={true}
      isLoading={isLoading}
    >
      <p>
        선택한 <strong>{selectedCount}명</strong>의 회원을 정말 삭제하시겠습니까?
      </p>
    </ConfirmationModal>
  );
}
