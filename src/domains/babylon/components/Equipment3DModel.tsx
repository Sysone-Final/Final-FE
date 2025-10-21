import { useEffect, useRef, useState, useCallback } from 'react';
import { Scene, SceneLoader, AbstractMesh, Vector3, Color3, PointerDragBehavior } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { COLORS, EQUIPMENT_SCALE, EQUIPMENT_Y_OFFSET, EQUIPMENT_POSITION_OFFSET } from '../constants/config';
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

function Equipment3DModel({
  scene,
  equipment,
  cellSize,
  modelPath,
  isSelected,
  onSelect,
  onPositionChange,
}: Equipment3DModelProps) {
  const meshRef = useRef<AbstractMesh | null>(null);
  const dragBehaviorRef = useRef<PointerDragBehavior | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // 🔥 각 메시의 원래 emissive 색상을 저장
  const originalEmissiveColors = useRef<Map<string, Color3>>(new Map());

  // 격자 좌표를 월드 좌표로 변환
  const gridToWorld = useCallback((gridX: number, gridY: number, _gridZ: number = 0) => {
    const yOffset = EQUIPMENT_Y_OFFSET[equipment.type] || 0; // 장비별 Y축 오프셋
    const posOffset = EQUIPMENT_POSITION_OFFSET[equipment.type] || { x: 0, z: 0 }; // 장비별 위치 오프셋
    
    return new Vector3(
      gridX * cellSize + cellSize / 2 + (posOffset.x * cellSize),  // X축: 격자 중심 + 오프셋
      yOffset,                                                       // Y축: 장비별 오프셋 적용
      gridY * cellSize + cellSize / 2 + (posOffset.z * cellSize)   // Z축: 격자 중심 + 오프셋
    );
  }, [cellSize, equipment.type]);

  // 월드 좌표를 격자 좌표로 변환
  const worldToGrid = useCallback((worldX: number, worldZ: number) => {
    // 격자 중심 오프셋을 제거한 후 변환
    // gridToWorld에서 cellSize/2를 더했으므로, 여기서는 빼줘야 정확함
    return {
      gridX: Math.floor(worldX / cellSize),
      gridY: Math.floor(worldZ / cellSize),
    };
  }, [cellSize]);

  useEffect(() => {
    if (!scene || !modelPath) return;

    let rootMesh: AbstractMesh | null = null;

    // 3D 모델 로드 - rootUrl과 fileName 분리
    console.log('Loading model from:', modelPath);
    const lastSlashIndex = modelPath.lastIndexOf('/');
    const rootUrl = lastSlashIndex > -1 ? modelPath.substring(0, lastSlashIndex + 1) : '/';
    const fileName = lastSlashIndex > -1 ? modelPath.substring(lastSlashIndex + 1) : modelPath;
    
    console.log('RootUrl:', rootUrl, 'FileName:', fileName);
    
    SceneLoader.ImportMesh(
      '',
      rootUrl,   // 텍스처 경로를 위한 루트 URL
      fileName,  // 파일명만
      scene,
      (meshes) => {
        console.log('Model loaded successfully:', meshes.length, 'meshes');
        if (meshes.length === 0) return;

        // 루트 메시 생성
        rootMesh = meshes[0];
        rootMesh.id = equipment.id;
        rootMesh.name = `equipment-${equipment.id}`;

        // 스케일 조정 (장비 타입별 스케일 적용)
        const typeScale = EQUIPMENT_SCALE[equipment.type] || 0.8; // 기본값 0.8
        const scaleFactor = cellSize * typeScale;
        rootMesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);

        // 위치 설정
        const worldPos = gridToWorld(equipment.gridX, equipment.gridY, equipment.gridZ);
        rootMesh.position = worldPos;

        // 회전 설정 (store의 rotation 값 사용, 이미 기본 회전 포함)
        rootMesh.rotation.y = equipment.rotation;

        // 선택 가능하게 설정
        rootMesh.isPickable = true;
        meshes.forEach((mesh) => {
          mesh.isPickable = true;
          
          // 🔥 각 메시의 원래 emissive 색상 저장
          if (mesh.material && 'emissiveColor' in mesh.material) {
            const material = mesh.material as any;
            if (material.emissiveColor) {
              // 원래 색상 복사해서 저장
              originalEmissiveColors.current.set(
                mesh.uniqueId.toString(),
                material.emissiveColor.clone()
              );
              console.log(`💾 Saved original emissive for ${mesh.name}:`, material.emissiveColor);
            }
          }
        });

        meshRef.current = rootMesh;
        setIsLoaded(true);

        // PointerDragBehavior 추가 (XZ 평면에서만 드래그)
        const dragBehavior = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) });
        dragBehavior.moveAttached = false; // 자동 이동 비활성화 (수동으로 제어)
        dragBehaviorRef.current = dragBehavior;
        
        // 드래그 시작 시
        dragBehavior.onDragStartObservable.add(() => {
          // 드래그 시작 시 장비 선택
          onSelect(equipment.id);
        });

        // 드래그 중
        dragBehavior.onDragObservable.add((event) => {
          if (rootMesh) {
            // 실제 메시를 드래그 위치로 이동
            rootMesh.position.copyFrom(event.dragPlanePoint);
          }
        });

        // 드래그 종료 시
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
        });

        rootMesh.addBehavior(dragBehavior);
      },
      undefined,
      (_scene, message, exception) => {
        console.error('Error loading model:', modelPath, message, exception);
      }
    );

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (dragBehaviorRef.current) {
        dragBehaviorRef.current.detach();
        dragBehaviorRef.current = null;
      }

      if (meshRef.current) {
        meshRef.current.dispose();
        meshRef.current = null;
      }
    };
  }, [scene, equipment.id, modelPath, cellSize, onSelect, onPositionChange, gridToWorld, worldToGrid]);

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
        const material = mesh.material as any;
        
        // 🔥 원래 emissive 색상 가져오기
        const originalColor = originalEmissiveColors.current.get(mesh.uniqueId.toString());
        
        if (isSelected) {
          // 선택 시: 하이라이트 색상 적용 (원래 색상 무시하고 덮어쓰기)
          const highlightColor = Color3.FromHexString(COLORS.highlight);
          material.emissiveColor = highlightColor.scale(0.3);
        } else {
          // 선택 해제 시: 원래 색상 복원
          if (originalColor) {
            material.emissiveColor = originalColor.clone();
          } else {
            // 원래 색상이 없으면 흰색 (텍스처가 색상 제어)
            material.emissiveColor = new Color3(1, 1, 1);
          }
        }
      }
    };

    meshRef.current.getChildMeshes().forEach(updateHighlight);
    updateHighlight(meshRef.current);
  }, [isSelected, isLoaded]);

  return null;
}

export default Equipment3DModel