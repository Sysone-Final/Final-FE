import { Group, Rect, Text, Line } from "react-konva";
import type { RackDevice } from "../types";

interface RackSlotProps {
  device: RackDevice;
  y: number;
  x: number;
  height: number;
  rackWidth: number;
}

function Device({ device, y, x, height, rackWidth }: RackSlotProps) {
  return (
    <Group y={y}>
      <Rect x={x} width={rackWidth} height={height} fill="#334155"></Rect>
      {/* 슬롯 상단 테두리 */}
      <Line
        points={[x, 0, x + rackWidth, 0]}
        stroke="#3f4e63"
        strokeWidth={1}
      />

      {/* 슬롯 하단 테두리 */}
      <Line
        points={[x, height, x + rackWidth, height]}
        stroke="#3f4e63"
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
