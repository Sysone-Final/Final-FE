import { ConfirmationModal } from '@/shared/ConfirmationModal';

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string | null;
  isLoading?: boolean;
}

export default function DeleteMemberModal({
  isOpen,
  onClose,
  onConfirm,
  memberName,
  isLoading = false,
}: DeleteMemberModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="회원 삭제"
      confirmText="삭제"
      isDestructive={true}
      isLoading={isLoading}
    >
      <p>
        <strong>{memberName}</strong> 회원을 정말 삭제하시겠습니까?
      </p>
      <p className="text-sm text-gray-400 mt-2">
        이 작업은 되돌릴 수 없습니다.
      </p>
    </ConfirmationModal>
  );
}
