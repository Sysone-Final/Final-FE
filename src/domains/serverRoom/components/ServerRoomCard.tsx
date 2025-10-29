import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ServerRoom } from '../types';
import { FaMapMarkerAlt, FaServer, FaPencilAlt, FaTrash } from 'react-icons/fa';
import '../css/serverRoomCard.css'; // 수정된 CSS 임포트

interface Props {
  room: ServerRoom;
}

const ServerRoomCard: React.FC<Props> = ({ room }) => {
  const navigate = useNavigate();

  const getStatusClassName = (status: ServerRoom['status']) => {
    // CSS 클래스 이름과 상태값 맞추기 (소문자)
    const statusLower = status.toLowerCase();
    if (['normal', 'warning', 'critical', 'maintenance'].includes(statusLower)) {
      return `status-dot ${statusLower}`;
    }
    return 'status-dot normal'; // 기본값 또는 알 수 없는 상태 처리
  };


  const handleViewLayout = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/server-room/${room.id}/view`); // 경로는 프로젝트에 맞게 확인 필요
  };

  return (
    <div className="server-room-card">
      <div className="card-header">
        {/* 텍스트 클래스 적용 */}
        <h3 className="card-title text-title">{room.name}</h3>
        <div className="card-actions">
          {/* 아이콘 버튼 텍스트 색상은 CSS에서 관리 */}
          <button className="icon-button"><FaPencilAlt /></button>
          <button className="icon-button"><FaTrash /></button>
        </div>
      </div>
      <div className="card-body">
        {/* 텍스트 클래스 적용 */}
        <p className="card-info text-body-primary">
          <FaMapMarkerAlt className="info-icon" /> {room.location}
        </p>
        <p className="card-info text-body-primary">
          <FaServer className="info-icon" /> {room.rackCount} 개 랙
        </p>
        <p className="card-info status-info text-body-primary">
          <span className={getStatusClassName(room.status)}></span>
          {room.status}
        </p>
      </div>
      <div className="card-footer">
        {/* 텍스트 클래스 적용 */}
        <a 
          href="#" 
          className="manage-layout-link text-button" // CSS의 색상 + text-button 크기/굵기
          onClick={handleViewLayout}
        >
          레이아웃 관리 →
        </a>
      </div>
    </div>
  );
};

export default ServerRoomCard;