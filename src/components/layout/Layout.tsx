import { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
      <div className="h-screen w-full flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
  
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
  );
}

export default Layout;
