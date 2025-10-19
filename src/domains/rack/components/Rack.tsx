import { Stage, Layer, Rect, Text, Group, Line } from "react-konva";
import type { RackDevice } from "../types";
import Device from "./Device";
import {
  RACK_CONFIG,
  RACK_COLORS,
  UNIT_COUNT,
} from "../constants/rackConstants";

interface RackProps {
  devices: RackDevice[];
}

function Rack({ devices }: RackProps) {
  const {
    height: rackHeight,
    width: rackWidth,
    stageWidth,
    frameThickness,
    panelWidth,
    baseY,
  } = RACK_CONFIG;

  const unitHeight = rackHeight / UNIT_COUNT;
  const centerX = stageWidth / 2;
  const rackX = centerX - rackWidth / 2;

  const fullY = baseY - frameThickness;
  const fullHeight = rackHeight + frameThickness * 2;
  const leftPanelX = rackX - frameThickness - panelWidth;
  const leftPillarX = rackX - frameThickness;
  const rightPillarX = rackX + rackWidth;
  const rightPanelX = rightPillarX + frameThickness;
  const coverWidth = rackWidth + frameThickness * 2;
  const textOffsetY = unitHeight / 2 - 5;

  return (
    <Stage width={stageWidth} height={fullHeight}>
      <Layer>
        {/* 상단 덮개 */}
        <Rect
          x={leftPillarX}
          y={fullY}
          width={coverWidth}
          height={frameThickness}
          fill={RACK_COLORS.background}
        />

        {/* 하단 덮개 */}
        <Rect
          x={leftPillarX}
          y={baseY + rackHeight}
          width={coverWidth}
          height={frameThickness}
          fill={RACK_COLORS.background}
        />

        {/* 왼쪽 눈금 패널 */}
        <Group>
          <Rect
            x={leftPanelX}
            y={fullY}
            width={panelWidth}
            height={fullHeight}
            fill={RACK_COLORS.scalePanel}
          />
          {Array.from({ length: UNIT_COUNT }).map((_, i) => (
            <Text
              key={`left-${i}`}
              x={leftPanelX + 5}
              y={baseY + i * unitHeight + textOffsetY}
              text={`${UNIT_COUNT - i}U`}
              fontSize={9}
              fill={RACK_COLORS.text}
            />
          ))}
        </Group>

        {/* 왼쪽 기둥 */}
        <Rect
          x={leftPillarX}
          y={baseY}
          width={frameThickness}
          height={rackHeight}
          fill={RACK_COLORS.background}
        />

        {/* 본체 */}
        <Rect
          x={rackX}
          y={baseY}
          width={rackWidth}
          height={rackHeight}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: rackHeight }}
          fillLinearGradientColorStops={[
            0,
            RACK_COLORS.gradientTop,
            1,
            RACK_COLORS.gradientBottom,
          ]}
          stroke={RACK_COLORS.gradientTop}
          strokeWidth={2}
        />

        {/* 오른쪽 기둥 */}
        <Rect
          x={rightPillarX}
          y={baseY}
          width={frameThickness}
          height={rackHeight}
          fill={RACK_COLORS.background}
        />

        {/* 오른쪽 눈금 패널 */}
        <Group>
          <Rect
            x={rightPanelX}
            y={fullY}
            width={panelWidth}
            height={fullHeight}
            fill={RACK_COLORS.scalePanel}
          />
          {Array.from({ length: UNIT_COUNT }).map((_, i) => (
            <Text
              key={`right-${i}`}
              x={rightPanelX + 5}
              y={baseY + i * unitHeight + textOffsetY}
              text={`${UNIT_COUNT - i}U`}
              fontSize={9}
              fill={RACK_COLORS.text}
            />
          ))}
        </Group>

        {/* 1U~42U 구분선 */}
        {Array.from({ length: UNIT_COUNT + 1 }).map((_, i) => (
          <Line
            key={`line-${i}`}
            points={[
              rackX,
              baseY + i * unitHeight,
              rackX + rackWidth,
              baseY + i * unitHeight,
            ]}
            stroke={RACK_COLORS.line}
            strokeWidth={0.6}
          />
        ))}

        {/* 장비 슬롯 */}
        {devices.map((device) => {
          const y =
            rackHeight -
            (device.position - 1) * unitHeight -
            device.height * unitHeight +
            baseY;
          const height = unitHeight * device.height;
          return (
            <Device
              key={device.id}
              device={device}
              y={y}
              height={height}
              rackWidth={rackWidth}
              x={rackX}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}

export default Rack;
