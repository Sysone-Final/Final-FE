

import React from 'react';
import type { ServerRoom } from '../types';
import ServerRoomCard from './ServerRoomCard';
import '../css/serverRoomList.css';

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