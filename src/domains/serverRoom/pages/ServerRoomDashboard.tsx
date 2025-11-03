import React, { useState, useEffect, useMemo } from 'react';
import ServerRoomList from '../components/ServerRoomList';
import ServerRoomCreateModal from '../components/ServerRoomCreateModal';
import { MOCK_SERVER_ROOMS } from '../constants/mockData';
import type { ServerRoom } from '../types';
import '../css/serverRoomDashboard.css'; 

const ServerRoomDashboard: React.FC = () => {
  const [serverRooms, setServerRooms] = useState<ServerRoom[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setServerRooms(MOCK_SERVER_ROOMS);
  }, []);

  const stats = useMemo(() => {
    const totalRooms = serverRooms.length;
    const totalRacks = serverRooms.reduce((sum, room) => sum + room.rackCount, 0);
    // 상태값 비교 시 대소문자 구분 주의 (예: 'Normal' vs 'normal')
    const normalStatus = serverRooms.filter(room => room.status.toLowerCase() === 'normal').length;
    const needAttention = serverRooms.filter(room => ['warning', 'critical'].includes(room.status.toLowerCase())).length;
    return { totalRooms, totalRacks, normalStatus, needAttention };
  }, [serverRooms]);


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