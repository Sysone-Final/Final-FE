import { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
    
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Layout;