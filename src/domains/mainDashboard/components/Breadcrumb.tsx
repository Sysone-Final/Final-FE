import { ChevronRight } from 'lucide-react';
import type { SelectedNode, Datacenter } from '../types/dashboard.types';

interface BreadcrumbProps {
  selectedNode: SelectedNode;
  datacenters: Datacenter[];
}

export default function Breadcrumb({ selectedNode, datacenters }: BreadcrumbProps) {
  const datacenter = datacenters.find((dc) => dc.id === selectedNode.datacenterId);
  const serverRoom = datacenter?.serverRooms.find((sr) => sr.id === selectedNode.serverRoomId);
  const rack = serverRoom?.racks.find((r) => r.id === selectedNode.rackId);

  return (
    <div className="bg-neutral-800/50 border-b border-neutral-700 px-6 py-4">
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 hover:text-gray-200 cursor-pointer">
          {datacenter?.name || '데이터센터'}
        </span>
        
        {selectedNode.level !== 'datacenter' && (
          <>
            <ChevronRight size={16} className="text-gray-600" />
            <span className={selectedNode.level === 'serverRoom' ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-200 cursor-pointer'}>
              {serverRoom?.name || '서버실'}
            </span>
          </>
        )}
        
        {selectedNode.level === 'rack' && (
          <>
            <ChevronRight size={16} className="text-gray-600" />
            <span className="text-blue-400 font-medium">
              {rack?.name || '랙'}
            </span>
          </>
        )}
      </nav>
    </div>
  );
}
