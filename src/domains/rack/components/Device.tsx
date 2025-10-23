import { Group, Rect, Text, Line } from "react-konva";
import type { RackDevice } from "../types";
import { useState } from "react";
import { UNIT_COUNT, RACK_CONFIG } from "../constants/rackConstants";

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

// 상수 정의
const DEFAULT_COLORS = {
  floating: {
    fill: "#3b82f6",
    stroke: "#60a5fa",
  },
  normal: {
    fill: "#334155",
    stroke: "#3f4e63",
  },
} as const;

const DRAG_OPACITY = 0.5;
const TEXT_OFFSET = { x: 10, y: 6 };

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

  //RACK_CONFIG 값 사용
  const { unitHeight, frameThickness: baseY } = RACK_CONFIG;
  const rackHeight = UNIT_COUNT * unitHeight;

  // 색상 계산
  const fillColor = isFloating
    ? device.color || DEFAULT_COLORS.floating.fill
    : device.color || DEFAULT_COLORS.normal.fill;

  const strokeColor = isFloating
    ? device.color || DEFAULT_COLORS.floating.stroke
    : device.color || DEFAULT_COLORS.normal.stroke;

  // 드래그 경계 처리
  const handleDragBound = (pos: { x: number; y: number }) => {
    // Y축 범위 제한
    const minY = baseY;
    const maxY = baseY + rackHeight - height;

    // 유닛 단위로 스냅
    const relativeY = pos.y - baseY;
    const snappedRelativeY = Math.round(relativeY / unitHeight) * unitHeight;
    const snappedY = snappedRelativeY + baseY;

    // 최종 Y좌표 계산
    const clampedY = Math.max(minY, Math.min(maxY, snappedY));

    return {
      x: 0, // X축은 항상 0으로 고정
      y: clampedY,
    };
  };

  return (
    <Group
      y={y}
      opacity={dragging ? DRAG_OPACITY : opacity}
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
      {/* 장비 본체 */}
      <Rect
        x={x}
        width={rackWidth}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isFloating ? 2 : 1}
      />

      {/* 상단 테두리 */}
      <Line
        points={[x, 0, x + rackWidth, 0]}
        stroke={strokeColor}
        strokeWidth={1}
      />

      {/* 하단 테두리 */}
      <Line
        points={[x, height, x + rackWidth, height]}
        stroke={strokeColor}
        strokeWidth={2}
      />

      {/* 장비 이름 */}
      <Text
        x={x + TEXT_OFFSET.x}
        y={height / 2 - TEXT_OFFSET.y}
        text={device.name}
        fontSize={12}
        fill="#fff"
      />
    </Group>
  );
}

export default Device;
