import MetricsGaugeGrid from './MetricsGaugeGrid';
import NetworkTrafficChart from './NetworkTrafficChart';
import { mockNetworkTrafficData } from '../data/mockData';
import type { AggregatedMetrics } from '../types/dashboard.types';
import { Activity } from 'lucide-react';

interface DatacenterDashboardProps {
  metrics: AggregatedMetrics;
}

export default function DatacenterDashboard({ metrics }: DatacenterDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 장비 현황 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">총 장비 수</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">{metrics.totalEquipments}</p>
            </div>
            <Activity className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-4 border border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">정상</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{metrics.onlineEquipments}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-4 border border-yellow-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">경고</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{metrics.warningEquipments}</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-4 border border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">위험</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{metrics.criticalEquipments}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">오프라인</p>
              <p className="text-3xl font-bold text-gray-400 mt-1">{metrics.offlineEquipments}</p>
            </div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 게이지 차트 그리드 */}
      <MetricsGaugeGrid
        avgCpuUsage={metrics.avgCpuUsage}
        avgMemoryUsage={metrics.avgMemoryUsage}
        avgDiskUsage={metrics.avgDiskUsage}
        avgLoadAvg1={metrics.avgLoadAvg1}
      />

      {/* 네트워크 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NetworkTrafficChart data={mockNetworkTrafficData} />

        {/* <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} className="text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-100">알람/경고</h3>
          </div>
          <div className="space-y-3">
            {metrics.criticalEquipments > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700 rounded">
                <span className="text-red-400 text-sm">Critical 알람</span>
                <span className="text-red-400 font-bold">{metrics.criticalEquipments}개</span>
              </div>
            )}
            {metrics.warningEquipments > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                <span className="text-yellow-400 text-sm">Warning 알람</span>
                <span className="text-yellow-400 font-bold">{metrics.warningEquipments}개</span>
              </div>
            )}
            {metrics.criticalEquipments === 0 && metrics.warningEquipments === 0 && (
              <div className="flex items-center justify-center p-6 text-green-400">
                <span>활성 알람 없음 ✓</span>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
