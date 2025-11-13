import { useRef, useEffect, useState, useCallback } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color4, type IPointerEvent, type PickingInfo } from '@babylonjs/core';
import { Snackbar, Alert } from '@mui/material';
import GridFloor from './GridFloor';
import Equipment3DModel from './Equipment3DModel';
import EquipmentPalette3D from './EquipmentPalette3D';
import ContextMenu from './ContextMenu';
import SelectionBox from './SelectionBox';
import { useBabylonDatacenterStore } from '../stores/useBabylonDatacenterStore';
import { CAMERA_CONFIG, EQUIPMENT_PALETTE } from '../constants/config';
import { useServerRoomEquipment } from '../hooks/useServerRoomEquipment';
import { getNextDeviceNumber, generateDeviceName } from '../utils/deviceNameGenerator';
import { createDevice, deleteEquipment, updateEquipment } from '../api/serverRoomEquipmentApi';
import type { EquipmentType } from '../types';
import { LoadingSpinner } from '@/shared/loading';

interface BabylonDatacenterViewProps {
  mode?: 'edit' | 'view'; // 초기 모드 (기본값: view)
  serverRoomId?: string; // 서버실 ID
  datacenterId?: number; // 데이터센터 ID (장비 생성 시 필요)
}

function BabylonDatacenterView({ mode: initialMode = 'view', serverRoomId, datacenterId = 1 }: BabylonDatacenterViewProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const renderLoopRef = useRef<boolean>(true); // 렌더링 루프 제어
  const hasAppliedInitialModeRef = useRef(false);

  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    equipmentId: string;
  } | null>(null);
  
  // 다중 선택 드래그 상태
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ gridX: number; gridY: number } | null>(null);

  // 토스트 메시지 상태
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Zustand
  const {
    gridConfig,
    equipment,
    selectedEquipmentId,
    selectedEquipmentIds,
    setSelectedEquipment,
    updateEquipmentPosition,
    updateMultipleEquipmentPositions,
    openRackModal, // 랙 모달 열기
    isRackModalOpen, // 랙 모달 상태 추가
    rotateEquipment90,
    removeEquipment,
    mode,
    setMode,
    currentServerRoomId,
    initializeServerRoom,
    isValidPosition,
    isPositionOccupied,
    selectionArea,
    setSelectionArea,
    selectEquipmentInArea,
    clearSelection,
    setGridConfig, // 그리드 설정 함수 추가
  } = useBabylonDatacenterStore();

  // 서버실 데이터 로드 (API 사용)
  const { equipment: fetchedEquipment, gridConfig: fetchedGridConfig, loading: equipmentLoading } = useServerRoomEquipment(serverRoomId);

  // 초기 모드 적용 (최초 한 번)
  useEffect(() => {
    if (hasAppliedInitialModeRef.current) return;
    setMode(initialMode);
    hasAppliedInitialModeRef.current = true;
  }, [initialMode, setMode]);

  // 서버실 데이터 로드 및 그리드 설정
  useEffect(() => {
    if (!serverRoomId || equipmentLoading) return;
    if (!fetchedEquipment || !fetchedGridConfig) return;

    // 그리드 설정 업데이트
    setGridConfig({
      rows: fetchedGridConfig.rows,
      columns: fetchedGridConfig.columns,
    });

    // 서버실 초기화 (변경 감지 로직은 initializeServerRoom 내부에서 처리)
    initializeServerRoom(serverRoomId, fetchedEquipment);
  }, [serverRoomId, currentServerRoomId, initializeServerRoom, fetchedEquipment, fetchedGridConfig, equipmentLoading, setGridConfig]);

  // 토스트 표시 헬퍼
  const showToast = useCallback((message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  // 장비 추가 핸들러
  const handleAddEquipment = useCallback(async (type: EquipmentType) => {
    if (!serverRoomId) {
      showToast('서버실 ID가 없습니다', 'error');
      return;
    }

    try {
      // 맵 중앙에 추가
      const centerX = Math.floor(gridConfig.columns / 2);
      const centerY = Math.floor(gridConfig.rows / 2);

      // 다음 사용 가능한 장비 번호 계산
      const nextNumber = getNextDeviceNumber(equipment, type, serverRoomId);
      const deviceName = generateDeviceName(type, serverRoomId, nextNumber);

      // API를 통해 장비 생성
      const createdEquipment = await createDevice(
        {
          type,
          gridX: centerX,
          gridY: centerY,
          gridZ: 0,
          rotation: 0,
          metadata: {
            name: deviceName,
            status: 'NORMAL',
          },
        },
        Number(serverRoomId),
        datacenterId,
        equipment, // 기존 장비 목록 전달
      );

      // 스토어에 추가 (loadEquipment 대신 직접 업데이트)
      useBabylonDatacenterStore.setState((state) => ({
        equipment: [...state.equipment, createdEquipment],
      }));

      showToast('장치가 추가되었습니다', 'success');
    } catch (error) {
      console.error('Failed to add equipment:', error);
      showToast('장치 추가에 실패했습니다', 'error');
    }
  }, [serverRoomId, datacenterId, gridConfig.columns, gridConfig.rows, showToast, equipment]);

  const handleRotateEquipment = useCallback((clockwise: boolean) => {
    if (!selectedEquipmentId) return;
    
    const equipmentToRotate = equipment.find(eq => eq.id === selectedEquipmentId);
    if (!equipmentToRotate) return;

    // 로컬 상태 업데이트
    rotateEquipment90(selectedEquipmentId, clockwise);
    
    // 새로운 회전값 계산
    const rotation90 = Math.PI / 2;
    const newRotation = clockwise
      ? equipmentToRotate.rotation + rotation90
      : equipmentToRotate.rotation - rotation90;
    const normalizedRotation = ((newRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // 백엔드 업데이트 (비동기 - 응답을 기다리지 않음)
    updateEquipment({
      ...equipmentToRotate,
      rotation: normalizedRotation,
    }).catch(error => {
      console.error('Failed to rotate equipment:', error);
      showToast('장비 회전에 실패했습니다', 'error');
    });
  }, [rotateEquipment90, selectedEquipmentId, equipment, showToast]);

  // 모드에 따라 안정적인 핸들러 반환 (memo 최적화용)
  // Server 클릭 핸들러 (view 모드에서만)
  const serverClickHandler = useCallback((serverId: string) => {
    openRackModal(serverId);
  }, [openRackModal]);

  // 장비 우클릭 핸들러 (edit 모드에서만)
  const rightClickHandler = useCallback((equipmentId: string, x: number, y: number) => {
    // 우클릭한 장비가 선택되지 않았다면 선택
    if (!selectedEquipmentIds.includes(equipmentId)) {
      setSelectedEquipment(equipmentId);
    }
    setContextMenu({ x, y, equipmentId });
  }, [selectedEquipmentIds, setSelectedEquipment]);

  // 토스트 닫기
  const handleCloseToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // 장비 위치 업데이트 핸들러 (유효성 검사 포함)
  const handleEquipmentPositionChange = useCallback((id: string, gridX: number, gridY: number): boolean => {
    const result = updateEquipmentPosition(id, gridX, gridY);
    
    if (!result) {
      // 유효성 검사 실패 시 토스트 표시
      if (!isValidPosition(gridX, gridY)) {
        showToast('격자 범위를 벗어났습니다', 'error');
      } else if (isPositionOccupied(gridX, gridY, id)) {
        showToast('이미 장비가 배치되어 있습니다', 'error');
      }
      return false;
    }

    // 백엔드 업데이트 (비동기 - 응답을 기다리지 않음)
    const equipmentToUpdate = equipment.find(eq => eq.id === id);
    if (equipmentToUpdate) {
      updateEquipment({
        ...equipmentToUpdate,
        gridX,
        gridY,
      }).catch(error => {
        console.error('Failed to update equipment position:', error);
        showToast('장비 위치 업데이트에 실패했습니다', 'error');
      });
    }
    
    return true;
  }, [updateEquipmentPosition, isValidPosition, isPositionOccupied, equipment, showToast]);

  // 다중 장비 위치 업데이트 핸들러 (유효성 검사 포함)
  const handleMultipleEquipmentPositionsChange = useCallback((
    updates: { id: string; gridX: number; gridY: number; originalGridX: number; originalGridY: number }[]
  ): boolean => {
    const result = updateMultipleEquipmentPositions(updates);
    
    if (!result) {
      // 유효성 검사 실패 시 토스트 표시
      showToast('선택된 장치들을 이동할 수 없습니다 (격자 범위 벗어남 또는 위치 중복)', 'error');
    }
    
    return result;
  }, [updateMultipleEquipmentPositions, showToast]);

  // 캔버스에서 마우스 좌표를 격자 좌표로 변환
  const screenToGrid = useCallback((clientX: number, clientY: number): { gridX: number; gridY: number } | null => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return null;

    // 캔버스 상의 좌표로 변환
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 레이 캐스팅으로 3D 공간의 좌표 얻기
    const pickResult = scene.pick(x, y, (mesh) => mesh.name === 'ground');
    
    if (pickResult?.hit && pickResult.pickedPoint) {
      const worldX = pickResult.pickedPoint.x;
      const worldZ = pickResult.pickedPoint.z;
      
      // 격자 좌표로 변환
      const gridX = Math.floor(worldX / gridConfig.cellSize);
      const gridY = Math.floor(worldZ / gridConfig.cellSize);
      
      return { gridX, gridY };
    }
    
    return null;
  }, [gridConfig.cellSize]);

  // 드래그 앤 드롭으로 장비 추가
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!serverRoomId) {
      showToast('서버실 ID가 없습니다', 'error');
      return;
    }
    
    const equipmentType = e.dataTransfer.getData('equipmentType') as EquipmentType;
    if (!equipmentType) return;

    const gridPos = screenToGrid(e.clientX, e.clientY);
    
    if (!gridPos) {
      showToast('격자 범위를 벗어났습니다', 'error');
      return;
    }

    const { gridX, gridY } = gridPos;

    // 유효성 검사
    if (!isValidPosition(gridX, gridY)) {
      showToast('격자 범위를 벗어났습니다', 'error');
      return;
    }

    if (isPositionOccupied(gridX, gridY)) {
      showToast('이미 장치가 배치되어 있습니다', 'error');
      return;
    }

    try {
      // 다음 사용 가능한 장비 번호 계산
      const nextNumber = getNextDeviceNumber(equipment, equipmentType, serverRoomId);
      const deviceName = generateDeviceName(equipmentType, serverRoomId, nextNumber);

      // API를 통해 장비 생성
      const createdEquipment = await createDevice(
        {
          type: equipmentType,
          gridX,
          gridY,
          gridZ: 0,
          rotation: 0,
          metadata: {
            name: deviceName,
            status: 'NORMAL',
          },
        },
        Number(serverRoomId),
        datacenterId,
        equipment, // 기존 장비 목록 전달
      );

      // 스토어에 추가
      useBabylonDatacenterStore.setState((state) => ({
        equipment: [...state.equipment, createdEquipment],
      }));

      showToast('장치가 추가되었습니다', 'success');
    } catch (error) {
      console.error('Failed to add equipment:', error);
      showToast('장치 추가에 실패했습니다', 'error');
    }
  }, [serverRoomId, datacenterId, screenToGrid, isValidPosition, isPositionOccupied, showToast, equipment]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // 컨텍스트 메뉴 닫기
  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  // 장비 삭제
  const handleDeleteEquipment = useCallback(async () => {
    if (contextMenu) {
      try {
        // 다중 선택된 경우 모두 삭제
        if (selectedEquipmentIds.length > 1) {
          await Promise.all(
            selectedEquipmentIds.map(async (id) => {
              const equipmentToDelete = equipment.find((eq) => eq.id === id);
              if (equipmentToDelete) {
                await deleteEquipment(equipmentToDelete);
                removeEquipment(id);
              }
            })
          );
          clearSelection();
          showToast(`${selectedEquipmentIds.length}개 장치가 삭제되었습니다`, 'success');
        } else {
          // 단일 선택
          const equipmentToDelete = equipment.find((eq) => eq.id === contextMenu.equipmentId);
          if (equipmentToDelete) {
            await deleteEquipment(equipmentToDelete);
            removeEquipment(contextMenu.equipmentId);
            showToast('장치가 삭제되었습니다', 'success');
          }
        }
        setContextMenu(null);
      } catch (error) {
        console.error('Failed to delete equipment:', error);
        showToast('장치 삭제에 실패했습니다', 'error');
      }
    }
  }, [contextMenu, selectedEquipmentIds, equipment, removeEquipment, clearSelection, showToast]);
  
  // 다중 선택된 장비 삭제
  const handleDeleteSelectedEquipment = useCallback(async () => {
    if (selectedEquipmentIds.length > 0) {
      try {
        await Promise.all(
          selectedEquipmentIds.map(async (id) => {
            const equipmentToDelete = equipment.find((eq) => eq.id === id);
            if (equipmentToDelete) {
              await deleteEquipment(equipmentToDelete);
              removeEquipment(id);
            }
          })
        );
        clearSelection();
        showToast(`${selectedEquipmentIds.length}개 장치가 삭제되었습니다`, 'success');
      } catch (error) {
        console.error('Failed to delete equipment:', error);
        showToast('장치 삭제에 실패했습니다', 'error');
      }
    }
  }, [selectedEquipmentIds, equipment, removeEquipment, clearSelection, showToast]);

  // 격자 설정 변경
  // const handleGridChange = (key: 'rows' | 'columns', value: number) => {
  //   setGridConfig({ [key]: Math.max(5, Math.min(30, value)) });
  // };

  // Babylon.js 씬 초기화
  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (equipmentLoading) return;

    // 엔진 생성
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    engineRef.current = engine;

    // 씬 생성
    const scene = new Scene(engine);
    // 데이터센터 배경색
    scene.clearColor = new Color4(0, 0, 0, 0); // 완전 투명
    sceneRef.current = scene;

    // 카메라 생성 (아이소메트릭 뷰)
    const camera = new ArcRotateCamera(
      'camera',
      CAMERA_CONFIG.alpha,
      CAMERA_CONFIG.beta,
      CAMERA_CONFIG.radius,
      new Vector3(
        (gridConfig.columns * gridConfig.cellSize) / 2,
        0,
        (gridConfig.rows * gridConfig.cellSize) / 2
      ),
      scene
    );

    camera.attachControl(canvasRef.current, true);
    camera.wheelPrecision = CAMERA_CONFIG.wheelPrecision;
    camera.panningSensibility = CAMERA_CONFIG.panningSensibility;
    camera.lowerRadiusLimit = CAMERA_CONFIG.lowerRadiusLimit;
    camera.upperRadiusLimit = CAMERA_CONFIG.upperRadiusLimit;
    camera.lowerBetaLimit = CAMERA_CONFIG.lowerBetaLimit;
    camera.upperBetaLimit = CAMERA_CONFIG.upperBetaLimit;

    // 조명 생성
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;

    // 추가 조명
    const light2 = new HemisphericLight('light2', new Vector3(0, -1, 0), scene);
    light2.intensity = 0.3;

    // 장비 로딩이 완료된 후에만 씬 준비 완료로 설정
    setIsSceneReady(true);

    // 렌더링 루프 (최적화: 렌더링이 필요할 때만 실행)
    renderLoopRef.current = true;
    engine.runRenderLoop(() => {
      if (renderLoopRef.current) {
        scene.render();
      }
    });

    // 리사이즈 핸들러
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // 렌더링 루프 중지
      renderLoopRef.current = false;
      
      // 이벤트 리스너 제거
      window.removeEventListener('resize', handleResize);
      
      // 씬과 엔진 정리
      if (scene) {
        scene.dispose();
      }
      if (engine) {
        engine.stopRenderLoop();
        engine.dispose();
      }
    };
  }, [gridConfig.columns, gridConfig.rows, gridConfig.cellSize, equipmentLoading]);

  // 모드 변경에 따른 포인터 상호작용 업데이트
  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;

    if (mode === 'edit') {
      // 편집 모드: 다중 선택 및 배경 클릭 처리
      const pointerDownHandler = (evt: IPointerEvent, pickResult: PickingInfo) => {
        // 우클릭은 무시
        if (evt.button === 2) return;
        
        // 장비 메시를 클릭한 경우 (equipment-로 시작하는 name 또는 id) - 이벤트 무시
        const clickedEquipment = pickResult.pickedMesh?.name?.startsWith('equipment-') || 
                                 pickResult.pickedMesh?.id?.startsWith('server-') ||
                                 pickResult.pickedMesh?.id?.startsWith('door-') ||
                                 pickResult.pickedMesh?.id?.startsWith('climatic_chamber-') ||
                                 pickResult.pickedMesh?.id?.startsWith('fire_extinguisher-') ||
                                 pickResult.pickedMesh?.id?.startsWith('thermometer-') ||
                                 pickResult.pickedMesh?.id?.startsWith('aircon-');
        
        if (clickedEquipment) {
          // 장비를 클릭한 경우 - 장비의 자체 드래그 동작이 처리하도록 함
          return;
        }
        
        // Ctrl/Cmd + 좌클릭: 영역 선택 시작 (배경 클릭 시에만)
        if ((evt.ctrlKey || evt.metaKey) && evt.button === 0) {
          // 배경이나 ground만 클릭한 경우에만 영역 선택 시작
          if (pickResult.hit && (pickResult.pickedMesh?.name === 'ground' || !pickResult.pickedMesh)) {
            const gridPos = screenToGrid(evt.clientX, evt.clientY);
            if (gridPos) {
              setIsDraggingSelection(true);
              setSelectionStart(gridPos);
              setSelectionArea({
                startX: gridPos.gridX,
                startY: gridPos.gridY,
                endX: gridPos.gridX,
                endY: gridPos.gridY,
              });
              // 카메라 비활성화
              scene.activeCamera!.detachControl();
            }
          }
          return;
        }
        
        // 장비가 아닌 배경 클릭: 선택 해제
        if (pickResult.hit && pickResult.pickedMesh?.name === 'ground') {
          clearSelection();
          setSelectionStart(null);
          setIsDraggingSelection(false);
        } else if (!pickResult.hit) {
          // 아무것도 클릭하지 않은 경우에도 선택 해제
          clearSelection();
          setSelectionStart(null);
          setIsDraggingSelection(false);
        }
      };

      const pointerMoveHandler = (evt: IPointerEvent) => {
        if (isDraggingSelection && selectionStart) {
          const gridPos = screenToGrid(evt.clientX, evt.clientY);
          if (gridPos) {
            setSelectionArea({
              startX: selectionStart.gridX,
              startY: selectionStart.gridY,
              endX: gridPos.gridX,
              endY: gridPos.gridY,
            });
          }
        }
      };

      const pointerUpHandler = (evt: IPointerEvent) => {
        if (isDraggingSelection && selectionStart) {
          const gridPos = screenToGrid(evt.clientX, evt.clientY);
          if (gridPos) {
            // 영역 내의 장비 선택
            selectEquipmentInArea(
              selectionStart.gridX,
              selectionStart.gridY,
              gridPos.gridX,
              gridPos.gridY
            );
          }
          setIsDraggingSelection(false);
          setSelectionStart(null);
          setSelectionArea(null);
          // 카메라 다시 활성화
          scene.activeCamera!.attachControl(canvas, true);
        }
      };

      scene.onPointerDown = pointerDownHandler;
      scene.onPointerMove = pointerMoveHandler;
      scene.onPointerUp = pointerUpHandler;

      return () => {
        if (scene.onPointerDown === pointerDownHandler) {
          scene.onPointerDown = undefined;
        }
        if (scene.onPointerMove === pointerMoveHandler) {
          scene.onPointerMove = undefined;
        }
        if (scene.onPointerUp === pointerUpHandler) {
          scene.onPointerUp = undefined;
        }
      };
    }

    // 보기 모드로 전환 시 선택 해제 및 포인터 이벤트 제거
    clearSelection();
    setSelectionArea(null);
    setIsDraggingSelection(false);
    setSelectionStart(null);
    scene.onPointerDown = undefined;
    scene.onPointerMove = undefined;
    scene.onPointerUp = undefined;
  }, [mode, isDraggingSelection, selectionStart, clearSelection, setSelectionArea, selectEquipmentInArea, screenToGrid]);

  //랙 모달이 열리면 Babylon 렌더링 일시정지 
  useEffect(() => {
    if (renderLoopRef.current !== undefined) {
      renderLoopRef.current = !isRackModalOpen;
    }
  }, [isRackModalOpen]);

  // 뷰어 모드일 때 서버실 데이터 로드 (추후 API 연동)
  useEffect(() => {
    if (mode === 'view' && serverRoomId) {
      // TODO: API에서 서버실 데이터 로드
      console.log('Loading server room:', serverRoomId);
      // 예시: fetch(`/api/server-rooms/${serverRoomId}`).then(...)
    }
  }, [mode, serverRoomId]);

  // Delete 키 이벤트 처리
  useEffect(() => {
    if (mode !== 'edit') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedEquipmentIds.length > 0) {
        handleDeleteSelectedEquipment();
      }
      // Escape 키로 선택 해제
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, selectedEquipmentIds, handleDeleteSelectedEquipment, clearSelection]);

  return (
    <div className="h-full w-full overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full outline-none"
        style={{ touchAction: 'none' }}
        onContextMenu={(e) => e.preventDefault()} // 우클릭 기본 메뉴 방지
        onDrop={mode === 'edit' ? handleDrop : undefined} // 편집 모드에서만 드롭 허용
        onDragOver={mode === 'edit' ? handleDragOver : undefined} // 드래그 오버 허용
      />

      {/* 로딩 표시  */}
      {equipmentLoading && <LoadingSpinner message="서버실 데이터를 불러오는 중..." />}

      {/* 컨트롤 가이드 */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white text-xs max-w-xs z-10">
        <div className="font-semibold mb-2">⌨️ 컨트롤</div>
        <ul className="space-y-1">
          <li>• 좌클릭 드래그 (배경): 카메라 회전</li>
          {mode === 'edit' && <li>• 좌클릭 드래그 (장비): 장비 이동</li>}
          {mode === 'edit' && <li>• Ctrl+드래그 (배경): 영역 선택</li>}
          <li>• 우클릭 드래그: 카메라 이동</li>
          <li>• 마우스 휠: 줌 인/아웃</li>
          {mode === 'edit' && selectedEquipmentIds.length > 0 && (
            <>
              <li>• Delete: 선택된 장비 삭제</li>
              <li>• Esc: 선택 해제</li>
            </>
          )}
        </ul>
      </div>

      {/* 회전 버튼 */}
      {mode === 'edit' && selectedEquipmentIds.length === 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 border border-slate-300/40 backdrop-blur-sm rounded-lg p-3 text-white text-xs flex items-center gap-2">
          <span className="font-semibold">회전</span>
          <button
            type="button"
            onClick={() => handleRotateEquipment(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-3 py-1 text-sm"
          >
            ⟲ 90°
          </button>
          <button
            type="button"
            onClick={() => handleRotateEquipment(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-3 py-1 text-sm"
          >
            ⟳ 90°
          </button>
        </div>
      )}
      
      {/* 다중 선택 시 삭제 버튼 */}
      {mode === 'edit' && selectedEquipmentIds.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 border border-slate-300/40 backdrop-blur-sm rounded-lg p-3 text-white text-xs flex items-center gap-2">
          <span className="font-semibold">{selectedEquipmentIds.length}개 선택됨</span>
          <button
            type="button"
            onClick={handleDeleteSelectedEquipment}
            className="bg-red-700 hover:bg-red-600 text-white rounded-md px-3 py-1 text-sm"
          >
            🗑️ 삭제
          </button>
        </div>
      )}

      {/* 장비 목록 패널 - 편집 모드에서만 표시 (오른쪽 상단에 플로팅) */}
      {mode === 'edit' && (
        <div className="absolute top-4 right-4 w-60 max-h-[calc(100vh-10rem)] z-20">
          <EquipmentPalette3D onAddEquipment={handleAddEquipment} />
        </div>
      )}

      {/* 3D 객체들 렌더링 */}
      {isSceneReady && sceneRef.current && (
        <>
          {/* 격자 바닥 */}
          <GridFloor scene={sceneRef.current} gridConfig={gridConfig} />

          {/* 장비들 */}
          {equipment.map((eq) => {
            const paletteItem = EQUIPMENT_PALETTE.find((p) => p.type === eq.type);
            if (!paletteItem) return null;

            return (
              <Equipment3DModel
                key={eq.id}
                scene={sceneRef.current!}
                equipment={eq}
                cellSize={gridConfig.cellSize}
                modelPath={paletteItem.modelPath}
                isSelected={selectedEquipmentIds.includes(eq.id)}
                  onSelect={setSelectedEquipment}
                  onPositionChange={handleEquipmentPositionChange}
                  isDraggable={mode === 'edit'} // 편집 모드에서만 드래그 가능
                  onServerClick={mode === 'view' ? serverClickHandler : undefined} // view 모드에서만 클릭 핸들러 전달
                  onRightClick={mode === 'edit' ? rightClickHandler : undefined} // edit 모드에서만 우클릭 핸들러 전달
                  selectedEquipmentIds={selectedEquipmentIds}
                  onMultiDragEnd={handleMultipleEquipmentPositionsChange}
                />
              );
            })}
          
          {/* 선택 영역 박스 */}
          {mode === 'edit' && selectionArea && (
            <SelectionBox
              scene={sceneRef.current!}
              startGridX={selectionArea.startX}
              startGridY={selectionArea.startY}
              endGridX={selectionArea.endX}
              endGridY={selectionArea.endY}
              cellSize={gridConfig.cellSize}
            />
          )}
        </>
      )}

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleContextMenuClose}
          onDelete={handleDeleteEquipment}
        />
      )}

      {/* 토스트 메시지 */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default BabylonDatacenterView
