import ReactECharts from 'echarts-for-react';
import { AlertTriangle } from 'lucide-react';

interface NetworkErrorStats {
  nicName: string;
  errorRate: number; // 백분율
  dropRate: number; // 백분율
}

interface NetworkErrorChartProps {
  data: NetworkErrorStats[];
  height?: string;
}

export default function NetworkErrorChart({ data, height = '250px' }: NetworkErrorChartProps) {
  const nicNames = data.map((item) => item.nicName);
  const errorRates = data.map((item) => item.errorRate);
  const dropRates = data.map((item) => item.dropRate);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#444',
      textStyle: {
        color: '#fff',
      },
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: Array<{ axisValue: string; seriesName: string; value: number; color: string }>) => {
        const nic = params[0].axisValue;
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${nic}</div>`;
        params.forEach((param) => {
          result += `
            <div style="display: flex; align-items: center; margin-top: 5px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 2px; background-color: ${param.color}; margin-right: 5px;"></span>
              <span>${param.seriesName}: <strong>${param.value.toFixed(3)}%</strong></span>
            </div>
          `;
        });
        return result;
      },
    },
    legend: {
      data: ['에러율', '드롭율'],
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
      data: nicNames,
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
      name: '%',
      nameTextStyle: {
        color: '#9ca3af',
      },
      axisLabel: {
        color: '#9ca3af',
        formatter: (value: number) => `${value.toFixed(2)}%`,
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
        name: '에러율',
        type: 'bar',
        data: errorRates,
        itemStyle: {
          color: '#ef4444', // 빨강
        },
        barMaxWidth: 40,
      },
      {
        name: '드롭율',
        type: 'bar',
        data: dropRates,
        itemStyle: {
          color: '#f97316', // 오렌지
        },
        barMaxWidth: 40,
      },
    ],
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-400" />
          <h3 className="text-lg font-semibold text-gray-100">네트워크 에러/드롭</h3>
        </div>
      </div>
      <ReactECharts option={option} style={{ height }} opts={{ renderer: 'svg' }} />
    </div>
  );
}
