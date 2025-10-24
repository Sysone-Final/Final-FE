import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore } from './../store/floorPlanStore';
import type { Asset } from './../types'; 
import TopToolbar from './../components/TopToolbar';
import LeftSidebar from './../components/LeftSidebar';
import Canvas from '../components/Canvas';
import RightSidebar from '../components/RightSidebar';

const CELL_SIZE = 80;
const HEADER_PADDING = 40;

// 충돌 감지 헬퍼 함수
const checkCollision = (targetAsset: Omit<Asset, 'id'>, allAssets: Asset[]): boolean => {
  for (const asset of allAssets) {
    if (asset.layer !== targetAsset.layer) {
      continue;
    }
    if (
      targetAsset.gridX < asset.gridX + asset.widthInCells &&
      targetAsset.gridX + targetAsset.widthInCells > asset.gridX &&
      targetAsset.gridY < asset.gridY + asset.heightInCells &&
      targetAsset.gridY + targetAsset.heightInCells > asset.gridY
    ) {
      return true;
    }
  }
  return false;
};

const FloorPlanPage: React.FC = () => {
  const addAsset = useFloorPlanStore((state) => state.addAsset);
  const stage = useFloorPlanStore((state) => state.stage);
  const assets = useFloorPlanStore((state) => state.assets);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || over.id !== 'canvas-drop-area' || !stage) {
      return;
    }
    const template = active.data.current as Omit<Asset, 'id'|'gridX'|'gridY'>;
    if (!template) return;

    const dropX = active.rect.current.translated?.left ?? 0;
    const dropY = active.rect.current.translated?.top ?? 0;
    
    const stageX = (dropX - stage.x) / stage.scale;
    const stageY = (dropY - stage.y) / stage.scale;
    
    const gridX = Math.floor((stageX - HEADER_PADDING) / CELL_SIZE);
    const gridY = Math.floor((stageY - HEADER_PADDING) / CELL_SIZE);

    const newAsset: Omit<Asset, 'id'> = { ...template, gridX, gridY };
    
    if (checkCollision(newAsset, assets)) {
      alert(`"${newAsset.name}"을(를) 해당 위치에 배치할 수 없습니다.\n동일한 레이어의 다른 자산과 겹칩니다.`);
      return;
    }
    
    addAsset(newAsset);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* 배경색, 폰트, 여백 스타일이 모두 제거된 최상위 div */}
      <div className="flex flex-col h-full w-full overflow-hidden">
        <TopToolbar />
        {/* 여백(p-4)이 제거된 내부 그리드 div */}
        <div className="grid grid-cols-[280px_1fr_320px] flex-grow gap-4 overflow-hidden">
          <LeftSidebar />
          {/* Canvas를 감싸던 div를 제거하여 배경이 없도록 함 */}
          <Canvas />
          <RightSidebar />
        </div>
      </div>
    </DndContext>
  );
};

export default FloorPlanPage;

