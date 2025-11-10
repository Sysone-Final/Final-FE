import { Group, Rect, Text, Line, Image } from "react-konva";
import { useState, memo, useRef } from "react";
import { Html } from "react-konva-utils";
import type { Equipments } from "../types";
import { deviceImageMap } from "../utils/deviceImageMap";
import { useImageLoad } from "../hooks/useImageLoad";
import { dragBound } from "../utils/dragBound";
import { UNIT_COUNT, RACK_CONFIG } from "../constants/rackConstants";
import deleteIcon from "../assets/delete.svg";
import checkIcon from "../assets/check.svg";
import ClickableIcon from "./ClickableIcon";

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
  isEditing?: boolean;
  tempDeviceName?: string;
  onDeviceNameChange?: (deviceId: number, name: string) => void;
  onDeviceNameConfirm?: (device: Equipments) => void;
  onDeviceNameCancel?: (deviceId: number) => void;
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
  isEditing = false,
  tempDeviceName = "",
  onDeviceNameChange,
  onDeviceNameCancel,
  onDeviceNameConfirm,
}: DeviceProps) {
  const [dragging, setIsDragging] = useState(false);
  const hasConfirmedRef = useRef(false);

  const { unitHeight, frameThickness: baseY } = RACK_CONFIG;
  const rackHeight = UNIT_COUNT * unitHeight;

  const imageUrls =
    deviceImageMap[device.equipmentType] || deviceImageMap.SERVER;
  const imageUrl = frontView ? imageUrls.front : imageUrls.back;

  const image = useImageLoad(imageUrl);

  const deleteImage = useImageLoad(deleteIcon);
  const checkImage = useImageLoad(checkIcon);

  const handleDragBound = (pos: { x: number; y: number }) => {
    return dragBound(pos, {
      baseY,
      rackHeight,
      deviceHeight: height,
      unitHeight,
    });
  };

  const handleConfirm = () => {
    if (hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;
    onDeviceNameConfirm?.(device);
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

      {/* 장비 이름 또는 입력 필드 */}
      {isEditing ? (
        <>
          {/* 입력 필드만 HTML */}
          <Html
            divProps={{
              style: {
                position: "absolute",
                top: `${height / 2 - 15}px`,
                left: `${x + 10}px`,
                width: `${rackWidth - 55}px`,
                pointerEvents: "auto",
              },
            }}
          >
            <input
              type="text"
              value={tempDeviceName}
              onChange={(e) => onDeviceNameChange?.(device.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirm();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  onDeviceNameCancel?.(device.id);
                }
              }}
              onBlur={handleConfirm}
              placeholder="장비명 입력"
              className="w-full px-2 py-1 text-xs bg-slate-700 text-black border border-slate-500 rounded focus:outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </Html>

          <ClickableIcon
            image={checkImage}
            x={x + rackWidth - 55}
            y={5}
            width={20}
            height={20}
            onClick={handleConfirm}
          />
          <ClickableIcon
            image={deleteImage}
            x={x + rackWidth - 30}
            y={5}
            width={20}
            height={20}
            onClick={() => onDeviceNameCancel?.(device.id)}
          />
        </>
      ) : (
        <Text
          x={x + 10}
          y={height / 2 - 6}
          text={device.equipmentName || device.equipmentType}
          fontSize={12}
          fill="#fff"
        />
      )}
      {editMode && !isFloating && !isEditing && (
        <ClickableIcon
          image={deleteImage}
          x={x + rackWidth - 30}
          y={5}
          width={20}
          height={20}
          onClick={() => onDelete?.(device.id)}
        />
      )}
    </Group>
  );
}

export default memo(Device);
