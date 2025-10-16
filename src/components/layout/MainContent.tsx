import { type ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gray-50/70 backdrop-blur-3xl rounded-tl-2xl h-full p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default MainContent;
