import { useEffect, useRef, useState, useCallback } from 'react';
import { Scene, SceneLoader, AbstractMesh, Vector3, Color3, StandardMaterial, ActionManager, ExecuteCodeAction, PointerDragBehavior } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { rgbStringToColor3 } from '../utils/colorHelper';
import { COLORS } from '../constants/config';
import type { Equipment3D } from '../types';

interface Equipment3DModelProps {
  scene: Scene;
  equipment: Equipment3D;
  cellSize: number;
  modelPath: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, gridX: number, gridY: number) => void;
}

export const Equipment3DModel = ({
  scene,
  equipment,
  cellSize,
  modelPath,
  isSelected,
  onSelect,
  onPositionChange,
}: Equipment3DModelProps) => {
  const meshRef = useRef<AbstractMesh | null>(null);
  const ghostMeshRef = useRef<AbstractMesh | null>(null); // Ghost 메시를 추적하기 위한 ref
  const dragBehaviorRef = useRef<PointerDragBehavior | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 격자 좌표를 월드 좌표로 변환
  const gridToWorld = useCallback((gridX: number, gridY: number, gridZ: number = 0) => {
    return new Vector3(
      gridX * cellSize + cellSize / 2,
      gridZ * cellSize + cellSize / 2,
      gridY * cellSize + cellSize / 2
    );
  }, [cellSize]);

  // 월드 좌표를 격자 좌표로 변환
  const worldToGrid = useCallback((worldX: number, worldZ: number) => {
    return {
      gridX: Math.round(worldX / cellSize),
      gridY: Math.round(worldZ / cellSize),
    };
  }, [cellSize]);

  useEffect(() => {
    if (!scene || !modelPath) return;

    let rootMesh: AbstractMesh | null = null;

    // 3D 모델 로드
    SceneLoader.ImportMesh(
      '',
      modelPath.substring(0, modelPath.lastIndexOf('/') + 1),
      modelPath.substring(modelPath.lastIndexOf('/') + 1),
      scene,
      (meshes) => {
        if (meshes.length === 0) return;

        // 루트 메시 생성
        rootMesh = meshes[0];
        rootMesh.id = equipment.id;
        rootMesh.name = `equipment-${equipment.id}`;

        // 스케일 조정 (격자 크기에 맞춤)
        const scaleFactor = cellSize * 0.8; // 격자의 80% 크기
        rootMesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);

        // 위치 설정
        const worldPos = gridToWorld(equipment.gridX, equipment.gridY, equipment.gridZ);
        rootMesh.position = worldPos;

        // 회전 설정
        rootMesh.rotation.y = equipment.rotation;

        // 선택 가능하게 설정
        rootMesh.isPickable = true;
        meshes.forEach((mesh) => {
          mesh.isPickable = true;
        });

        // 하이라이트 색상 (선택 시)
        if (isSelected) {
          meshes.forEach((mesh) => {
            if (mesh.material && 'emissiveColor' in mesh.material) {
              (mesh.material as StandardMaterial).emissiveColor = rgbStringToColor3(COLORS.highlight);
            }
          });
        }

        meshRef.current = rootMesh;
        setIsLoaded(true);

        // 클릭으로 선택
        rootMesh.actionManager = new ActionManager(scene);
        rootMesh.actionManager.registerAction(
          new ExecuteCodeAction(
            ActionManager.OnPickTrigger,
            () => {
              onSelect(equipment.id);
            }
          )
        );

        // ✅ PointerDragBehavior 추가 (XZ 평면에서만 드래그)
        const dragBehavior = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) });
        dragBehaviorRef.current = dragBehavior;
        
        // 드래그 시작 시
        dragBehavior.onDragStartObservable.add(() => {
          // Ghost 메시가 이미 있다면 제거 (안전장치)
          if (ghostMeshRef.current) {
            ghostMeshRef.current.dispose();
            ghostMeshRef.current = null;
          }

          // Ghost 메시 생성
          const ghost = rootMesh!.clone(`ghost-${equipment.id}`, null);
          
          if (ghost) {
            ghostMeshRef.current = ghost;

            // Ghost 메시 스타일링 (반투명 하얀색)
            const ghostMaterial = new StandardMaterial(`ghostMat-${equipment.id}`, scene);
            ghostMaterial.alpha = 0.3;
            ghostMaterial.diffuseColor = new Color3(1, 1, 1);
            ghostMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5);
            
            ghost.getChildMeshes().forEach((mesh) => {
              mesh.material = ghostMaterial;
            });
            if (ghost.material) {
              ghost.material = ghostMaterial;
            }

            // Ghost는 선택 불가능하게
            ghost.isPickable = false;
            ghost.getChildMeshes().forEach((mesh) => {
              mesh.isPickable = false;
            });
          }
        });

        // 드래그 중
        dragBehavior.onDragObservable.add(() => {
          if (rootMesh) {
            // Ghost 메시의 위치를 현재 드래그 위치로 업데이트
            if (ghostMeshRef.current) {
              ghostMeshRef.current.position.copyFrom(rootMesh.position);
            }
          }
        });

        // ✅✅ 드래그 종료 시 (가장 중요!)
        dragBehavior.onDragEndObservable.add(() => {
          if (rootMesh) {
            // 현재 월드 좌표를 격자 좌표로 변환 (스냅)
            const { gridX, gridY } = worldToGrid(rootMesh.position.x, rootMesh.position.z);
            
            // 격자 좌표로 위치 업데이트
            onPositionChange(equipment.id, gridX, gridY);

            // 스냅된 위치로 메시 위치 업데이트
            const snappedPos = gridToWorld(gridX, gridY, equipment.gridZ);
            rootMesh.position = snappedPos;
          }

          // ✅ Ghost 메시 완전히 제거!
          if (ghostMeshRef.current) {
            ghostMeshRef.current.dispose();
            ghostMeshRef.current = null;
          }
        });

        rootMesh.addBehavior(dragBehavior);
      },
      undefined,
      (_scene, message, exception) => {
        console.error('Error loading model:', message, exception);
      }
    );

    return () => {
      // ✅ 컴포넌트 언마운트 시 정리
      if (ghostMeshRef.current) {
        ghostMeshRef.current.dispose();
        ghostMeshRef.current = null;
      }
      
      if (dragBehaviorRef.current) {
        dragBehaviorRef.current.detach();
        dragBehaviorRef.current = null;
      }

      if (rootMesh) {
        rootMesh.dispose();
      }
    };
  }, [scene, equipment.id, modelPath, cellSize, onSelect, onPositionChange, gridToWorld, worldToGrid, equipment.gridX, equipment.gridY, equipment.gridZ, equipment.rotation, isSelected]);

  // 위치 업데이트
  useEffect(() => {
    if (!meshRef.current || !isLoaded) return;

    const worldPos = gridToWorld(equipment.gridX, equipment.gridY, equipment.gridZ);
    meshRef.current.position = worldPos;
  }, [equipment.gridX, equipment.gridY, equipment.gridZ, isLoaded, gridToWorld]);

  // 회전 업데이트
  useEffect(() => {
    if (!meshRef.current || !isLoaded) return;
    meshRef.current.rotation.y = equipment.rotation;
  }, [equipment.rotation, isLoaded]);

  // 선택 상태 업데이트
  useEffect(() => {
    if (!meshRef.current || !isLoaded) return;

    const updateHighlight = (mesh: AbstractMesh) => {
      if (mesh.material && 'emissiveColor' in mesh.material) {
        // 선택된 경우 하이라이트
        (mesh.material as StandardMaterial).emissiveColor = isSelected
          ? rgbStringToColor3(COLORS.highlight)
          : new Color3(0, 0, 0);
      }
    };

    meshRef.current.getChildMeshes().forEach(updateHighlight);
    updateHighlight(meshRef.current);
  }, [isSelected, isLoaded]);

  return null;
};
