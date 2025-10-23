import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { PaginationState, RowSelectionState } from '@tanstack/react-table';

import ResourceFilters from '../components/ResourceFilters';
import ResourceTable from '../components/ResourceTable';
import ResourcePaginationActions from '../components/ResourcePaginationActions';
import ResourceFormModal from '../components/ResourceFormModal';
import { columns } from '../components/resourceTable.config';
// import { useDeleteResource } from '../hooks/useResourceQueries';
import type { Resource, ResourceTableMeta } from '../types/resource.types';

//  --- MOCK DATA  ---
const MOCK_DATA: Resource[] = [
  { id: '1', assetName: 'DB-Server-01', status: '정상', ipAddress: '192.168.1.101', model: 'Dell PowerEdge R740', location: 'IDC A-Zone, Rack A-01, U:22' },
  { id: '2', assetName: 'Web-Server-02', status: '경고', ipAddress: '192.168.1.102', model: 'HP ProLiant DL380', location: 'IDC A-Zone, Rack A-02, U:15' },
  { id: '3', assetName: 'Switch-Core-01', status: '정보 필요', ipAddress: '192.168.1.103', model: 'Cisco Catalyst 9300', location: 'IDC B-Zone, Rack B-01, U:42' },
  { id: '4', assetName: 'Storage-Array-01', status: '미할당', ipAddress: '192.168.1.104', model: 'NetApp FAS8200', location: 'IDC C-Zone, Rack C-01, U:35' },
  { id: '5', assetName: 'Firewall-01', status: '정상', ipAddress: '192.168.1.105', model: 'Fortinet FortiGate 600E', location: 'IDC A-Zone, Rack A-03, U:10' },
  { id: '6', assetName: 'Backup-Server-01', status: '경고', ipAddress: '192.168.1.106', model: 'IBM System x3650 M5', location: 'IDC B-Zone, Rack B-02, U:28' },
];
//  --- MOCK DATA 끝 ---

export default function ResourceManagePage() {
   // NOTE(user): TanStack Table 상태
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // NOTE(user): 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  //  ---  useQuery 훅 주석 처리 ---
  // NOTE(user): TanStack Query 훅 호출 (API 연결 시 주석 해제)
  // const { data: paginatedData, isLoading } = useGetResourceList(
  //   pagination.pageIndex,
  //   pagination.pageSize
  // );
  
//   const deleteResourceMutation = useDeleteResource();

  //  --- 3. Mock Data 사용 ---
  const isLoading = false; // 로딩 상태 강제
  const resourceData = MOCK_DATA; // 실제 데이터 대신 Mock 데이터 사용
  const totalPageCount = 1; // 가짜 페이지 카운트
  //  --- Mock Data 사용 끝 ---

  // NOTE(user): 이벤트 핸들러 (컨벤션)
  const addResourceHandler = () => {
    setSelectedResource(null); // 'Add' 모드
    setIsModalOpen(true);
  };

  const editResourceHandler = (resource: Resource) => {
    setSelectedResource(resource); // 'Edit' 모드
    setIsModalOpen(true);
  };

  const deleteResourceHandler = (resourceId: string) => {
    if (window.confirm('이 자산을 삭제하시겠습니까? (테스트)')) {
         // TODO(user): API 연결 시 아래 주석 해제
      // deleteResourceMutation.mutate(resourceId);
      console.log("테스트 삭제:", resourceId);
    }
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

// NOTE(user): TanStack Table 인스턴스 생성
  const table = useReactTable({
    data: resourceData,
    columns,
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: totalPageCount,
     //  수정: Mock Data는 클라이언트 사이드 페이징을 사용하므로 manualPagination 주석 처리
    // manualPagination: true, 
    meta: {
      editResourceHandler,
      deleteResourceHandler,
    } as ResourceTableMeta,
  });

  return (
    <div className="p-4 md:p-8 space-y-4">
      <ResourceFilters onAddResourceHandler={addResourceHandler} />
      <ResourceTable table={table} isLoading={isLoading} />
      <ResourcePaginationActions table={table} />
      
      <ResourceFormModal
        isOpen={isModalOpen}
        onCloseHandler={closeModalHandler}
        resource={selectedResource}
      />
    </div>
  );
}