import { type ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="relative bg-gray-50/70 backdrop-blur-3xl p-3 rounded-tl-2xl h-full overflow-hidden">
        //children이 부모 컨텐츠 안쪽에서 전체를 차지하게 함 inset-0
        <div className="absolute inset-0 m-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
