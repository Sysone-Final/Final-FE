import React from 'react';
import type { DataCenterGroup } from '../types';
import ServerRoomCard from './ServerRoomCard';
import '../css/serverRoomList.css';

interface Props {
  dataCenters: DataCenterGroup[];
}

const ServerRoomList: React.FC<Props> = ({ dataCenters }) => {
  return (
    <div className="server-room-list-container">
      {dataCenters.map((dataCenter) => (
        <div key={dataCenter.dataCenterId} className="datacenter-group">
          {/* 데이터센터 헤더 */}
          <div className="datacenter-header">
            <h2 className="datacenter-title text-subtitle">
              {dataCenter.dataCenterName}
              <span className="datacenter-code text-body-primary text-gray-400">
                ({dataCenter.dataCenterCode})
              </span>
            </h2>
            <p className="datacenter-address text-body-primary text-gray-400">
             {dataCenter.dataCenterAddress}
            </p>
          </div>
          
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
};

export default ServerRoomList;