import { Stage, Layer, Rect, Line, Text } from "react-konva";
import { useState, useMemo } from "react";
import type { RackDevice } from "../types";
import Device from "./Device";
import { RACK_CONFIG, UNIT_COUNT } from "../constants/rackConstants";
import type { FloatingDevice } from "../types";
import {
  getFloatingDeviceInfo,
  calculateDraggedPosition,
  calculateDeviceY,
} from "../utils/rackCalculation";

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
  // 랙 설정
  const [, setScrollY] = useState(0);
  const { width: rackWidth, frameThickness, panelWidth } = RACK_CONFIG;
  const unitHeight = 40;
  const rackHeight = UNIT_COUNT * unitHeight;
  const baseY = frameThickness;

  // 랙 레이아웃 계산
  const fullWidth = rackWidth + frameThickness * 2 + panelWidth * 2;
  const fullHeight = rackHeight + frameThickness * 2;
  const leftPanelX = -5;
  const leftPillarX = leftPanelX + panelWidth;
  const rackX = leftPillarX + frameThickness;

  // 색상 테마
  const RACK_COLORS = {
    background: "#1f2937",
    border: "#374151",
    rackBody: "#000000",
    line: "#4b5563",
    unitText: "#6b7280",
  };
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

  // 스크롤 처리
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  return (
    <div
      className="overflow-y-auto overflow-x-hidden "
      style={{
        height: "670px",
        width: `${fullWidth}px`,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      onScroll={handleScroll}
    >
      <Stage
        width={fullWidth}
        height={fullHeight}
        style={{ display: "block", margin: 0, padding: 0 }}
        onMouseMove={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            const pos = stage.getPointerPosition();
            if (pos) onMouseMove(pos.y);
          }
        }}
        onClick={() => {
          if (floatingDevice && floatingInfo) {
            onRackClick(floatingInfo.position);
          }
        }}
      >
        <Layer>
          {/* 랙 본체 */}
          <Rect
            x={rackX}
            y={baseY}
            width={rackWidth}
            height={rackHeight}
            fill={RACK_COLORS.rackBody}
            stroke={RACK_COLORS.border}
            strokeWidth={1}
          />

          {/* U 단위 구분선 및 번호 */}
          {Array.from({ length: UNIT_COUNT + 1 }).map((_, i) => {
            const unitNumber = UNIT_COUNT - i;
            const yPos = baseY + i * unitHeight;
            const elements = [
              <Line
                key={`line-${i}`}
                points={[rackX, yPos, rackX + rackWidth, yPos]}
                stroke={RACK_COLORS.line}
                strokeWidth={0.5}
              />,
            ];

            if (i < UNIT_COUNT) {
              elements.push(
                <Text
                  key={`text-${i}`}
                  x={rackX + 8}
                  y={yPos + 12}
                  text={`${unitNumber}U`}
                  fontSize={12}
                  fill={RACK_COLORS.unitText}
                />
              );
            }

            return elements;
          })}

          {/* 장비 슬롯 */}
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
                id: -1,
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
              opacity={0.2}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default Rack;
