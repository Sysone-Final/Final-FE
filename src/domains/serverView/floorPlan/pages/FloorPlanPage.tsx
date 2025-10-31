import { type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore, addAsset } from './../store/floorPlanStore';
import type { Asset } from './../types';

export const CELL_SIZE = 160;
export const HEADER_PADDING = 80;

//충돌 감지
export const checkCollision = (
  targetAsset: Omit<Asset, 'id'>,
  allAssets: Asset[],
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

export const useFloorPlanDragDrop = () => {
  // 훅 내부에서 state를 구독하지 않습니다.
  // const addAsset = useFloorPlanStore((state) => state.addAsset);  <-- 삭제
  // const stage = useFloorPlanStore((state) => state.stage);      <-- 삭제
  // const assets = useFloorPlanStore((state) => state.assets);     <-- 삭제

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    // 함수가 실행되는 시점에 store에서 최신 상태를 가져옵니다.
    const { stage, assets } = useFloorPlanStore.getState();

    if (!over || over.id !== 'canvas-drop-area' || !stage) {
      return;
    }
    const template = active.data.current as Omit<
      Asset,
      'id' | 'gridX' | 'gridY'
    >;
    if (!template) return;

    const dropX = active.rect.current.translated?.left ?? 0;
    const dropY = active.rect.current.translated?.top ?? 0;

    const stageX = (dropX - stage.x) / stage.scale;
    const stageY = (dropY - stage.y) / stage.scale;

    const gridX = Math.floor((stageX - HEADER_PADDING) / CELL_SIZE);
    const gridY = Math.floor((stageY - HEADER_PADDING) / CELL_SIZE);

    const newAsset: Omit<Asset, 'id'> = { ...template, gridX, gridY };

    if (checkCollision(newAsset, assets)) {
      console.warn(
        `"${newAsset.name}"을(를) 해당 위치에 배치할 수 없습니다.\n동일한 레이어의 다른 자산과 겹칩니다.`,
      );
      return;
    }

    addAsset(newAsset); 
  };

  return { handleDragEnd };
};