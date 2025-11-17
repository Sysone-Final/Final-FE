import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';

import { DataTable, DataTablePagination } from '@/shared/table';
import { memberColumns } from '../components/memberTable.config';
import AddMemberModal from '../components/AddMemberModal';
import {
  useGetMemberList,
  useDeleteMember,
  useDeleteMultipleMembers,
} from '../hooks/useMemberQueries';
import type { Member, MemberTableMeta } from '../types/memberTypes';

export default function HumanResource() {
  // --- 상태 관리 ---
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- 데이터 페칭 ---
  const { data: memberData = [], isLoading, isError } = useGetMemberList();
  const deleteMemberMutation = useDeleteMember();
  const deleteMultipleMembersMutation = useDeleteMultipleMembers();

  // --- 이벤트 핸들러 ---
  const handleAddMember = () => {
    setIsAddModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    // TODO: 회원 수정 모달 열기
    alert(`회원 수정: ${member.name} (ID: ${member.id})`);
  };

  const handleDeleteMember = (id: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      deleteMemberMutation.mutate(id);
    }
  };

  const handleDeleteSelected = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (selectedIds.length === 0) {
      alert('삭제할 회원을 선택해주세요.');
      return;
    }

    if (
      window.confirm(`${selectedIds.length}명의 회원을 삭제하시겠습니까?`)
    ) {
      deleteMultipleMembersMutation.mutate(selectedIds, {
        onSuccess: () => {
          setRowSelection({});
          table.resetRowSelection();
        },
      });
    }
  };

  // --- 테이블 인스턴스 ---
  const table = useReactTable({
    data: memberData,
    columns: memberColumns,
    state: { pagination, rowSelection, sorting },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    meta: {
      onEdit: handleEditMember,
      onDelete: handleDeleteMember,
    } as MemberTableMeta,
  });

  const isMutating = deleteMultipleMembersMutation.isPending;
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="tab-layout">
      {/* 헤더 */}
      <header className="tab-header">
        <div>
          <h1 className="text-main-title tab-title">인사 관리</h1>
          <p className="tab-subtitle text-body-primary text-gray-400">
            시스템 사용자 및 권한을 관리하세요.
          </p>
        </div>

        <button onClick={handleAddMember} className="btn-create px-4 py-3">
          <Plus size={18} className="inline mr-1" />
          회원 추가
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* 대량 작업 버튼 */}
        {selectedCount > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-body-primary">
              {selectedCount}명 선택됨:
            </span>
            <button
              disabled={isMutating}
              className="flex items-center px-3 py-1 border border-gray-700 rounded-lg text-sm disabled:opacity-50 bg-gray-800 hover:bg-gray-700 text-button"
              onClick={handleDeleteSelected}
            >
              <Trash2 size={14} className="mr-1" />
              <span>선택 삭제</span>
            </button>
          </div>
        )}

        {/* 테이블 */}
        <div className={isMutating ? 'opacity-50 pointer-events-none' : ''}>
          <DataTable
            table={table}
            columns={memberColumns}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="등록된 회원이 없습니다."
            errorMessage="회원 목록을 불러오는 중 오류가 발생했습니다."
            skeletonRows={10}
          />
        </div>

        {/* 페이지네이션 */}
        <DataTablePagination
          table={table}
          showSelectedCount={false}
          showPageSizeSelector={true}
          pageSizeOptions={[10, 20, 30, 50]}
          disabled={isLoading || isMutating}
        />
      </main>

      {/* 회원 추가 모달 */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}