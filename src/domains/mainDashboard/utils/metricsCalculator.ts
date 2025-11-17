import type { Datacenter, AggregatedMetrics } from '../types/dashboard.types';

export const calculateAggregatedMetrics = (datacenter: Datacenter): AggregatedMetrics => {
  const allEquipments = datacenter.serverRooms.flatMap((sr) =>
    sr.racks.flatMap((rack) => rack.equipments)
  );

  const totalEquipments = allEquipments.length;
  const onlineEquipments = allEquipments.filter((eq) => eq.status === 'online').length;
  const offlineEquipments = allEquipments.filter((eq) => eq.status === 'offline').length;
  const warningEquipments = allEquipments.filter((eq) => eq.status === 'warning').length;
  const criticalEquipments = allEquipments.filter((eq) => eq.status === 'critical').length;

  const avgCpuUsage =
    allEquipments.reduce((sum, eq) => sum + (100 - (eq.systemMetric?.cpu_idle || 0)), 0) / totalEquipments || 0;

  const avgMemoryUsage =
    allEquipments.reduce((sum, eq) => sum + (eq.systemMetric?.used_memory_percentage || 0), 0) / totalEquipments || 0;

  const avgDiskUsage =
    allEquipments.reduce((sum, eq) => sum + (eq.storageMetric?.used_percentage || 0), 0) / totalEquipments || 0;

  const totalNetworkIn = allEquipments.reduce((sum, eq) => {
    const networkIn = eq.networkMetrics?.reduce((s, nm) => s + nm.in_bytes_per_sec, 0) || 0;
    return sum + networkIn;
  }, 0);

  const totalNetworkOut = allEquipments.reduce((sum, eq) => {
    const networkOut = eq.networkMetrics?.reduce((s, nm) => s + nm.out_bytes_per_sec, 0) || 0;
    return sum + networkOut;
  }, 0);

  const avgLoadAvg1 =
    allEquipments.reduce((sum, eq) => sum + (eq.systemMetric?.load_avg1 || 0), 0) / totalEquipments || 0;

  return {
    totalEquipments,
    onlineEquipments,
    offlineEquipments,
    warningEquipments,
    criticalEquipments,
    avgCpuUsage: Math.round(avgCpuUsage * 10) / 10,
    avgMemoryUsage: Math.round(avgMemoryUsage * 10) / 10,
    avgDiskUsage: Math.round(avgDiskUsage * 10) / 10,
    totalNetworkInMbps: Math.round((totalNetworkIn / 1024 / 1024) * 10) / 10,
    totalNetworkOutMbps: Math.round((totalNetworkOut / 1024 / 1024) * 10) / 10,
    avgLoadAvg1: Math.round(avgLoadAvg1 * 100) / 100,
  };
};

export const calculateServerRoomMetrics = (datacenter: Datacenter, serverRoomId: number): AggregatedMetrics => {
  const serverRoom = datacenter.serverRooms.find((sr) => sr.id === serverRoomId);
  if (!serverRoom) {
    return {
      totalEquipments: 0,
      onlineEquipments: 0,
      offlineEquipments: 0,
      warningEquipments: 0,
      criticalEquipments: 0,
      avgCpuUsage: 0,
      avgMemoryUsage: 0,
      avgDiskUsage: 0,
      totalNetworkInMbps: 0,
      totalNetworkOutMbps: 0,
      avgLoadAvg1: 0,
    };
  }

  const allEquipments = serverRoom.racks.flatMap((rack) => rack.equipments);

  const totalEquipments = allEquipments.length;
  const onlineEquipments = allEquipments.filter((eq) => eq.status === 'online').length;
  const offlineEquipments = allEquipments.filter((eq) => eq.status === 'offline').length;
  const warningEquipments = allEquipments.filter((eq) => eq.status === 'warning').length;
  const criticalEquipments = allEquipments.filter((eq) => eq.status === 'critical').length;

  const avgCpuUsage =
    allEquipments.reduce((sum, eq) => sum + (100 - (eq.systemMetric?.cpu_idle || 0)), 0) / totalEquipments || 0;

  const avgMemoryUsage =
    allEquipments.reduce((sum, eq) => sum + (eq.systemMetric?.used_memory_percentage || 0), 0) / totalEquipments || 0;

  const avgDiskUsage =
    allEquipments.reduce((sum, eq) => sum + (eq.storageMetric?.used_percentage || 0), 0) / totalEquipments || 0;

  const totalNetworkIn = allEquipments.reduce((sum, eq) => {
    const networkIn = eq.networkMetrics?.reduce((s, nm) => s + nm.in_bytes_per_sec, 0) || 0;
    return sum + networkIn;
  }, 0);

  const totalNetworkOut = allEquipments.reduce((sum, eq) => {
    const networkOut = eq.networkMetrics?.reduce((s, nm) => s + nm.out_bytes_per_sec, 0) || 0;
    return sum + networkOut;
  }, 0);

  const avgLoadAvg1 =
    allEquipments.reduce((sum, eq) => sum + (eq.systemMetric?.load_avg1 || 0), 0) / totalEquipments || 0;

  return {
    totalEquipments,
    onlineEquipments,
    offlineEquipments,
    warningEquipments,
    criticalEquipments,
    avgCpuUsage: Math.round(avgCpuUsage * 10) / 10,
    avgMemoryUsage: Math.round(avgMemoryUsage * 10) / 10,
    avgDiskUsage: Math.round(avgDiskUsage * 10) / 10,
    totalNetworkInMbps: Math.round((totalNetworkIn / 1024 / 1024) * 10) / 10,
    totalNetworkOutMbps: Math.round((totalNetworkOut / 1024 / 1024) * 10) / 10,
    avgLoadAvg1: Math.round(avgLoadAvg1 * 100) / 100,
  };
};
