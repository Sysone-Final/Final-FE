interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="loader" />
        <div className="text-white text-lg font-medium">{message}</div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
