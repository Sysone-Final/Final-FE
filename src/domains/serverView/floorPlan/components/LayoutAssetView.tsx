// floorPlan/components/LayoutAssetView.tsx
// (이 파일의 모든 내용을 아래 코드로 교체하세요)

import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';

import {
  useFloorPlanStore,
  updateAsset,
  selectAsset,
} from '../store/floorPlanStore';

// AssetRenderer.tsx에서 export한 타입을 가져옵니다.
import type { AssetRendererProps } from './AssetRenderer';
import type { Asset } from '../types';

// --- 기존 AssetRenderer의 모든 상수와 헬퍼 함수 ---
const STATUS_COLORS = { normal: '#27ae60', warning: '#f39c12', danger: '#c0392b', selected: '#3498db' };
const DOOR_COLOR = '#7f8c8d';

// (기존 checkCollision 로직)
const checkCollision = (targetAsset: Asset, allAssets: Asset[]): boolean => {
  for (const otherAsset of allAssets) {
    if (otherAsset.id === targetAsset.id) continue;
    if (otherAsset.layer !== targetAsset.layer) continue;
    if (
      targetAsset.gridX < otherAsset.gridX + otherAsset.widthInCells &&
      targetAsset.gridX + targetAsset.widthInCells > otherAsset.gridX &&
      targetAsset.gridY < otherAsset.gridY + otherAsset.heightInCells &&
      targetAsset.gridY + targetAsset.heightInCells > otherAsset.gridY
    ) {
      return true;
    }
  }
  return false;
};

