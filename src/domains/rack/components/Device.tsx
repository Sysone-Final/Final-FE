import { Group, Rect, Text, Line, Image } from "react-konva";
import { useState } from "react";
import type { RackDevice } from "../types";
import { deviceImageMap } from "../utils/deviceImageMap";
import { useImageLoad } from "../hooks/useImageLoad";
import { dragBound } from "../utils/dragBound";
import { UNIT_COUNT, RACK_CONFIG } from "../constants/rackConstants";
import deleteIcon from "../assets/delete.svg";

interface DeviceProps {
  device: RackDevice;
  y: number;
  x: number;
  height: number;
  rackWidth: number;
  opacity?: number;
  isFloating?: boolean;
  frontView: boolean;
  editMode: boolean;
  onDragEnd?: (deviceId: number, newY: number) => void;
  onDelete?: (deviceId: number) => void;
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
  frontView,
  editMode,
  onDelete,
}: DeviceProps) {
  const [dragging, setIsDragging] = useState(false);
  const [hovered, setIsHovered] = useState(false);

  const { unitHeight, frameThickness: baseY } = RACK_CONFIG;
  const rackHeight = UNIT_COUNT * unitHeight;

  const imageUrls = deviceImageMap[device.type] || deviceImageMap.server;
  const imageUrl = frontView ? imageUrls.front : imageUrls.back;
  const image = useImageLoad(imageUrl);

  const deleteImage = useImageLoad(deleteIcon);

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
      draggable={!isFloating && editMode}
      dragBoundFunc={!isFloating && editMode ? handleDragBound : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={() => {
        setIsDragging(true);
        setIsHovered(false);
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        if (onDragEnd && !isFloating && editMode) {
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
      <Text
        x={x + 10}
        y={height / 2 - 6}
        text={device.name}
        fontSize={12}
        fill="#fff"
      />

      {editMode && hovered && !isFloating && deleteImage && (
        <Group
          x={x + rackWidth - 30}
          y={5}
          onClick={(e) => {
            e.cancelBubble = true;
            onDelete?.(device.id);
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = "pointer";
            }
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = "default";
            }
          }}
        >
          <Image image={deleteImage} x={0} y={0} width={24} height={24} />
        </Group>
      )}
    </Group>
  );
}

export default Device;
