import { useState, useMemo ,useEffect} from 'react';
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
 useDeleteMultipleResources,
 useUpdateMultipleResourceStatus,
 useGetServerRooms,
} from '../hooks/useResourceQueries';
import type { ResourceListFilters, Resource, ResourceTableMeta } from '../types/resource.types';
import { useDebounce } from '../hooks/useDebounce';
import { ConfirmationModal } from '@shared/ConfirmationModal';
import { useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast'; 
import Snackbar from '@shared/Snackbar';
import { RESOURCE_QUERY_KEY } from '../hooks/useResourceQueries'; // (4)
import type { PaginatedResourceResponse, ResourceStatus, } from '../types/resource.types'; // (5)

export default function ResourceManagePage() {
    const queryClient = useQueryClient();
 // --- 상태 관리 ---
 const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
 const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
 const [sorting, setSorting] = useState<SortingState>([]);
 

 
 // 검색/필터 상태
 const [keyword, setkeyword] = useState('');
 const [statusFilter, setStatusFilter] = useState('');
 const [typeFilter, setTypeFilter] = useState("");
const [serverRoomFilter, setServerRoomFilter] = useState("");
const [errorToastId, setErrorToastId] = useState<string | null>(null);
 
 // API 호출 지연을 위한 Debounce
 const debouncedkeyword = useDebounce(keyword, 300);

 // API에 전달할 필터 객체 (Memoize)
 const filters = useMemo((): ResourceListFilters => ({
  keyword: debouncedkeyword,
  status: statusFilter,
  type: typeFilter,
    serverRoomId: serverRoomFilter,
  }), [debouncedkeyword, statusFilter, typeFilter, serverRoomFilter], 
  );

 // --- 데이터 페칭 ---
 const { 
  data: paginatedData, 
  isLoading, //  캐시/placeholderData가 없을 때 (최초 로딩)
  isFetching, //  백그라운드 갱신 포함 모든 API 호출 시
  isError, // 에러 상태 추가
  refetch
 } = useGetResourceList(
  pagination.pageIndex,
  pagination.pageSize,
  filters
 );

 useEffect(() => {
 // (A) 에러가 발생했고, 페칭 중이 아니며, 이미 뜬 토스트가 없을 때
 if (isError && !isFetching && !errorToastId) {
  const id = toast.custom(
   (t) => (
    <Snackbar
     t={t}
     message="목록을 불러오지 못했습니다."
     actionText="다시 시도"
     onAction={() => {
      refetch(); //  Retry 버튼 클릭 시 refetch!
      toast.dismiss(t.id);
      setErrorToastId(null); // (초기화)
     }}
    />
   ),
   { duration: Infinity }, // (Retry는 자동 종료 X)
  );
  setErrorToastId(id);
 } 
 //  에러가 아니거나 (성공) 페칭 중일 때, 기존 토스트가 있다면 닫기
 else if ((!isError || isFetching) && errorToastId) {
  toast.dismiss(errorToastId);
  setErrorToastId(null);
 }
}, [isError, isFetching, refetch, errorToastId]);

  const { data: serverRooms, isLoading: isLoadingServerRooms } =
    useGetServerRooms();

const [deleteModalState, setDeleteModalState] = useState<{
 isOpen: boolean;
 resource?: Resource; // 단일 삭제용
 isBulk?: boolean; // 대량 삭제용
}>({ isOpen: false });
    
 const deleteResourceMutation = useDeleteResource();
 const deleteMultipleResourcesMutation = useDeleteMultipleResources();
 const updateStatusMutation = useUpdateMultipleResourceStatus();

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


const deleteResourceHandler = (resourceId: number) => {
 deleteResourceMutation.mutate(resourceId);
};
const openDeleteModal = (resource: Resource) => {
 setDeleteModalState({ isOpen: true, resource });
};
const openBulkDeleteModal = () => {
 if (table.getSelectedRowModel().rows.length === 0) {
  alert("삭제할 자산을 선택해주세요.");
  return;
 }
 setDeleteModalState({ isOpen: true, isBulk: true });
};

const closeDeleteModal = () => {
 setDeleteModalState({ isOpen: false });
}; 

const handleConfirmDelete = () => {
  const queryKey = [
    RESOURCE_QUERY_KEY,
    pagination.pageIndex,
    pagination.pageSize,
    filters,
  ];

  if (deleteModalState.resource) {
    const resource = deleteModalState.resource;
    closeDeleteModal();

    const deleteTimer = setTimeout(() => {
      deleteResourceMutation.mutate(resource.id);
    }, 5000);

    queryClient.setQueryData(
      queryKey,
      (oldData: PaginatedResourceResponse | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          content: oldData.content.filter((r) => r.id !== resource.id),
          totalElements: oldData.totalElements - 1,
        };
      },
    );
    //  undo 스낵바 
    toast.custom(
      (t) => (
        <Snackbar
          t={t}
          message="자원이 삭제되었습니다."
          actionText="실행 취소"
          onAction={() => {
            clearTimeout(deleteTimer); // 타이머 취소
            queryClient.invalidateQueries({ queryKey }); // 데이터 복구
            toast.dismiss(t.id); // 스낵바 닫기

            toast.success('삭제가 취소되었습니다.');
          }}
        />
      ),
      { duration: 5000 },
    );
  } else if (deleteModalState.isBulk) {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    const selectedCount = selectedIds.length;
    closeDeleteModal();

    //  5초 후 실제 삭제 실행
    const deleteTimer = setTimeout(() => {
      deleteMultipleResourcesMutation.mutate(selectedIds, {
        onSuccess: () => {
          // 실제 삭제가 완료되면 선택 상태 초기화
          setRowSelection({});
          table.resetRowSelection();
        },
      });
    }, 5000);

    // UI에서 즉시 숨기기
    queryClient.setQueryData(
      queryKey,
      (oldData: PaginatedResourceResponse | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          content: oldData.content.filter(
            (r) => !selectedIds.includes(r.id),
          ),
          totalElements: oldData.totalElements - selectedCount,
        };
      },
    );

    //  undo 스낵바 
    toast.custom(
      (t) => (
        <Snackbar
          t={t}
          message={`${selectedCount}개 자원이 삭제되었습니다.`}
          actionText="실행 취소"
          onAction={() => {
            clearTimeout(deleteTimer); // 타이머 취소
            queryClient.invalidateQueries({ queryKey }); // 데이터 복구
            toast.dismiss(t.id); // 스낵바 닫기

         
            toast.success('삭제가 취소되었습니다.');
          }}
        />
      ),
      { duration: 5000 },
    );
  }
};


