import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import ServerRoomList from '../components/ServerRoomList';
import ServerRoomCreateModal from '../components/ServerRoomCreateModal';
import ServerRoomEditModal from '../components/ServerRoomEditModal';
import DataCenterCreateModal from '../components/DataCenterCreateModal';
import { useServerRooms, useDeleteServerRoom } from '../hooks/useServerRoomQueries';
import { useAuthStore } from '@domains/login/store/useAuthStore';
import { ConfirmationModal } from '@/shared/ConfirmationModal';
import type { ServerRoom } from '../types';
import '../css/serverRoomDashboard.css'; 

const ServerRoomDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDataCenterCreateModalOpen, setIsDataCenterCreateModalOpen] = useState(false);
  const [selectedServerRoom, setSelectedServerRoom] = useState<ServerRoom | null>(null);
  const [selectedDataCenterId, setSelectedDataCenterId] = useState<number | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    serverRoom?: ServerRoom;
  }>({ isOpen: false });
  
  // 로그인한 사용자의 회사 ID 가져오기
  const { user } = useAuthStore();
  const companyId = user?.companyId;
  
  const { data: dataCenters = [], isLoading, isError, error } = useServerRooms(companyId!);
  const deleteMutation = useDeleteServerRoom();

  // 편집 모달 열기
  const handleOpenEditModal = (serverRoom: ServerRoom) => {
    setSelectedServerRoom(serverRoom);
    setIsEditModalOpen(true);
  };

  // 편집 모달 닫기
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedServerRoom(null);
  };

  // 삭제 모달 열기
  const handleOpenDeleteModal = (serverRoom: ServerRoom) => {
    setDeleteModalState({ isOpen: true, serverRoom });
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setDeleteModalState({ isOpen: false });
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (deleteModalState.serverRoom) {
      try {
        await deleteMutation.mutateAsync(deleteModalState.serverRoom.id);
        handleCloseDeleteModal();
      } catch (error) {
        console.error("서버실 삭제 실패:", error);
      }
    }
  };

  // 첫 번째 데이터센터를 기본으로 선택
  React.useEffect(() => {
    if (dataCenters.length > 0 && selectedDataCenterId === null) {
      setSelectedDataCenterId(dataCenters[0].dataCenterId);
    }
  }, [dataCenters, selectedDataCenterId]);

  // 선택된 데이터센터 필터링
  const filteredDataCenters = useMemo(() => {
    if (selectedDataCenterId === null) return dataCenters;
    return dataCenters.filter(dc => dc.dataCenterId === selectedDataCenterId);
  }, [dataCenters, selectedDataCenterId]);

  const stats = useMemo(() => {
    const dataToCalculate = filteredDataCenters;
    const totalRooms = dataToCalculate.reduce((sum, dc) => sum + dc.serverRooms.length, 0);
    const totalDataCenters = dataToCalculate.length;
    const activeRooms = dataToCalculate.reduce(
      (sum, dc) => sum + dc.serverRooms.filter(room => room.status === 'ACTIVE').length, 
      0
    );
    const maintenanceRooms = dataToCalculate.reduce(
      (sum, dc) => sum + dc.serverRooms.filter(room => room.status === 'MAINTENANCE').length, 
      0
    );
    
    return { totalRooms, totalDataCenters, activeRooms, maintenanceRooms };
  }, [filteredDataCenters]);

  // companyId 체크
  if (!companyId) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-red-400">
            회사 정보를 불러올 수 없습니다. 다시 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-gray-400">서버실 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-red-400">
            서버실 목록을 불러오는데 실패했습니다: {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-layout">
      {/* Header */}
      <header className="tab-header">
        <div>
          <h1 className="tab-title text-main-title">서버실 관리</h1>
          <p className="tab-subtitle text-body-primary text-gray-400">데이터 센터 인프라를 모니터링하고 관리하세요</p>
        </div>
          <button 
            className="btn-create px-4 py-3"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + 새 서버실 추가
          </button>
      </header>

      {/* Data Center Tabs */}
      <div className="datacenter-tabs">
        {dataCenters.map((dataCenter) => (
          <button
            key={dataCenter.dataCenterId}
            className={`datacenter-tab ${selectedDataCenterId === dataCenter.dataCenterId ? 'active' : ''}`}
            onClick={() => setSelectedDataCenterId(dataCenter.dataCenterId)}
          >
            <span>{dataCenter.dataCenterName} ({dataCenter.dataCenterCode})</span>
          </button>
        ))}
        {/* 데이터센터 추가 버튼 */}
        <button
          className="datacenter-tab"
          onClick={() => setIsDataCenterCreateModalOpen(true)}
          title="새 데이터센터 추가"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* Main Content */}
      <main className="dashboard-main">
        <ServerRoomList 
          dataCenters={filteredDataCenters}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteModal}
        />

        {/* Statistics Section */}
        <section className="statistics-section">
          <h2 className="statistics-title text-subtitle">전체 통계</h2>
          <div className="stats-grid">
            {/* Stat Item 1 */}
            {/* <div className="stat-item">
              <span className="stat-value text-gray-50">{stats.totalDataCenters}</span>
              <span className="stat-label text-body-primary text-gray-400">총 데이터센터</span>
            </div> */}
            
            {/* Stat Item 2 */}
            <div className="stat-item">
              <span className="stat-value text-gray-50">{stats.totalRooms}</span>
              <span className="stat-label text-body-primary text-gray-400">총 서버실</span>
            </div>
            
            {/* Stat Item 3 */}
            <div className="stat-item">
              <span className="stat-value stat-value-success">{stats.activeRooms}</span>
              <span className="stat-label text-body-primary text-gray-400">활성 상태</span>
            </div>
            
            {/* Stat Item 4 */}
            <div className="stat-item">
              <span className="stat-value stat-value-warning">{stats.maintenanceRooms}</span>
              <span className="stat-label text-body-primary text-gray-400">유지보수</span>
            </div>
          </div>
        </section>
      </main>

      {/* 서버실 생성 모달 */}
      <ServerRoomCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 데이터센터 생성 모달 */}
      <DataCenterCreateModal
        isOpen={isDataCenterCreateModalOpen}
        onClose={() => setIsDataCenterCreateModalOpen(false)}
      />

      {/* 서버실 수정 모달 */}
      <ServerRoomEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        serverRoom={selectedServerRoom}
      />

      {/* 서버실 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="서버실 삭제"
        confirmText="삭제"
        isDestructive={true}
      >
        <p>
          {deleteModalState.serverRoom?.name}서버실을 삭제하시겠습니까?
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default ServerRoomDashboard;