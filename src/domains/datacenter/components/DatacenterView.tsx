import { Stage, Layer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import type Konva from 'konva';
import ServerRack from './ServerRack';
import DatacenterFloor from './DatacenterFloor';
import EquipmentPalette from './EquipmentPalette';
import { DATACENTER_CONFIG } from '../constants/config';
import { useDatacenterStore } from '../stores/useDatacenterStore';
import type { EquipmentType } from '../types';

function DatacenterView() {
  // 설정값 가져오기
  const {
    GRID_SIZE: gridSize,
    ROOM_WIDTH: roomWidth,
    ROOM_HEIGHT: roomHeight,
  } = DATACENTER_CONFIG;
  
  // Zustand 스토어에서 장비 데이터 가져오기
  const { equipment, addEquipment } = useDatacenterStore();
  
  // Stage 참조와 상태
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(0.8);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageDimensions, setStageDimensions] = useState({ width: 800, height: 600 });
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // 초기 맵 중앙 위치 설정
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    // 컨테이너의 실제 크기 가져오기
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const stageWidth = rect.width;
    const stageHeight = rect.height - 80; // 헤더 공간 제외
    
    setStageDimensions({ width: stageWidth, height: stageHeight });
    
    // 등축 투영된 맵의 실제 크기 계산
    const isometricWidth = (roomWidth + roomHeight) * 0.5;
    const isometricHeight = (roomWidth + roomHeight) * 0.25;
    
    // 맵 중앙을 화면 중앙에 배치
    const initialScale = 0.8;
    const centerX = (stageWidth - isometricWidth * initialScale) / 2;
    const centerY = (stageHeight - isometricHeight * initialScale) / 2 + 50;
    
    setStagePos({
      x: centerX,
      y: centerY,
    });
  }, [roomWidth, roomHeight]);

  // 팔레트에서 장비 추가 핸들러
  const handleAddEquipment = (type: EquipmentType) => {
    // 맵 중앙에 장비 추가
    const centerX = roomWidth / 2;
    const centerY = roomHeight / 2;
    addEquipment(type, centerX, centerY);
  };

  // 마우스 휠로 줌 인/아웃
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // 스케일 변경 (0.5 ~ 2.0 사이로 제한)
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.5, Math.min(2, newScale));

    setStageScale(clampedScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setStagePos(newPos);
  };

  // 배경(Layer) 클릭 드래그 핸들러
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 빈 공간 클릭 시에만 드래그 시작 (Stage 자체를 클릭한 경우)
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsDraggingStage(true);
      lastPosRef.current = {
        x: e.evt.clientX,
        y: e.evt.clientY,
      };
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDraggingStage) return;

    const dx = e.evt.clientX - lastPosRef.current.x;
    const dy = e.evt.clientY - lastPosRef.current.y;

    setStagePos((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPosRef.current = {
      x: e.evt.clientX,
      y: e.evt.clientY,
    };
  };

  const handleMouseUp = () => {
    setIsDraggingStage(false);
  };

  try {
    return (
      <div className="flex h-full w-full overflow-hidden bg-gray-900">
        {/* 왼쪽: 격자 맵 영역 (flex-1로 남은 공간 모두 차지) */}
        <div ref={containerRef} className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
          {/* 맵 헤더 */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="p-4">
              <h1 className="text-white text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                데이터센터 레이아웃
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                배치된 장비: {equipment.length}개
              </p>
            </div>
          </div>

          {/* Konva Stage */}
          <div className="absolute inset-0 pt-20">
            <Stage
              ref={stageRef}
              width={stageDimensions.width}
              height={stageDimensions.height}
              scaleX={stageScale}
              scaleY={stageScale}
              x={stagePos.x}
              y={stagePos.y}
              draggable={false}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
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
              <li>• 🖱️ 드래그 (배경): 맵 이동</li>
              <li>• �️ 드래그 (장비): 장비 이동</li>
              <li>• � 마우스 휠: 줌 인/아웃</li>
              <li>• 배율: {stageScale.toFixed(1)}x</li>
            </ul>
          </div>
        </div>

        {/* 오른쪽: 장비 팔레트 사이드바 (고정 너비) */}
        <div className="w-80 h-full overflow-hidden flex-shrink-0">
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