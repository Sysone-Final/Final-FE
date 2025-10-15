import { Line } from 'react-konva';
import { isometricTransform } from '../utils/isometric';
import { DATACENTER_CONFIG } from '../constants/config';

interface DatacenterFloorProps {
  width: number;
  height: number;
  gridSize: number;
}

function DatacenterFloor({ width, height, gridSize }: DatacenterFloorProps) {
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
      const tileColor = isLight 
        ? DATACENTER_CONFIG.FLOOR_COLORS.LIGHT 
        : DATACENTER_CONFIG.FLOOR_COLORS.DARK;
      
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
          stroke={DATACENTER_CONFIG.FLOOR_COLORS.GRID_STROKE}
          strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.TILE}
        />
      );
    }
  }
  
  // 격자선들 (가로선)
  for (let i = 0; i <= height / gridSize; i++) {
    const y = i * gridSize;
    const start = isometricTransform(0, y);
    const end = isometricTransform(width, y);
    
    floorElements.push(
      <Line
        key={`h-${i}`}
        points={[start.x, start.y, end.x, end.y]}
        stroke={DATACENTER_CONFIG.FLOOR_COLORS.GRID_STROKE}
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.GRID}
        opacity={0.8}
      />
    );
  }
  
  // 격자선들 (세로선)
  for (let i = 0; i <= width / gridSize; i++) {
    const x = i * gridSize;
    const start = isometricTransform(x, 0);
    const end = isometricTransform(x, height);
    
    floorElements.push(
      <Line
        key={`v-${i}`}
        points={[start.x, start.y, end.x, end.y]}
        stroke={DATACENTER_CONFIG.FLOOR_COLORS.GRID_STROKE}
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.GRID}
        opacity={0.8}
      />
    );
  }
  
  return <>{floorElements}</>;
}

export default DatacenterFloor;