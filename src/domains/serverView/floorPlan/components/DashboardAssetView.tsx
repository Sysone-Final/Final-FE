
import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { selectAsset, useFloorPlanStore } from '../store/floorPlanStore';
import type { AssetRendererProps } from './AssetRenderer';
import { useBabylonDatacenterStore } from '@/domains/serverView/view3d/stores/useBabylonDatacenterStore';

// CPU 사용량에 따라 상태(색상)를 결정
const getCpuStatus = (cpuUsage: number | undefined) => {
 const usage = cpuUsage ?? 0;
 if (usage > 90) return 'danger';
 if (usage > 75) return 'warning'; 
 return 'normal';
};

// 온도에 따라 아이콘을 반환
const getTempIcon = (temp: number | undefined) => {
 const t = temp ?? 0;
 if (t > 35) return '🔥'; // 위험
 if (t > 30) return '⚠️'; // 주의
 return ''; // 정상
};

// 상태별 색상 (대시보드 뷰 전용)
const STATUS_COLORS = {
 normal: { fill: '#2e4c40', stroke: '#3f6d5a', text: '#2ecc71', symbol: '🟢' },
 warning: { fill: '#5e432f', stroke: '#8a6245', text: '#f39c12', symbol: '🟡' },
 danger: { fill: '#6b303b', stroke: '#994553', text: '#e74c3c', symbol: '🔴' },
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
const MetricText: React.FC<MetricProps> = ({ label, value, unit, y, padding, width, valueColor = '#ecf0f1', fontStyle = 'normal' }) => (
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
}) => {

 const metricView = useFloorPlanStore((state) => state.dashboardMetricView);

 const openRackModal = useBabylonDatacenterStore((state) => state.openRackModal);

 const pixelX = (asset.gridX ?? 0) * gridSize + headerPadding;
 const pixelY = (asset.gridY ?? 0) * gridSize + headerPadding;
 const pixelWidth = (asset.widthInCells ?? 1) * gridSize;
 const pixelHeight = (asset.heightInCells ?? 1) * gridSize;

 const data = asset.data ?? {}; 
 const cpuUsage = data.cpuUsage ?? 0; 
 const memoryUsage = data.memoryUsage ?? 0;
 const temperature = data.temperature ?? 0;
 const powerUsage = data.powerUsage ?? 0;
 const networkUsage = data.networkUsage ?? 0;
 const uUsage = Math.round(data.uUsage ?? 0); 
 const uHeight = asset.uHeight ?? 42; 

 const rackStatusKey = getCpuStatus(cpuUsage);
 const statusColors = STATUS_COLORS[rackStatusKey];
 const tempIcon = getTempIcon(temperature);
 const tempColor = tempIcon ? (tempIcon === '🔥' ? STATUS_COLORS.danger.text : STATUS_COLORS.warning.text) : '#ecf0f1';
 const tempStyle = tempIcon ? 'bold' : 'normal';

 const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
  e.cancelBubble = true;
  selectAsset(asset.id, e.evt.shiftKey);
  openRackModal(asset.id);
 };

 const innerPadding = 15;
 const titleFontSize = 15;
 const labelFontSize = 14;
 const lineHeight = 28; 

 const titleY = innerPadding;
 const cpuLabelY = titleY + titleFontSize + 12;
 const cpuGaugeY = cpuLabelY + labelFontSize + 6; 
 const cpuPercentY = cpuGaugeY + 10 + 4; 
 const metricGroupY = cpuPercentY + labelFontSize + 12;

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
   {/* ... (배경 Rect) ... */}
   <Rect
    width={pixelWidth}
    height={pixelHeight}
    fill={statusColors.fill}
    stroke={isSelected ? '#3498db' : statusColors.stroke}
    strokeWidth={isSelected ? 3 : 2}
    cornerRadius={8}
   />

   {/* --- 1. 랙 상단 (이름, 상태 심볼) --- */}
   
   {/*  랙 이름 */}
   <Text
    text={asset.name} 
    x={innerPadding}
    y={titleY}
    fill="#ffffff"
    fontSize={titleFontSize}
    fontStyle="bold"
    //  심볼이 들어갈 공간(약 30px)을 제외한 너비
    width={pixelWidth - innerPadding * 2 - 30} 
    ellipsis={true}
   />
   
   {/*  상태 심볼  */}
   <Text
    text={statusColors.symbol} 
    x={innerPadding} //  x를 패딩으로
    y={titleY + 2} 
    fill="#ffffff"
    fontSize={titleFontSize}
    width={pixelWidth - innerPadding * 2} //  전체 내부 너비
    align="right" //  오른쪽 정렬
   />

   {/*  CPU 게이지  --- */}
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
    fill={statusColors.text}
    cornerRadius={5}
   />
   
   {/* "XX% Full" 텍스트 수정 */}
   <Text
    text={`${cpuUsage}% Full`}
    x={innerPadding} //  x를 패딩으로
    y={cpuPercentY} 
    fill={statusColors.text}
    fontSize={labelFontSize}
    fontStyle="bold"
    width={pixelWidth - innerPadding * 2} //  전체 내부 너비
    align="right" //  오른쪽 정렬
   />

   {/*  하단 필터링 영역  --- */}
   {pixelHeight > 130 && ( 
    <Group y={metricGroupY}>
     {metricView === 'default' && (
      <>
       <MetricText label="메모리" value={memoryUsage.toString()} unit="%" y={0} padding={innerPadding} width={pixelWidth} />
       <MetricText label="온도" value={`${temperature}°C ${tempIcon}`} unit="" y={lineHeight} padding={innerPadding} width={pixelWidth} valueColor={tempColor} fontStyle={tempStyle} />
      </>
     )}

     {metricView === 'network' && (
      <>
       <MetricText label="전력" value={powerUsage.toString()} unit="kW" y={0} padding={innerPadding} width={pixelWidth} />
       <MetricText label="네트워크" value={networkUsage.toString()} unit="Mbps" y={lineHeight} padding={innerPadding} width={pixelWidth} />
      </>
     )}

     {metricView === 'usage' && (
      <>
       <MetricText label="U-Usage"
        value={`${uUsage} / ${uHeight}`} unit="U" y={0} padding={innerPadding} width={pixelWidth} />
      </>
     )}
    </Group>
   )}
  </Group>
 );
};

export default DashboardAssetView;