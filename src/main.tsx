// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router';

// 💡 --- 1. React Query 도구 임포트 ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 💡 --- 2. QueryClient 인스턴스 생성 ---
const queryClient = new QueryClient();

// 💡 --- 3. MSW를 실행하는 비동기 함수 생성 ---
async function enableMocking() {
  // Vite 환경 변수(import.meta.env.MODE)가 'development'일 때만 MSW 실행
  if (import.meta.env.MODE !== 'development') {
    return;
  }
 
  // mocks/browser 파일을 동적으로 임포트
  const { worker } = await import('./mocks/browser');
 
  // MSW 워커를 시작합니다.
  // onUnhandledRequest: 'bypass'는 MSW가 처리하지 않는 요청(CSS, 폰트 등)을
  // 그대로 통과시키라는 의미입니다.
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// 💡 --- 4. 앱을 렌더링하기 전에 MSW를 먼저 실행 ---
// enableMocking()이 완료된 후(.then)에 React 앱을 렌더링합니다.
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {/* 💡 --- 5. QueryClientProvider를 최상단에 배치 --- */}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* Layout.tsx에서 옮겨온 Devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
});