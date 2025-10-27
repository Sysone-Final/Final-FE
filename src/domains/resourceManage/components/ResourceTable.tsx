import { flexRender } from '@tanstack/react-table';
import type {
  Table as TanStackTable,
  HeaderGroup,
  Row,
  Cell,
} from '@tanstack/react-table';
import type { Resource } from '../types/resource.types';
import { columns } from './resourceTable.config';

interface ResourceTableProps {
  table: TanStackTable<Resource>;
  isLoading: boolean;
}

export default function ResourceTable({ table, isLoading }: ResourceTableProps) {
  if (isLoading) {
     // TODO(user): 공통 스켈레톤 UI 컴포넌트로 대체
    return (
      <div className="text-center py-10 text-gray-500">
        자원을 불러오는 중...
      </div>
    );
  }

  return (
    // NOTE(user): 공통 레이아웃에 맞춰 배경/그림자 조정 (예: bg-white shadow-md rounded-lg)
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<Resource>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row: Row<Resource>) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell: Cell<Resource, unknown>) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-500"
              >
                표시할 자원이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}