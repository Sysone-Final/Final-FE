import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  Scene,
  SceneLoader,
  AbstractMesh,
  Vector3,
  Color3,
  PointerDragBehavior,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {
  COLORS,
  EQUIPMENT_SCALE,
  EQUIPMENT_Y_OFFSET,
  EQUIPMENT_POSITION_OFFSET,
} from "../../constants/config";
import type { Equipment3D } from "../../types";

interface Equipment3DModelProps {
  scene: Scene;
  equipment: Equipment3D;
  cellSize: number;
  modelPath: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, gridX: number, gridY: number) => boolean; // boolean 반환으로 변경
  isDraggable?: boolean; // 드래그 가능 여부 (기본값: true)
  onServerClick?: (serverId: string) => void; // server 클릭 핸들러 추가
  onRightClick?: (equipmentId: string, x: number, y: number) => void; // 우클릭 핸들러 추가
  selectedEquipmentIds?: string[]; // 다중 선택된 ID 목록
  onMultiDragEnd?: (
    updates: {
      id: string;
      gridX: number;
      gridY: number;
      originalGridX: number;
      originalGridY: number;
    }[]
  ) => boolean; // boolean 반환으로 변경
}

function Equipment3DModel({
  scene,
  equipment,
  cellSize,
  modelPath,
  isSelected,
  onSelect,
  onPositionChange,
  isDraggable = true, // 기본값: 드래그 가능
  onServerClick, // server 클릭 핸들러
  onRightClick, // 우클릭 핸들러
  selectedEquipmentIds = [],
  onMultiDragEnd,
}: Equipment3DModelProps) {
  const meshRef = useRef<AbstractMesh | null>(null);
  const dragBehaviorRef = useRef<PointerDragBehavior | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isDraggingRef = useRef(false); // 드래그 중인지 추적
  const selectedEquipmentIdsRef = useRef<string[]>([]); // 최신 선택 상태 추적
  const onSelectRef = useRef(onSelect);
  const onPositionChangeRef = useRef(onPositionChange);
  const onRightClickRef = useRef(onRightClick);
  const onServerClickRef = useRef(onServerClick);
  const onMultiDragEndRef = useRef(onMultiDragEnd);
  // 각 메시의 원래 emissive 색상을 저장
  const originalEmissiveColors = useRef<Map<string, Color3>>(new Map());
  // 다중 드래그 시작 위치 저장
  const multiDragStartPositions = useRef<
    Map<string, { gridX: number; gridY: number }>
  >(new Map());

  // selectedEquipmentIds의 최신 값을 ref에 동기화
  useEffect(() => {
    selectedEquipmentIdsRef.current = selectedEquipmentIds;
  }, [selectedEquipmentIds]);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    onPositionChangeRef.current = onPositionChange;
  }, [onPositionChange]);

  useEffect(() => {
    onRightClickRef.current = onRightClick;
  }, [onRightClick]);

  useEffect(() => {
    onServerClickRef.current = onServerClick;
  }, [onServerClick]);

  useEffect(() => {
    onMultiDragEndRef.current = onMultiDragEnd;
  }, [onMultiDragEnd]);

  // 격자 좌표를 월드 좌표로 변환
  const gridToWorld = useCallback(
    (gridX: number, gridY: number) => {
      const yOffset = EQUIPMENT_Y_OFFSET[equipment.type] || 0; // 장비별 Y축 오프셋
      const posOffset = EQUIPMENT_POSITION_OFFSET[equipment.type] || {
        x: 0,
        z: 0,
      }; // 장비별 위치 오프셋

      return new Vector3(
        gridX * cellSize + cellSize / 2 + posOffset.x * cellSize, // X축: 격자 중심 + 오프셋
        yOffset, // Y축: 장비별 오프셋 적용
        gridY * cellSize + cellSize / 2 + posOffset.z * cellSize // Z축: 격자 중심 + 오프셋
      );
    },
    [cellSize, equipment.type]
  );

  // 월드 좌표를 격자 좌표로 변환
  const worldToGrid = useCallback(
    (worldX: number, worldZ: number) => {
      // 격자 중심 오프셋을 제거한 후 변환
      // gridToWorld에서 cellSize/2를 더했으므로, 여기서는 빼줘야 정확함
      return {
        gridX: Math.floor(worldX / cellSize),
        gridY: Math.floor(worldZ / cellSize),
      };
    },
    [cellSize]
  );

  useEffect(() => {
    if (!scene || !modelPath) return;

    setIsLoaded(false);

    let rootMesh: AbstractMesh | null = null;
    let isLoadingCancelled = false; // 로딩 취소 플래그
    // cleanup을 위해 현재 originalEmissiveColors Map 참조 저장
    const emissiveColorsMap = originalEmissiveColors.current;

    // 3D 모델 로드 - rootUrl과 fileName 분리
    const lastSlashIndex = modelPath.lastIndexOf("/");
    const rootUrl =
      lastSlashIndex > -1 ? modelPath.substring(0, lastSlashIndex + 1) : "/";
    const fileName =
      lastSlashIndex > -1 ? modelPath.substring(lastSlashIndex + 1) : modelPath;

    SceneLoader.ImportMesh(
      "",
      rootUrl, // 텍스처 경로를 위한 루트 URL
      fileName, // 파일명만
      scene,
      (meshes) => {
        // cleanup이 실행되었으면 메시를 생성하지 않음
        if (isLoadingCancelled) {
          meshes.forEach((mesh) => mesh.dispose());
          return;
        }

        if (meshes.length === 0) return;

        // 루트 메시 생성
        rootMesh = meshes[0];
        rootMesh.id = equipment.id;
        rootMesh.name = `equipment-${equipment.id}`;

        // 스케일 조정 (장비 타입별 스케일 적용)
        const typeScale = EQUIPMENT_SCALE[equipment.type] || 0.8; // 기본값 0.8
        const scaleFactor = cellSize * typeScale;
        rootMesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);

        // GLTF 모델 로드 시 rotationQuaternion 제거 (Euler 회전을 사용하기 위해)
        // 공식문서: rotationQuaternion이 존재하면 rotation 값이 무시됨
        rootMesh.rotationQuaternion = null;
        meshes.forEach((mesh) => {
          if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion = null;
          }
        });

        // 선택 가능하게 설정
        rootMesh.isPickable = true;
        meshes.forEach((mesh) => {
          mesh.isPickable = true;

          // 각 메시의 원래 emissive 색상 저장
          if (mesh.material && "emissiveColor" in mesh.material) {
            const material = mesh.material as { emissiveColor?: Color3 };
            if (material.emissiveColor) {
              // 원래 색상 복사해서 저장
              emissiveColorsMap.set(
                mesh.uniqueId.toString(),
                material.emissiveColor.clone()
              );
            }
          }
        });

        meshRef.current = rootMesh;
        setIsLoaded(true);
      },
      undefined,
      (_scene, message, exception) => {
        console.error("Error loading model:", modelPath, message, exception);
      }
    );

    return () => {
      // 컴포넌트 언마운트 시 정리
      // 로딩 취소 플래그 설정
      isLoadingCancelled = true;

      if (meshRef.current) {
        // 메시 dispose
        meshRef.current.dispose();
        meshRef.current = null;
      }

      // 원본 색상 맵 정리
      emissiveColorsMap.clear();
    };
  }, [scene, equipment.id, equipment.type, modelPath, cellSize]);

  // 드래그 동작과 클릭 이벤트 핸들러 설정 (모드 변경 시에만 업데이트)
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !isLoaded) return;

    // 기존 ActionManager 정리
    if (mesh.actionManager) {
      mesh.actionManager.dispose();
      mesh.actionManager = null;
    }

    // 자식 메시들의 ActionManager도 정리
    const childMeshes = mesh.getChildMeshes();
    childMeshes.forEach((childMesh) => {
      if (childMesh.actionManager) {
        childMesh.actionManager.dispose();
        childMesh.actionManager = null;
      }
    });

    // 기존 드래그 동작 제거
    if (dragBehaviorRef.current) {
      dragBehaviorRef.current.detach();
      dragBehaviorRef.current = null;
    }

    const hasRightClickHandler = Boolean(onRightClickRef.current);
    const hasServerClickHandler = Boolean(onServerClickRef.current);

    // 편집 모드: 드래그 동작 추가
    if (isDraggable) {
      const dragBehavior = new PointerDragBehavior({
        dragPlaneNormal: new Vector3(0, 1, 0),
      });
      dragBehavior.moveAttached = false;
      dragBehaviorRef.current = dragBehavior;

      // 드래그 시작 전에 선택되었는지 확인할 플래그
      let wasSelectedBeforeDrag = false;

      dragBehavior.onDragStartObservable.add(() => {
        const currentSelectedIds = selectedEquipmentIdsRef.current;
        wasSelectedBeforeDrag = currentSelectedIds.includes(equipment.id);

        isDraggingRef.current = true; // 드래그 시작

        // 선택되지 않은 장비라면 즉시 선택
        if (!wasSelectedBeforeDrag) {
          onSelectRef.current?.(equipment.id);
        }

        // 다중 선택된 장비들의 시작 위치 저장 (이미 선택된 경우에만)
        const isCurrentlyMultiSelected =
          wasSelectedBeforeDrag && currentSelectedIds.length > 1;
        if (wasSelectedBeforeDrag && isCurrentlyMultiSelected) {
          multiDragStartPositions.current.clear();
          // 선택된 모든 장비의 현재 위치 저장
          scene.meshes.forEach((sceneMesh) => {
            if (sceneMesh.id && currentSelectedIds.includes(sceneMesh.id)) {
              const pos = worldToGrid(
                sceneMesh.position.x,
                sceneMesh.position.z
              );
              multiDragStartPositions.current.set(sceneMesh.id, pos);
            }
          });
        } else {
          // 단일 드래그 시에도 원래 위치 저장
          const pos = worldToGrid(mesh.position.x, mesh.position.z);
          multiDragStartPositions.current.set(equipment.id, pos);
        }
      });

      dragBehavior.onDragObservable.add((event) => {
        if (mesh) {
          const newPos = event.dragPlanePoint;
          mesh.position.copyFrom(newPos);

          const currentSelectedIds = selectedEquipmentIdsRef.current;
          const isCurrentlyMultiSelected =
            currentSelectedIds.includes(equipment.id) &&
            currentSelectedIds.length > 1;

          // 다중 선택 시 다른 장비들도 함께 이동 (드래그 시작 전에 이미 선택된 경우에만)
          if (wasSelectedBeforeDrag && isCurrentlyMultiSelected) {
            const currentGrid = worldToGrid(newPos.x, newPos.z);
            const startPos = multiDragStartPositions.current.get(equipment.id);

            if (startPos) {
              const deltaX = currentGrid.gridX - startPos.gridX;
              const deltaY = currentGrid.gridY - startPos.gridY;

              // 다른 선택된 장비들도 같은 오프셋만큼 이동
              scene.meshes.forEach((sceneMesh) => {
                if (
                  sceneMesh.id &&
                  sceneMesh.id !== equipment.id &&
                  currentSelectedIds.includes(sceneMesh.id)
                ) {
                  const otherStartPos = multiDragStartPositions.current.get(
                    sceneMesh.id
                  );
                  if (otherStartPos) {
                    const newGridX = otherStartPos.gridX + deltaX;
                    const newGridY = otherStartPos.gridY + deltaY;
                    const worldPos = gridToWorld(newGridX, newGridY);
                    sceneMesh.position = worldPos;
                  }
                }
              });
            }
          }
        }
      });

      dragBehavior.onDragEndObservable.add(() => {
        if (mesh) {
          isDraggingRef.current = false; // 드래그 종료

          const currentSelectedIds = selectedEquipmentIdsRef.current;
          const isCurrentlyMultiSelected =
            currentSelectedIds.includes(equipment.id) &&
            currentSelectedIds.length > 1;

          // 🔥 핵심: 드래그 시작 전에 이미 선택된 상태였고, 다중 선택이었을 때만 다중 업데이트
          if (
            wasSelectedBeforeDrag &&
            isCurrentlyMultiSelected &&
            onMultiDragEndRef.current
          ) {
            const updates: {
              id: string;
              gridX: number;
              gridY: number;
              originalGridX: number;
              originalGridY: number;
            }[] = [];

            scene.meshes.forEach((sceneMesh) => {
              if (sceneMesh.id && currentSelectedIds.includes(sceneMesh.id)) {
                const gridPos = worldToGrid(
                  sceneMesh.position.x,
                  sceneMesh.position.z
                );
                const originalPos = multiDragStartPositions.current.get(
                  sceneMesh.id
                );
                if (originalPos) {
                  updates.push({
                    id: sceneMesh.id,
                    gridX: gridPos.gridX,
                    gridY: gridPos.gridY,
                    originalGridX: originalPos.gridX,
                    originalGridY: originalPos.gridY,
                  });
                }
              }
            });

            // 유효성 검사를 포함한 다중 업데이트 (store에서 처리)
            const validationResult = onMultiDragEndRef.current?.(updates);

            // 유효성 검사 실패 시 모든 메시를 원래 위치로 되돌림
            if (validationResult === false) {
              scene.meshes.forEach((sceneMesh) => {
                if (sceneMesh.id && currentSelectedIds.includes(sceneMesh.id)) {
                  const originalPos = multiDragStartPositions.current.get(
                    sceneMesh.id
                  );
                  if (originalPos) {
                    const snappedPos = gridToWorld(
                      originalPos.gridX,
                      originalPos.gridY
                    );
                    sceneMesh.position = snappedPos;
                  }
                }
              });
            } else {
              // 유효성 검사 성공 시 격자에 스냅
              scene.meshes.forEach((sceneMesh) => {
                if (sceneMesh.id && currentSelectedIds.includes(sceneMesh.id)) {
                  const gridPos = worldToGrid(
                    sceneMesh.position.x,
                    sceneMesh.position.z
                  );
                  const snappedPos = gridToWorld(gridPos.gridX, gridPos.gridY);
                  sceneMesh.position = snappedPos;
                }
              });
            }

            multiDragStartPositions.current.clear();
          } else {
            // 단일 선택 시: 드래그 시작 전에 선택되지 않았거나, 단일 선택이었던 경우
            const { gridX, gridY } = worldToGrid(
              mesh.position.x,
              mesh.position.z
            );

            // 유효성 검사 결과에 따라 위치 업데이트 또는 원위치 복원
            const validationResult = onPositionChangeRef.current?.(
              equipment.id,
              gridX,
              gridY
            );

            if (validationResult === false) {
              // 유효성 검사 실패 시 원래 위치로 되돌림
              const originalPos = multiDragStartPositions.current.get(
                equipment.id
              );
              if (originalPos) {
                const snappedPos = gridToWorld(
                  originalPos.gridX,
                  originalPos.gridY
                );
                mesh.position = snappedPos;
              }
            } else {
              // 유효성 검사 성공 시 격자에 스냅
              const snappedPos = gridToWorld(gridX, gridY);
              mesh.position = snappedPos;
            }
          }
        }
      });

      mesh.addBehavior(dragBehavior);

      // 우클릭 이벤트 추가 (edit 모드에서)
      if (hasRightClickHandler) {
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
            const event = evt.sourceEvent as PointerEvent;
            if (event.button === 2) {
              event.preventDefault();
              onRightClickRef.current?.(
                equipment.id,
                event.clientX,
                event.clientY
              );
            }
          })
        );

        // 모든 자식 메시에도 동일한 액션 적용
        childMeshes.forEach((childMesh) => {
          if (!childMesh.actionManager) {
            childMesh.actionManager = new ActionManager(scene);
          }
          childMesh.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
              const event = evt.sourceEvent as PointerEvent;
              if (event.button === 2) {
                event.preventDefault();
                onRightClickRef.current?.(
                  equipment.id,
                  event.clientX,
                  event.clientY
                );
              }
            })
          );
        });
      }
    }
    // 보기 모드: server 클릭 이벤트 추가
    else if (equipment.type === "server" && hasServerClickHandler) {
      mesh.actionManager = new ActionManager(scene);
      mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          if (equipment.rackId) {
            onServerClickRef.current?.(equipment.rackId.toString());
          }
        })
      );

      // 모든 자식 메시에도 동일한 액션 적용
      childMeshes.forEach((childMesh) => {
        childMesh.actionManager = new ActionManager(scene);
        childMesh.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
            if (equipment.rackId) {
              onServerClickRef.current?.(equipment.rackId.toString());
            }
          })
        );
      });
    }

    return () => {
      // 이벤트 핸들러만 정리 (메시는 dispose하지 않음)
      if (dragBehaviorRef.current) {
        dragBehaviorRef.current.detach();
        dragBehaviorRef.current = null;
      }

      if (mesh.actionManager) {
        mesh.actionManager.dispose();
        mesh.actionManager = null;
      }

      childMeshes.forEach((childMesh) => {
        if (childMesh.actionManager) {
          childMesh.actionManager.dispose();
          childMesh.actionManager = null;
        }
      });
    };
  }, [
    isLoaded,
    isDraggable,
    equipment.id,
    equipment.rackId,
    equipment.type,
    scene,
    gridToWorld,
    worldToGrid,
  ]);

  // 위치 업데이트 (초기 설정 + 드래그나 외부에서 위치 변경 시)
  useEffect(() => {
    if (!meshRef.current || !isLoaded) return;

    // 드래그 중일 때는 위치 업데이트 무시 (드래그가 위치를 제어함)
    if (isDraggingRef.current) {
      return;
    }

    const worldPos = gridToWorld(equipment.gridX, equipment.gridY);
    meshRef.current.position = worldPos;
  }, [
    equipment.gridX,
    equipment.gridY,
    isLoaded,
    equipment.id,
    equipment.type,
    cellSize,
    gridToWorld,
  ]);

  // 회전 업데이트
  useEffect(() => {
    if (!meshRef.current || !isLoaded) return;

    // 🔥 rotationQuaternion이 다시 생성될 수 있으므로 매번 null로 설정
    // 공식문서: rotationQuaternion과 rotation을 함께 사용하면 충돌 발생
    meshRef.current.rotationQuaternion = null;

    // 자식 메시들도 동일하게 처리
    meshRef.current.getChildMeshes().forEach((mesh) => {
      if (mesh.rotationQuaternion) {
        mesh.rotationQuaternion = null;
      }
    });

    // Euler 회전 적용 (Y축 회전)
    meshRef.current.rotation.y = equipment.rotation;
  }, [equipment.rotation, isLoaded, equipment.id]);

  // 선택 상태 업데이트
  useEffect(() => {
    if (!meshRef.current || !isLoaded) return;

    const updateHighlight = (mesh: AbstractMesh) => {
      if (mesh.material && "emissiveColor" in mesh.material) {
        const material = mesh.material as { emissiveColor: Color3 };

        // 원래 emissive 색상 가져오기
        const originalColor = originalEmissiveColors.current.get(
          mesh.uniqueId.toString()
        );

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

// React.memo로 감싸서 불필요한 리렌더링 방지
// 실제로 변경된 props만 비교
const MemoizedEquipment3DModel = memo(
  Equipment3DModel,
  (prevProps, nextProps) => {
    // equipment 객체의 실제 값 비교
    const equipmentEqual =
      prevProps.equipment.id === nextProps.equipment.id &&
      prevProps.equipment.type === nextProps.equipment.type &&
      prevProps.equipment.gridX === nextProps.equipment.gridX &&
      prevProps.equipment.gridY === nextProps.equipment.gridY &&
      prevProps.equipment.gridZ === nextProps.equipment.gridZ &&
      prevProps.equipment.rotation === nextProps.equipment.rotation;

    // 다른 primitive props 비교
    const otherPropsEqual =
      prevProps.cellSize === nextProps.cellSize &&
      prevProps.modelPath === nextProps.modelPath &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isDraggable === nextProps.isDraggable;

    // selectedEquipmentIds는 이 장비가 선택되었는지 여부만 확인
    const wasSelected =
      prevProps.selectedEquipmentIds?.includes(prevProps.equipment.id) ?? false;
    const isNowSelected =
      nextProps.selectedEquipmentIds?.includes(nextProps.equipment.id) ?? false;
    const selectionEqual = wasSelected === isNowSelected;

    // 콜백 함수는 비교하지 않음 (Zustand에서 매번 새로 생성될 수 있음)
    // 대신 equipment와 selection 상태만으로 리렌더링 결정
    const shouldSkipRender =
      equipmentEqual && otherPropsEqual && selectionEqual;

    // 모든 조건이 true면 리렌더링 스킵 (true 반환)
    return shouldSkipRender;
  }
);
MemoizedEquipment3DModel.displayName = "Equipment3DModel";

export default MemoizedEquipment3DModel;
