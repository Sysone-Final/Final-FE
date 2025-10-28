import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore } from '../floorPlan/store/floorPlanStore';
import type { Asset } from '../floorPlan/types';
import ServerViewHeader from '../components/ServerViewHeader';
import LeftSidebar from '../floorPlan/components/LeftSidebar';
import Canvas from '../floorPlan/components/Canvas';
import RightSidebar from '../floorPlan/components/RightSidebar';
import BabylonDatacenterView from '../view3d/components/BabylonDatacenterView';
import RackModal from '../view3d/components/RackModal';

const CELL_SIZE = 80;
const HEADER_PADDING = 40;

// 충돌 감지 헬퍼 함수
const checkCollision = (
  targetAsset: Omit<Asset, 'id'>,
  allAssets: Asset[]
): boolean => {
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

const ServerViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [viewDimension, setViewDimension] = useState<'2D' | '3D'>('3D');

  // 2D FloorPlan 관련 상태
  const addAsset = useFloorPlanStore((state) => state.addAsset);
  const stage = useFloorPlanStore((state) => state.stage);
  const assets = useFloorPlanStore((state) => state.assets);
  const mode = useFloorPlanStore((state) => state.mode);

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

    const newAsset: Omit<Asset, 'id'> = { ...template, gridX, gridY };

    if (checkCollision(newAsset, assets)) {
      alert(
        `"${newAsset.name}"을(를) 해당 위치에 배치할 수 없습니다.\n동일한 레이어의 다른 자산과 겹칩니다.`
      );
      return;
    }

    addAsset(newAsset);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* 통합 헤더 */}
      <ServerViewHeader
        serverRoomId={id}
        viewDimension={viewDimension}
        onViewDimensionChange={setViewDimension}
      />

      {/* 뷰 컨텐츠 */}
      {viewDimension === '3D' ? (
        // 3D 뷰
        <>
          <div className="flex-1 overflow-hidden">
            <BabylonDatacenterView mode="view" serverRoomId={id} />
          </div>
          <RackModal />
        </>
      ) : (
        // 2D 뷰
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              className={`grid ${
                mode === 'view'
                  ? 'grid-cols-[280px_1fr]' // 뷰 모드: 2단
                  : 'grid-cols-[280px_1fr_320px]' // 편집 모드: 3단
              } flex-grow gap-4 overflow-hidden`}
            >
              <LeftSidebar />
              <Canvas />
              {mode === 'edit' && <RightSidebar />}
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default ServerViewPage;
