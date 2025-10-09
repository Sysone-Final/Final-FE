import React from 'react';
import { Stage, Layer, Line, Group } from 'react-konva';

// 아이소메트릭 변환 유틸리티
const isometricTransform = (x: number, y: number, z: number = 0) => {
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
  return { x: isoX, y: isoY };
};

// 서버랙 컴포넌트 (실제 서버랙처럼 보이도록)
interface ServerRackProps {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  type: 'server' | 'storage' | 'network' | 'ups' | 'ac';
}

const ServerRack: React.FC<ServerRackProps> = ({ 
  x, 
  y, 
  z, 
  width, 
  depth, 
  height, 
  type 
}) => {
  // 정육면체의 8개 꼭짓점 계산
  const vertices = [
    isometricTransform(x, y, z),                      // 0: 앞-왼쪽-아래
    isometricTransform(x + width, y, z),              // 1: 앞-오른쪽-아래
    isometricTransform(x + width, y + depth, z),      // 2: 뒤-오른쪽-아래
    isometricTransform(x, y + depth, z),              // 3: 뒤-왼쪽-아래
    isometricTransform(x, y, z + height),             // 4: 앞-왼쪽-위
    isometricTransform(x + width, y, z + height),     // 5: 앞-오른쪽-위
    isometricTransform(x + width, y + depth, z + height), // 6: 뒤-오른쪽-위
    isometricTransform(x, y + depth, z + height),     // 7: 뒤-왼쪽-위
  ];

  // 타입별 색상 설정 (밝기별로 6면 구분)
  const getColors = (type: string) => {
    switch (type) {
      case 'server':
        return { 
          top: '#5599FF', 
          left: '#4488EE', 
          right: '#3377DD',
          back: '#2266CC',
          front: '#1155BB',
          bottom: '#0044AA'
        };
      case 'storage':
        return { 
          top: '#FF9933', 
          left: '#EE8822', 
          right: '#DD7711',
          back: '#CC6600',
          front: '#BB5500',
          bottom: '#AA4400'
        };
      case 'network':
        return { 
          top: '#66CC33', 
          left: '#55BB22', 
          right: '#44AA11',
          back: '#339900',
          front: '#228800',
          bottom: '#117700'
        };
      case 'ups':
        return { 
          top: '#FF3366', 
          left: '#EE2255', 
          right: '#DD1144',
          back: '#CC0033',
          front: '#BB0022',
          bottom: '#AA0011'
        };
      case 'ac':
        return { 
          top: '#9966FF', 
          left: '#8855EE', 
          right: '#7744DD',
          back: '#6633CC',
          front: '#5522BB',
          bottom: '#4411AA'
        };
      default:
        return { 
          top: '#33CCAA', 
          left: '#22BB99', 
          right: '#11AA88',
          back: '#009977',
          front: '#008866',
          bottom: '#007755'
        };
    }
  };

  const colors = getColors(type);

  return (
    <Group>
      {/* 아래면 (바닥) - 먼저 그려서 뒤쪽에 위치 */}
      <Line
        points={[
          vertices[0].x, vertices[0].y,  // 앞-왼쪽-아래
          vertices[1].x, vertices[1].y,  // 앞-오른쪽-아래
          vertices[2].x, vertices[2].y,  // 뒤-오른쪽-아래
          vertices[3].x, vertices[3].y,  // 뒤-왼쪽-아래
        ]}
        closed
        fill={colors.bottom}
        stroke="#000"
        strokeWidth={0.8}
        opacity={0.7}
      />

      {/* 뒤쪽면 */}
      <Line
        points={[
          vertices[2].x, vertices[2].y,  // 뒤-오른쪽-아래
          vertices[6].x, vertices[6].y,  // 뒤-오른쪽-위
          vertices[7].x, vertices[7].y,  // 뒤-왼쪽-위
          vertices[3].x, vertices[3].y,  // 뒤-왼쪽-아래
        ]}
        closed
        fill={colors.back}
        stroke="#000"
        strokeWidth={1.0}
      />
      
      {/* 왼쪽면 */}
      <Line
        points={[
          vertices[0].x, vertices[0].y,  // 앞-왼쪽-아래
          vertices[4].x, vertices[4].y,  // 앞-왼쪽-위
          vertices[7].x, vertices[7].y,  // 뒤-왼쪽-위
          vertices[3].x, vertices[3].y,  // 뒤-왼쪽-아래
        ]}
        closed
        fill={colors.left}
        stroke="#000"
        strokeWidth={1.2}
      />
      
      {/* 오른쪽면 */}
      <Line
        points={[
          vertices[1].x, vertices[1].y,  // 앞-오른쪽-아래
          vertices[2].x, vertices[2].y,  // 뒤-오른쪽-아래
          vertices[6].x, vertices[6].y,  // 뒤-오른쪽-위
          vertices[5].x, vertices[5].y,  // 앞-오른쪽-위
        ]}
        closed
        fill={colors.right}
        stroke="#000"
        strokeWidth={1.2}
      />

      {/* 앞면 */}
      <Line
        points={[
          vertices[0].x, vertices[0].y,  // 앞-왼쪽-아래
          vertices[1].x, vertices[1].y,  // 앞-오른쪽-아래
          vertices[5].x, vertices[5].y,  // 앞-오른쪽-위
          vertices[4].x, vertices[4].y,  // 앞-왼쪽-위
        ]}
        closed
        fill={colors.front}
        stroke="#000"
        strokeWidth={1.2}
      />
      
      {/* 윗면 (마지막에 그려서 가장 앞에 위치) */}
      <Line
        points={[
          vertices[4].x, vertices[4].y,  // 앞-왼쪽-위
          vertices[5].x, vertices[5].y,  // 앞-오른쪽-위
          vertices[6].x, vertices[6].y,  // 뒤-오른쪽-위
          vertices[7].x, vertices[7].y,  // 뒤-왼쪽-위
        ]}
        closed
        fill={colors.top}
        stroke="#000"
        strokeWidth={1.4}
      />
    </Group>
  );
};

