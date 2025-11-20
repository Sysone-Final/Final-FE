import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import toast from 'react-hot-toast';
import {
 useFloorPlanStore,
 updateAsset,
 selectAsset,
} from '../store/floorPlanStore';

import { useBabylonDatacenterStore } from '@/domains/serverView/view3d/stores/useBabylonDatacenterStore';
import type { AssetRendererProps } from './AssetRenderer';
import type { Asset } from '../types';

const STATUS_COLORS = { normal: '#27ae60', warning: '#f39c12', danger: '#c0392b', selected: '#3498db' };
const DOOR_COLOR = '#7f8c8d';

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

// 평면도 경계 밖으로 나가는지 검사하는 함수
const checkOutOfBounds = (targetAsset: Asset, gridCols: number, gridRows: number): boolean => {
 // 왼쪽 또는 위쪽 경계를 벗어나는지 검사
 if (targetAsset.gridX < 0 || targetAsset.gridY < 0) {
  return true;
 }
 // 오른쪽 또는 아래쪽 경계를 벗어나는지 검사
 if (
  targetAsset.gridX + targetAsset.widthInCells > gridCols ||
  targetAsset.gridY + targetAsset.heightInCells > gridRows
 ) {
  return true;
 }
 return false;
};

const LayoutAssetView: React.FC<AssetRendererProps> = ({
 asset,
 gridSize,
 headerPadding,
 isSelected,
 displayMode,
 displayOptions,
 onContextMenu,
}) => {
 const mode = useFloorPlanStore((state) => state.mode);
 const assets = useFloorPlanStore((state) => state.assets);
 const gridCols = useFloorPlanStore((state) => state.gridCols);
 const gridRows = useFloorPlanStore((state) => state.gridRows);

 const openRackModal = useBabylonDatacenterStore((state) => state.openRackModal);

 const pixelX = headerPadding + (asset.gridX ?? 0) * gridSize;
 const pixelY = headerPadding + (asset.gridY ?? 0) * gridSize;
 const pixelWidth = (asset.widthInCells ?? 1) * gridSize;
 const pixelHeight = (asset.heightInCells ?? 1) * gridSize;

 const isDashboardView = displayMode === 'status';

 const rackFillColor = isDashboardView
  ? '#2d3748'
  : displayMode === 'customColor'
  ? asset.customColor || '#4b5563'
  : asset.status
  ? STATUS_COLORS[asset.status]
  : '#4b5563';

 const strokeColor = isSelected
  ? STATUS_COLORS.selected
  : isDashboardView
  ? '#4a5568'
  : '#bdc3c7';

 const offsetX = pixelWidth / 2;
 const offsetY = pixelHeight / 2;
 const isDoor = asset.assetType.startsWith('door_');
 const groupY = isDoor ? pixelY + (gridSize / 2) : pixelY + offsetY;

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
   // 🚨 수정: 드래그 취소 시에도 중앙 정렬 로직을 반영합니다.
   group.y(groupY);
   return;
  }

  const assetsToMove = asset.groupId
   ? assets.filter((a) => a.groupId === asset.groupId)
   : [asset];
  const otherAssets = assets.filter(
   (a) => !assetsToMove.some((m) => m.id === a.id),
  );

  // 경계 검사
  let outOfBoundsFound = false;
  for (const memberToMove of assetsToMove) {
   const movedMemberPreview: Asset = {
    ...memberToMove,
    gridX: memberToMove.gridX + deltaGridX,
    gridY: memberToMove.gridY + deltaGridY,
   };
   if (checkOutOfBounds(movedMemberPreview, gridCols, gridRows)) {
    outOfBoundsFound = true;
    break;
   }
  }

  if (outOfBoundsFound) {
   const message = asset.groupId
    ? '그룹을 평면도 밖으로 이동할 수 없습니다.'
    : `"${asset.name}"을(를) 평면도 밖으로 배치할 수 없습니다.`;

   toast.error(message, {
    id: 'asset-move-out-of-bounds', // 중복 알림 방지
   });

   group.x(pixelX + offsetX);
   group.y(groupY);
   return;
  }

  // 충돌 검사
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
    ? '그룹을 이동할 수 없습니다.'
    : `"${asset.name}"을(를) 이동할 수 없습니다.`;

   toast.error(`${message} 다른 자산과 겹칩니다.`, {
    id: 'asset-move-collision', // 중복 알림 방지
   });

    group.x(pixelX + offsetX);
   group.y(groupY);
   return;
  }

  // (충돌이 없었을 때) 자산을 새 위치로 업데이트합니다.
  assetsToMove.forEach((member) => {
   updateAsset(member.id, {
    gridX: member.gridX + deltaGridX,
    gridY: member.gridY + deltaGridY,
   });
  });
 }; 

