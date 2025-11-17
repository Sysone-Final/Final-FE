import type { ColumnDef } from '@tanstack/react-table';
import type { Equipment } from '../types/dashboard.types';

export const equipmentColumns: ColumnDef<Equipment>[] = [
  {
    accessorKey: 'name',
    header: '장비명',
    cell: ({ getValue }) => <span className="font-medium text-gray-100">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'type',
    header: '타입',
    cell: ({ getValue }) => {
      const type = getValue<string>();
      const colorMap: Record<string, string> = {
        Server: 'bg-blue-700 text-blue-100',
        Switch: 'bg-purple-700 text-purple-100',
        Storage: 'bg-green-700 text-green-100',
        Router: 'bg-orange-700 text-orange-100',
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[type] || 'bg-gray-700'}`}>{type}</span>
      );
    },
  },
  {
    accessorKey: 'ip_address',
    header: 'IP 주소',
    cell: ({ getValue }) => <span className="font-mono text-sm text-gray-300">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
        online: { color: 'bg-green-700 text-green-100', label: '정상', icon: '●' },
        warning: { color: 'bg-yellow-700 text-yellow-100', label: '경고', icon: '▲' },
        critical: { color: 'bg-red-700 text-red-100', label: '위험', icon: '✕' },
        offline: { color: 'bg-gray-700 text-gray-300', label: '오프라인', icon: '○' },
      };
      const config = statusConfig[status] || statusConfig.offline;
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 ${config.color}`}>
          <span>{config.icon}</span>
          {config.label}
        </span>
      );
    },
  },
  {
    id: 'cpu_usage',
    header: 'CPU 사용률',
    accessorFn: (row) => (row.systemMetric ? 100 - row.systemMetric.cpu_idle : 0),
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const rounded = Math.round(value * 10) / 10;
      let colorClass = 'text-green-400';
      if (value >= 90) colorClass = 'text-red-400';
      else if (value >= 80) colorClass = 'text-yellow-400';
      else if (value >= 50) colorClass = 'text-blue-400';

      return <span className={`font-semibold ${colorClass}`}>{rounded.toFixed(2)}%</span>;
    },
  },
  {
    id: 'memory_usage',
    header: '메모리 사용률',
    accessorFn: (row) => row.systemMetric?.used_memory_percentage || 0,
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const rounded = Math.round(value * 10) / 10;
      let colorClass = 'text-green-400';
      if (value >= 95) colorClass = 'text-red-400';
      else if (value >= 85) colorClass = 'text-yellow-400';
      else if (value >= 50) colorClass = 'text-blue-400';

      return <span className={`font-semibold ${colorClass}`}>{rounded.toFixed(2)}%</span>;
    },
  },
  {
    id: 'disk_usage',
    header: '디스크 사용률',
    accessorFn: (row) => row.storageMetric?.used_percentage || 0,
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const rounded = Math.round(value * 10) / 10;
      let colorClass = 'text-green-400';
      if (value >= 95) colorClass = 'text-red-400';
      else if (value >= 85) colorClass = 'text-yellow-400';
      else if (value >= 50) colorClass = 'text-blue-400';

      return <span className={`font-semibold ${colorClass}`}>{rounded.toFixed(2)}%</span>;
    },
  },
  {
    id: 'network_rx',
    header: 'Network RX',
    accessorFn: (row) => {
      const totalRx = row.networkMetrics?.reduce((sum, nm) => sum + nm.in_bytes_per_sec, 0) || 0;
      return totalRx / 1024 / 1024; // Mbps
    },
    cell: ({ getValue }) => {
      const mbps = getValue<number>();
      return <span className="text-cyan-400 font-semibold">{mbps.toFixed(2)} Mbps</span>;
    },
  },
  {
    id: 'network_tx',
    header: 'Network TX',
    accessorFn: (row) => {
      const totalTx = row.networkMetrics?.reduce((sum, nm) => sum + nm.out_bytes_per_sec, 0) || 0;
      return totalTx / 1024 / 1024; // Mbps
    },
    cell: ({ getValue }) => {
      const mbps = getValue<number>();
      return <span className="text-blue-400 font-semibold">{mbps.toFixed(2)} Mbps</span>;
    },
  },
  {
    id: 'load_avg',
    header: 'Load Avg (1m)',
    accessorFn: (row) => row.systemMetric?.load_avg1 || 0,
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const rounded = Math.round(value * 100) / 100;
      let colorClass = 'text-gray-300';
      if (value >= 4) colorClass = 'text-red-400';
      else if (value >= 2) colorClass = 'text-yellow-400';

      return <span className={colorClass}>{rounded.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: 'position_u',
    header: '위치 (U)',
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">
        {row.original.position_u}U ({row.original.height_u}U)
      </span>
    ),
  },
];
