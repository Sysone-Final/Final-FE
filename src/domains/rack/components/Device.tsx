import { Group, Rect, Text } from "react-konva";
import type { RackDevice } from "../types";

interface RackSlotProps {
  device: RackDevice;
  y: number;
  height: number;
  rackWidth: number;
}

const Device = ({ device, y, height, rackWidth }: RackSlotProps) => {
  return (
    <Group y={y}>
      <Rect x={100} width={rackWidth} height={height} fill="#3b82f6"></Rect>
      <Text
        x={110}
        y={height / 2 - 6}
        text={device.name}
        fontSize={12}
        fill="#fff"
      ></Text>
    </Group>
  );
};

export default Device;
