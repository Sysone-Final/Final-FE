import { TriangleAlert, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

/**
 * 에러 Fallback UI 컴포넌트
 * 에러 발생 시 사용자에게 표시되는 UI
 */
function ErrorFallback({ 
  error, 
  resetError, 
  title = '오류가 발생했습니다',
  message = '일시적인 문제가 발생했습니다. 다시 시도해 주세요.'
}: ErrorFallbackProps) {
  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-neutral-800 border border-neutral-700 rounded-lg">
      <TriangleAlert className="w-12 h-12 text-red-500 mb-4" />
      
      <h2 className="text-xl font-semibold text-white mb-2">
        {title}
      </h2>
      
      <p className="text-neutral-400 text-center mb-4">
        {message}
      </p>
      
      {import.meta.env.DEV && error && (
        <details className="w-full mb-4">
          <summary className="cursor-pointer text-sm text-red-400 hover:text-red-300">
            상세 오류 정보
          </summary>
          <div className="mt-2 p-3 bg-neutral-900 rounded text-sm text-red-400 overflow-auto max-h-32">
            <div className="font-semibold">Error:</div>
            <div className="mb-2">{error.toString()}</div>
            <div className="font-semibold">Stack Trace:</div>
            <pre className="whitespace-pre-wrap text-xs">
              {error.stack}
            </pre>
          </div>
        </details>
      )}
      
      <button
        onClick={handleRetry}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        다시 시도
      </button>
    </div>
  );
}

export default ErrorFallback;
