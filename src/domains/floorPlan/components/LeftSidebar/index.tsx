import React from 'react';
// store와 자식 컴포넌트의 상대 경로를 현재 파일 위치에 맞게 수정합니다.
import { useFloorPlanStore } from '../../store/floorPlanStore'; 
import AssetLibrary from './AssetLibrary';
import DisplayOptions from './DisplayOptions';

/**
* LeftSidebar: '보기/편집' 모드에 따라 표시 옵션 또는 자산 라이브러리를 동적으로 렌더링합니다.
* 자산 라이브러리가 표시될 때 스크롤이 가능하도록 레이아웃을 수정했습니다.
*/
const LeftSidebar: React.FC = () => {
  const mode = useFloorPlanStore((state) => state.mode);

  return (
    //  사이드바가 부모의 전체 높이를 차지하도록 h-full 클래스를 추가합니다.
    <aside className="rounded-lg shadow-lg flex flex-col h-full">
   <div className="p-4 border-b">
    <h2 className="text-title-sidebar">
     {mode === 'view' ? '표시 옵션' : '자산 라이브러리'}
    </h2>
   </div>
      
      {/* 이 컨테이너가 남은 공간을 모두 차지하고(flex-grow), 
          내부 컨텐츠가 넘칠 경우 자동으로 스크롤바가 생기도록(overflow-y-auto) 수정합니다.
          p-4 패딩은 컨텐츠가 너무 가장자리에 붙지 않도록 안쪽으로 이동시켰습니다.
      */}
      <div className="flex-grow overflow-y-auto p-4">
        {mode === 'view' ? <DisplayOptions /> : <AssetLibrary />}
      </div>
    </aside>
  );
};

export default LeftSidebar;
