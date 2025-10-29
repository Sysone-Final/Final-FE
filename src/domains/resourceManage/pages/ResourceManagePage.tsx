import { useState, useMemo } from 'react';
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
import { Plus } from 'lucide-react'; 

import ResourceFilters from '../components/ResourceFilters';
import ResourceTable from '../components/ResourceTable';
import ResourcePaginationActions from '../components/ResourcePaginationActions';
import ResourceWizardModal from '../components/ResourceWizardModal';
import { columns } from '../components/resourceTable.config';
import {
  useGetResourceList,
  useDeleteResource,
  useDeleteMultipleResources
} from '../hooks/useResourceQueries';
import type { ResourceListFilters, Resource, ResourceTableMeta } from '../types/resource.types';
import { useDebounce } from '../hooks/useDebounce';

export default function ResourceManagePage() {
  // --- 상태 관리 ---
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // 검색/필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // TODO(user): typeFilter, locationFilter 상태 추가
  
  // API 호출 지연을 위한 Debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    setSelectedResourceId(null); // 추가 모드
    setIsModalOpen(true);
  };

  const editResourceHandler = (resource: Resource) => {
    setSelectedResourceId(resource.id); // 수정 모드
    setIsModalOpen(true);
  };

  const deleteResourceHandler = (resourceId: string) => {
    if (window.confirm(`[ID: ${resourceId}] 자산을 삭제하시겠습니까? (MSW)`)) {
      deleteResourceMutation.mutate(resourceId);
    }
  };
  
  const deleteSelectedHandler = () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
    
    if (selectedIds.length === 0) {
      alert("삭제할 자산을 선택해주세요.");
      return;
    }
    
    if (window.confirm(`${selectedIds.length}개의 자산을 삭제하시겠습니까? (MSW)`)) {
      deleteMultipleResourcesMutation.mutate(selectedIds, {
        onSuccess: () => {
          setRowSelection({}); // 성공 시 선택 상태 초기화
          table.resetRowSelection();
        } 
      });
    }
  };

  // TODO(user): 대량 상태 변경 핸들러 구현
  // const statusChangeSelectedHandler = (newStatus: ResourceStatus) => { ... }

  const closeModalHandler = () => {
    setIsModalOpen(false);
    setSelectedResourceId(null);
  };

  // --- 테이블 인스턴스 ---
  const table = useReactTable({
    data: resourceData,
    columns,
    state: { pagination, rowSelection, sorting },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: totalPageCount,
    manualPagination: true,
    enableRowSelection: true,
    meta: {
      editResourceHandler,
      deleteResourceHandler,
    } as ResourceTableMeta,
  });

  // 로딩 상태 결정
  const isProcessing = isLoading || isFetching || deleteMultipleResourcesMutation.isPending;

  return (
    // 전체 레이아웃 (ServerRoomDashboard와 동일)
    <div className="h-full w-full flex flex-col overflow-hidden">

      {/* 헤더 스타일 적용 (ServerRoomDashboard와 동일) */}
<header className="flex justify-between items-center px-8 py-6 flex-shrink-0 border-b border-white/10 backdrop-blur-sm bg-gray-900">        <div>
          {/* 제목 */}
          <h1 className="text-main-title">자원 관리 목록</h1>
          {/* 부제목  */}
          <p className="text-body-primary text-gray-400">데이터 센터의 모든 하드웨어 자산을 효율적으로 관리하세요.</p>
        </div>
        {/* "자산 추가" 버튼 */}
        <button
          onClick={addResourceHandler} // 핸들러 연결
          className="bg-blue-600 text-white border-none px-6 py-3 rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700 text-button"
        >
          <Plus size={18} className="inline mr-1" /> {/* 아이콘 추가 */}
          자산 추가
        </button>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* 필터 (제목과 버튼 없음) */}
        <ResourceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          // TODO: type, location 필터 props 전달
        />

        {/* 테이블 (위아래 간격 추가) */}
        <div className="mt-6">
          {isProcessing ? (
            <div className="text-center py-10 text-gray-400 text-placeholder">데이터 처리 중...</div>
          ) : (
            <ResourceTable table={table} isLoading={false} />
          )}
        </div>

        {/* 페이지네이션 및 액션 (위아래 간격 추가) */}
        <div className="mt-6">
          <ResourcePaginationActions
            table={table}
            onDeleteSelectedHandler={deleteSelectedHandler}
            // TODO: onStatusChangeSelectedHandler 전달
          />
        </div>
      </main>

      {/* 모달 */}
      <ResourceWizardModal
        isOpen={isModalOpen}
        onCloseHandler={closeModalHandler}
        resourceId={selectedResourceId}
      />
    </div>
  );
}
