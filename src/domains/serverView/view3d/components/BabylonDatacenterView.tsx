import { useRef, useEffect, useState, useCallback } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color4, type IPointerEvent, type PickingInfo } from '@babylonjs/core';
import { Snackbar, Alert } from '@mui/material';
import GridFloor from './GridFloor';
import Equipment3DModel from './Equipment3DModel';
import EquipmentPalette3D from './EquipmentPalette3D';
import ContextMenu from './ContextMenu';
import { useBabylonDatacenterStore } from '../stores/useBabylonDatacenterStore';
import { CAMERA_CONFIG, EQUIPMENT_PALETTE } from '../constants/config';
import { getServerRoomEquipment } from '../data/mockServerRoomEquipment';
import type { EquipmentType } from '../types';

interface BabylonDatacenterViewProps {
  mode?: 'edit' | 'view'; // 초기 모드 (기본값: view)
  serverRoomId?: string; // 서버실 ID
}

function BabylonDatacenterView({ mode: initialMode = 'view', serverRoomId }: BabylonDatacenterViewProps = {}) {
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
    addEquipment,
    setSelectedEquipment,
    updateEquipmentPosition,
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
  } = useBabylonDatacenterStore();

  // 초기 모드 적용 (최초 한 번)
  useEffect(() => {
    if (hasAppliedInitialModeRef.current) return;
    setMode(initialMode);
    hasAppliedInitialModeRef.current = true;
  }, [initialMode, setMode]);

  // 서버실 데이터 로드
  useEffect(() => {
    if (!serverRoomId) return;
    if (currentServerRoomId === serverRoomId) return;

    const equipmentData = getServerRoomEquipment(serverRoomId);
    initializeServerRoom(serverRoomId, equipmentData);
    console.log(`✅ Loaded ${equipmentData.length} equipment for server room: ${serverRoomId}`);
  }, [serverRoomId, currentServerRoomId, initializeServerRoom]);

  // 장비 추가 핸들러
  const handleAddEquipment = useCallback((type: EquipmentType) => {
    // 맵 중앙에 추가
    const centerX = Math.floor(gridConfig.columns / 2);
    const centerY = Math.floor(gridConfig.rows / 2);
    addEquipment(type, centerX, centerY);
  }, [addEquipment, gridConfig.columns, gridConfig.rows]);

  const handleRotateEquipment = useCallback((clockwise: boolean) => {
    if (!selectedEquipmentId) return;
    rotateEquipment90(selectedEquipmentId, clockwise);
  }, [rotateEquipment90, selectedEquipmentId]);

  // 모드에 따라 안정적인 핸들러 반환 (memo 최적화용)
  // Server 클릭 핸들러 (view 모드에서만)
  const serverClickHandler = useCallback((serverId: string) => {
    openRackModal(serverId);
  }, [openRackModal]);

  // 장비 우클릭 핸들러 (edit 모드에서만)
  const rightClickHandler = useCallback((equipmentId: string, x: number, y: number) => {
    setContextMenu({ x, y, equipmentId });
  }, []);

  // 토스트 표시 헬퍼
  const showToast = useCallback((message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  // 토스트 닫기
  const handleCloseToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

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
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
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
      showToast('이미 장비가 배치되어 있습니다', 'error');
      return;
    }

    // 장비 추가
    addEquipment(equipmentType, gridX, gridY);
    showToast('장비가 추가되었습니다', 'success');
  }, [screenToGrid, isValidPosition, isPositionOccupied, addEquipment, showToast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // 컨텍스트 메뉴 닫기
  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  // 장비 삭제
  const handleDeleteEquipment = useCallback(() => {
    if (contextMenu) {
      removeEquipment(contextMenu.equipmentId);
      setContextMenu(null);
    }
  }, [contextMenu, removeEquipment]);

  // 격자 설정 변경
  // const handleGridChange = (key: 'rows' | 'columns', value: number) => {
  //   setGridConfig({ [key]: Math.max(5, Math.min(30, value)) });
  // };

  // Babylon.js 씬 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

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
  }, [gridConfig.columns, gridConfig.rows, gridConfig.cellSize]);

  // 모드 변경에 따른 포인터 상호작용 업데이트
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (mode === 'edit') {
      const pointerHandler: NonNullable<typeof scene.onPointerDown> = (_evt: IPointerEvent, pickResult: PickingInfo) => {
        if (!pickResult.hit || pickResult.pickedMesh?.name === 'ground') {
          setSelectedEquipment(null);
        }
      };
      scene.onPointerDown = pointerHandler;

      return () => {
        if (scene.onPointerDown === pointerHandler) {
          scene.onPointerDown = undefined;
        }
      };
    }

    // 보기 모드로 전환 시 선택 해제 및 포인터 이벤트 제거
    setSelectedEquipment(null);
    scene.onPointerDown = undefined;
  }, [mode, setSelectedEquipment]);

  // 🔥 랙 모달이 열리면 Babylon 렌더링 일시정지 (성능 최적화)
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

      {/* 컨트롤 가이드 */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white text-xs max-w-xs z-10">
        <div className="font-semibold mb-2">⌨️ 컨트롤</div>
        <ul className="space-y-1">
          <li>• 좌클릭 드래그 (배경): 카메라 회전</li>
          {mode === 'edit' && <li>• 좌클릭 드래그 (장비): 장비 이동</li>}
          <li>• 우클릭 드래그: 카메라 이동</li>
          <li>• 마우스 휠: 줌 인/아웃</li>
        </ul>
      </div>

      {/* 회전 버튼 */}
      {mode === 'edit' && selectedEquipmentId && (
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
                isSelected={eq.id === selectedEquipmentId}
                onSelect={setSelectedEquipment}
                onPositionChange={updateEquipmentPosition}
                isDraggable={mode === 'edit'} // 편집 모드에서만 드래그 가능
                onServerClick={mode === 'view' ? serverClickHandler : undefined} // view 모드에서만 클릭 핸들러 전달
                onRightClick={mode === 'edit' ? rightClickHandler : undefined} // edit 모드에서만 우클릭 핸들러 전달
              />
            );
          })}
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
