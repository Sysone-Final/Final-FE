import { Group, Rect, Text, Line, Image } from "react-konva";
import { useState } from "react";
import type { RackDevice, ViewMode } from "../types";
import { deviceImageMap } from "../utils/deviceImageMap";
import { useImageLoad } from "../hooks/useImageLoad";
import { dragBound } from "../utils/dragBound";
import { UNIT_COUNT, RACK_CONFIG } from "../constants/rackConstants";

interface DeviceProps {
  device: RackDevice;
  y: number;
  x: number;
  height: number;
  rackWidth: number;
  opacity?: number;
  isFloating?: boolean;
  viewMode: ViewMode;
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
  viewMode,
}: DeviceProps) {
  const [dragging, setIsDragging] = useState(false);

  const { unitHeight, frameThickness: baseY } = RACK_CONFIG;
  const rackHeight = UNIT_COUNT * unitHeight;

  const imageUrls = deviceImageMap[device.type] || deviceImageMap.server;
  const imageUrl = viewMode === "front" ? imageUrls.front : imageUrls.back;
  const image = useImageLoad(imageUrl);

  const handleDragBound = (pos: { x: number; y: number }) => {
    return dragBound(pos, {
      baseY,
      rackHeight,
      deviceHeight: height,
      unitHeight,
    });
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
      {image && (
        <Image image={image} x={x} y={0} width={rackWidth} height={height} />
      )}

      {/* 장비 본체 */}
      <Rect
        x={x}
        width={rackWidth}
        height={height}
        fill="transparent"
        strokeWidth={isFloating ? 2 : 1}
      />

      {/* 상단 테두리 */}
      <Line points={[x, 0, x + rackWidth, 0]} strokeWidth={1} />

      {/* 하단 테두리 */}
      <Line points={[x, height, x + rackWidth, height]} strokeWidth={2} />

      {/* 장비 이름 */}
      {viewMode === "front" ? (
        <Text
          x={x + 10}
          y={height / 2 - 6}
          text={device.name}
          fontSize={12}
          fill="#fff"
        />
      ) : (
        <>
          <Text
            x={x + 10}
            y={height / 2 - 6}
            text={`${device.name} (뒷면)`}
            fontSize={12}
            fill="#fff"
          />
        </>
      )}
    </Group>
  );
}

export default Device;
