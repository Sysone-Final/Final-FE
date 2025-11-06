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
import { Plus, Loader2 } from 'lucide-react'; 

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
 const [keyword, setkeyword] = useState('');
 const [statusFilter, setStatusFilter] = useState('');
 const [typeFilter, setTypeFilter] = useState("");
  // TODO(user): locationFilter 상태 추가
 
 // API 호출 지연을 위한 Debounce
 const debouncedkeyword = useDebounce(keyword, 300);

 // API에 전달할 필터 객체 (Memoize)
 const filters = useMemo((): ResourceListFilters => ({
  keyword: debouncedkeyword,
  status: statusFilter,
  type: typeFilter,
  // location: locationFilter, // TODO
 }), [debouncedkeyword, statusFilter ,typeFilter,/* TODO:  locationFilter */]);

 // --- 데이터 페칭 ---
 const { 
  data: paginatedData, 
  isLoading, // ⬅️ 캐시/placeholderData가 없을 때 (최초 로딩)
  isFetching, // ⬅️ 백그라운드 갱신 포함 모든 API 호출 시
  isError, // ⬅️ [리팩토링 1] 에러 상태 추가
 } = useGetResourceList(
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
  data: resourceData, // ⬅️ placeholderData 덕분에 isFetching 중에도 이전 데이터 유지
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

 const isInitialLoading = isLoading; 
 
 const isBackgroundFetching = isFetching && !isLoading;
 
 const isMutating = deleteMultipleResourcesMutation.isPending;
 

 return (
  // 전체 레이아웃 (ServerRoomDashboard와 동일)
  <div className="tab-layout">

   {/* 헤더 스타일 적용 (ServerRoomDashboard와 동일) */}
   <header className="tab-header">
    <div>
     {/* 제목 */}
     <h1 className="text-main-title tab-title">자원 관리 목록</h1>
     {/* 부제목 */}
     <p className="tab-subtitle text-body-primary text-gray-400">데이터 센터의 모든 하드웨어 자산을 효율적으로 관리하세요.</p>
    </div>
    
    {/* --- ⬇️ [리팩토링 1] 버튼과 스피너를 묶기 위한 div --- */}
    <div className="flex items-center gap-4">
     {/* 백그라운드 로딩 스피너 */}
     {isBackgroundFetching && (
      <div className="flex items-center text-gray-400 text-sm">
       <Loader2 size={18} className="animate-spin mr-2" />
       <span>갱신 중...</span>
      </div>
     )}
     
     {/* "자산 추가" 버튼 */}
     <button
      onClick={addResourceHandler} // 핸들러 연결
      className="btn-create px-4 py-3"
     >
      <Plus size={18} className="inline mr-1" /> {/* 아이콘 추가 */}
      자산 추가
     </button>
    </div>
    {/* --- ⬆️ [리팩토링 1] --- */}
   </header>

   {/* 메인 컨텐츠 영역 */}
   <main className="flex-1 overflow-y-auto p-8">
    {/* 필터 (제목과 버튼 없음) */}
    <ResourceFilters
     keyword={keyword}
     onSearchChange={setkeyword}
     statusFilter={statusFilter}
     onStatusChange={setStatusFilter}
    typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        // TODO: type, location 필터 props 전달
    />

    {/* 테이블 (위아래 간격 추가) */}
    <div className="mt-6">
     {/* --- ⬇️ [리팩토링 1] 로딩 UI 로직 변경 --- */}
     {isInitialLoading ? (
      // 1. 최초 로딩: 스켈레톤 UI를 보여주기 위해 isLoading=true 전달
      <ResourceTable table={table} isLoading={true} />
     ) : isError ? (
      // 2. 에러 발생
      <div className="text-center py-10 text-red-400 text-placeholder">
       데이터 로딩 중 오류가 발생했습니다.
      </div>
     ) : (
      // 3. 데이터 있음 (백그라운드 갱신 포함)
      // 
      // isMutating(삭제 등)일 때 테이블을 흐리게 처리
      <div className={isMutating ? "opacity-50 pointer-events-none" : ""}>
       <ResourceTable table={table} isLoading={false} />
      </div>
     )}
     {/* --- ⬆️ [리팩토링 1] --- */}
    </div>

    {/* 페이지네이션 및 액션 (위아래 간격 추가) */}
    <div className="mt-6">
     <ResourcePaginationActions
      table={table}
      onDeleteSelectedHandler={deleteSelectedHandler}
      // --- ⬇️ [리팩토링 1] 로딩/뮤테이션 중 페이지네이션 비활성화 ---
      disabled={isInitialLoading || isMutating}
      // --- ⬆️ [리팩토링 1] ---
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