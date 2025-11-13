import { useState, useCallback } from 'react';

export type ToastSeverity = 'error' | 'warning' | 'info' | 'success';

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

/** 토스트 메시지 관리 훅 */
export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback((message: string, severity: ToastSeverity = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
