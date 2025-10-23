import React from 'react'; 
import type { ColumnDef } from '@tanstack/react-table';
import type { Resource, ResourceStatus, ResourceTableMeta } from '../types/resource.types';
import HeaderCheckbox from './HeaderCheckbox';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';

const statusColorMap: Record<ResourceStatus, string> = {
  '정상': 'bg-green-100 text-green-800',
  '경고': 'bg-orange-100 text-orange-800',
  '정보 필요': 'bg-blue-100 text-blue-800',
  '미할당': 'bg-gray-100 text-gray-800',
};

// NOTE(user): 컬럼 정의
export const columns: ColumnDef<Resource>[] = [
  {
    id: 'select',
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
    // 정렬/필터 비활성화
    enableSorting: false,
    enableHiding: false, 
  },
  {
    accessorKey: 'assetName',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center hover:text-gray-700" // 호버 효과 추가
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          자산명
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      )
    },
    // TODO(user): 필요 시 cell 렌더링 커스텀 (예: 이미지 미리보기 추가)
  },
  {
    accessorKey: 'status',
    header: '상태', // TODO(user): 상태 컬럼도 정렬/필터링 가능하도록 구현
    cell: ({ getValue }) => {
      const status = getValue<ResourceStatus>();
      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColorMap[status] ?? statusColorMap['미할당']
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP 주소',
  },
  {
    accessorKey: 'model',
    header: '모델명',
  },
  {
    accessorKey: 'location',
    header: '위치', // TODO(user): 위치 컬럼도 정렬/필터링 가능하도록 구현
  },
  {
    id: 'manage',
    header: '관리',
    cell: ({ row, table }) => (
      <div className="flex gap-2">
        <button
          className="text-gray-600 hover:text-blue-600"
          onClick={() => 
            (table.options.meta as ResourceTableMeta)?.editResourceHandler(row.original)
          }
          aria-label={`${row.original.assetName} 수정`}
        >
          <Pencil size={16} />
        </button>
        <button
          className="text-gray-600 hover:text-red-600"
          onClick={() => 
            (table.options.meta as ResourceTableMeta)?.deleteResourceHandler(row.original.id)
          }
          aria-label={`${row.original.assetName} 삭제`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
    // 액션 컬럼은 정렬/필터 필요 없음
    enableSorting: false, 
  },
];