// 바닥과 격자 그리기 함수
const DatacenterFloor: React.FC<{ width: number; height: number; gridSize: number }> = ({
  width,
  height,
  gridSize,
}) => {
  const floorElements = [];
  
  // 바닥 타일들 (체크무늬 패턴)
  for (let i = 0; i < width / gridSize; i++) {
    for (let j = 0; j < height / gridSize; j++) {
      const x = i * gridSize;
      const y = j * gridSize;
      
      const corners = [
        isometricTransform(x, y),
        isometricTransform(x + gridSize, y),
        isometricTransform(x + gridSize, y + gridSize),
        isometricTransform(x, y + gridSize),
      ];
      
      // 체크무늬 패턴
      const isLight = (i + j) % 2 === 0;
      const tileColor = isLight ? '#f5f5f5' : '#e8e8e8';
      
      floorElements.push(
        <Line
          key={`tile-${i}-${j}`}
          points={[
            corners[0].x, corners[0].y,
            corners[1].x, corners[1].y,
            corners[2].x, corners[2].y,
            corners[3].x, corners[3].y,
          ]}
          closed
          fill={tileColor}
          stroke="#333"
          strokeWidth={0.3}
        />
      );
    }
  }
  
  // 격자선들 (더 진한 색상)
  for (let i = 0; i <= height / gridSize; i++) {
    const y = i * gridSize;
    const start = isometricTransform(0, y);
    const end = isometricTransform(width, y);
    
    floorElements.push(
      <Line
        key={`h-${i}`}
        points={[start.x, start.y, end.x, end.y]}
        stroke="#333"
        strokeWidth={1}
        opacity={0.8}
      />
    );
  }
  
  // 수직선들
  for (let i = 0; i <= width / gridSize; i++) {
    const x = i * gridSize;
    const start = isometricTransform(x, 0);
    const end = isometricTransform(x, height);
    
    floorElements.push(
      <Line
        key={`v-${i}`}
        points={[start.x, start.y, end.x, end.y]}
        stroke="#333"
        strokeWidth={1}
        opacity={0.8}
      />
    );
  }
  
  return <>{floorElements}</>;
};

const IsometricDatacenterView: React.FC = () => {
  try {
    // 캔버스 크기
    const stageWidth = 1000;
    const stageHeight = 700;
    
    // 격자 설정 - 더 작은 격자로 촘촘하게 표시
    const gridSize = 30; // 격자 크기를 작게 만듦
    const roomWidth = 600;
    const roomHeight = 480;
    
    // 큐브 크기 설정 (격자 칸 사이사이에 배치하기 위해 2칸 간격 사용)
    const cubeSize = 25; // 큐브 크기를 격자에 맞게 축소
    
    const datacenterEquipment = [
      // 첫 번째 행 - 2칸 간격으로 배치 (격자 기준 1, 3, 5, 7번째 위치)
      { x: gridSize * 1, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' as const },
      { x: gridSize * 3, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' as const },
      { x: gridSize * 5, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' as const },
      { x: gridSize * 7, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ups' as const },
      
      // 두 번째 행
      { x: gridSize * 1, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ac' as const },
      { x: gridSize * 3, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' as const },
      { x: gridSize * 5, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' as const },
      { x: gridSize * 7, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' as const },
      
      // 세 번째 행
      { x: gridSize * 1, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ups' as const },
      { x: gridSize * 3, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ac' as const },
      { x: gridSize * 5, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' as const },
      { x: gridSize * 7, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' as const },
      
      // 네 번째 행
      { x: gridSize * 1, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' as const },
      { x: gridSize * 3, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ups' as const },
      { x: gridSize * 5, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ac' as const },
      { x: gridSize * 7, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' as const },
    ];

    return (
      <div className="isometric-datacenter" style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <div style={{ 
          border: '2px solid #34495e', 
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'inline-block',
          backgroundColor: '#ecf0f1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <Stage
            width={stageWidth}
            height={stageHeight}
            scaleX={1}
            scaleY={1}
            x={stageWidth / 2.5}
            y={150}
          >
            <Layer>
              {/* 바닥과 격자 */}
              <DatacenterFloor 
                width={roomWidth} 
                height={roomHeight} 
                gridSize={gridSize} 
              />
              
              {/* 장비들 렌더링 */}
              {datacenterEquipment.map((equipment, index) => (
                <ServerRack
                  key={index}
                  x={equipment.x}
                  y={equipment.y}
                  z={equipment.z}
                  width={equipment.width}
                  depth={equipment.depth}
                  height={equipment.height}
                  type={equipment.type}
                />
              ))}
            </Layer>
          </Stage>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>장비 범례</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px' }}>
            <span>�️ <strong>서버랙</strong> - 메인 서버들</span>
            <span>� <strong>네트워크</strong> - 스위치/라우터</span>
            <span>� <strong>스토리지</strong> - 데이터 저장소</span>
            <span>🔋 <strong>UPS</strong> - 무정전 전원공급장치</span>
            <span>❄️ <strong>항온항습기</strong> - 온도/습도 제어</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px' }}>

        <p> {String(error)}</p>
      </div>
    );
  }
};

export default IsometricDatacenterView;