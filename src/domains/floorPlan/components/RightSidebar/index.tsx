import React from 'react';
// ✅ 'floorPlanStore.ts'에서 내보낸 'useFloorPlanStore'를 정확히 같은 이름으로 가져옵니다 (import).
import { useFloorPlanStore } from '../../store/floorPlanStore'; 
import PropertiesEditor from './PropertiesEditor';
import PropertiesViewer from './PropertiesViewer';

/**
* RightSidebar: '보기/편집' 모드에 따라 속성 뷰어 또는 속성 편집기를 동적으로 렌더링합니다.
*/
const RightSidebar: React.FC = () => {
  // ✅ import한 'useFloorPlanStore' 훅을 정상적으로 호출합니다.
 const mode = useFloorPlanStore((state) => state.mode);

 return (
  <aside className="rounded-lg shadow-lg flex flex-col">
    <div className="p-4 border-b">
     <h2 className="text-title-sidebar">
      {mode === 'view' ? '속성 정보' : '속성 편집'}
     </h2>
    </div>
    <div className="flex-grow p-4">
     {mode === 'view' ? <PropertiesViewer /> : <PropertiesEditor />}
    </div>
  </aside>
 );
};

export default RightSidebar;
