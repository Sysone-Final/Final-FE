import ProgressGauge from './ProgressGauge';
import { TrendingUp } from 'lucide-react';

interface SystemLoadGaugeProps {
  value: number;
}

export default function SystemLoadGauge({ value }: SystemLoadGaugeProps) {
  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={20} className="text-orange-400" />
        <h3 className="text-lg font-semibold text-gray-100">시스템 부하</h3>
      </div>
      <ProgressGauge value={value * 25} title={`Load Avg: ${value}`} unit="" />
    </div>
  );
}
