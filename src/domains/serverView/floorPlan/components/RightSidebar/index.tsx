
import React from 'react';
import { useFloorPlanStore } from '../../store/floorPlanStore'; 
import PropertiesEditor from './PropertiesEditor';
import PropertiesViewer from './PropertiesViewer';

const RightSidebar: React.FC = () => {
  const mode = useFloorPlanStore((state) => state.mode);

  return (
    <aside className="rounded-lg shadow-lg flex flex-col bg-gray-800/70 backdrop-blur-sm border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-subtitle">
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