// --- 컴포넌트 이름을 LayoutAssetView로 변경 ---
const LayoutAssetView: React.FC<AssetRendererProps> = ({
  asset,
  gridSize,
  headerPadding,
  isSelected,
  displayMode,
  displayOptions,
}) => {
  
  // --- 기존 AssetRenderer의 모든 내부 로직 ---
  
  const mode = useFloorPlanStore((state) => state.mode);
  const assets = useFloorPlanStore((state) => state.assets);

  // (asset 유효성 검사는 상위 AssetRenderer.tsx가 이미 처리)
  
  const pixelX = headerPadding + (asset.gridX ?? 0) * gridSize;
  const pixelY = headerPadding + (asset.gridY ?? 0) * gridSize;
  const pixelWidth = (asset.widthInCells ?? 1) * gridSize;
  const pixelHeight = (asset.heightInCells ?? 1) * gridSize;

  // [추가] '상태 임계값' 모드인지 확인
  const isDashboardView = displayMode === 'status';

  const rackFillColor = isDashboardView
    ? '#2d3748' // 대시보드 뷰일 때 어두운 회색 (랙 아님)
    : displayMode === 'customColor'
    ? asset.customColor || '#4b5563'
    : asset.status
    ? STATUS_COLORS[asset.status]
    : '#4b5563';

    const strokeColor = isSelected
        ? STATUS_COLORS.selected
        : isDashboardView
        ? '#4a5568' // 대시보드 뷰일 때 더 어두운 테두리
        : '#bdc3c7';
    
    const offsetX = pixelWidth / 2;
    const offsetY = pixelHeight / 2;

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const group = e.target;
    const newTopLeftX = e.target.x() - offsetX;
    const newTopLeftY = e.target.y() - offsetY;
    const newGridX = Math.round((newTopLeftX - headerPadding) / gridSize);
    const newGridY = Math.round((newTopLeftY - headerPadding) / gridSize);
    const deltaGridX = newGridX - asset.gridX;
    const deltaGridY = newGridY - asset.gridY;

    if (deltaGridX === 0 && deltaGridY === 0) {
      group.x(pixelX + offsetX);
      group.y(pixelY + offsetY);
      return;
    }

    const assetsToMove = asset.groupId
      ? assets.filter((a) => a.groupId === asset.groupId)
      : [asset];
    const otherAssets = assets.filter(
      (a) => !assetsToMove.some((m) => m.id === a.id),
    );

    let collisionFound = false;
    for (const memberToMove of assetsToMove) {
      const movedMemberPreview: Asset = {
        ...memberToMove,
        gridX: memberToMove.gridX + deltaGridX,
        gridY: memberToMove.gridY + deltaGridY,
      };
      if (checkCollision(movedMemberPreview, otherAssets)) {
        collisionFound = true;
        break;
      }
    }

    if (collisionFound) {
      const message = asset.groupId
        ? '그룹을 해당 위치로 이동할 수 없습니다.'
        : `"${asset.name}"을(를) 해당 위치로 이동할 수 없습니다.`;
      console.warn(`${message}\n동일한 레이어의 다른 자산과 겹칩니다.`);
      group.x(pixelX + offsetX);
      group.y(pixelY + offsetY);
      return;
    }

    assetsToMove.forEach((member) => {
      updateAsset(member.id, {
        gridX: member.gridX + deltaGridX,
        gridY: member.gridY + deltaGridY,
      });
    });
  };

  const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    selectAsset(asset.id, e.evt.shiftKey);
  };

  const getDoorPosition = () => {
    const barThickness = 4;
    switch (asset.doorDirection) {
      case 'north': return { x: 2, y: 0, width: pixelWidth - 4, height: barThickness };
      case 'south': return { x: 2, y: pixelHeight - barThickness, width: pixelWidth - 4, height: barThickness };
      case 'west': return { x: 0, y: 2, width: barThickness, height: pixelHeight - 4 };
      case 'east': return { x: pixelWidth - barThickness, y: 2, width: barThickness, height: pixelHeight - 4 };
      default: return null;
    }
  };
  const doorPos = getDoorPosition();
  const baseFontSize = 16;
  const smallFontSize = 14;

  return (
    <Group
      x={pixelX + offsetX}
      y={pixelY + offsetY}
      rotation={asset.rotation || 0}
      offsetX={offsetX}
      offsetY={offsetY}
      onClick={handleClick}
      onTap={handleClick}
      draggable={mode === 'edit' && !asset.isLocked}
      onDragEnd={handleDragEnd}
    >
      <Rect
        width={pixelWidth}
        height={pixelHeight}
        fill={rackFillColor}
        stroke={strokeColor}
        strokeWidth={isSelected ? 3 : 1.5}
        cornerRadius={4}
        opacity={isDashboardView ? 0.8 : asset.opacity ?? 1} // 대시보드 뷰에서 살짝 투명하게
      />
      
      {/* 문은 대시보드 뷰에서도 보이도록 유지 */}
      {(asset.assetType === 'rack' || asset.assetType.startsWith('door')) &&
        doorPos && !isDashboardView && ( // 대시보드 뷰에서는 문 표시 X
          <Rect {...doorPos} fill={DOOR_COLOR} listening={false} />
      )}
      <Group listening={false}>
        {/* [수정] 대시보드 뷰 텍스트 로직 */}
        {isDashboardView ? (
          <>
            {/* 대시보드 뷰에서는 벽(wall) 이름은 숨기고, 그 외 자산 이름만 표시 */}
            {asset.assetType !== 'wall' && (
              <Text
                text={asset.name}
                x={5} y={5}
                fontSize={baseFontSize}
                fill="#9ca3af" // 어두운 텍스트 색상
                width={pixelWidth - 10}
                wrap="char"
              />
            )}
          </>
        ) : (
          <>
        {displayOptions.showName && (
          <Text
            text={asset.name} x={5} y={5} fontSize={baseFontSize} fill="#FFFFFF"
            width={pixelWidth - 10} wrap="char"
          />
        )}
        {displayOptions.showStatusIndicator && asset.status && (
          <Circle
            x={pixelWidth - 10} y={10} radius={5}
            fill={STATUS_COLORS[asset.status]} stroke="#fff" strokeWidth={1}
          />
        )}
        {displayOptions.showTemperature && asset.data?.temperature && (
          <Text
            text={`T: ${asset.data.temperature}°C`} x={5} y={baseFontSize + 8}
            fontSize={smallFontSize} fill="#FFFFFF"
          />
        )}
        {/* [!!!] "66% Full" 버그 수정 [!!!] */}
            {/* (지난번에 건너뛴 3단계입니다) */}
            {displayOptions.showUUsage && asset.data?.uUsage !== undefined && (
              <Text
                text={`U: ${asset.data.uUsage}%`} x={5} y={baseFontSize + smallFontSize + 12}
                fontSize={smallFontSize} fill="#FFFFFF"
              />
            )}

        {asset.isLocked && (
              <Text
                text="🔒" x={5} y={pixelHeight - 18} fontSize={14} opacity={0.7}
              />
            )}
          </>
        )}
      </Group>
    </Group>
  );
};

export default LayoutAssetView;