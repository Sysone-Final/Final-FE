
import React from 'react';
import type { Table } from '@tanstack/react-table';

import type { Resource } from '../types/resource.types';

// 아이콘 라이브러리 (lucide-react 등) 
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2 } from 'lucide-react';

interface ResourcePaginationActionsProps {
  table: Table<Resource>;
  // TODO(user): 대량 삭제, 상태 변경 핸들러 props로 받기
}

export default function ResourcePaginationActions({ table }: ResourcePaginationActionsProps) {
  // Prompt 3: Selection Status Text
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Prompt 3: Bulk Actions (Left-aligned) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">{selectedCount} 개 항목 선택됨:</span>
        <button
          disabled={selectedCount === 0}
          className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
        >
          {/* <Trash2 size={14} className="mr-1" /> */}
          <span>🗑️ 삭제</span>
        </button>
        <select
          disabled={selectedCount === 0}
          className="border border-gray-300 rounded-lg py-1 px-2 text-sm disabled:opacity-50"
        >
          <option>상태 변경</option>
          {/* ... */}
        </select>
      </div>

      {/* Prompt 3: Pagination Control (Right-aligned) */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {/* <ChevronsLeft size={18} /> */}
          <span>&lt;&lt;</span>
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {/* <ChevronLeft size={18} /> */}
          <span>&lt;</span>
        </button>
        
        {/* TODO(user): 더 나은 페이지 번호 로직 구현 (예: 1, 2, 3 ... 10) */}
        <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium">
          {table.getState().pagination.pageIndex + 1}
        </span>
        <span className="text-sm text-gray-600">
          / {table.getPageCount() || 1}
        </span>
        
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {/* <ChevronRight size={18} /> */}
          <span>&gt;</span>
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {/* <ChevronsRight size={18} /> */}
          <span>&gt;&gt;</span>
        </button>
      </div>
    </div>
  );
}