
import React from 'react';
import { useFloorPlanStore } from '../../store/floorPlanStore'; 
import DisplayOptions from './DisplayOptions';
import PropertiesPanel from './PropertiesPanel';

const LeftSidebar: React.FC = () => {
  const mode = useFloorPlanStore((state) => state.mode);

  return (
    <aside className="rounded-lg shadow-lg flex flex-col h-full bg-gray-800/70 backdrop-blur-sm border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-subtitle">
          {mode === 'view' ? '표시 옵션' : '속성 편집'}
        </h2>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {mode === 'view' ? <DisplayOptions /> : <PropertiesPanel />}
      </div>
    </aside>
  );
};

export default LeftSidebar;