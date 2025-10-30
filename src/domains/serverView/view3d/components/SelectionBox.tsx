import { useEffect, useRef } from 'react';
import { Scene, MeshBuilder, StandardMaterial, Color3, Mesh } from '@babylonjs/core';
import { COLORS } from '../constants/config';

interface SelectionBoxProps {
  scene: Scene;
  startGridX: number;
  startGridY: number;
  endGridX: number;
  endGridY: number;
  cellSize: number;
}

function SelectionBox({ scene, startGridX, startGridY, endGridX, endGridY, cellSize }: SelectionBoxProps) {
  const meshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    if (!scene) return;

    // 시작과 끝 좌표 정규화
    const minX = Math.min(startGridX, endGridX);
    const maxX = Math.max(startGridX, endGridX);
    const minY = Math.min(startGridY, endGridY);
    const maxY = Math.max(startGridY, endGridY);

    // 박스 크기 계산
    const width = (maxX - minX + 1) * cellSize;
    const depth = (maxY - minY + 1) * cellSize;
    
    // 박스 중심 위치
    const centerX = (minX + maxX + 1) * cellSize / 2;
    const centerZ = (minY + maxY + 1) * cellSize / 2;

    // 기존 메시 제거
    if (meshRef.current) {
      meshRef.current.dispose();
    }

    // 선택 영역 박스 생성
    const box = MeshBuilder.CreatePlane(
      'selectionBox',
      { width, height: depth },
      scene
    );
    
    box.rotation.x = Math.PI / 2; // 바닥에 평평하게
    box.position.x = centerX;
    box.position.y = 0.02; // 바닥보다 살짝 위
    box.position.z = centerZ;
    box.isPickable = false; // 선택 불가

    // 반투명 하이라이트 색상
    const material = new StandardMaterial('selectionBoxMat', scene);
    material.diffuseColor = Color3.FromHexString(COLORS.highlight);
    material.emissiveColor = Color3.FromHexString(COLORS.highlight);
    material.alpha = 0.4;
    box.material = material;

    meshRef.current = box;

    return () => {
      if (meshRef.current) {
        if (meshRef.current.material) {
          meshRef.current.material.dispose();
        }
        meshRef.current.dispose();
        meshRef.current = null;
      }
    };
  }, [scene, startGridX, startGridY, endGridX, endGridY, cellSize]);

  return null;
}

export default SelectionBox;