const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    
    //  2D 스토어의 자산 선택 
    selectAsset(asset.id, e.evt.shiftKey);

    // view 모드에서 rack 클릭 시 rackServerId가 있을 때만 랙 모달 열기
    if (mode === 'view' && asset.assetType === 'rack' && asset.data?.rackServerId) {
      openRackModal(asset.data.rackServerId.toString());
    }
  };

 const getDoorPosition = () => {
  const barThickness = 4;
  switch (asset.doorDirection) {
   case 'north':
    return { x: 2, y: 0, width: pixelWidth - 4, height: barThickness };
   case 'south':
    return {
     x: 2,
     y: pixelHeight - barThickness,
     width: pixelWidth - 4,
     height: barThickness,
    };
   case 'west':
    return { x: 0, y: 2, width: barThickness, height: pixelHeight - 4 };
   case 'east':
    return {
     x: pixelWidth - barThickness,
     y: 2,
     width: barThickness,
     height: pixelHeight - 4,
    };
   default:
    return null;
  }
 };

 // 랙의 문 표시 위치 계산 (rotation 고려)
 const getRackDoorPosition = () => {
  // 랙이 아니면 null
  if (asset.assetType !== 'rack') return null;
  
  // doorDirection이 없으면 기본값 'FRONT' 사용 (임시로 모든 랙에 표시)
  const doorDirection = asset.rackDoorDirection || 'FRONT';
  
  const barThickness = 8; // 적당한 두께
  const rotation = asset.rotation || 0;
  
  // 회전 각도에 따라 FRONT가 어느 방향인지 결정
  // 0도: 위쪽, 90도: 오른쪽, 180도: 아래쪽, 270도: 왼쪽
  let side: 'top' | 'right' | 'bottom' | 'left' = 'top';
  
  if (rotation >= -45 && rotation < 45) {
    side = 'top';
  } else if (rotation >= 45 && rotation < 135) {
    side = 'right';
  } else if (rotation >= 135 || rotation < -135) {
    side = 'bottom';
  } else {
    side = 'left';
  }
  
  // BACK인 경우 반대편
  if (doorDirection === 'BACK') {
    side = side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left';
  }
  
  const padding = 2;
  switch (side) {
    case 'top':
      return { x: padding, y: 0, width: pixelWidth - padding * 2, height: barThickness };
    case 'bottom':
      return { x: padding, y: pixelHeight - barThickness, width: pixelWidth - padding * 2, height: barThickness };
    case 'left':
      return { x: 0, y: padding, width: barThickness, height: pixelHeight - padding * 2 };
    case 'right':
      return { x: pixelWidth - barThickness, y: padding, width: barThickness, height: pixelHeight - padding * 2 };
  }
 };
 
 const doorPos = getDoorPosition();
 const rackDoorPos = getRackDoorPosition();
 const baseFontSize = 16;
 const smallFontSize = 14;

 return (
  <Group
   x={pixelX + offsetX}
  y={groupY}
   rotation={asset.rotation || 0}
   offsetX={offsetX}
   offsetY={offsetY}
   onClick={handleClick}
   onTap={handleClick}
   draggable={mode === 'edit' && !asset.isLocked}
   onDragEnd={handleDragEnd}
   onContextMenu={onContextMenu}
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

   {/* 랙의 문 표시 - 모든 모드에서 표시 */}
   {asset.assetType === 'rack' && rackDoorPos && (
     <Rect 
       {...rackDoorPos} 
       fill="#06b6d4" // 청록색 (cyan-500)
       opacity={0.75} // 살짝 투명도
       listening={false} 
     />
   )}

   {/* door 타입 자산의 문 표시 */}
   {asset.assetType.startsWith('door') &&
    doorPos &&
    !isDashboardView && ( // 대시보드 뷰에서는 문 표시 X
     <Rect {...doorPos} fill={DOOR_COLOR} listening={false} />
    )}
   <Group listening={false}>
    {/* 대시보드 뷰 텍스트 */}
    {isDashboardView ? (
     <>
      {/* 대시보드 뷰에서는 벽(wall) 이름은 숨기고, 그 외 자산 이름만 표시 */}
      {asset.assetType !== 'wall' && (
       <Text
        text={asset.name}
        x={5}
        y={5}
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
        text={asset.name}
        x={5}
        y={5}
        fontSize={baseFontSize}
        fill="#FFFFFF"
        width={pixelWidth - 10}
        wrap="char"
       />
      )}
      {displayOptions.showStatusIndicator && asset.status && (
       <Circle
        x={pixelWidth - 10}
        y={10}
        radius={5}
        fill={STATUS_COLORS[asset.status]}
        stroke="#fff"
        strokeWidth={1}
       />
      )}
      {displayOptions.showTemperature && asset.data?.temperature && (
       <Text
        text={`T: ${asset.data.temperature}°C`}
        x={5}
        y={baseFontSize + 8}
        fontSize={smallFontSize}
        fill="#FFFFFF"
       />
      )}
      {displayOptions.showUUsage && asset.data?.uUsage !== undefined && (
       <Text
        text={`U: ${asset.data.uUsage}%`}
        x={5}
        y={baseFontSize + smallFontSize + 12}
        fontSize={smallFontSize}
        fill="#FFFFFF"
       />
      )}

      {asset.isLocked && (
       <Text
        text="🔒"
        x={5}
 V       y={pixelHeight - 18}
        fontSize={14}
        opacity={0.7}
       />
      )}
     </>
    )}
   </Group>
  </Group>
 );
};

export default LayoutAssetView;