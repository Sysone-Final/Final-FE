import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { Datacenter, SelectedNode } from '../types/dashboard.types';
import { Database, Building2, Server } from 'lucide-react';

interface HierarchySidebarProps {
  datacenters: Datacenter[];
  selectedNode: SelectedNode;
  onSelectNode: (node: SelectedNode) => void;
}

export default function HierarchySidebar({ datacenters, selectedNode, onSelectNode }: HierarchySidebarProps) {
  const getSelectedItemId = () => {
    if (selectedNode.level === 'rack') {
      return `rack-${selectedNode.rackId}`;
    }
    if (selectedNode.level === 'serverRoom') {
      return `serverRoom-${selectedNode.serverRoomId}`;
    }
    return `datacenter-${selectedNode.datacenterId}`;
  };

  const handleItemClick = (itemId: string) => {
    const [type, id] = itemId.split('-');
    const numId = parseInt(id);

    if (type === 'datacenter') {
      onSelectNode({ level: 'datacenter', datacenterId: numId });
    } else if (type === 'serverRoom') {
      const datacenter = datacenters.find((dc) =>
        dc.serverRooms.some((sr) => sr.id === numId)
      );
      if (datacenter) {
        onSelectNode({
          level: 'serverRoom',
          datacenterId: datacenter.id,
          serverRoomId: numId,
        });
      }
    } else if (type === 'rack') {
      const datacenter = datacenters.find((dc) =>
        dc.serverRooms.some((sr) => sr.racks.some((r) => r.id === numId))
      );
      const serverRoom = datacenter?.serverRooms.find((sr) =>
        sr.racks.some((r) => r.id === numId)
      );
      if (datacenter && serverRoom) {
        onSelectNode({
          level: 'rack',
          datacenterId: datacenter.id,
          serverRoomId: serverRoom.id,
          rackId: numId,
        });
      }
    }
  };

  return (
    <div className="h-full bg-neutral-800 border-r border-neutral-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <Database size={20} />
          인프라 계층 구조
        </h2>

        <SimpleTreeView
          selectedItems={getSelectedItemId()}
          onItemClick={(_event, itemId) => handleItemClick(itemId)}
          defaultExpandedItems={[`datacenter-${datacenters[0]?.id}`]}
          sx={{
            '& .MuiTreeItem-content': {
              padding: '8px',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(64, 64, 64, 0.8)',
              },
              '&.Mui-selected': {
                backgroundColor: '#16a34a !important',
                '&:hover': {
                  backgroundColor: '#15803d !important',
                },
              },
            },
            '& .MuiTreeItem-label': {
              fontSize: '14px',
              color: '#d1d5db',
            },
            '& .MuiTreeItem-iconContainer': {
              color: '#9ca3af',
            },
            '& .MuiTreeItem-group': {
              marginLeft: '24px',
            },
          }}
        >
          {datacenters.map((datacenter) => (
            <TreeItem
              key={datacenter.id}
              itemId={`datacenter-${datacenter.id}`}
              label={
                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span className="font-medium">{datacenter.name}</span>
                </div>
              }
            >
              {datacenter.serverRooms.map((serverRoom) => (
                <TreeItem
                  key={serverRoom.id}
                  itemId={`serverRoom-${serverRoom.id}`}
                  label={
                    <div className="flex items-center gap-2">
                      <Database size={16} />
                      <span>{serverRoom.name}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        ({serverRoom.racks.length})
                      </span>
                    </div>
                  }
                >
                  {serverRoom.racks.map((rack) => (
                    <TreeItem
                      key={rack.id}
                      itemId={`rack-${rack.id}`}
                      label={
                        <div className="flex items-center gap-2">
                          <Server size={14} />
                          <span>{rack.name}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            ({rack.equipments.length})
                          </span>
                        </div>
                      }
                    />
                  ))}
                </TreeItem>
              ))}
            </TreeItem>
          ))}
        </SimpleTreeView>
      </div>
    </div>
  );
}
