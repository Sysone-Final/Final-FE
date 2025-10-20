import React from 'react';
import { Group, Rect, Text } from 'react-konva';
// [수정] 타입 import 경로를 ../types 로 수정합니다.
import type { Asset, AssetStatus } from '../types';

interface AssetRendererProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: () => void;
}

const getStatusColor = (status: AssetStatus | undefined) => {
  switch (status) {
    case 'normal': return '#2ecc71';
    case 'warning': return '#f1c40f';
    case 'danger': return '#e74c3c';
    default: return '#bdc3c7';
  }
};

const AssetRenderer: React.FC<AssetRendererProps> = ({ asset, isSelected, onSelect }) => {
  const statusColor = getStatusColor(asset.status);

  return (
    <Group x={asset.x} y={asset.y} onClick={onSelect} onTap={onSelect}>
      <Rect
        width={asset.width}
        height={asset.height}
        fill="#ecf0f1"
        stroke={isSelected ? '#3498db' : statusColor}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={4}
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 5}
        shadowOpacity={isSelected ? 0.6 : 0.3}
        shadowOffsetX={0}
        shadowOffsetY={isSelected ? 4 : 2}
      />
      <Rect width={asset.width} height={10} fill={statusColor} cornerRadius={[4, 4, 0, 0]} />
      <Text text={asset.name} fontSize={16} fontStyle="bold" fill="#2c3e50" x={10} y={20} />
      {asset.data?.temperature && (
        <Text text={`T: ${asset.data.temperature}°C`} fontSize={14} fill="#34495e" x={10} y={45} />
      )}
    </Group>
  );
};

export default AssetRenderer;

