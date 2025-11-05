import { Group, Rect, Text, Line, Image } from "react-konva";
import { useState } from "react";
import type { Equipments } from "../types";
import { deviceImageMap } from "../utils/deviceImageMap";
import { useImageLoad } from "../hooks/useImageLoad";
import { dragBound } from "../utils/dragBound";
import { UNIT_COUNT, RACK_CONFIG } from "../constants/rackConstants";
import deleteIcon from "../assets/delete.svg";

interface DeviceProps {
  device: Equipments;
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

  const { unitHeight, frameThickness: baseY } = RACK_CONFIG;
  const rackHeight = UNIT_COUNT * unitHeight;

  const imageUrls =
    deviceImageMap[device.equipmentType] || deviceImageMap.SERVER;
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
      onDragEnd={(e) => {
        setIsDragging(false);
        if (onDragEnd && !isFloating && editMode) {
          onDragEnd(device.equipmentId, e.target.y());
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
        text={device.equipmentType}
        fontSize={12}
        fill="#fff"
      />

      {editMode && !isFloating && deleteImage && (
        <Group
          x={x + rackWidth - 30}
          y={5}
          onClick={(e) => {
            e.cancelBubble = true;
            onDelete?.(device.equipmentId);
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
