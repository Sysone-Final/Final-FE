import { type ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gray-50/30 h-full overflow-y-auto ">
        {children}
      </div>
    </div>
  );
}

export default MainContent;

//       <div className="relative bg-gray-50/30 backdrop-blur-3xl p-3 h-full overflow-hidden">
//         {/* children이 부모 컨텐츠 안쪽에서 전체를 차지하게 함 inset-0 */}
//         <div className="absolute inset-0">
//           {children}
//         </div>
//       </div>



