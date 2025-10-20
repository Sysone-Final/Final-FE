import React from 'react';
// 1. 스토어와 자식 컴포넌트들을 import 합니다.
// [수정] store 파일의 상대 경로를 정확하게 수정했습니다.
import { useFloorPlanStore } from '../../store/floorPlanStore'; 
import AssetLibrary from './AssetLibrary';
import DisplayOptions from './DisplayOptions';

/**
* LeftSidebar: '보기/편집' 모드에 따라 표시 옵션 또는 자산 라이브러리를 동적으로 렌더링합니다.
*/
const LeftSidebar: React.FC = () => {
  // 2. 스토어에서 현재 mode 상태를 가져옵니다.
 const mode = useFloorPlanStore((state) => state.mode);

 return (
  <aside className="bg-white rounded-lg shadow-lg flex flex-col">
   <div className="p-4 border-b">
        {/* 3. 제목도 현재 모드에 따라 동적으로 변경해 줍니다. */}
    <h2 className="text-lg font-semibold text-gray-700">
          {mode === 'view' ? '표시 옵션' : '자산 라이브러리'}
        </h2>
   </div>
   <div className="flex-grow p-4">
        {/* 4. mode 값에 따라 적절한 컴포넌트를 렌더링합니다. */}
    {mode === 'view' ? <DisplayOptions /> : <AssetLibrary />}
   </div>
     </aside>
 );
};

export default LeftSidebar;
