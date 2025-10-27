
import type { ColumnDef } from '@tanstack/react-table';
import type { Resource, ResourceStatus, ResourceTableMeta } from '../types/resource.types';
import HeaderCheckbox from './HeaderCheckbox';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';

const statusColorMap: Record<ResourceStatus, string> = {
 'NORMAL': 'bg-green-100 text-green-800',
 'MAINTENANCE': 'bg-orange-100 text-orange-800',
 'INACTIVE': 'bg-gray-100 text-gray-800',
 'DISPOSED': 'bg-red-100 text-red-800',
};

// NOTE(user): 컬럼 정의 (새 타입 기준)
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
  enableSorting: false,
  enableHiding: false, 
 },
 {
  accessorKey: 'equipmentName', // assetName -> equipmentName
  header: ({ column }) => {
   return (
    <button
     className="flex items-center hover:text-gray-700" 
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
      statusColorMap[status] ?? statusColorMap['INACTIVE']
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
  accessorKey: 'modelName', // model -> modelName
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
     className="text-gray-600 hover:text-blue-600"
     onClick={() => 
      (table.options.meta as ResourceTableMeta)?.editResourceHandler(row.original)
     }
     aria-label={`${row.original.equipmentName} 수정`} //  assetName -> equipmentName
    >
     <Pencil size={16} />
    </button>
    <button
     className="text-gray-600 hover:text-red-600"
     onClick={() => 
      (table.options.meta as ResourceTableMeta)?.deleteResourceHandler(row.original.id)
     }
     aria-label={`${row.original.equipmentName} 삭제`} //  assetName -> equipmentName
    >
     <Trash2 size={16} />
    </button>
   </div>
  ),
  enableSorting: false, 
 },
];