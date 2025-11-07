import { flexRender } from '@tanstack/react-table';
import type {
  HeaderGroup,
  Row,
  Cell,
} from '@tanstack/react-table';
import type { CommonTableProps } from '../types/types';

/**
 * 테이블 스켈레톤 UI를 위한 단일 행
 */
interface SkeletonRowProps {
  columnCount: number;
  cellClassName?: string;
}

const SkeletonRow = ({ columnCount, cellClassName }: SkeletonRowProps) => {
  const cells = Array.from({ length: columnCount }, (_, i) => (
    <td key={i} className={cellClassName || "px-6 py-4 whitespace-nowrap"}>
      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
    </td>
  ));
  return <tr className="hover:bg-gray-700">{cells}</tr>;
};

/**
 * 공통 테이블 컴포넌트
 * 
 * @template TData - 테이블 데이터 타입
 * 
 * @example
 * ```tsx
 * // 1. 컬럼 정의 (각 도메인에서)
 * const columns: ColumnDef<User>[] = [
 *   { accessorKey: 'name', header: '이름' },
 *   { accessorKey: 'email', header: '이메일' },
 * ];
 * 
 * // 2. 테이블 인스턴스 생성
 * const table = useReactTable({
 *   data,
 *   columns,
 *   getCoreRowModel: getCoreRowModel(),
 * });
 * 
 * // 3. 공통 테이블 사용
 * <CommonTable 
 *   table={table} 
 *   isLoading={isLoading}
 *   emptyMessage="사용자가 없습니다."
 * />
 * ```
 */
export default function CommonTable<TData>({
  table,
  isLoading = false,
  emptyMessage = '데이터가 없습니다.',
  skeletonRows = 5,
  containerClassName,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
}: CommonTableProps<TData>) {
  const columnCount = table.getAllColumns().length;

  // 기본 스타일 (다크모드)
  const defaultContainerClass = "overflow-x-auto bg-gray-800 rounded-lg shadow-md border border-gray-700";
  const defaultHeaderClass = "bg-gray-900";
  const defaultBodyClass = "bg-gray-800 divide-y divide-gray-700";
  const defaultRowClass = "hover:bg-gray-700";
  const defaultCellClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-300";

  return (
    <div className={containerClassName || defaultContainerClass}>
      <table className="min-w-full divide-y divide-gray-700">
        {/* 테이블 헤더 */}
        <thead className={headerClassName || defaultHeaderClass}>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
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

        {/* 테이블 바디 */}
        <tbody className={bodyClassName || defaultBodyClass}>
          {isLoading ? (
            // 로딩 중: 스켈레톤 표시
            Array.from({ length: skeletonRows }, (_, i) => (
              <SkeletonRow 
                key={i} 
                columnCount={columnCount} 
                cellClassName={cellClassName || defaultCellClass}
              />
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            // 데이터 있음: 실제 데이터 표시
            table.getRowModel().rows.map((row: Row<TData>) => (
              <tr key={row.id} className={rowClassName || defaultRowClass}>
                {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                  <td
                    key={cell.id}
                    className={cellClassName || defaultCellClass}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // 데이터 없음: 빈 상태 메시지
            <tr>
              <td
                colSpan={columnCount}
                className="text-center py-10 text-gray-500 text-placeholder"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
