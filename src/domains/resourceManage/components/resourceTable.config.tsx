
import type { ColumnDef } from '@tanstack/react-table';
import type { Resource, ResourceStatus, ResourceTableMeta } from '../types/resource.types';
import HeaderCheckbox from './HeaderCheckbox';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';

// 상태 Badge 다크 모드 색상 맵
const statusColorMap: Record<ResourceStatus, string> = {
  'NORMAL': 'bg-green-700 text-green-100',
   'WARNING': 'bg-yellow-600 text-yellow-100',
 'ERROR': 'bg-red-800 text-red-100', 
  'MAINTENANCE': 'bg-orange-700 text-orange-100',
 'POWERED_OFF': 'bg-gray-700 text-gray-100',
 'DECOMMISSIONED': 'bg-red-700 text-red-100',
};

// NOTE(user): 컬럼 정의 (새 타입 기준)
export const columns: ColumnDef<Resource>[] = [
 {
  id: 'select',
  header: ({ table }) => <HeaderCheckbox table={table} />,
  cell: ({ row }) => (
   <input
    type="checkbox"
    className="rounded border-gray-600 bg-gray-700 focus:ring-slate-300/40" // 다크 모드 스타일    checked={row.getIsSelected()}
    disabled={!row.getCanSelect()}
    onChange={row.getToggleSelectedHandler()}
   />
  ),
  enableSorting: false,
  enableHiding: false, 
 },
 {
  accessorKey: 'equipmentName', 
  header: ({ column }) => {
   return (
    <button
     className="flex items-center hover:text-gray-300 text-gray-400" 
     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
     장비명
     <ArrowUpDown className="ml-2 h-4 w-4" />
    </button>
   )
  },
 },
 {
  accessorKey: 'status',
  header: '상태', 
  cell: ({ getValue }) => {
   const status = getValue<ResourceStatus>();
   return (
    <span
     className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
      statusColorMap[status] ?? statusColorMap['POWERED_OFF']
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
  accessorKey: 'modelName', 
  header: '모델명',
 },
  {
  accessorKey: 'manufacturer', //  제조사
  header: '제조사',
 },
 {
  accessorKey: 'location',
  header: '위치', // TODO(user): rackId, startUnit 등으로 조합해서 표시
 },
 {
  id: 'manage',
  header: '관리',
  cell: ({ row, table }) => (
   <div className="flex gap-2">
    <button
     className="text-gray-400 hover:text-blue-400"
     onClick={() => 
      (table.options.meta as ResourceTableMeta)?.editResourceHandler(row.original)
     }
     aria-label={`${row.original.equipmentName} 수정`} 
    >
     <Pencil size={16} />
    </button>
    <button
  className="text-gray-400 hover:text-red-400"
  onClick={() => 
   (table.options.meta as ResourceTableMeta)?.openDeleteModal(row.original)
  }
  aria-label={`${row.original.equipmentName} 삭제`}
  >
  <Trash2 size={16} />
  </button>
   </div>
  ),
  enableSorting: false, 
 },
];