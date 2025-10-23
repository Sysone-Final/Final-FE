import { Group, Rect, Text, Line } from "react-konva";
import type { RackDevice } from "../types";
import { useState } from "react";
import { UNIT_COUNT } from "../constants/rackConstants";

interface DeviceProps {
  device: RackDevice;
  y: number;
  x: number;
  height: number;
  rackWidth: number;
  opacity?: number;
  isFloating?: boolean;
  onDragEnd?: (deviceId: number, newY: number) => void;
}

function Device({
  device,
  y,
  x,
  height,
  rackWidth,
  opacity = 1,
  isFloating = false,
  onDragEnd,
}: DeviceProps) {
  const [dragging, setIsDragging] = useState(false);

  const fillColor = isFloating
    ? device.color || "#3b82f6"
    : device.color || "#334155";

  const strokeColor = isFloating
    ? device.color || "#60a5fa"
    : device.color || "#3f4e63";

  const handleDragBound = (pos: { x: number; y: number }) => {
    const unitHeight = 40;
    const baseY = 20;
    const rackHeight = UNIT_COUNT * unitHeight;

    const newX = 0;

    const minY = baseY;
    const maxY = baseY + rackHeight - height;

    const relativeY = pos.y - baseY;
    const snappedRelativeY = Math.round(relativeY / unitHeight) * unitHeight;
    const snappedY = snappedRelativeY + baseY;

    const clampedY = Math.max(minY, Math.min(maxY, snappedY));

    return {
      x: newX,
      y: clampedY,
    };
  };

  return (
    <Group
      y={y}
      opacity={dragging ? 0.5 : opacity}
      draggable={!isFloating}
      dragBoundFunc={!isFloating ? handleDragBound : undefined}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e) => {
        setIsDragging(false);
        if (onDragEnd && !isFloating) {
          onDragEnd(device.id, e.target.y());
        }
      }}
      onDragMove={(e) => {
        e.target.x(0);
      }}
    >
      <Rect
        x={x}
        width={rackWidth}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isFloating ? 2 : 1}
      />
      {/* 슬롯 상단 테두리 */}
      <Line
        points={[x, 0, x + rackWidth, 0]}
        stroke={strokeColor}
        strokeWidth={1}
      />

      {/* 슬롯 하단 테두리 */}
      <Line
        points={[x, height, x + rackWidth, height]}
        stroke={strokeColor}
        strokeWidth={2}
      />
      <Text
        x={x + 10}
        y={height / 2 - 6}
        text={device.name}
        fontSize={12}
        fill="#fff"
      ></Text>
    </Group>
  );
}

export default Device;
