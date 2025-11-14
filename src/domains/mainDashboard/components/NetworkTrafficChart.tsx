import ReactECharts from 'echarts-for-react';
import { Network } from 'lucide-react';

interface NetworkTrafficChartProps {
  networkInMbps: number;
  networkOutMbps: number;
  height?: string;
}

export default function NetworkTrafficChart({ networkInMbps, networkOutMbps, height = '250px' }: NetworkTrafficChartProps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#444',
      textStyle: {
        color: '#fff',
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
      data: ['현재'],
      axisLabel: {
        color: '#9ca3af',
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
        type: 'bar',
        data: [networkInMbps.toFixed(2)],
        itemStyle: {
          color: '#06b6d4',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} Mbps',
          color: '#06b6d4',
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      {
        name: '아웃바운드 (Tx)',
        type: 'bar',
        data: [networkOutMbps.toFixed(2)],
        itemStyle: {
          color: '#3b82f6',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} Mbps',
          color: '#3b82f6',
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
    ],
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <div className="flex items-center gap-2 mb-4">
        <Network size={20} className="text-cyan-400" />
        <h3 className="text-lg font-semibold text-gray-100">네트워크 트래픽</h3>
      </div>
      <ReactECharts option={option} style={{ height }} opts={{ renderer: 'svg' }} />
    </div>
  );
}
