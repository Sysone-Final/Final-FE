
import React from 'react'; 
import type { ColumnDef } from '@tanstack/react-table';
import type { Resource, ResourceStatus, ResourceTableMeta } from '../types/resource.types';
//  HeaderCheckbox 컴포넌트를 임포트
import HeaderCheckbox from './HeaderCheckbox';

// NOTE(user): Status Pill 스타일 (Tailwind) - Prompt 2 요구사항
const statusColorMap: Record<ResourceStatus, string> = {
  '정상': 'bg-green-100 text-green-800',
  '경고': 'bg-orange-100 text-orange-800',
  '정보 필요': 'bg-blue-100 text-blue-800',
  '미할당': 'bg-gray-100 text-gray-800',
};

// 💡 --- 삭제 ---
// interface HeaderCheckboxProps { ... }
// function HeaderCheckbox({ table }: HeaderCheckboxProps) { ... }
// (이 파일에 있던 HeaderCheckbox 관련 코드를 모두 삭제합니다)
// 💡 --- 삭제 끝 ---


// NOTE(user): 컬럼 정의
export const columns: ColumnDef<Resource>[] = [
  {
    id: 'select',
    //  임포트한 컴포넌트를 사용
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
  {
    accessorKey: 'assetName',
    header: '자산명',
  },
  {
    accessorKey: 'status',
    header: '상태',
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
    header: '위치',
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
        >
          <span>수정</span>
        </button>
        <button
          className="text-gray-600 hover:text-red-600"
          onClick={() => 
            (table.options.meta as ResourceTableMeta)?.deleteResourceHandler(row.original.id)
          }
        >
          <span>삭제</span>
        </button>
      </div>
    ),
  },
];