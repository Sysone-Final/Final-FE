import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore } from '../store/floorPlanStore';
import type { Asset } from '../types'; 
import TopToolbar from '../components/TopToolbar';
import LeftSidebar from '../components/LeftSidebar';
import Canvas from '../components/Canvas';
import RightSidebar from '../components/RightSidebar';

const CELL_SIZE = 40;
const HEADER_PADDING = 40;

// [추가] 충돌 감지 헬퍼 함수
const checkCollision = (targetAsset: Omit<Asset, 'id'>, allAssets: Asset[]): boolean => {
  for (const asset of allAssets) {
    // 다른 레이어의 자산과는 충돌하지 않음
    if (asset.layer !== targetAsset.layer) {
      continue;
    }

    // AABB 충돌 감지 (Axis-Aligned Bounding Box)
    if (
      targetAsset.gridX < asset.gridX + asset.widthInCells &&
      targetAsset.gridX + targetAsset.widthInCells > asset.gridX &&
      targetAsset.gridY < asset.gridY + asset.heightInCells &&
      targetAsset.gridY + targetAsset.heightInCells > asset.gridY
    ) {
      return true; // Collision detected
    }
  }
  return false; // No collision
};

const FloorPlanPage: React.FC = () => {
  const addAsset = useFloorPlanStore((state) => state.addAsset);
  const stage = useFloorPlanStore((state) => state.stage);
  // [추가] 충돌 감지를 위해 현재 모든 자산 목록을 가져옴
  const assets = useFloorPlanStore((state) => state.assets);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over || over.id !== 'canvas-drop-area' || !stage) {
      return;
    }

    const template = active.data.current as Omit<Asset, 'id' | 'gridX' | 'gridY'>;
    if (!template) return;

    const dropX = active.rect.current.translated?.left ?? 0;
    const dropY = active.rect.current.translated?.top ?? 0;
    
    const stageX = (dropX - stage.x) / stage.scale;
    const stageY = (dropY - stage.y) / stage.scale;
    
    const gridX = Math.floor((stageX - HEADER_PADDING) / CELL_SIZE);
    const gridY = Math.floor((stageY - HEADER_PADDING) / CELL_SIZE);

    const newAsset: Omit<Asset, 'id'> = {
      ...template,
      gridX,
      gridY,
    };
    
    // [추가] 자산을 추가하기 전에 충돌 검사 실행
    if (checkCollision(newAsset, assets)) {
      alert(`"${newAsset.name}"을(를) 해당 위치에 배치할 수 없습니다.\n동일한 레이어의 다른 자산과 겹칩니다.`);
      return; // 충돌 시 자산 추가 중단
    }
    
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

