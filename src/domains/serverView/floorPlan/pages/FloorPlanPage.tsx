import { type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore, addAsset } from './../store/floorPlanStore';
import type { Asset } from './../types';
import toast from 'react-hot-toast';
import React from 'react'; 

export const CELL_SIZE = 160;
export const HEADER_PADDING = 80;

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


// 2. 훅이 캔버스 컨테이너의 ref를 인자로 받도록 수정
export const useFloorPlanDragDrop = (
 containerRef: React.RefObject<HTMLDivElement>,
) => {
 const handleDragEnd = (event: DragEndEvent) => {
  const { over, active } = event;
  const { stage, assets } = useFloorPlanStore.getState();

  // 3. 캔버스 ref가 없거나, 드롭 영역이 아니면 중단
  if (
   !over ||
   over.id !== 'canvas-drop-area' ||
   !stage ||
   !containerRef.current
  ) {
   return;
  }

  const template = active.data.current as Omit<
   Asset,
   'id' | 'gridX' | 'gridY'
  >;
  if (!template) return;

  // 4. 캔버스 영역의 화면상 실제 위치(offset)를 가져옵니다.
  const { top: containerTop, left: containerLeft } =
   containerRef.current.getBoundingClientRect();

  // 5. dnd-kit이 반환한 *화면(Viewport) 기준* 좌표
  const dropX_viewport = active.rect.current.translated?.left ?? 0;
  const dropY_viewport = active.rect.current.translated?.top ?? 0;

  // 6. 화면 기준 좌표에서 캔버스 offset을 빼서 *캔버스 기준* 좌표로 변환
  const dropX_relative = dropX_viewport - containerLeft;
  const dropY_relative = dropY_viewport - containerTop;

  // 7. *캔버스 기준* 좌표를 사용하여 stage 좌표로 변환
  const stageX = (dropX_relative - stage.x) / stage.scale;
  const stageY = (dropY_relative - stage.y) / stage.scale;

  // 8. Stage 좌표를 그리드 좌표로 변환 (Math.round 유지)
  const gridX = Math.round((stageX - HEADER_PADDING) / CELL_SIZE);
  const gridY = Math.round((stageY - HEADER_PADDING) / CELL_SIZE);

  const newAsset: Omit<Asset, 'id'> = { ...template, gridX, gridY };

  // --- (이하는 동일) ---
  if (checkCollision(newAsset, assets)) {
   toast.error(
    `"${newAsset.name}"을(를) 배치할 수 없습니다. 다른 자산과 겹칩니다.`,
    {
     id: 'asset-collision-error',
    },
   );
   return;
  }

  addAsset(newAsset);

  toast.success(`"${newAsset.name}" 자산이 추가되었습니다.`);
 };

 return { handleDragEnd };
};