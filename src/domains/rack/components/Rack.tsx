import { Stage, Layer, Rect, Line, Text } from "react-konva";
import { useMemo, Fragment } from "react";
import type { RackDevice, FloatingDevice } from "../types";
import Device from "./Device";
import {
  RACK_CONFIG,
  UNIT_COUNT,
  RACK_COLORS,
} from "../constants/rackConstants";
import {
  getFloatingDeviceInfo,
  calculateDraggedPosition,
  calculateDeviceY,
} from "../utils/rackCalculation";
import type { KonvaEventObject } from "konva/lib/Node";
import { rackLayout } from "../utils/rackLayout";

interface RackProps {
  devices: RackDevice[];
  floatingDevice: FloatingDevice | null;
  onMouseMove: (mouseY: number) => void;
  onRackClick: (position: number) => void;
  onDeviceDragEnd: (deviceId: number, newPosition: number) => void;
}

// 상수 정의
const FLOATING_DEVICE_ID = -1;
const FLOATING_DEVICE_OPACITY = 0.2;
const UNIT_TEXT_OFFSET = { x: 8, y: 12 };
const UNIT_TEXT_SIZE = 12;
const RACK_STROKE_WIDTH = 1;
const LINE_STROKE_WIDTH = 0.5;

function Rack({
  devices,
  floatingDevice,
  onMouseMove,
  onRackClick,
  onDeviceDragEnd,
}: RackProps) {
  // 랙 설정
  const { width: rackWidth, unitHeight } = RACK_CONFIG;

  const { border, rackBody, line, unitText } = RACK_COLORS;

  // 레이아웃 계산
  const layout = useMemo(() => rackLayout(RACK_CONFIG), []);
  const { rackHeight, baseY, fullWidth, fullHeight, rackX } = layout;

  // 떠있는 장비 정보 계산
  const floatingInfo = useMemo(
    () =>
      getFloatingDeviceInfo(floatingDevice, {
        rackHeight,
        baseY,
        unitHeight,
      }),
    [floatingDevice, rackHeight, baseY, unitHeight]
  );

  // 장비 드래그 종료 처리
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

  // 마우스 이동 처리
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (pos) onMouseMove(pos.y);
  };

  // 랙 클릭 처리
  const handleRackClick = () => {
    if (floatingDevice && floatingInfo) {
      onRackClick(floatingInfo.position);
    }
  };

  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        height: "670px",
        width: `${fullWidth}px`,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Stage
        width={fullWidth}
        height={fullHeight}
        style={{ display: "block", margin: 0, padding: 0 }}
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
            strokeWidth={RACK_STROKE_WIDTH}
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
                  strokeWidth={LINE_STROKE_WIDTH}
                />
                {i < UNIT_COUNT && (
                  <Text
                    x={rackX + UNIT_TEXT_OFFSET.x}
                    y={yPos + UNIT_TEXT_OFFSET.y}
                    text={`${unitNumber}U`}
                    fontSize={UNIT_TEXT_SIZE}
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

          {floatingDevice && floatingInfo && (
            <Device
              device={{
                id: FLOATING_DEVICE_ID,
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
              opacity={FLOATING_DEVICE_OPACITY}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default Rack;
