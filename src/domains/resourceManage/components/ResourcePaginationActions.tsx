import type { Table } from '@tanstack/react-table';
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
 disabled?: boolean;
}

export default function ResourcePaginationActions({
 table,
 onDeleteSelectedHandler,
 disabled = false,
 // TODO: onStatusChangeSelectedHandler
}: ResourcePaginationActionsProps) {
 const selectedCount = table.getSelectedRowModel().rows.length;

 // TODO(user): 대량 상태 변경 로직
 // const handleBulkStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => { ... }

 return (
  <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
   {/* --- Bulk Actions --- */}
   <div className="flex items-center gap-2">
    {/* 텍스트 색상 및 클래스 */}
    <span className="text-body-primary">{selectedCount} 개 항목 선택됨:</span> 
    {/* 버튼 다크 모드 및 텍스트 클래스 */}
    <button
     disabled={selectedCount === 0 || disabled}
     className="flex items-center px-3 py-1 border border-gray-700 rounded-lg text-sm disabled:opacity-50 bg-gray-800 hover:bg-gray-700 text-button" // 다크 모드, 텍스트 클래스
     onClick={onDeleteSelectedHandler}
    >
     <Trash2 size={14} className="mr-1" />
     <span>삭제</span>
    </button>
    {/* Select 다크 모드 */}
    <select
     disabled={selectedCount === 0 || disabled}
     className="border border-gray-700 rounded-lg py-1 px-2 text-sm disabled:opacity-50 bg-gray-800 text-gray-50" // 다크 모드
     // onChange={handleBulkStatusChange} // TODO
     // value=""
    >
     <option value="">상태 변경</option>
     <option value="정상">정상</option>
     <option value="경고">경고</option>
     <option value="정보 필요">정보 필요</option>
     <option value="미할당">미할당</option>
     {/* <option value="MAINTENANCE">점검중</option>
     <option value="INACTIVE">비활성/재고</option>
     <option value="DISPOSED">폐기</option> */}
    </select>
   </div>

   {/* --- Pagination Control --- */}
   <div className="flex items-center gap-1">
     {/* 버튼 다크 모드, 아이콘 색상 */}
    <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage() || disabled} className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300" aria-label="첫 페이지로 이동"> <ChevronsLeft size={18} /> </button>
    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || disabled} className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300" aria-label="이전 페이지로 이동"> <ChevronLeft size={18} /> </button>
    {/* 텍스트 색상 및 클래스 */}
    <span className="text-body-primary"> 페이지{' '} <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> {' / '} {table.getPageCount() || 1} </span> 
    {/* 버튼 다크 모드, 아이콘 색상 */}
    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || disabled} className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300" aria-label="다음 페이지로 이동"> <ChevronRight size={18} /> </button>
    <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage() || disabled} className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300" aria-label="마지막 페이지로 이동"> <ChevronsRight size={18} /> </button>
   </div>
  </div>
 );
}