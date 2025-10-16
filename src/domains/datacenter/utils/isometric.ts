import type { IsometricCoordinate } from '../types';

/**
 * 3D 좌표를 아이소메트릭 2D 좌표로 변환
 * @param x - X 좌표
 * @param y - Y 좌표  
 * @param z - Z 좌표 (높이)
 * @returns 아이소메트릭 2D 좌표
 */
export const isometricTransform = (x: number, y: number, z: number = 0): IsometricCoordinate => {
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
  return { x: isoX, y: isoY };
};

/**
 * 정육면체의 8개 꼭짓점을 아이소메트릭 좌표로 변환
 * @param x - 시작 X 좌표
 * @param y - 시작 Y 좌표
 * @param z - 시작 Z 좌표
 * @param width - 폭
 * @param depth - 깊이
 * @param height - 높이
 * @returns 8개 꼭짓점의 아이소메트릭 좌표 배열
 */
export const getCubeVertices = (
  x: number, 
  y: number, 
  z: number, 
  width: number, 
  depth: number, 
  height: number
): IsometricCoordinate[] => {
  return [
    isometricTransform(x, y, z),                      // 0: 앞-왼쪽-아래
    isometricTransform(x + width, y, z),              // 1: 앞-오른쪽-아래
    isometricTransform(x + width, y + depth, z),      // 2: 뒤-오른쪽-아래
    isometricTransform(x, y + depth, z),              // 3: 뒤-왼쪽-아래
    isometricTransform(x, y, z + height),             // 4: 앞-왼쪽-위
    isometricTransform(x + width, y, z + height),     // 5: 앞-오른쪽-위
    isometricTransform(x + width, y + depth, z + height), // 6: 뒤-오른쪽-위
    isometricTransform(x, y + depth, z + height),     // 7: 뒤-왼쪽-위
  ];
};