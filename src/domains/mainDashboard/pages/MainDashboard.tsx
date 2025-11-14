import { useState } from 'react';
import HierarchySidebar from '../components/HierarchySidebar';
import Breadcrumb from '../components/Breadcrumb';
import DatacenterDashboard from '../components/DatacenterDashboard';
import ServerRoomDashboard from '../components/ServerRoomDashboard';
import RackDashboard from '../components/RackDashboard';
import { mockDatacenters } from '../data/mockData';
import { calculateAggregatedMetrics, calculateServerRoomMetrics } from '../utils/metricsCalculator';
import type { SelectedNode } from '../types/dashboard.types';

function MainDashboard() {
  const [selectedNode, setSelectedNode] = useState<SelectedNode>({
    level: 'datacenter',
    datacenterId: mockDatacenters[0].id,
  });

  const renderDashboard = () => {
    const datacenter = mockDatacenters.find((dc) => dc.id === selectedNode.datacenterId);
    if (!datacenter) return <div className="text-gray-400">데이터센터를 찾을 수 없습니다.</div>;

    if (selectedNode.level === 'datacenter') {
      const metrics = calculateAggregatedMetrics(datacenter);
      return <DatacenterDashboard metrics={metrics} />;
    }

    if (selectedNode.level === 'serverRoom' && selectedNode.serverRoomId) {
      const serverRoom = datacenter.serverRooms.find((sr) => sr.id === selectedNode.serverRoomId);
      if (!serverRoom) return <div className="text-gray-400">서버실을 찾을 수 없습니다.</div>;

      const metrics = calculateServerRoomMetrics(datacenter, serverRoom.id);
      return <ServerRoomDashboard serverRoom={serverRoom} metrics={metrics} />;
    }

    if (selectedNode.level === 'rack' && selectedNode.serverRoomId && selectedNode.rackId) {
      const serverRoom = datacenter.serverRooms.find((sr) => sr.id === selectedNode.serverRoomId);
      const rack = serverRoom?.racks.find((r) => r.id === selectedNode.rackId);
      if (!serverRoom || !rack) return <div className="text-gray-400">랙을 찾을 수 없습니다.</div>;

      return <RackDashboard rack={rack} />;
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-neutral-900">
      {/* 왼쪽 사이드바 */}
      <div className="w-80 flex-shrink-0">
        <HierarchySidebar
          datacenters={mockDatacenters}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        />
      </div>

      {/* 오른쪽 대시보드 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Breadcrumb selectedNode={selectedNode} datacenters={mockDatacenters} />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6">{renderDashboard()}</div>
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;