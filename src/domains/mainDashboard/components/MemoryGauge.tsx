import ProgressGauge from './ProgressGauge';
import { Activity } from 'lucide-react';

interface MemoryGaugeProps {
  value: number;
}

export default function MemoryGauge({ value }: MemoryGaugeProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Activity size={20} className="text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-100">메모리 사용률</h3>
      </div>
      <ProgressGauge value={value} title="평균 메모리 사용률" />
    </div>
  );
}
