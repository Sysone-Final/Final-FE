import { Stage, Layer, Rect, Text, Group, Line } from "react-konva";
import type { RackDevice } from "../types";
import Device from "./Device";

const Rack = () => {
  const devices: RackDevice[] = [
    { id: 1, name: "Server_1", position: 1, height: 1 },
    { id: 2, name: "Firewall_1", position: 3, height: 1 },
    { id: 3, name: "UPS_5F", position: 4, height: 3 },
  ];

  const rackHeight = 700;
  const rackWidth = 200;
  const unitHeight = rackHeight / 42;
  const frameThickness = 20;
  const panelWidth = 25;
  ``;

  // 기준 좌표
  const baseY = 40;
  const fullY = baseY - frameThickness;
  const fullHeight = rackHeight + frameThickness * 2;
  const leftPanelX = 100 - frameThickness - panelWidth;
  const leftPillarX = leftPanelX + panelWidth;
  const rightPillarX = 100 + rackWidth;
  const rightPanelX = rightPillarX + frameThickness;
  const coverWidth = rackWidth + frameThickness * 2;

  // 눈금 위치 중앙 정렬용 offset
  const textOffsetY = unitHeight / 2 - 5;

  return (
    <Stage width={600} height={fullHeight + 100}>
      <Layer>
        {/* ✅ 상단 덮개 */}
        <Rect
          x={leftPillarX}
          y={fullY}
          width={coverWidth}
          height={frameThickness}
          fill="#1f2937"
        />

        {/* ✅ 하단 덮개 */}
        <Rect
          x={leftPillarX}
          y={baseY + rackHeight}
          width={coverWidth}
          height={frameThickness}
          fill="#1f2937"
        />

        {/* ✅ 왼쪽 눈금 패널 */}
        <Group>
          <Rect
            x={leftPanelX}
            y={fullY}
            width={panelWidth}
            height={fullHeight}
            fill="#0f172a"
          />
          {/* 눈금: 1U~42U (본체와 정확히 정렬됨) */}
          {Array.from({ length: 42 }).map((_, i) => (
            <Text
              key={`left-${i}`}
              x={leftPanelX + 5}
              y={baseY + i * unitHeight + textOffsetY}
              text={`${42 - i}U`}
              fontSize={9}
              fill="#fff"
            />
          ))}
        </Group>

        {/* ✅ 왼쪽 기둥 */}
        <Rect
          x={leftPillarX}
          y={baseY}
          width={frameThickness}
          height={rackHeight}
          fill="#1f2937"
        />

        {/* ✅ 본체 */}
        <Rect
          x={100}
          y={baseY}
          width={rackWidth}
          height={rackHeight}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: rackHeight }}
          fillLinearGradientColorStops={[0, "#374151", 1, "#1f2937"]}
          stroke="#374151"
          strokeWidth={2}
        />

        {/* ✅ 오른쪽 기둥 */}
        <Rect
          x={rightPillarX}
          y={baseY}
          width={frameThickness}
          height={rackHeight}
          fill="#1f2937"
        />

        {/* ✅ 오른쪽 눈금 패널 */}
        <Group>
          <Rect
            x={rightPanelX}
            y={fullY}
            width={panelWidth}
            height={fullHeight}
            fill="#0f172a"
          />
          {Array.from({ length: 42 }).map((_, i) => (
            <Text
              key={`right-${i}`}
              x={rightPanelX + 5}
              y={baseY + i * unitHeight + textOffsetY}
              text={`${42 - i}U`}
              fontSize={9}
              fill="#fff"
            />
          ))}
        </Group>

        {/* ✅ 1U~42U 구분선 (옵션: 실제 랙처럼 보여줌) */}
        {Array.from({ length: 43 }).map((_, i) => (
          <Line
            key={`line-${i}`}
            points={[
              100,
              baseY + i * unitHeight,
              100 + rackWidth,
              baseY + i * unitHeight,
            ]}
            stroke="#1f2937"
            strokeWidth={0.6}
          />
        ))}

        {/* ✅ 장비 슬롯 */}
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
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default Rack;
