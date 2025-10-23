// src/domains/resourceManage/components/resourceTable.config.tsx
// 💡 수정: useRef, useEffect 삭제. React는 JSX 때문에 유지
import React from 'react'; 
// 💡 수정: Table 타입 임포트 삭제
import type { ColumnDef } from '@tanstack/react-table'; 
import type { Resource, ResourceStatus, ResourceTableMeta } from '../types/resource.types';
// 💡 추가: 방금 만든 HeaderCheckbox 컴포넌트 임포트
import HeaderCheckbox from './HeaderCheckbox';

// ... (statusColorMap 코드는 그대로 둡니다) ...
const statusColorMap: Record<ResourceStatus, string> = {
  Normal: 'bg-green-100 text-green-800',
  Warning: 'bg-orange-100 text-orange-800',
  'Info Needed': 'bg-blue-100 text-blue-800',
  Unassigned: 'bg-gray-100 text-gray-800',
};

// 💡 삭제: function HeaderCheckbox(...) 정의를 여기서 삭제합니다.

// NOTE(user): 컬럼 정의
export const columns: ColumnDef<Resource>[] = [
  {
    id: 'select',
    // 💡 수정: 임포트한 컴포넌트를 렌더링
    header: ({ table }) => <HeaderCheckbox table={table} />,
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="rounded border-gray-300"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  // ... (나머지 컬럼 정의는 그대로 둡니다) ...
  {
    accessorKey: 'assetName',
    header: 'Asset Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<ResourceStatus>();
      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColorMap[status] ?? statusColorMap.Unassigned
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address',
  },
  {
    accessorKey: 'model',
    header: 'Model',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    id: 'manage',
    header: 'Manage',
    cell: ({ row, table }) => (
      <div className="flex gap-2">
        <button
          className="text-gray-600 hover:text-blue-600"
          onClick={() => 
            (table.options.meta as ResourceTableMeta)?.editResourceHandler(row.original)
          }
        >
          <span>✏️</span>
        </button>
        <button
          className="text-gray-600 hover:text-red-600"
          onClick={() => 
            (table.options.meta as ResourceTableMeta)?.deleteResourceHandler(row.original.id)
          }
        >
          <span>🗑️</span>
        </button>
      </div>
    ),
  },
];