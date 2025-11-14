// 시스템 메트릭 타입
export interface SystemMetric {
  id: number;
  equipment_id: number;
  context_switches: number;
  cpu_idle: number;
  cpu_irq: number;
  cpu_nice: number;
  cpu_softirq: number;
  cpu_steal: number;
  cpu_system: number;
  cpu_user: number;
  cpu_wait: number;
  free_memory: number;
  generate_time: string;
  load_avg1: number;
  load_avg15: number;
  load_avg5: number;
  memory_active: number;
  memory_buffers: number;
  memory_cached: number;
  memory_inactive: number;
  total_memory: number;
  total_swap: number;
  used_memory: number;
  used_memory_percentage: number;
  used_swap: number;
  used_swap_percentage: number;
}

// 네트워크 메트릭 타입
export interface NetworkMetric {
  id: number;
  equipment_id: number;
  generate_time: string;
  in_bytes_per_sec: number;
  in_bytes_tot: number;
  in_discard_pkts_tot: number;
  in_error_pkts_tot: number;
  in_pkts_per_sec: number;
  in_pkts_tot: number;
  nic_name: string;
  oper_status: number;
  out_bytes_per_sec: number;
  out_bytes_tot: number;
  out_discard_pkts_tot: number;
  out_error_pkts_tot: number;
  out_pkts_per_sec: number;
  out_pkts_tot: number;
  rx_usage: number;
  tx_usage: number;
}

// 스토리지 메트릭 타입
export interface StorageMetric {
  id: number;
  equipment_id: number;
  free_bytes: number;
  free_inodes: number;
  generate_time: string;
  io_read_bps: number;
  io_read_count: number;
  io_time_percentage: number;
  io_write_bps: number;
  io_write_count: number;
  total_bytes: number;
  total_inodes: number;
  used_bytes: number;
  used_inode_percentage: number;
  used_inodes: number;
  used_percentage: number;
}

// 장비 타입
export interface Equipment {
  id: number;
  name: string;
  type: 'Server' | 'Switch' | 'Storage' | 'Router';
  rack_id: number;
  position_u: number;
  height_u: number;
  ip_address: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  systemMetric?: SystemMetric;
  networkMetrics?: NetworkMetric[];
  storageMetric?: StorageMetric;
}

// 랙 타입
export interface Rack {
  id: number;
  name: string;
  server_room_id: number;
  total_u: number;
  equipments: Equipment[];
}

// 서버실 타입
export interface ServerRoom {
  id: number;
  name: string;
  datacenter_id: number;
  location: string;
  area: number; // 면적 (m²)
  racks: Rack[];
}

// 데이터센터 타입
export interface Datacenter {
  id: number;
  name: string;
  location: string;
  serverRooms: ServerRoom[];
}

// 계층 선택 타입
export type HierarchyLevel = 'datacenter' | 'serverRoom' | 'rack';

export interface SelectedNode {
  level: HierarchyLevel;
  datacenterId: number;
  serverRoomId?: number;
  rackId?: number;
}

// 집계된 메트릭 타입
export interface AggregatedMetrics {
  totalEquipments: number;
  onlineEquipments: number;
  offlineEquipments: number;
  warningEquipments: number;
  criticalEquipments: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgDiskUsage: number;
  totalNetworkInMbps: number;
  totalNetworkOutMbps: number;
  avgLoadAvg1: number;
}