const handleBulkStatusChange = (newStatus: ResourceStatus) => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    const selectedCount = selectedIds.length;

    if (selectedCount === 0) return; // (안전 장치)

    // 쿼리 키 (삭제 핸들러와 동일)
    const queryKey = [
      RESOURCE_QUERY_KEY,
      pagination.pageIndex,
      pagination.pageSize,
      filters,
    ];

    // 5초 후 실제 API/DB 변경 실행
    const statusUpdateTimer = setTimeout(() => {
      updateStatusMutation.mutate({ ids: selectedIds, status: newStatus });
    }, 5000);

    // 낙관적 업데이트 (UI 즉시 변경)
    queryClient.setQueryData(
      queryKey,
      (oldData: PaginatedResourceResponse | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          content: oldData.content.map((r) =>
            selectedIds.includes(r.id) ? { ...r, status: newStatus } : r,
          ),
        };
      },
    );

    // "실행 취소" 스낵바 띄우기
    toast.custom(
      (t) => (
        <Snackbar
          t={t}
          message={`${selectedCount}개 자산 상태가 변경되었습니다.`}
          actionText="실행 취소"
          onAction={() => {
            clearTimeout(statusUpdateTimer); // 타이머 취소
            queryClient.invalidateQueries({ queryKey }); // 데이터 원상 복구 (refetch)
            toast.dismiss(t.id); // 스낵바 닫기
            toast.success('상태 변경이 취소되었습니다.'); // 취소 확인 알림
          }}
        />
      ),
      { duration: 5000 },
    );
  };

 const closeModalHandler = () => {
  setIsModalOpen(false);
  setSelectedResourceId(null);
 };

 // --- 테이블 인스턴스 ---
 const table = useReactTable({
  data: resourceData, //  placeholderData 덕분에 isFetching 중에도 이전 데이터 유지
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
 openDeleteModal, 
 } as ResourceTableMeta,
});

 const isInitialLoading = isLoading; 
 
 const isBackgroundFetching = isFetching && !isLoading;
 
