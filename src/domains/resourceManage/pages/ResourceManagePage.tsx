import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { 
  PaginationState, 
  RowSelectionState, 
  SortingState 
} from '@tanstack/react-table';

import ResourceFilters from '../components/ResourceFilters';
import ResourceTable from '../components/ResourceTable';
import ResourcePaginationActions from '../components/ResourcePaginationActions';
import ResourceFormModal from '../components/ResourceFormModal';
import { columns } from '../components/resourceTable.config';
import { 
  useGetResourceList, 
  useDeleteResource,
  useDeleteMultipleResources
} from '../hooks/useResourceQueries';
import type { ResourceListFilters, Resource, ResourceTableMeta } from '../types/resource.types';
import { useDebounce } from '../hooks/useDebounce'; // Debounce 훅 임포트 확인

export default function ResourceManagePage() {
  // --- 상태 관리 ---
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // 검색/필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // TODO(user): typeFilter, locationFilter 상태 추가
  
  // API 호출 지연을 위한 Debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms 지연

  // API에 전달할 필터 객체 (Memoize)
  const filters = useMemo((): ResourceListFilters => ({
    searchTerm: debouncedSearchTerm,
    status: statusFilter,
    // type: typeFilter, // TODO
    // location: locationFilter, // TODO
  }), [debouncedSearchTerm, statusFilter /* TODO: typeFilter, locationFilter */]);

  // --- 데이터 페칭 ---
  const { data: paginatedData, isLoading, isFetching } = useGetResourceList(
    pagination.pageIndex,
    pagination.pageSize,
    filters
  );
  const deleteResourceMutation = useDeleteResource();
  const deleteMultipleResourcesMutation = useDeleteMultipleResources();
  // TODO(user): 대량 상태 변경을 위한 useMutation 추가

  const resourceData = paginatedData?.content ?? [];
  const totalPageCount = paginatedData?.totalPages ?? 0;

  // --- 이벤트 핸들러 ---
  const addResourceHandler = () => {
    setSelectedResource(null);
    setIsModalOpen(true);
  };

  const editResourceHandler = (resource: Resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const deleteResourceHandler = (resourceId: string) => {
    if (window.confirm(`[ID: ${resourceId}] 자산을 삭제하시겠습니까? (MSW)`)) {
      deleteResourceMutation.mutate(resourceId);
    }
  };
  
  const deleteSelectedHandler = () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
    // getSelectedRowModel().flatRows 대신 위 방법 사용 권장
    
    if (selectedIds.length === 0) {
      alert("삭제할 자산을 선택해주세요.");
      return;
    }
    
    if (window.confirm(`${selectedIds.length}개의 자산을 삭제하시겠습니까? (MSW)`)) {
      deleteMultipleResourcesMutation.mutate(selectedIds, {
        onSuccess: () => {
          setRowSelection({}); // 성공 시 선택 상태 초기화
          table.resetRowSelection(); // TanStack Table v8+ 권장 방식
        } 
      });
    }
  };

  // TODO(user): 대량 상태 변경 핸들러 구현
  // const statusChangeSelectedHandler = (newStatus: ResourceStatus) => { ... }

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  // --- 테이블 인스턴스 ---
  const table = useReactTable({
    data: resourceData,
    columns,
    state: {
      pagination,
      rowSelection,
      sorting,
    },
    // 핸들러 연결
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    // 모델 연결
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 페이지 카운트 및 수동 페이지네이션 설정
    pageCount: totalPageCount,
    manualPagination: true,
    // 기타 옵션
    enableRowSelection: true, // 행 선택 활성화 (기본값)
    // manualSorting: false, // 서버 사이드 정렬 시 true로 설정
    meta: {
      editResourceHandler,
      deleteResourceHandler,
    } as ResourceTableMeta,
  });

  // 로딩 상태 결정 (데이터 로딩 중 또는 대량 삭제 진행 중)
  const isProcessing = isLoading || isFetching || deleteMultipleResourcesMutation.isPending;

  return (
    <div className="p-4 md:p-8 space-y-4">
      <ResourceFilters 
        onAddResourceHandler={addResourceHandler}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        // TODO: type, location 필터 props 전달
      />
      {/* TODO(user): 공통 스켈레톤 UI 컴포넌트 적용 */}
      {/* <ResourceTable table={table} isLoading={isProcessing} /> */}
      {isProcessing ? (
          <div className="text-center py-10 text-gray-500">데이터 처리 중...</div>
      ) : (
          <ResourceTable table={table} isLoading={false} />
      )}

      <ResourcePaginationActions 
        table={table} 
        onDeleteSelectedHandler={deleteSelectedHandler}
        // TODO: onStatusChangeSelectedHandler 전달
      />
      
      <ResourceFormModal
        isOpen={isModalOpen}
        onCloseHandler={closeModalHandler}
        resource={selectedResource}
      />
    </div>
  );
}