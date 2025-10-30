import { useRef, useEffect, useState, useCallback } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color4, type IPointerEvent, type PickingInfo } from '@babylonjs/core';
import GridFloor from './GridFloor';
import Equipment3DModel from './Equipment3DModel';
import EquipmentPalette3D from './EquipmentPalette3D';
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
    mode,
    setMode,
    currentServerRoomId,
    initializeServerRoom,
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

  // Server 클릭 핸들러 (view 모드에서만)
  const handleServerClick = useCallback((serverId: string) => {
    if (mode === 'view') {
      openRackModal(serverId);
    }
  }, [mode, openRackModal]);

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
                onServerClick={mode === 'view' ? handleServerClick : undefined} // view 모드에서만 클릭 핸들러 전달
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default BabylonDatacenterView
