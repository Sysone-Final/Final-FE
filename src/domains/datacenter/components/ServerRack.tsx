import { Group, Line, Image as KonvaImage } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import type { ServerRackProps } from '../types';
import { getCubeVertices } from '../utils/isometric';
import { getEquipmentColors } from '../constants/colors';
import { DATACENTER_CONFIG } from '../constants/config';
import serverRackImage from '../assets/rack_front_left.png';

function ServerRack({ 
  x, 
  y, 
  z, 
  width, 
  depth, 
  height, 
  type 
}: ServerRackProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement>();

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
  
  // 타입별 색상 가져오기
  const colors = getEquipmentColors(type);

  // 서버 타입이고 이미지가 로드되었다면 이미지로 표시
  if (type === 'server' && image) {
    // 서버랙 이미지 크기
    const imageHeight = width * DATACENTER_CONFIG.SERVER_RACK.HEIGHT_MULTIPLIER;
    const imageWidth = imageHeight * DATACENTER_CONFIG.SERVER_RACK.ASPECT_RATIO;

    // 바닥의 중심
    const floorCenterX = (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4;
    const floorCenterY = (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4;
    
    return (
      <Group>        
        {/* 서버랙 이미지 */}
        <KonvaImage
          image={image}
          x={floorCenterX - imageWidth / 2}
          y={floorCenterY - imageHeight + 8}
          width={imageWidth}
          height={imageHeight}
        />
      </Group>
    );
  }

  // 다른 타입들은 기존 정육면체로 표시
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
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.CUBE_BOTTOM}
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
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.CUBE_BACK}
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
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.CUBE_SIDE}
      />
      
    {/* 우측 */}
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
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.CUBE_SIDE}
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
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.CUBE_SIDE}
      />
      
      {/* 윗면 */}
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
        strokeWidth={DATACENTER_CONFIG.STROKE_WIDTH.CUBE_TOP}
      />
    </Group>
  );
}

export default ServerRack;