import { useState, useMemo, useEffect } from 'react';
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
  useGetServerRoomsByCompany,
  RESOURCE_QUERY_KEY // import 추가 확인
} from '../hooks/useResourceQueries';
import { useAuthStore } from '@domains/login/store/useAuthStore';
import type { ResourceListFilters, Resource, ResourceTableMeta, PaginatedResourceResponse, ResourceStatus } from '../types/resource.types';
import { useDebounce } from '../hooks/useDebounce';
import { ConfirmationModal } from '@shared/ConfirmationModal';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Snackbar from '@shared/Snackbar';

export default function ResourceManagePage() {
  const queryClient = useQueryClient();
  
  // 로그인한 사용자의 회사 ID 가져오기
  const { user } = useAuthStore();
  const companyId = user?.companyId ?? null;
  
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

  // --- [중요 수정] 로그인한 사용자의 회사에 해당하는 서버실 데이터 로딩 ---
  const { 
    data: serverRoomGroups, 
    isLoading: isLoadingServerRooms 
  } = useGetServerRoomsByCompany(companyId);

  // API 호출 지연을 위한 Debounce
  const debouncedkeyword = useDebounce(keyword, 300);

  // API에 전달할 필터 객체 (Memoize)
  const filters = useMemo((): ResourceListFilters => ({
    keyword: debouncedkeyword,
    status: statusFilter,
    type: typeFilter,
    serverRoomId: serverRoomFilter,
  }), [debouncedkeyword, statusFilter, typeFilter, serverRoomFilter]);

  // --- 데이터 페칭 ---
  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetResourceList(
    pagination.pageIndex,
    pagination.pageSize,
    filters
  );

  useEffect(() => {
    if (isError && !isFetching && !errorToastId) {
      const id = toast.custom(
        (t) => (
          <Snackbar
            t={t}
            message="목록을 불러오지 못했습니다."
            actionText="다시 시도"
            onAction={() => {
              refetch();
              toast.dismiss(t.id);
              setErrorToastId(null);
            }}
          />
        ),
        { duration: Infinity },
      );
      setErrorToastId(id);
    } else if ((!isError || isFetching) && errorToastId) {
      toast.dismiss(errorToastId);
      setErrorToastId(null);
    }
  }, [isError, isFetching, refetch, errorToastId]);

  // [삭제됨] 여기에 있던 중복된 useGetServerRooms 호출 코드를 제거했습니다.

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    resource?: Resource;
    isBulk?: boolean;
  }>({ isOpen: false });

  const deleteResourceMutation = useDeleteResource();
  const deleteMultipleResourcesMutation = useDeleteMultipleResources();
  const updateStatusMutation = useUpdateMultipleResourceStatus();

  const resourceData = paginatedData?.content ?? [];
  const totalPageCount = paginatedData?.totalPages ?? 0;

  // --- 이벤트 핸들러 ---
  const addResourceHandler = () => {
    setSelectedResourceId(null);
    setIsModalOpen(true);
  };

  const editResourceHandler = (resource: Resource) => {
    setSelectedResourceId(resource.id);
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
      
      toast.custom(
        (t) => (
          <Snackbar
            t={t}
            message="자원이 삭제되었습니다."
            actionText="실행 취소"
            onAction={() => {
              clearTimeout(deleteTimer);
              queryClient.invalidateQueries({ queryKey });
              toast.dismiss(t.id);
              toast.success('삭제가 취소되었습니다.');
            }}
          />
        ),
        { duration: 5000 },
      );
    } else if (deleteModalState.isBulk) {
      const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
      const selectedCount = selectedIds.length;
      closeDeleteModal();

      const deleteTimer = setTimeout(() => {
        deleteMultipleResourcesMutation.mutate(selectedIds, {
          onSuccess: () => {
            setRowSelection({});
            table.resetRowSelection();
          },
        });
      }, 5000);

      queryClient.setQueryData(
        queryKey,
        (oldData: PaginatedResourceResponse | undefined) => {
          if (!oldData) return undefined;
          return {
            ...oldData,
            content: oldData.content.filter((r) => !selectedIds.includes(r.id)),
            totalElements: oldData.totalElements - selectedCount,
          };
        },
      );

      toast.custom(
        (t) => (
          <Snackbar
            t={t}
            message={`${selectedCount}개 자원이 삭제되었습니다.`}
            actionText="실행 취소"
            onAction={() => {
              clearTimeout(deleteTimer);
              queryClient.invalidateQueries({ queryKey });
              toast.dismiss(t.id);
              toast.success('삭제가 취소되었습니다.');
            }}
          />
        ),
        { duration: 5000 },
      );
    }
  };

  const handleBulkStatusChange = (newStatus: ResourceStatus) => {
    const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
    const selectedCount = selectedIds.length;

    if (selectedCount === 0) return;

    const queryKey = [
      RESOURCE_QUERY_KEY,
      pagination.pageIndex,
      pagination.pageSize,
      filters,
    ];

    const statusUpdateTimer = setTimeout(() => {
      updateStatusMutation.mutate({ ids: selectedIds, status: newStatus });
    }, 5000);

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

    toast.custom(
      (t) => (
        <Snackbar
          t={t}
          message={`${selectedCount}개 자산 상태가 변경되었습니다.`}
          actionText="실행 취소"
          onAction={() => {
            clearTimeout(statusUpdateTimer);
            queryClient.invalidateQueries({ queryKey });
            toast.dismiss(t.id);
            toast.success('상태 변경이 취소되었습니다.');
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
      openDeleteModal,
    } as ResourceTableMeta,
  });

  const isInitialLoading = isLoading;
  const isBackgroundFetching = isFetching && !isLoading;
  const isMutating = deleteMultipleResourcesMutation.isPending || updateStatusMutation.isPending;

  return (
    <div className="tab-layout">
      <header className="tab-header">
        <div>
          <h1 className="text-main-title tab-title">자원 관리 목록</h1>
          <p className="tab-subtitle text-body-primary text-gray-400">데이터 센터의 모든 하드웨어 자산을 효율적으로 관리하세요.</p>
        </div>
        <div className="flex items-center gap-4">
          {isBackgroundFetching && (
            <div className="flex items-center text-gray-400 text-sm">
              <Loader2 size={18} className="animate-spin mr-2" />
              <span>갱신 중...</span>
            </div>
          )}
          <button onClick={addResourceHandler} className="btn-create px-4 py-3">
            <Plus size={18} className="inline mr-1" /> 자산 추가
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <ResourceFilters
          searchTerm={keyword}
          onSearchChange={setkeyword}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          serverRoomFilter={serverRoomFilter}
          onServerRoomChange={setServerRoomFilter}
          serverRoomGroups={serverRoomGroups}
          isLoadingServerRooms={isLoadingServerRooms}
        />

        <div className="mt-6">
          {isInitialLoading ? (
            <ResourceTable table={table} isLoading={true} />
          ) : (isError && !paginatedData?.content?.length) ? (
            <div className="text-center py-10 text-red-400 text-placeholder">
              데이터 로딩 중 오류가 발생했습니다.
            </div>
          ) : (
            <div className={isMutating ? "opacity-50 pointer-events-none" : ""}>
              <ResourceTable table={table} isLoading={false} />
            </div>
          )}
        </div>

        <div className="mt-6">
          <ResourcePaginationActions
            table={table}
            onDeleteSelectedHandler={openBulkDeleteModal}
            onStatusChangeSelectedHandler={handleBulkStatusChange}
            disabled={isInitialLoading || isMutating}
          />
        </div>
      </main>

      <ResourceWizardModal
        isOpen={isModalOpen}
        onCloseHandler={closeModalHandler}
        resourceId={selectedResourceId}
        isUnallocated={false} // 새 자산 추가 시에도 위치 할당 가능하게 설정
      />

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
      </ConfirmationModal>
    </div>
  );
}