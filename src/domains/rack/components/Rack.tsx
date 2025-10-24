import { Stage, Layer, Rect, Line, Text } from "react-konva";
import { useMemo, Fragment } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import type { RackDevice, FloatingDevice } from "../types";
import Device from "./Device";
import {
  RACK_CONFIG,
  UNIT_COUNT,
  RACK_COLORS,
  RACK_STYLING,
  RACK_TEXT,
  FLOATING_DEVICE,
  RACK_CONTAINER,
  STAGE_STYLING,
} from "../constants/rackConstants";
import {
  getFloatingDeviceInfo,
  calculateDraggedPosition,
  calculateDeviceY,
} from "../utils/rackCalculation";
import { rackLayout } from "../utils/rackLayout";

interface RackProps {
  devices: RackDevice[];
  floatingDevice: FloatingDevice | null;
  onMouseMove: (mouseY: number) => void;
  onRackClick: (position: number) => void;
  onDeviceDragEnd: (deviceId: number, newPosition: number) => void;
}

function Rack({
  devices,
  floatingDevice,
  onMouseMove,
  onRackClick,
  onDeviceDragEnd,
}: RackProps) {
  const { width: rackWidth, unitHeight } = RACK_CONFIG;
  const { border, rackBody, line, unitText } = RACK_COLORS;

  const layout = useMemo(() => rackLayout(RACK_CONFIG), []);
  const { rackHeight, baseY, fullWidth, fullHeight, rackX } = layout;

  const floatingInfo = useMemo(
    () =>
      getFloatingDeviceInfo(floatingDevice, {
        rackHeight,
        baseY,
        unitHeight,
      }),
    [floatingDevice, rackHeight, baseY, unitHeight]
  );

  const handleDeviceDragEnd = (deviceId: number, newY: number) => {
    const draggedDevice = devices.find((d) => d.id === deviceId);
    if (!draggedDevice) return;

    const newPosition = calculateDraggedPosition(
      newY,
      draggedDevice.height,
      baseY,
      unitHeight
    );
    onDeviceDragEnd(deviceId, newPosition);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (pos) onMouseMove(pos.y);
  };

  const handleRackClick = () => {
    if (floatingDevice && floatingInfo) {
      onRackClick(floatingInfo.position);
    }
  };

  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        height: RACK_CONTAINER.height,
        width: `${fullWidth}px`,
        scrollbarWidth: RACK_CONTAINER.scrollbarWidth,
        msOverflowStyle: RACK_CONTAINER.msOverflowStyle,
      }}
    >
      <Stage
        width={fullWidth}
        height={fullHeight}
        style={STAGE_STYLING}
        onMouseMove={handleMouseMove}
        onClick={handleRackClick}
      >
        <Layer>
          {/* 랙 본체 */}
          <Rect
            x={rackX}
            y={baseY}
            width={rackWidth}
            height={rackHeight}
            fill={rackBody}
            stroke={border}
            strokeWidth={RACK_STYLING.strokeWidth}
          />

          {/* U 단위 구분선 및 번호 */}
          {Array.from({ length: UNIT_COUNT + 1 }).map((_, i) => {
            const unitNumber = UNIT_COUNT - i;
            const yPos = baseY + i * unitHeight;

            return (
              <Fragment key={i}>
                <Line
                  points={[rackX, yPos, rackX + rackWidth, yPos]}
                  stroke={line}
                  strokeWidth={RACK_STYLING.lineStrokeWidth}
                />
                {i < UNIT_COUNT && (
                  <Text
                    x={rackX + RACK_TEXT.unitOffset.x}
                    y={yPos + RACK_TEXT.unitOffset.y}
                    text={`${unitNumber}U`}
                    fontSize={RACK_TEXT.unitSize}
                    fill={unitText}
                  />
                )}
              </Fragment>
            );
          })}

          {/* 설치된 장비들 */}
          {devices.map((device) => {
            const y = calculateDeviceY(
              device.position,
              device.height,
              rackHeight,
              baseY,
              unitHeight
            );
            const height = unitHeight * device.height;

            return (
              <Device
                key={device.id}
                device={device}
                y={y}
                height={height}
                rackWidth={rackWidth}
                x={rackX}
                onDragEnd={handleDeviceDragEnd}
              />
            );
          })}

          {/* 떠있는 장비 */}
          {floatingDevice && floatingInfo && (
            <Device
              device={{
                id: FLOATING_DEVICE.id,
                name: floatingDevice.card.label,
                type: floatingDevice.card.type,
                position: floatingInfo.position,
                height: floatingDevice.card.height,
              }}
              y={floatingInfo.y}
              height={floatingInfo.height}
              rackWidth={rackWidth}
              x={rackX}
              isFloating={true}
              opacity={FLOATING_DEVICE.opacity}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default Rack;
