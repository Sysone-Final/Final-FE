import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
// [수정] 빌드 도구가 모듈을 명확하게 찾을 수 있도록 파일 확장자(.ts)를 추가합니다.
import { useFloorPlanStore } from '../store/floorPlanStore.ts';
import type { Asset, DisplayMode, DisplayOptionsType } from '../types';

interface AssetRendererProps {
  asset: Asset;
  gridSize: number;
  headerPadding: number;
  isSelected: boolean;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
}

const STATUS_COLORS = { normal: '#27ae60', warning: '#f39c12', danger: '#c0392b', selected: '#2980b9' };

const AssetRenderer: React.FC<AssetRendererProps> = ({ asset, gridSize, headerPadding, isSelected, displayMode, displayOptions }) => {
  const { mode, updateAsset, selectAsset } = useFloorPlanStore();

  const pixelX = headerPadding + asset.gridX * gridSize + (asset.widthInCells * gridSize) / 2;
  const pixelY = headerPadding + asset.gridY * gridSize + (asset.heightInCells * gridSize) / 2;
  const pixelWidth = asset.widthInCells * gridSize;
  const pixelHeight = asset.heightInCells * gridSize;

  const rackFillColor = displayMode === 'status' && asset.status ? STATUS_COLORS[asset.status] : asset.customColor || '#ecf0f1';
  const strokeColor = isSelected ? STATUS_COLORS.selected : '#bdc3c7';

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const group = e.target;
    const newGridX = Math.round((group.x() - headerPadding - (pixelWidth / 2)) / gridSize);
    const newGridY = Math.round((group.y() - headerPadding - (pixelHeight / 2)) / gridSize);
    updateAsset(asset.id, { gridX: newGridX, gridY: newGridY });
  };
  
  const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
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
      x={pixelX}
      y={pixelY}
      rotation={asset.rotation || 0}
      offsetX={pixelWidth / 2}
      offsetY={pixelHeight / 2}
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
        strokeWidth={isSelected ? 4 : 1.5}
        cornerRadius={4}
        opacity={asset.opacity ?? 0.8}
      />
      
      {asset.type === 'rack' && doorPos && (
        <Rect {...doorPos} fill="#3498db" opacity={0.7} />
      )}
      
      {displayOptions.showName && <Text text={asset.name} x={5} y={5} fontSize={12} fill="#34495e" fontStyle="bold" />}
      {displayOptions.showStatusIndicator && asset.status && <Circle x={pixelWidth - 10} y={10} radius={5} fill={STATUS_COLORS[asset.status]} stroke="#fff" strokeWidth={1}/>}
      {displayOptions.showTemperature && asset.data?.temperature && <Text text={`T: ${asset.data.temperature}°C`} x={5} y={20} fontSize={10} fill="#34495e" />}
      {asset.isLocked && <Text text="🔒" x={5} y={pixelHeight - 18} fontSize={14} opacity={0.7} />}
    </Group>
  );
};

export default AssetRenderer;

