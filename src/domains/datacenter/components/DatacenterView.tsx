import { Stage, Layer } from 'react-konva';
import { useEffect } from 'react';
import ServerRack from './ServerRack';
import DatacenterFloor from './DatacenterFloor';
import EquipmentPalette from './EquipmentPalette';
import { DATACENTER_CONFIG } from '../constants/config';
import { useDatacenterStore } from '../stores/useDatacenterStore';
import type { EquipmentType } from '../types';

function DatacenterView() {
  // 설정값 가져오기
  const {
    STAGE_HEIGHT: stageHeight,
    GRID_SIZE: gridSize,
    ROOM_WIDTH: roomWidth,
    ROOM_HEIGHT: roomHeight,
    VIEW_OFFSET_X,
    VIEW_OFFSET_Y,
  } = DATACENTER_CONFIG;
  
  // Zustand 스토어에서 장비 데이터 가져오기
  const { equipment, addEquipment } = useDatacenterStore();
  
  // 맵 영역 크기 (화면의 4/5)
  const mapWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 960;
  const sidebarWidth = typeof window !== 'undefined' ? window.innerWidth * 0.2 : 240;

  // 초기 장비 설정 (테스트용 - 필요시 제거)
  useEffect(() => {
    // 처음 로드시 빈 상태로 시작
  }, []);

  // 팔레트에서 장비 추가 핸들러
  const handleAddEquipment = (type: EquipmentType) => {
    // 맵 중앙에 장비 추가
    const centerX = roomWidth / 2;
    const centerY = roomHeight / 2;
    addEquipment(type, centerX, centerY);
  };

  try {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
        {/* 왼쪽 4/5: 격자 맵 영역 */}
        <div 
          className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 relative"
          style={{ width: `${mapWidth}px` }}
        >
          {/* 맵 헤더 */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="p-4">
              <h1 className="text-white text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                데이터센터 레이아웃
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                장비를 드래그하여 배치하세요 • 배치된 장비: {equipment.length}개
              </p>
            </div>
          </div>

          {/* Konva Stage */}
          <div className="w-full h-full flex items-center justify-center">
            <Stage
              width={mapWidth}
              height={stageHeight}
              scaleX={1}
              scaleY={1}
              x={mapWidth / VIEW_OFFSET_X}
              y={VIEW_OFFSET_Y}
            >
              <Layer>
                {/* 바닥과 격자 */}
                <DatacenterFloor 
                  width={roomWidth} 
                  height={roomHeight} 
                  gridSize={gridSize} 
                />
                
                {/* 장비들 렌더링 */}
                {equipment.map((eq) => (
                  <ServerRack
                    key={eq.id}
                    id={eq.id}
                    x={eq.x}
                    y={eq.y}
                    z={eq.z}
                    width={eq.width}
                    depth={eq.depth}
                    height={eq.height}
                    type={eq.type}
                    draggable={true}
                    isDragging={eq.isDragging}
                    valid={eq.valid}
                  />
                ))}
              </Layer>
            </Stage>
          </div>

          {/* 컨트롤 안내 */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
            <div className="font-semibold mb-2">⌨️ 컨트롤</div>
            <ul className="space-y-1">
              <li>• 🖱️ 드래그: 장비 이동</li>
              <li>• 🟢 초록 테두리: 유효한 위치</li>
              <li>• 🔴 빨강 테두리: 충돌 또는 범위 밖</li>
              <li>• 🟡 금색 테두리: 드래그 중</li>
            </ul>
          </div>
        </div>

        {/* 오른쪽 1/5: 장비 팔레트 사이드바 */}
        <div 
          className="flex-none"
          style={{ width: `${sidebarWidth}px` }}
        >
          <EquipmentPalette onAddEquipment={handleAddEquipment} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ 오류 발생</h2>
          <p className="text-gray-700">{String(error)}</p>
        </div>
      </div>
    );
  }
}

export default DatacenterView;