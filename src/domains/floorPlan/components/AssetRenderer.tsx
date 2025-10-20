import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
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

// 상태에 따른 색상 정의
const STATUS_COLORS = {
  normal: '#27ae60', // Green
  warning: '#f39c12', // Yellow
  danger: '#c0392b',  // Red
  selected: '#2980b9', // Blue
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
  // 그리드 좌표를 실제 픽셀 좌표로 변환
  const pixelX = headerPadding + asset.gridX * gridSize;
  const pixelY = headerPadding + asset.gridY * gridSize;
  const pixelWidth = asset.widthInCells * gridSize;
  const pixelHeight = asset.heightInCells * gridSize;

  // 표시 모드에 따라 랙의 배경색 결정
  const rackFillColor = displayMode === 'status' && asset.status
      ? STATUS_COLORS[asset.status]
      : asset.customColor || '#ecf0f1';

  // 테두리 색상 결정
  const strokeColor = isSelected ? STATUS_COLORS.selected : (asset.status ? STATUS_COLORS[asset.status] : '#bdc3c7');

  return (
    <Group x={pixelX} y={pixelY} onClick={onSelect} onTap={onSelect}>
      {/* 랙 몸체 */}
      <Rect
        width={pixelWidth}
        height={pixelHeight}
        fill={rackFillColor}
        stroke={strokeColor}
        strokeWidth={isSelected ? 3 : 1.5}
        cornerRadius={4}
        opacity={0.7}
      />
      
      {/* 랙 이름 */}
      {displayOptions.showName && (
        <Text
          text={asset.name}
          x={5}
          y={5}
          fontSize={12}
          fill="#34495e"
          fontStyle="bold"
        />
      )}

      {/* 상태 표시등 */}
      {displayOptions.showStatusIndicator && asset.status && (
         <Circle
            x={pixelWidth - 10}
            y={10}
            radius={5}
            fill={STATUS_COLORS[asset.status]}
            stroke="#ffffff"
            strokeWidth={1}
         />
      )}
      
      {/* 온도 정보 */}
      {displayOptions.showTemperature && asset.data?.temperature !== undefined && (
        <Text
          text={`T: ${asset.data.temperature}°C`}
          x={5}
          y={20}
          fontSize={10}
          fill="#34495e"
        />
      )}
    </Group>
  );
};

export default AssetRenderer;

