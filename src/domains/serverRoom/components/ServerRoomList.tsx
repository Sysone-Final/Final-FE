

import React from 'react';
import type { ServerRoom } from '../types';
import ServerRoomCard from './ServerRoomCard';
import './ServerRoomList.css'; // 리스트 스타일을 위한 CSS 파일

interface Props {
  rooms: ServerRoom[];
}

const ServerRoomList: React.FC<Props> = ({ rooms }) => {
  return (
    <div className="server-room-list">
      {rooms.map((room) => (
        <ServerRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default ServerRoomList;