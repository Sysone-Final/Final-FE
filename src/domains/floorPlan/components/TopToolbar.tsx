import React from 'react';

/**
 * TopToolbar: 화면 상단에 위치하며 레이아웃 이름, 모드 토글, 보기 기준 등을 포함할 툴바의 기본 틀입니다.
 */
const TopToolbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 bg-white shadow-md px-6 flex-shrink-0 z-10">
      <h1 className="text-xl font-bold">Top Toolbar Area</h1>
    </header>
  );
};

export default TopToolbar;

