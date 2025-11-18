import { useNavigate } from "react-router-dom";
import type { ServerRoom } from "../types";
import { FaMapMarkerAlt, FaPencilAlt, FaTrash } from "react-icons/fa";
import { RiBarcodeLine } from "react-icons/ri";
import { IoDocumentSharp } from "react-icons/io5";
import { MdLayers } from "react-icons/md";
import "../css/serverRoomCard.css";

interface Props {
  room: ServerRoom;
  dataCenterAddress: string;
  onEditClick: (serverRoom: ServerRoom) => void;
  onDeleteClick: (serverRoom: ServerRoom) => void;
}

function ServerRoomCard({ room, dataCenterAddress, onEditClick, onDeleteClick }: Props) {
  const navigate = useNavigate();

  const handleViewLayout = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/server-room/${room.id}/view`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEditClick(room);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onDeleteClick(room);
  };

  return (
    <div className="server-room-card">
      <div className="card-header">
        <h3 className="card-title text-title">{room.name}</h3>
        <div className="card-actions">
          <button className="icon-button" onClick={handleEditClick}>
            <FaPencilAlt />
          </button>
          <button className="icon-button" onClick={handleDeleteClick}>
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="card-body">
        {/* 서버실 코드 */}
        <p className="card-info text-body-primary">
          <RiBarcodeLine className="info-icon" />
          {room.code}
        </p>
        {/* 데이터센터 주소 */}
        <p className="card-info text-body-primary">
          <FaMapMarkerAlt className="info-icon" /> {dataCenterAddress}
        </p>
        {/* 층수 정보 */}
        <p className="card-info text-body-primary">
          <MdLayers className="info-icon" />
          {room.floor}층
        </p>
        <p className="card-info text-body-primary">
          <IoDocumentSharp className="info-icon" />  
          {room.description}
        </p>
      </div>
      <div className="card-footer">
        <a
          href="#"
          className="manage-layout-link text-button"
          onClick={handleViewLayout}
        >
          서버실 관리 →
        </a>
      </div>
    </div>
  );
}

export default ServerRoomCard;
