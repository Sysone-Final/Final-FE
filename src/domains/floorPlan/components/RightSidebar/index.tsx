import React from 'react';

/**
 * RightSidebar: 화면 우측에 위치하며 선택된 자산의 정보를 보거나 속성을 편집하는 영역의 기본 틀입니다.
 */
const RightSidebar: React.FC = () => {
  return (
    <aside className="bg-white rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">Right Sidebar Area</h2>
      </div>
      <div className="flex-grow p-4">
        {/* 자산 선택 여부 및 모드에 따라 다른 컴포넌트가 여기에 표시됩니다. */}
      </div>
    </aside>
  );
};

export default RightSidebar;
