import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { DataTablePaginationProps } from '../types/table';

/**
 * 재사용 가능한 데이터 테이블 페이지네이션 컴포넌트
 * 
 * @template TData - 테이블 데이터 타입
 * @param table - TanStack Table 인스턴스
 * @param showSelectedCount - 선택된 행 개수 표시 여부
 * @param showPageSizeSelector - 페이지 크기 선택 표시 여부
 * @param pageSizeOptions - 페이지 크기 옵션
 * @param disabled - 비활성화 여부
 */
export default function DataTablePagination<TData>({
  table,
  showSelectedCount = true,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 30, 50],
  disabled = false,
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getSelectedRowModel().rows.length;
  const currentPageSize = table.getState().pagination.pageSize;

  return (
    <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* 왼쪽: 선택된 행 정보 및 페이지 크기 선택 */}
      <div className="flex items-center gap-4">
        {/* 선택된 행 개수 */}
        {showSelectedCount && (
          <span className="text-body-primary text-sm">
            {selectedCount}개 항목 선택됨
          </span>
        )}

        {/* 페이지 크기 선택 */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <label 
              htmlFor="pageSize" 
              className="text-body-primary text-sm"
            >
              페이지당:
            </label>
            <select
              id="pageSize"
              value={currentPageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              disabled={disabled}
              className="border border-gray-700 rounded-lg py-1 px-2 text-sm disabled:opacity-50 bg-gray-800 text-gray-50"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}개
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 오른쪽: 페이지네이션 컨트롤 */}
      <div className="flex items-center gap-1">
        {/* 첫 페이지 */}
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage() || disabled}
          className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300"
          aria-label="첫 페이지로 이동"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* 이전 페이지 */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || disabled}
          className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300"
          aria-label="이전 페이지로 이동"
        >
          <ChevronLeft size={18} />
        </button>

        {/* 페이지 정보 */}
        <span className="text-body-primary text-sm mx-2">
          페이지{' '}
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>
          {' / '}
          {table.getPageCount() || 1}
        </span>

        {/* 다음 페이지 */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || disabled}
          className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300"
          aria-label="다음 페이지로 이동"
        >
          <ChevronRight size={18} />
        </button>

        {/* 마지막 페이지 */}
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage() || disabled}
          className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300"
          aria-label="마지막 페이지로 이동"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
