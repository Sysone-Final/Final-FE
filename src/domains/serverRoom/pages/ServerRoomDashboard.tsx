import React, { useState, useMemo } from 'react';
import ServerRoomList from '../components/ServerRoomList';
import ServerRoomCreateModal from '../components/ServerRoomCreateModal';
import { useServerRooms } from '../hooks/useServerRoomQueries';
import { useAuthStore } from '../../login/store/useAuthStore';
import '../css/serverRoomDashboard.css'; 

const ServerRoomDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // 로그인한 사용자의 회사 ID 가져오기
  const { user } = useAuthStore();
  const companyId = user?.companyId;
  
  const { data: serverRooms = [], isLoading, isError, error } = useServerRooms(companyId!);

  const stats = useMemo(() => {
    const totalRooms = serverRooms.length;
    const totalRacks = serverRooms.reduce((sum, room) => sum + room.rackCount, 0);
    // 상태값 비교 시 대소문자 구분 주의 (예: 'Normal' vs 'normal')
    const normalStatus = serverRooms.filter(room => room.status.toLowerCase() === 'normal').length;
    const needAttention = serverRooms.filter(room => ['warning', 'critical'].includes(room.status.toLowerCase())).length;
    return { totalRooms, totalRacks, normalStatus, needAttention };
  }, [serverRooms]);

  // companyId! (변경예정)
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

  // 로딩 상태 처리 (변경예정)
  if (isLoading) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-gray-400">서버실 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리 (변경예정)
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
          {/* 텍스트 클래스 적용 */}
          <h1 className="tab-title text-main-title">서버실 관리</h1>
          {/* 텍스트 클래스 및 색상 조정 */}
          <p className="tab-subtitle text-body-primary text-gray-400">데이터 센터 인프라를 모니터링하고 관리하세요</p>
        </div>
        <button 
          className="btn-create px-4 py-3"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + 새 서버실 추가
        </button>
      </header>
      
      {/* Main Content */}
      <main className="dashboard-main">
        <ServerRoomList rooms={serverRooms} />

        {/* Statistics Section */}
        <section className="statistics-section">
          {/* 텍스트 클래스 적용 */}
          <h2 className="statistics-title text-subtitle">전체 통계</h2>
          <div className="stats-grid">
            {/* Stat Item 1 */}
            <div className="stat-item">
              {/* 텍스트 클래스 적용 */}
              <span className="stat-value text-gray-50">{stats.totalRooms}</span>
              {/* 텍스트 클래스 및 색상 조정 */}
              <span className="stat-label text-body-primary text-gray-400">총 서버실</span>
            </div>
            
            {/* Stat Item 2 */}
            <div className="stat-item">
               {/* 텍스트 클래스 적용 */}
              <span className="stat-value text-gray-50">{stats.totalRacks}</span>
               {/* 텍스트 클래스 및 색상 조정 */}
              <span className="stat-label text-body-primary text-gray-400">총 랙 수</span>
            </div>
            
            {/* Stat Item 3 */}
            <div className="stat-item">
              {/* 상태별 색상 클래스 직접 적용 */}
              <span className="stat-value stat-value-success">{stats.normalStatus}</span>
               {/* 텍스트 클래스 및 색상 조정 */}
              <span className="stat-label text-body-primary text-gray-400">정상 상태</span>
            </div>
            
            {/* Stat Item 4 */}
            <div className="stat-item">
              {/* 상태별 색상 클래스 직접 적용 */}
              <span className="stat-value stat-value-warning">{stats.needAttention}</span>
               {/* 텍스트 클래스 및 색상 조정 */}
              <span className="stat-label text-body-primary text-gray-400">주의 필요</span>
            </div>
          </div>
        </section>
      </main>

      {/* 서버실 생성 모달 */}
      <ServerRoomCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ServerRoomDashboard;