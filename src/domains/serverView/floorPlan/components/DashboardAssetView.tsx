import React from "react";
import { Group, Rect, Text } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { selectAsset, useFloorPlanStore } from "../store/floorPlanStore";
import type { AssetRendererProps } from "./AssetRenderer";
import { useBabylonDatacenterStore } from "@/domains/serverView/view3d/stores/useBabylonDatacenterStore";

// 사용량(CPU, Memory) 상태 (90% 'danger', 75% 'warning')
const getUsageStatus = (
  usage: number | undefined
): "normal" | "warning" | "danger" => {
  const u = usage ?? 0;
  if (u > 90) return "danger";
  if (u > 75) return "warning";
  return "normal";
};

// 온도 상태 (35°C 'danger', 30°C 'warning')
const getTempStatus = (
  temp: number | undefined
): "normal" | "warning" | "danger" => {
  const t = temp ?? 0;
  if (t > 35) return "danger";
  if (t > 30) return "warning";
  return "normal";
};

// 온도 아이콘 (35°C 초과 '🔥', 30°C 초과 '⚠️')
const getTempIcon = (tempStatus: "normal" | "warning" | "danger") => {
  if (tempStatus === "danger") return "🔥";
  if (tempStatus === "warning") return "⚠️";
  return "";
};

// 상태별 색상 (대시보드 뷰 전용)
const STATUS_COLORS = {
  normal: { fill: "#2e4c40", stroke: "#3f6d5a", text: "#2ecc71", symbol: "🟢" },
  warning: {
    fill: "#5e432f",
    stroke: "#8a6245",
    text: "#f39c12",
    symbol: "🟡",
  },
  danger: { fill: "#6b303b", stroke: "#994553", text: "#e74c3c", symbol: "🔴" },
};

// --- 랙 내부 지표 렌더링 컴포넌트 ---
interface MetricProps {
  label: string;
  value: string;
  unit: string;
  y: number;
  padding: number;
  width: number;
  valueColor?: string;
  fontStyle?: string;
}
//  MetricText 컴포넌트
const MetricText: React.FC<MetricProps> = ({
  label,
  value,
  unit,
  y,
  padding,
  width,
  valueColor = "#ecf0f1",
  fontStyle = "normal",
}) => (
  <Group y={y}>
    <Text // 레이블 (예: "메모리")
      text={label}
      x={padding}
      fill="#bdc3c7"
      fontSize={16}
      width={width / 2 - padding} // 왼쪽 절반 사용
    />
    <Text // 값 (예: "68 %")
      text={`${value} ${unit}`}
      x={padding} //  x를 패딩으로
      fill={valueColor}
      fontSize={16}
      fontStyle={fontStyle}
      width={width - padding * 2} //  전체 내부 너비 사용
      align="right" //  오른쪽 정렬
    />
  </Group>
);
// --- 렌더링 컴포넌트 끝 ---

