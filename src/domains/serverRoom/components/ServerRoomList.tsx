import type { DataCenterGroup } from '../types';
import ServerRoomCard from './ServerRoomCard';
import '../css/serverRoomList.css';

interface Props {
  dataCenters: DataCenterGroup[];
}

function ServerRoomList({ dataCenters }: Props) {
  return (
    <div className="server-room-list-container">
      {dataCenters.map((dataCenter) => (
        <div key={dataCenter.dataCenterId} className="datacenter-group">
          {/* 서버실 카드 목록 */}
          <div className="server-room-list">
            {dataCenter.serverRooms.map((room) => (
              <ServerRoomCard 
                key={room.id} 
                room={room} 
                dataCenterAddress={dataCenter.dataCenterAddress}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServerRoomList;