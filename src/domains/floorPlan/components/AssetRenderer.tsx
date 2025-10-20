import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
// [수정] 빌드 도구가 모듈을 명확하게 찾을 수 있도록 파일 확장자(.ts)를 추가합니다.
import { useFloorPlanStore } from '../store/floorPlanStore.ts';
import type { Asset, DisplayMode, DisplayOptions } from '../types';

interface AssetRendererProps {
  asset: Asset;
  gridSize: number;
  headerPadding: number;
  isSelected: boolean;
  onSelect: () => void;
  displayMode: DisplayMode;
  displayOptions: DisplayOptions;
}

const STATUS_COLORS = {
  normal: '#27ae60',
  warning: '#f39c12',
  danger: '#c0392b',
  selected: '#2980b9',
};

const AssetRenderer: React.FC<AssetRendererProps> = ({
  asset,
  gridSize,
  headerPadding,
  isSelected,
  onSelect,
  displayMode,
  displayOptions,
}) => {
  const { mode, updateAsset } = useFloorPlanStore();

  const pixelX = headerPadding + asset.gridX * gridSize;
  const pixelY = headerPadding + asset.gridY * gridSize;
  const pixelWidth = asset.widthInCells * gridSize;
  const pixelHeight = asset.heightInCells * gridSize;

  const rackFillColor = displayMode === 'status' && asset.status
      ? STATUS_COLORS[asset.status]
      : asset.customColor || '#ecf0f1';

  const strokeColor = isSelected ? STATUS_COLORS.selected : (asset.status ? STATUS_COLORS[asset.status] : '#bdc3c7');

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const endX = e.target.x();
    const endY = e.target.y();
    const newGridX = Math.round((endX - headerPadding) / gridSize);
    const newGridY = Math.round((endY - headerPadding) / gridSize);
    updateAsset(asset.id, { gridX: newGridX, gridY: newGridY });
  };

  return (
    <Group
      x={pixelX}
      y={pixelY}
      onClick={onSelect}
      onTap={onSelect}
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
        opacity={0.8}
      />
      
      {displayOptions.showName && (
        <Text text={asset.name} x={5} y={5} fontSize={12} fill="#34495e" fontStyle="bold" />
      )}

      {displayOptions.showStatusIndicator && asset.status && (
         <Circle x={pixelWidth - 10} y={10} radius={5} fill={STATUS_COLORS[asset.status]} stroke="#ffffff" strokeWidth={1} />
      )}
      
      {displayOptions.showTemperature && asset.data?.temperature !== undefined && (
        <Text text={`T: ${asset.data.temperature}°C`} x={5} y={20} fontSize={10} fill="#34495e" />
      )}

      {asset.isLocked && (
        <Text
          text="🔒"
          x={pixelWidth - 18}
          y={pixelHeight - 18}
          fontSize={14}
          opacity={0.7}
        />
      )}
    </Group>
  );
};

export default AssetRenderer;

