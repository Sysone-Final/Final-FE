import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useFloorPlanStore } from '../store/floorPlanStore';
import type { Asset, DisplayMode, DisplayOptionsType } from '../types';

interface AssetRendererProps {
  asset: Asset;
  gridSize: number;
  headerPadding: number;
  isSelected: boolean;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
}

const STATUS_COLORS = { normal: '#27ae60', warning: '#f39c12', danger: '#c0392b', selected: '#3498db' };
const DOOR_COLOR = '#7f8c8d';

//  충돌 감지 헬퍼 함수 (그룹 이동을 위해 targetAsset에 id가 있도록 수정)
const checkCollision = (targetAsset: Asset, allAssets: Asset[]): boolean => {
  for (const otherAsset of allAssets) {
    // 자기 자신과는 충돌 검사를 하지 않음
    if (otherAsset.id === targetAsset.id) continue;
    // 다른 레이어의 자산과는 충돌하지 않음
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

const AssetRenderer: React.FC<AssetRendererProps> = ({ asset, gridSize, headerPadding, isSelected, displayMode, displayOptions }) => {
  const mode = useFloorPlanStore((state) => state.mode);
  const updateAsset = useFloorPlanStore((state) => state.updateAsset);
  const selectAsset = useFloorPlanStore((state) => state.selectAsset);
  const assets = useFloorPlanStore((state) => state.assets);

  const pixelX = headerPadding + asset.gridX * gridSize;
  const pixelY = headerPadding + asset.gridY * gridSize;
  const pixelWidth = asset.widthInCells * gridSize;
  const pixelHeight = asset.heightInCells * gridSize;

  const rackFillColor = displayMode === 'customColor'
    ? (asset.customColor || '#4b5563')
    : (asset.status ? STATUS_COLORS[asset.status] : '#4b5563');
  
  const strokeColor = isSelected ? STATUS_COLORS.selected : '#bdc3c7';

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

    //  그룹 이동과 단일 이동 모두를 처리하는 충돌 감지 로직
    const assetsToMove = asset.groupId ? assets.filter(a => a.groupId === asset.groupId) : [asset];
    const otherAssets = assets.filter(a => !assetsToMove.some(m => m.id === a.id));

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
      const message = asset.groupId ? "그룹을 해당 위치로 이동할 수 없습니다." : `"${asset.name}"을(를) 해당 위치로 이동할 수 없습니다.`;
      alert(`${message}\n동일한 레이어의 다른 자산과 겹칩니다.`);
      group.x(pixelX + offsetX);
      group.y(pixelY + offsetY);
      return;
    }

    // 충돌이 없으면 모든 자산 업데이트
    assetsToMove.forEach(member => {
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
  }
  const doorPos = getDoorPosition();

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
        opacity={asset.opacity ?? 1}
      />
      
      {/* 'rack' 또는 'door'로 시작하는 모든 자산 타입에 대해 문 표시 */}
      {(asset.assetType === 'rack' || asset.assetType.startsWith('door')) && doorPos && (
        <Rect {...doorPos} fill={DOOR_COLOR} listening={false} />
      )}
      
      {/* 자산 내부 정보가 올바르게 표시되도록 좌표 계산 수정 */}
      <Group listening={false}>
        {displayOptions.showName && <Text text={asset.name} x={5} y={5} fontSize={12} fill="#FFFFFF" />}
        {displayOptions.showStatusIndicator && asset.status && <Circle x={pixelWidth - 10} y={10} radius={5} fill={STATUS_COLORS[asset.status]} stroke="#fff" strokeWidth={1}/>}
        {displayOptions.showTemperature && asset.data?.temperature && <Text text={`T: ${asset.data.temperature}°C`} x={5} y={20} fontSize={10} fill="#FFFFFF" />}
        {asset.isLocked && <Text text="🔒" x={5} y={pixelHeight - 18} fontSize={14} opacity={0.7} />}
      </Group>
    </Group>
  );
};

export default AssetRenderer;

