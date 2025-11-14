import CpuGauge from './CpuGauge';
import MemoryGauge from './MemoryGauge';
import DiskGauge from './DiskGauge';
import SystemLoadGauge from './SystemLoadGauge';

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
      <CpuGauge value={avgCpuUsage} />
      <MemoryGauge value={avgMemoryUsage} />
      <DiskGauge value={avgDiskUsage} />
      <SystemLoadGauge value={avgLoadAvg1} />
    </div>
  );
}
