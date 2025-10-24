

import React from 'react';
//  경로가 도메인 폴더 안을 가리키도록 수정되었습니다.
import { useFloorPlanStore } from '../store/floorPlanStore'; 

const TopToolbar: React.FC = () => {
  //  스토어에서 mode와 toggleMode를 가져옵니다.
  const { mode, toggleMode } = useFloorPlanStore();

  return (
    <div className="bg-white shadow-md p-2 flex justify-between items-center">
      <h1 className="text-lg font-bold">Floor Plan Editor</h1>
      <button
        //  onClick 이벤트에 toggleMode를 바로 연결합니다.
        onClick={toggleMode}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {mode === 'view' ? '편집 모드로 전환' : '보기 모드로 전환'}
      </button>
    </div>
  );
};

export default TopToolbar;