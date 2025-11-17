import ReactECharts from 'echarts-for-react';

interface ProgressGaugeProps {
  value: number;
  title: string;
  unit?: string;
  color?: string;
}

const getColorByValue = (value: number): string => {
  if (value >= 90) return '#EF4444'; // 위험 (빨강)
  if (value >= 75) return '#F59E0B'; // 경고 (주황)
  if (value >= 50) return '#3B82F6'; // 주의 (파랑)
  return '#10B981'; // 정상 (초록)
};

export default function ProgressGauge({ value, title, unit = '%', color }: ProgressGaugeProps) {
  const gaugeColor = color || getColorByValue(value);

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: gaugeColor,
        },
        progress: {
          show: true,
          width: 18,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, 'rgba(255, 255, 255, 0.1)']],
          },
        },
        axisTick: {
          distance: -30,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999',
          },
        },
        splitLine: {
          distance: -40,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999',
          },
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 12,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '0%'],
          fontSize: 24,
          fontWeight: 'bold',
          formatter: `{value}${unit}`,
          color: gaugeColor,
        },
        data: [
          {
            value: Math.round(value * 100) / 100, // 소수점 2자리로 제한
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <ReactECharts option={option} style={{ height: '200px', width: '100%' }} opts={{ renderer: 'svg' }} />
      <div className="text-center -mt-10">
        <p className="text-sm font-medium text-gray-300">{title}</p>
      </div>
    </div>
  );
}