const DashboardAssetView: React.FC<AssetRendererProps> = ({
  asset,
  gridSize,
  headerPadding,
  isSelected,
  currentScale,
}) => {
  const metricView = useFloorPlanStore((state) => state.dashboardMetricView);

  const openRackModal = useBabylonDatacenterStore(
    (state) => state.openRackModal
  );

  const pixelX = (asset.gridX ?? 0) * gridSize + headerPadding;
  const pixelY = (asset.gridY ?? 0) * gridSize + headerPadding;
  const pixelWidth = (asset.widthInCells ?? 1) * gridSize;
  const pixelHeight = (asset.heightInCells ?? 1) * gridSize;

  const LOD_THRESHOLD = 0.7;
  const isDetailedView = currentScale > LOD_THRESHOLD;

  const data = asset.data ?? {};
  const cpuUsage = data.cpuUsage ?? 0;
  const memoryUsage = data.memoryUsage ?? 0;
  const temperature = data.temperature ?? 0;
  const powerUsage = data.powerUsage ?? 0;
  const networkUsage = data.networkUsage ?? 0;
  const uUsage = Math.round(data.uUsage ?? 0);
  const uHeight = asset.uHeight ?? 42;

  const cpuStatus = getUsageStatus(cpuUsage);
  const memStatus = getUsageStatus(memoryUsage);
  const tempStatus = getTempStatus(temperature);

  const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    selectAsset(asset.id, e.evt.shiftKey);

    // rackServerId가 있을 때만 랙 모달 열기
    if (asset.data?.rackServerId) {
      openRackModal(asset.data.rackServerId.toString());
    }
  };

  const statusPriority = { danger: 3, warning: 2, normal: 1 };

  // 🌟 전체 랙 상태 (배경색) = 가장 심각한 지표 기준
  const overallPriority = Math.max(
    statusPriority[cpuStatus],
    statusPriority[memStatus],
    statusPriority[tempStatus]
  );

  let rackStatusKey: "normal" | "warning" | "danger" = "normal";
  if (overallPriority === 3) rackStatusKey = "danger";
  else if (overallPriority === 2) rackStatusKey = "warning";

  // 🌟 이제 statusColors는 랙의 '진짜' 전체 상태를 반영
  const statusColors = STATUS_COLORS[rackStatusKey];

  // --- 4. 개별 지표 스타일 계산 (Detailed View 용) ---
  const cpuColor = STATUS_COLORS[cpuStatus].text;
  const memColor = STATUS_COLORS[memStatus].text;
  const tempColor = STATUS_COLORS[tempStatus].text;
  const tempIcon = getTempIcon(tempStatus);

  // const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
  //   e.cancelBubble = true;
  //   selectAsset(asset.id, e.evt.shiftKey);
  //   openRackModal(asset.id);
  // };

  // --- 4. 렌더링 레이아웃 상수 ---
  const innerPadding = 15;
  const titleFontSize = 15;
  const labelFontSize = 14;
  const lineHeight = 28; // 텍스트 뷰 줄 간격

  const titleY = innerPadding;
  // CPU 게이지 뷰 y좌표
  const cpuLabelY = titleY + titleFontSize + 12;
  const cpuGaugeY = cpuLabelY + labelFontSize + 6;
  const cpuPercentY = cpuGaugeY + 10 + 4;
  // 텍스트 뷰 시작 y좌표
  const metricGroupY = titleY + titleFontSize + 45; // 🌟 텍스트 뷰 시작 Y좌표

  return (
    <Group
      x={pixelX}
      y={pixelY}
      width={pixelWidth}
      height={pixelHeight}
      onClick={handleClick}
      onTap={handleClick}
      clipFunc={(ctx) => {
        ctx.beginPath();
        ctx.rect(0, 0, pixelWidth, pixelHeight);
        ctx.closePath();
      }}
    >
      {/* 1. 배경 (항상 표시) */}
      <Rect
        width={pixelWidth}
        height={pixelHeight}
        fill={statusColors.fill}
        stroke={isSelected ? "#3b82f6" : statusColors.stroke}
        strokeWidth={isSelected ? 5 : 2}
        cornerRadius={8}
        shadowEnabled={isSelected}
        shadowColor="#60a5fa"
        shadowBlur={isSelected ? 20 : 0}
        shadowOpacity={isSelected ? 0.8 : 0}
      />

      {/* 선택된 자산 추가 강조 - 내부 테두리 */}
      {isSelected && (
        <Rect
          x={3}
          y={3}
          width={pixelWidth - 6}
          height={pixelHeight - 6}
          stroke="#60a5fa"
          strokeWidth={2}
          cornerRadius={6}
          listening={false}
          opacity={0.6}
        />
      )}

      {/* 2. 랙 상단 (항상 표시) */}
      <Text
        text={asset.name}
        x={innerPadding}
        y={titleY}
        fill="#ffffff"
        fontSize={titleFontSize}
        fontStyle="bold"
        width={pixelWidth - innerPadding * 2 - 30}
        ellipsis={true}
      />
      <Text
        text={statusColors.symbol}
        x={innerPadding}
        y={titleY + 2}
        fill="#ffffff"
        fontSize={titleFontSize}
        width={pixelWidth - innerPadding * 2}
        align="right"
      />

      {/* 3. LOD 적용: Detailed View (줌 인 했을 때만) */}
      {isDetailedView && (
        <Group>
          {/* 🌟 뷰 모드에 따라 렌더링 분기 */}

          {metricView === "cpuDetail" ? (
            <>
              {/* 🌟 "CPU 상세" 뷰: 게이지 바 표시 */}
              <Text
                text="CPU 사용량"
                x={innerPadding}
                y={cpuLabelY}
                fill="#bdc3c7"
                fontSize={labelFontSize}
              />
              <Rect // 게이지 바 배경
                x={innerPadding}
                y={cpuGaugeY}
                width={pixelWidth - innerPadding * 2}
                height={10}
                fill="#34495e"
                cornerRadius={5}
              />
              <Rect // 게이지 바 값
                x={innerPadding}
                y={cpuGaugeY}
                width={(pixelWidth - innerPadding * 2) * (cpuUsage / 100)}
                height={10}
                fill={cpuColor}
                cornerRadius={5}
              />
              <Text
                text={`${cpuUsage}% Full`}
                x={innerPadding}
                y={cpuPercentY}
                fill={cpuColor}
                fontSize={labelFontSize}
                fontStyle="bold"
                width={pixelWidth - innerPadding * 2}
                align="right"
              />
            </>
          ) : (
            <>
              {/* 🌟 "기본/네트워크/U-Usage" 뷰: 텍스트 기반 뷰 */}
              {pixelHeight > 130 && (
                <Group y={metricGroupY}>
                  {metricView === "default" && (
                    <>
                      {/* 🌟 "기본" 뷰: 'Worst Offender' 로직 */}
                      {(() => {
                        const metrics: React.ReactNode[] = [];
                        let line = 0;

                        const addMetric = (
                          label: string,
                          value: string,
                          unit: string,
                          color: string,
                          style: string
                        ) => {
                          metrics.push(
                            <MetricText
                              key={label}
                              label={label}
                              value={value}
                              unit={unit}
                              y={line * lineHeight}
                              padding={innerPadding}
                              width={pixelWidth}
                              valueColor={color}
                              fontStyle={style}
                            />
                          );
                          line++;
                        };

                        if (rackStatusKey === "normal") {
                          // 1. 모두 정상: CPU, 메모리 표시
                          addMetric(
                            "CPU",
                            cpuUsage.toString(),
                            "%",
                            cpuColor,
                            "normal"
                          );
                          addMetric(
                            "메모리",
                            memoryUsage.toString(),
                            "%",
                            memColor,
                            "normal"
                          );
                        } else {
                          // 2. 문제 발생: 비정상 지표만 표시
                          if (cpuStatus !== "normal") {
                            addMetric(
                              "CPU",
                              cpuUsage.toString(),
                              "%",
                              cpuColor,
                              "bold"
                            );
                          }
                          if (memStatus !== "normal") {
                            addMetric(
                              "메모리",
                              memoryUsage.toString(),
                              "%",
                              memColor,
                              "bold"
                            );
                          }
                          if (tempStatus !== "normal") {
                            addMetric(
                              "온도",
                              `${temperature}°C ${tempIcon}`,
                              "",
                              tempColor,
                              "bold"
                            );
                          }
                        }
                        return metrics;
                      })()}
                    </>
                  )}

                  {metricView === "network" && (
                    <>
                      {/* 🌟 "네트워크" 뷰 로직 복원 */}
                      <MetricText
                        label="전력"
                        value={powerUsage.toString()}
                        unit="kW"
                        y={0}
                        padding={innerPadding}
                        width={pixelWidth}
                      />
                      <MetricText
                        label="네트워크"
                        value={networkUsage.toString()}
                        unit="Mbps"
                        y={lineHeight}
                        padding={innerPadding}
                        width={pixelWidth}
                      />
                    </>
                  )}

                  {metricView === "usage" && (
                    <>
                      {/* 🌟 "U-Usage" 뷰 로직 복원 */}
                      <MetricText
                        label="U-Usage"
                        value={`${uUsage} / ${uHeight}`}
                        unit="U"
                        y={0}
                        padding={innerPadding}
                        width={pixelWidth}
                      />
                    </>
                  )}
                </Group>
              )}
            </>
          )}
        </Group>
      )}
    </Group>
  );
};

export default DashboardAssetView;
