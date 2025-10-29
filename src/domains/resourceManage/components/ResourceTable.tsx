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
      <div className="text-center py-10 text-gray-400 text-placeholder">
        자원을 불러오는 중...
      </div>
    );
  }

  return (
    // NOTE(user): 공통 레이아웃에 맞춰 배경/그림자 조정 (예: bg-white shadow-md rounded-lg)
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md border border-gray-700"> 
      <table className="min-w-full divide-y divide-gray-700">
        {/* 테이블 헤더 다크 모드 */}
        <thead className="bg-gray-900"> 
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<Resource>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  // 헤더 텍스트 색상
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" 
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
        {/* 테이블 바디 다크 모드 */}
        <tbody className="bg-gray-800 divide-y divide-gray-700"> 
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row: Row<Resource>) => (
              // 행 호버 색상
              <tr key={row.id} className="hover:bg-gray-700"> 
                {row.getVisibleCells().map((cell: Cell<Resource, unknown>) => (
                  <td
                    key={cell.id}
                    // 셀 텍스트 색상
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300" 
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
                // 빈 테이블 텍스트 색상 및 클래스
                className="text-center py-10 text-gray-500 text-placeholder" 
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