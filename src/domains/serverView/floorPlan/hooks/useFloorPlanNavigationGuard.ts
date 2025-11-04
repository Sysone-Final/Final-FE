import { useEffect } from 'react';
import { useBlocker, useLocation } from 'react-router-dom';
import { useFloorPlanStore, useHasUnsavedChanges } from '../store/floorPlanStore';
import { useConfirmationModal } from '../components/ConfirmationModal';

/**
 * FloorPlan 편집 시 페이지 이탈을 방지하는 훅
 * - 라우터 네비게이션 차단 (useBlocker)
 * - 브라우저 새로고침/탭 닫기 차단 (beforeunload)
 */
export const useFloorPlanNavigationGuard = () => {
  const location = useLocation();
  const mode = useFloorPlanStore((state) => state.mode);
  const hasUnsavedChanges = useHasUnsavedChanges();
  const clearTemporalHistory = useFloorPlanStore.temporal.getState().clear;
  const { confirm } = useConfirmationModal();

  // 편집 모드이고, 저장 안한게 있으면 true
  const shouldBlock = mode === 'edit' && hasUnsavedChanges;

  // 1. 라우터 네비게이션 차단
  const blocker = useBlocker(
    ({ nextLocation }) =>
      shouldBlock && nextLocation.pathname !== location.pathname,
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      confirm({
        title: '페이지 이탈 확인',
        message:
          '저장하지 않은 변경 사항이 있습니다. 정말로 이 페이지를 벗어나시겠습니까?',
        confirmText: '나가기',
        confirmAction: () => {
          clearTemporalHistory();
          blocker.proceed();
        },
        cancelAction: () => {
          blocker.reset();
        },
      });
    }
  }, [blocker, confirm, clearTemporalHistory]);

  // 2. 브라우저 이탈 방지 (새로고침, 탭 닫기)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        event.returnValue = '저장하지 않은 변경 사항이 있습니다.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock]);
};