const isMutating =
    deleteMultipleResourcesMutation.isPending ||
    updateStatusMutation.isPending;
 

 return (
  // 전체 레이아웃 
  <div className="tab-layout">

   {/* 헤더 스타일 */}
   <header className="tab-header">
    <div>
     {/* 제목 */}
     <h1 className="text-main-title tab-title">자원 관리 목록</h1>
     {/* 부제목 */}
     <p className="tab-subtitle text-body-primary text-gray-400">데이터 센터의 모든 하드웨어 자산을 효율적으로 관리하세요.</p>
    </div>
    
    {/* ---  버튼과 스피너를 묶기 위한 div --- */}
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
   </header>

   {/* 메인 컨텐츠 영역 */}
   <main className="flex-1 overflow-y-auto p-8">
    {/* 필터 (제목과 버튼 없음) */}
    <ResourceFilters
          searchTerm={keyword}
          onSearchChange={setkeyword}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        serverRoomFilter={serverRoomFilter}
        onServerRoomChange={setServerRoomFilter}
        serverRooms={serverRooms ?? []}
        isLoadingServerRooms={isLoadingServerRooms}
        />

    {/* 테이블 (위아래 간격 추가) */}
    <div className="mt-6">
     {isInitialLoading ? (
      // 1. 최초 로딩: 스켈레톤 UI를 보여주기 위해 isLoading=true 전달
      <ResourceTable table={table} isLoading={true} />
  ) : (isError && !paginatedData?.content?.length) ? (
  // (2. 에러인데 *보여줄 이전 데이터도 없을 때*만 에러 메시지)
  <div className="text-center py-10 text-red-400 text-placeholder">
   데이터 로딩 중 오류가 발생했습니다.
  </div>
  ) : (
  // (3. 성공 or 에러지만 이전 데이터가 있을 때 -> 테이블 정상 표시)
  <div className={isMutating ? "opacity-50 pointer-events-none" : ""}>
   <ResourceTable table={table} isLoading={false} />
  </div>
     )}
    </div>

    {/* 페이지네이션 및 액션 (위아래 간격 추가) */}
    <div className="mt-6">
    <ResourcePaginationActions
        table={table}
        onDeleteSelectedHandler={openBulkDeleteModal}
        // 5. [신규] 상태 변경 핸들러 prop 전달
        onStatusChangeSelectedHandler={handleBulkStatusChange}
        disabled={isInitialLoading || isMutating}
      />
    </div>
   </main>

{/* 모달 */}
 <ResourceWizardModal
  isOpen={isModalOpen}
  onCloseHandler={closeModalHandler}
  resourceId={selectedResourceId}
  // isUnallocated={!selectedResourceId}
  isUnallocated={false}
 />

    {/*  을 tab-layout div 안으로 이동 */}
 <ConfirmationModal
  isOpen={deleteModalState.isOpen}
  onClose={closeDeleteModal}
  onConfirm={handleConfirmDelete}
  title="자산 삭제"
  confirmText="삭제"
  isDestructive
 >
  {deleteModalState.isBulk
   ? `선택한 ${table.getSelectedRowModel().rows.length}개의 자산을 정말 삭제하시겠습니까?`
   : `[${deleteModalState.resource?.equipmentName}] 자산을 정말 삭제하시겠습니까?`}
  <br />
  {/* 이 작업은 되돌릴 수 없습니다. */}
</ConfirmationModal>

</div> 
);
} 