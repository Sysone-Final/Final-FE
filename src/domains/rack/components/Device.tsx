import { Group, Rect, Text, Line } from "react-konva";
import type { RackDevice } from "../types";

interface RackSlotProps {
  device: RackDevice;
  y: number;
  x: number;
  height: number;
  rackWidth: number;
  opacity?: number;
  isFloating?: boolean;
}

function Device({
  device,
  y,
  x,
  height,
  rackWidth,
  opacity = 1,
  isFloating = false,
}: RackSlotProps) {
  const fillColor = isFloating
    ? device.color || "#3b82f6"
    : device.color || "#334155";

  const strokeColor = isFloating
    ? device.color || "#60a5fa"
    : device.color || "#3f4e63";

  return (
    <Group y={y} opacity={opacity}>
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
