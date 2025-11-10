import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router';
import { Toaster } from 'react-hot-toast';
//  --- 1. React Query 도구 임포트 ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') {
//     return;
//   }
//   const { worker } = await import('./mocks/browser');
 
//   return worker.start({
//     onUnhandledRequest: 'bypass',
//   });
// }

// enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* --- [2] Toaster 컴포넌트 추가 --- */}
    <Toaster
     position="top-right"
     toastOptions={{
      duration: 3000,
     }}
    />
        {/* Layout.tsx에서 옮겨온 Devtools */}
      </QueryClientProvider>
    </StrictMode>,
  );
// });