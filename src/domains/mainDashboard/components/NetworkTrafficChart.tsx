import ReactECharts from 'echarts-for-react';
import { Network } from 'lucide-react';
import type { NetworkTrafficData } from '../types/dashboard.types';

interface NetworkTrafficChartProps {
  data: NetworkTrafficData;
  height?: string;
}

export default function NetworkTrafficChart({ data, height = '250px' }: NetworkTrafficChartProps) {
  // 바이트를 Mbps로 변환하는 함수
  const bytesToMbps = (bytes: number): number => {
    return (bytes * 8) / (1024 * 1024);
  };

  // 시간 포맷팅 함수
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // 차트 데이터 준비
  const timeLabels = data.networkUsageTrend.map(item => formatTime(item.time));
  const rxData = data.networkUsageTrend.map(item => bytesToMbps(item.rxBytesPerSec).toFixed(2));
  const txData = data.networkUsageTrend.map(item => bytesToMbps(item.txBytesPerSec).toFixed(2));

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#444',
      textStyle: {
        color: '#fff',
      },
      formatter: (params: any) => {
        const time = params[0].axisValue;
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${time}</div>`;
        params.forEach((param: any) => {
          result += `
            <div style="display: flex; align-items: center; margin-top: 5px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 5px;"></span>
              <span>${param.seriesName}: <strong>${param.value} Mbps</strong></span>
            </div>
          `;
        });
        return result;
      },
    },
    legend: {
      data: ['인바운드 (Rx)', '아웃바운드 (Tx)'],
      textStyle: {
        color: '#d1d5db',
      },
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      axisLabel: {
        color: '#9ca3af',
        rotate: 45,
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Mbps',
      nameTextStyle: {
        color: '#9ca3af',
      },
      axisLabel: {
        color: '#9ca3af',
        formatter: (value: number) => {
          if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
          }
          return value.toFixed(0);
        },
      },
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
        },
      },
    },
    series: [
      {
        name: '인바운드 (Rx)',
        type: 'line',
        data: rxData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#06b6d4',
        },
        lineStyle: {
          width: 2,
          color: '#06b6d4',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(6, 182, 212, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(6, 182, 212, 0.05)',
              },
            ],
          },
        },
      },
      {
        name: '아웃바운드 (Tx)',
        type: 'line',
        data: txData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#3b82f6',
        },
        lineStyle: {
          width: 2,
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.05)',
              },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network size={20} className="text-cyan-400" />
          <h3 className="text-lg font-semibold text-gray-100">네트워크 트래픽</h3>
        </div>
        <div className="text-sm text-gray-400">
          최근 5분 (15초 간격)
        </div>
      </div>
      <ReactECharts option={option} style={{ height }} opts={{ renderer: 'svg' }} />
    </div>
  );
}
