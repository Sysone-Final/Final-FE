

import React, { useState, useEffect, useMemo } from 'react';
import ServerRoomList from '../components/ServerRoomList';
import { MOCK_SERVER_ROOMS } from '../constants/mockData';
import type{ ServerRoom } from '../types';
import './ServerRoomDashboard.css'; // 대시보드 전체 스타일

const ServerRoomDashboard: React.FC = () => {
  const [serverRooms, setServerRooms] = useState<ServerRoom[]>([]);

  useEffect(() => {
    // 실제 환경에서는 이 부분에서 API를 호출하여 데이터를 가져옵니다.
    // 예: fetch('/api/server-rooms').then(res => res.json()).then(data => setServerRooms(data));
    setServerRooms(MOCK_SERVER_ROOMS);
  }, []);

  // 통계 계산 (useMemo를 사용하여 불필요한 재계산을 방지)
  const stats = useMemo(() => {
    const totalRooms = serverRooms.length;
    const totalRacks = serverRooms.reduce((sum, room) => sum + room.rackCount, 0);
    const normalStatus = serverRooms.filter(room => room.status === 'Normal').length;
    const needAttention = serverRooms.filter(room => room.status === 'Warning' || room.status === 'Critical').length;
    return { totalRooms, totalRacks, normalStatus, needAttention };
  }, [serverRooms]);


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>서버실 관리</h1>
          <p>데이터 센터 인프라를 모니터링하고 관리하세요</p>
        </div>
        <button className="add-room-button">+ 새 서버실 추가</button>
      </header>
      
      <main>
        <ServerRoomList rooms={serverRooms} />

        <section className="overview-statistics">
          <h2>전체 통계</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.totalRooms}</span>
              <span className="stat-label">총 서버실</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalRacks}</span>
              <span className="stat-label">총 랙 수</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#28a745' }}>{stats.normalStatus}</span>
              <span className="stat-label">정상 상태</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ffc107' }}>{stats.needAttention}</span>
              <span className="stat-label">주의 필요</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServerRoomDashboard;