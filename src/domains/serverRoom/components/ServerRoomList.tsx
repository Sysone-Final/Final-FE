import React from 'react';
import type { ServerRoom } from '../types';
import ServerRoomCard from './ServerRoomCard';
import '../css/serverRoomList.css'; // 수정된 CSS 임포트 (만약 있다면)

interface Props {
  rooms: ServerRoom[];
}

const ServerRoomList: React.FC<Props> = ({ rooms }) => {
  return (
    <div className="server-room-list"> {/* serverRoomList.css 에 정의된 스타일 */}
      {rooms.map((room) => (
        <ServerRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default ServerRoomList;