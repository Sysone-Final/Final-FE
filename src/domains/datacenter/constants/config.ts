//기본 설정
export const DATACENTER_CONFIG = {
  // 캔버스 크기
  STAGE_WIDTH: 1200,
  STAGE_HEIGHT: 700,
  
  // 격자 설정
  GRID_SIZE: 30,
  ROOM_WIDTH: 600,
  ROOM_HEIGHT: 480,
  
  // 큐브 크기
  CUBE_SIZE: 25,
  
  // 뷰 위치 조정
  VIEW_OFFSET_X: 2.5, 
  VIEW_OFFSET_Y: 150,
  
  // 바닥 타일 색상
  FLOOR_COLORS: {
    LIGHT: '#f5f5f5',
    DARK: '#e8e8e8',
    GRID_STROKE: '#333'
  },
  
  // 선 두께 설정
  STROKE_WIDTH: {
    TILE: 1,
    GRID: 1,
    CUBE_BOTTOM: 0.8,
    CUBE_BACK: 1.0,
    CUBE_SIDE: 1.2,
    CUBE_TOP: 1.4
  },
  
  // 서버랙 이미지 설정
  SERVER_RACK: {
    ASPECT_RATIO: 0.6,     // 가로/세로 비율 
    HEIGHT_MULTIPLIER: 2.8  
  }
} as const;