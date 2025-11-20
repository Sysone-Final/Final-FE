import { type DragEndEvent } from '@dnd-kit/core';
import { useFloorPlanStore, addAsset } from '../store/floorPlanStore';
import type { Asset } from '../types';
import { checkCollision } from '../utils/collision';
import { CELL_SIZE, HEADER_PADDING } from '../utils/constants';
import toast from 'react-hot-toast';
import React from 'react';

export const useFloorPlanDragDrop = (
  containerRef: React.RefObject<HTMLDivElement>,
  serverRoomId?: string,
) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active, delta } = event;
    const { stage, assets } = useFloorPlanStore.getState();

    // 캔버스 ref가 없거나, 드롭 영역이 아니면 중단
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

    // 캔버스 영역의 화면상 실제 위치(offset)를 가져옵니다.
    const { top: containerTop, left: containerLeft } =
      containerRef.current.getBoundingClientRect();

    // 드래그 시작 위치에서 delta를 더해 최종 드롭 위치 계산
    const dropX_viewport = (active.rect.current.initial?.left ?? 0) + delta.x;
    const dropY_viewport = (active.rect.current.initial?.top ?? 0) + delta.y;

    // 화면 기준 좌표에서 캔버스 offset을 빼서 *캔버스 기준* 좌표로 변환
    const dropX_relative = dropX_viewport - containerLeft;
    const dropY_relative = dropY_viewport - containerTop;

    // *캔버스 기준* 좌표를 사용하여 stage 좌표로 변환
    const stageX = (dropX_relative - stage.x) / stage.scale;
    const stageY = (dropY_relative - stage.y) / stage.scale;

    // Stage 좌표를 그리드 좌표로 변환 (정확한 위치 계산)
    const gridX = Math.floor((stageX - HEADER_PADDING) / CELL_SIZE);
    const gridY = Math.floor((stageY - HEADER_PADDING) / CELL_SIZE);

    const newAsset: Omit<Asset, 'id'> = { ...template, gridX, gridY };

    if (checkCollision(newAsset, assets)) {
      toast.error(
        `"${newAsset.name}"을(를) 배치할 수 없습니다. 다른 자산과 겹칩니다.`,
        {
          id: 'asset-collision-error',
        },
      );
      return;
    }

    addAsset(newAsset, serverRoomId);
  };

  return { handleDragEnd };
};