import ProgressGauge from './ProgressGauge';
import { HardDrive } from 'lucide-react';

interface DiskGaugeProps {
  value: number;
}

export default function DiskGauge({ value }: DiskGaugeProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <HardDrive size={20} className="text-green-400" />
        <h3 className="text-lg font-semibold text-gray-100">디스크 사용률</h3>
      </div>
      <ProgressGauge value={value} title="평균 디스크 사용률" />
    </div>
  );
}
