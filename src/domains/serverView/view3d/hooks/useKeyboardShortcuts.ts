import { useEffect } from 'react';

interface UseKeyboardShortcutsParams {
  mode: 'edit' | 'view';
  selectedEquipmentIds: string[];
  onDelete: () => void;
  onClearSelection: () => void;
}

/** 키보드 단축키 관리 */
export function useKeyboardShortcuts({
  mode,
  selectedEquipmentIds,
  onDelete,
  onClearSelection,
}: UseKeyboardShortcutsParams) {
  useEffect(() => {
    if (mode !== 'edit') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete 키: 선택된 장비 삭제
      if (e.key === 'Delete' && selectedEquipmentIds.length > 0) {
        onDelete();
      }
      
      // Escape 키: 선택 해제
      if (e.key === 'Escape') {
        onClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, selectedEquipmentIds, onDelete, onClearSelection]);
}
