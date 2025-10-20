import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ServerRoom } from '../types';
import { FaMapMarkerAlt, FaServer, FaPencilAlt, FaTrash } from 'react-icons/fa';
import '../css/serverRoomCard.css';

interface Props {
  room: ServerRoom;
}

const ServerRoomCard: React.FC<Props> = ({ room }) => {
  const navigate = useNavigate();

  // status 값에 따라 클래스 이름을 동적으로 반환하는 함수
  const getStatusClassName = (status: ServerRoom['status']) => {
    return `status-dot ${status.toLowerCase()}`;
  };

  // 3D 뷰 페이지로 이동
  const handleViewLayout = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/server-room/${room.id}/view`);
  };

  return (
    <div className="server-room-card">
      <div className="card-header">
        <h3 className="card-title">{room.name}</h3>
        <div className="card-actions">
          <button className="icon-button"><FaPencilAlt /></button>
          <button className="icon-button"><FaTrash /></button>
        </div>
      </div>
      <div className="card-body">
        <p className="card-info">
          <FaMapMarkerAlt className="info-icon" /> {room.location}
        </p>
        <p className="card-info">
          <FaServer className="info-icon" /> {room.rackCount} 개 랙
        </p>
        <p className="card-info status-info">
          <span className={getStatusClassName(room.status)}></span>
          {room.status}
        </p>
      </div>
      <div className="card-footer">
        <a 
          href="#" 
          className="manage-layout-link"
          onClick={handleViewLayout}
        >
          레이아웃 관리 →
        </a>
      </div>
    </div>
  );
};

export default ServerRoomCard;