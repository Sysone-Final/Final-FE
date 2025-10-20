import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore } from '../store/floorPlanStore';
import type { Asset } from '../types'; // Asset 타입을 가져옵니다.
import TopToolbar from '../components/TopToolbar';
import LeftSidebar from '../components/LeftSidebar';
import Canvas from '../components/Canvas';
import RightSidebar from '../components/RightSidebar';

// 캔버스 관련 상수
const CELL_SIZE = 40;
const HEADER_PADDING = 40;

const FloorPlanPage: React.FC = () => {
  const addAsset = useFloorPlanStore((state) => state.addAsset);
  const stage = useFloorPlanStore((state) => state.stage);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over || over.id !== 'canvas-drop-area' || !stage) {
      return;
    }

    const template = active.data.current as Omit<Asset, 'id' | 'gridX' | 'gridY'>;
    if (!template) return;

    // 드롭된 최종 스크린 좌표
    // active.rect.current.translated는 드래그가 끝난 시점의 최종 위치를 담고 있습니다.
    const dropX = active.rect.current.translated?.left ?? 0;
    const dropY = active.rect.current.translated?.top ?? 0;
    
    // 캔버스의 현재 위치(pan)와 배율(zoom)을 고려하여 실제 그리드 좌표 계산
    const stageX = (dropX - stage.x) / stage.scale;
    const stageY = (dropY - stage.y) / stage.scale;
    
    // 헤더 여백을 제외하고 셀 크기로 나누어 그리드 좌표를 구합니다.
    const gridX = Math.floor((stageX - HEADER_PADDING) / CELL_SIZE);
    const gridY = Math.floor((stageY - HEADER_PADDING) / CELL_SIZE);

    const newAsset: Omit<Asset, 'id'> = {
      ...template,
      gridX,
      gridY,
    };
    
    addAsset(newAsset);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full w-full bg-gray-100 font-sans text-gray-800 overflow-hidden">
        <TopToolbar />
        <div className="grid grid-cols-[280px_1fr_320px] flex-grow gap-4 p-4 overflow-hidden">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </div>
    </DndContext>
  );
};

export default FloorPlanPage;

