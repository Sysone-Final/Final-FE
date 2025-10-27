import type { Table } from '@tanstack/react-table';
// 사용하지 않는 ResourceStatus 임포트 삭제
import type { Resource } from '../types/resource.types';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2
} from 'lucide-react';

interface ResourcePaginationActionsProps {
  table: Table<Resource>;
  onDeleteSelectedHandler: () => void;
  // TODO(user): 대량 상태 변경 핸들러 추가
  // onStatusChangeSelectedHandler: (newStatus: ResourceStatus) => void;
}

export default function ResourcePaginationActions({
  table,
  onDeleteSelectedHandler
  // TODO: onStatusChangeSelectedHandler
}: ResourcePaginationActionsProps) {
  const selectedCount = table.getSelectedRowModel().rows.length;

  // TODO(user): 대량 상태 변경 로직
  // const handleBulkStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => { ... }

  return (
    <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* --- Bulk Actions --- */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">{selectedCount} 개 항목 선택됨:</span>
        <button
          disabled={selectedCount === 0}
          className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          onClick={onDeleteSelectedHandler}
        >
          <Trash2 size={14} className="mr-1" />
          <span>삭제</span>
        </button>
        <select
          disabled={selectedCount === 0}
          className="border border-gray-300 rounded-lg py-1 px-2 text-sm disabled:opacity-50"
          // onChange={handleBulkStatusChange} // TODO
          // value=""
        >
          <option value="">상태 변경</option>
          <option value="정상">정상</option>
          <option value="경고">경고</option>
          <option value="정보 필요">정보 필요</option>
          <option value="미할당">미할당</option>
        </select>
      </div>

      {/* --- Pagination Control --- */}
      <div className="flex items-center gap-1">
         {/* ... 페이지네이션 버튼들 ... */}
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" aria-label="첫 페이지로 이동"> <ChevronsLeft size={18} /> </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" aria-label="이전 페이지로 이동"> <ChevronLeft size={18} /> </button>
        <span className="text-sm text-gray-700"> 페이지{' '} <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> {' / '} {table.getPageCount() || 1} </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" aria-label="다음 페이지로 이동"> <ChevronRight size={18} /> </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" aria-label="마지막 페이지로 이동"> <ChevronsRight size={18} /> </button>
      </div>
    </div>
  );
}