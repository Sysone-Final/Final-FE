import ProgressGauge from './ProgressGauge';
import { Cpu, Activity, HardDrive, TrendingUp } from 'lucide-react';

interface MetricsGaugeGridProps {
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgDiskUsage: number;
  avgLoadAvg1: number;
}

export default function MetricsGaugeGrid({
  avgCpuUsage,
  avgMemoryUsage,
  avgDiskUsage,
  avgLoadAvg1,
}: MetricsGaugeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 ">
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={20} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-100">CPU 사용률</h3>
        </div>
        <ProgressGauge value={avgCpuUsage} title="평균 CPU 사용률" />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={20} className="text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-100">메모리 사용률</h3>
        </div>
        <ProgressGauge value={avgMemoryUsage} title="평균 메모리 사용률" />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive size={20} className="text-green-400" />
          <h3 className="text-lg font-semibold text-gray-100">디스크 사용률</h3>
        </div>
        <ProgressGauge value={avgDiskUsage} title="평균 디스크 사용률" />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-100">시스템 부하</h3>
        </div>
        <ProgressGauge value={avgLoadAvg1 * 25} title={`Load Avg: ${avgLoadAvg1}`} unit="" />
      </div>
    </div>
  );
}
