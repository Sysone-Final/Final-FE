import { useEffect, useRef } from 'react';
import { Color3, StandardMaterial, MeshBuilder, Scene, Mesh, LinesMesh, Vector3 } from '@babylonjs/core';
import { COLORS } from '../constants/config';
import type { GridConfig } from '../types';

interface GridFloorProps {
  scene: Scene;
  gridConfig: GridConfig;
}

function GridFloor({ scene, gridConfig }: GridFloorProps) {
  const floorRef = useRef<Mesh | null>(null);
  const gridLinesRef = useRef<LinesMesh[]>([]);

  useEffect(() => {
    if (!scene) return;

    const { rows, columns, cellSize } = gridConfig;
    const totalWidth = columns * cellSize;
    const totalDepth = rows * cellSize;

    // 기존 메시 제거
    if (floorRef.current) {
      floorRef.current.dispose();
      floorRef.current = null;
    }
    gridLinesRef.current.forEach((line) => line.dispose());
    gridLinesRef.current = [];

    // 바닥 생성
    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: totalWidth, height: totalDepth },
      scene
    );
    
    const groundMaterial = new StandardMaterial('groundMat', scene);
    groundMaterial.diffuseColor = Color3.FromHexString(COLORS.gridFloor);
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;
    // 바닥을 격자 선과 같은 좌표계로 맞춤
    ground.position.x = totalWidth / 2;
    ground.position.z = totalDepth / 2;
    floorRef.current = ground;

    // 격자 선 생성
    const gridMaterial = new StandardMaterial('gridMat', scene);
    gridMaterial.diffuseColor = Color3.FromHexString(COLORS.grid);
    gridMaterial.emissiveColor = Color3.FromHexString(COLORS.grid);
    gridMaterial.alpha = 0.3;

    // 세로 선 (X축 방향)
    for (let i = 0; i <= columns; i++) {
      const x = i * cellSize;
      const line = MeshBuilder.CreateLines(
        `gridLineX${i}`,
        {
          points: [
            new Vector3(x, 0.01, 0),
            new Vector3(x, 0.01, totalDepth),
          ],
        },
        scene
      );
      line.color = Color3.FromHexString(COLORS.grid);
      line.alpha = 0.5;
      gridLinesRef.current.push(line);
    }

    // 가로 선 (Z축 방향)
    for (let i = 0; i <= rows; i++) {
      const z = i * cellSize;
      const line = MeshBuilder.CreateLines(
        `gridLineZ${i}`,
        {
          points: [
            new Vector3(0, 0.01, z),
            new Vector3(totalWidth, 0.01, z),
          ],
        },
        scene
      );
      line.color = Color3.FromHexString(COLORS.grid);
      line.alpha = 0.5;
      gridLinesRef.current.push(line);
    }

    return () => {
      // cleanup 시 material도 정리
      if (floorRef.current) {
        if (floorRef.current.material) {
          floorRef.current.material.dispose();
        }
        floorRef.current.dispose();
        floorRef.current = null;
      }
      
      gridLinesRef.current.forEach((line) => {
        if (line.material) {
          line.material.dispose();
        }
        line.dispose();
      });
      gridLinesRef.current = [];
    };
  }, [scene, gridConfig]);

  return null;
}

export default GridFloor