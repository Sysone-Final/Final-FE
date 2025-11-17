import ProgressGauge from './ProgressGauge';
import { Cpu } from 'lucide-react';

interface CpuGaugeProps {
  value: number;
}

export default function CpuGauge({ value }: CpuGaugeProps) {
  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <div className="flex items-center gap-2 mb-2">
        <Cpu size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-100">CPU 사용률</h3>
      </div>
      <ProgressGauge value={value} title="평균 CPU 사용률" />
    </div>
  );
}
