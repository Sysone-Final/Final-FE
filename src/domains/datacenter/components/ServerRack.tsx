import { Group, Line, Image as KonvaImage } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import type { ServerRackProps } from '../types';
import { getCubeVertices } from '../utils/isometric';
import { getEquipmentColors } from '../constants/colors';
import { DATACENTER_CONFIG } from '../constants/config';
import { useDatacenterStore } from '../stores/useDatacenterStore';
import serverRackImage from '../assets/rack_front_left.png';

interface DraggableServerRackProps extends ServerRackProps {
  id: string;
  draggable?: boolean;
  isDragging?: boolean;
  valid?: boolean;
}

function ServerRack({ 
  id,
  x, 
  y, 
  z, 
  width, 
  depth, 
  height, 
  type,
  draggable = false,
  isDragging = false,
  valid = true,
}: DraggableServerRackProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement>();
  const groupRef = useRef<any>(null);
  const [originalPosition, setOriginalPosition] = useState({ x, y });
  
  const { 
    updateEquipmentPosition, 
    setEquipmentDragging,
    validateEquipmentPosition,
    snapToGrid 
  } = useDatacenterStore();

  // 서버 타입일 때만 이미지 로드
  useEffect(() => {
    if (type === 'server') {
      const img = new Image();
      img.src = serverRackImage;
      img.onload = () => {
        setImage(img);
      };
      imageRef.current = img;
    }
  }, [type]);

  // 꼭짓점 계산
  const vertices = getCubeVertices(x, y, z, width, depth, height);
  
  // 타입별 색상 가져오기 (드래깅 및 유효성 상태에 따라 조정)
  const colors = getEquipmentColors(type);
  const opacity = isDragging ? 0.7 : 1;
  const strokeColor = !valid ? '#ff0000' : isDragging ? '#ffd700' : '#000';
  const strokeWidth = isDragging ? 3 : 1;

  // 드래그 핸들러
  const handleDragStart = () => {
    setOriginalPosition({ x, y });
    setEquipmentDragging(id, true);
  };

  const handleDragEnd = (e: any) => {
    const newX = e.target.x();
    const newY = e.target.y();
    
    // 위치 검증
    if (validateEquipmentPosition(id, newX, newY)) {
      const snappedX = snapToGrid(newX);
      const snappedY = snapToGrid(newY);
      updateEquipmentPosition(id, snappedX, snappedY);
      e.target.x(snappedX);
      e.target.y(snappedY);
    } else {
      // 유효하지 않으면 원래 위치로 복원
      e.target.x(originalPosition.x);
      e.target.y(originalPosition.y);
    }
    
    setEquipmentDragging(id, false);
  };

  // 서버 타입이고 이미지가 로드되었다면 이미지로 표시
  if (type === 'server' && image) {
    // 서버랙 이미지 크기
    const imageHeight = width * DATACENTER_CONFIG.SERVER_RACK.HEIGHT_MULTIPLIER;
    const imageWidth = imageHeight * DATACENTER_CONFIG.SERVER_RACK.ASPECT_RATIO;

    // 바닥의 중심
    const floorCenterX = (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4;
    const floorCenterY = (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4;
    
    return (
      <Group
        ref={groupRef}
        x={x}
        y={y}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        opacity={opacity}
      >        
        {/* 서버랙 이미지 */}
        <KonvaImage
          image={image}
          x={floorCenterX - imageWidth / 2 - x}
          y={floorCenterY - imageHeight + 8 - y}
          width={imageWidth}
          height={imageHeight}
        />
      </Group>
    );
  }

  // 다른 타입들은 기존 정육면체로 표시
  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      opacity={opacity}
    >
      {/* 아래면 (바닥) - 먼저 그려서 뒤쪽에 위치 */}
      <Line
        points={[
          vertices[0].x - x, vertices[0].y - y,  // 앞-왼쪽-아래
          vertices[1].x - x, vertices[1].y - y,  // 앞-오른쪽-아래
          vertices[2].x - x, vertices[2].y - y,  // 뒤-오른쪽-아래
          vertices[3].x - x, vertices[3].y - y,  // 뒤-왼쪽-아래
        ]}
        closed
        fill={colors.bottom}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* 뒤쪽면 */}
      <Line
        points={[
          vertices[2].x - x, vertices[2].y - y,  // 뒤-오른쪽-아래
          vertices[6].x - x, vertices[6].y - y,  // 뒤-오른쪽-위
          vertices[7].x - x, vertices[7].y - y,  // 뒤-왼쪽-위
          vertices[3].x - x, vertices[3].y - y,  // 뒤-왼쪽-아래
        ]}
        closed
        fill={colors.back}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      
      {/* 왼쪽면 */}
      <Line
        points={[
          vertices[0].x - x, vertices[0].y - y,  // 앞-왼쪽-아래
          vertices[4].x - x, vertices[4].y - y,  // 앞-왼쪽-위
          vertices[7].x - x, vertices[7].y - y,  // 뒤-왼쪽-위
          vertices[3].x - x, vertices[3].y - y,  // 뒤-왼쪽-아래
        ]}
        closed
        fill={colors.left}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      
    {/* 우측 */}
      <Line
        points={[
          vertices[1].x - x, vertices[1].y - y,  // 앞-오른쪽-아래
          vertices[2].x - x, vertices[2].y - y,  // 뒤-오른쪽-아래
          vertices[6].x - x, vertices[6].y - y,  // 뒤-오른쪽-위
          vertices[5].x - x, vertices[5].y - y,  // 앞-오른쪽-위
        ]}
        closed
        fill={colors.right}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* 앞면 */}
      <Line
        points={[
          vertices[0].x - x, vertices[0].y - y,  // 앞-왼쪽-아래
          vertices[1].x - x, vertices[1].y - y,  // 앞-오른쪽-아래
          vertices[5].x - x, vertices[5].y - y,  // 앞-오른쪽-위
          vertices[4].x - x, vertices[4].y - y,  // 앞-왼쪽-위
        ]}
        closed
        fill={colors.front}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      
      {/* 윗면 */}
      <Line
        points={[
          vertices[4].x - x, vertices[4].y - y,  // 앞-왼쪽-위
          vertices[5].x - x, vertices[5].y - y,  // 앞-오른쪽-위
          vertices[6].x - x, vertices[6].y - y,  // 뒤-오른쪽-위
          vertices[7].x - x, vertices[7].y - y,  // 뒤-왼쪽-위
        ]}
        closed
        fill={colors.top}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </Group>
  );
}

export default ServerRack;