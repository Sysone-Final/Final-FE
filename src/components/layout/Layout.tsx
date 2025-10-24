import { type ReactNode } from 'react';
import Header from './Header';
import MainContent from './MainContent';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
      <div className="h-screen w-full flex flex-col overflow-hidden">
        <Header />
        <MainContent>
          {children}
        </MainContent>
      </div>
  );
}

export default Layout;
