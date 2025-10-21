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

const AssetRenderer: React.FC<AssetRendererProps> = ({ asset, gridSize, headerPadding, isSelected, displayMode, displayOptions }) => {
 // [수정] 무한 루프를 방지하기 위해 각 상태를 개별적으로 선택합니다.
 const mode = useFloorPlanStore((state) => state.mode);
 const updateAsset = useFloorPlanStore((state) => state.updateAsset);
 const selectAsset = useFloorPlanStore((state) => state.selectAsset);
 const assets = useFloorPlanStore((state) => state.assets);

 const pixelX = headerPadding + asset.gridX * gridSize;
 const pixelY = headerPadding + asset.gridY * gridSize;
 const pixelWidth = asset.widthInCells * gridSize;
 const pixelHeight = asset.heightInCells * gridSize;

 const rackFillColor = displayMode === 'customColor'
  ? (asset.customColor || '#ecf0f1')
  : (asset.status ? STATUS_COLORS[asset.status] : '#ecf0f1');
  
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

  if (asset.groupId) {
   assets.forEach(a => {
    if (a.groupId === asset.groupId) {
     updateAsset(a.id, {
      gridX: a.gridX + deltaGridX,
      gridY: a.gridY + deltaGridY,
     });
    }
   });
  } else {
   updateAsset(asset.id, { gridX: newGridX, gridY: newGridY });
  }
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
    opacity={asset.opacity ?? 0.8}
   />
   
   {asset.type === 'rack' && doorPos && (
    <Rect {...doorPos} fill={DOOR_COLOR} listening={false} />
   )}
   
   <Group listening={false}>
     {displayOptions.showName && <Text text={asset.name} x={5} y={5} fontSize={12} fill="#34495e" fontStyle="bold" />}
     {displayOptions.showStatusIndicator && asset.status && <Circle x={pixelWidth - 10} y={10} radius={5} fill={STATUS_COLORS[asset.status]} stroke="#fff" strokeWidth={1}/>}
     {displayOptions.showTemperature && asset.data?.temperature && <Text text={`T: ${asset.data.temperature}°C`} x={5} y={20} fontSize={10} fill="#34495e" />}
     {asset.isLocked && <Text text="🔒" x={5} y={pixelHeight - 18} fontSize={14} opacity={0.7} />}
   </Group>
  </Group>
 );
};

export default AssetRenderer;