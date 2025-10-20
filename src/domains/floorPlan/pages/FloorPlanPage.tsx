import React from 'react';
import TopToolbar from '../components/TopToolbar';
import LeftSidebar from '../components/LeftSidebar';
import Canvas from '../components/Canvas';
import RightSidebar from '../components/RightSidebar';

/**
 * FloorPlanPage: 2D 평면도 화면의 전체 레이아웃을 구성하는 메인 페이지 컴포넌트입니다.
 * Tailwind CSS의 Grid를 사용하여 상단 툴바와 3단 컨텐츠 영역(좌측, 중앙, 우측)으로 나눕니다.
 */
const FloorPlanPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-gray-100 font-sans text-gray-800 overflow-hidden">
    {/* <div className="""h-screen w-full flex overflow-hidden"> */}
      {/* flex flex-col h-screen w-screen bg-gray-100 font-sans text-gray-800 */}
      {/* 상단 툴바 영역 */}
      <TopToolbar />

      {/* 메인 컨텐츠 영역 (좌측 사이드바, 캔버스, 우측 사이드바) */}
      <div className="grid grid-cols-[280px_1fr_320px] flex-grow gap-4 p-4 overflow-hidden">
        {/* 좌측 사이드바 */}
        <LeftSidebar />

        {/* 중앙 캔버스 */}
        <Canvas />

        {/* 우측 사이드바 */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default FloorPlanPage;

