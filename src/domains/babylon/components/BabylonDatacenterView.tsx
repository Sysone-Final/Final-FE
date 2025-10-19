import { useRef, useEffect, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color4 } from '@babylonjs/core';
import GridFloor from './GridFloor';
import Equipment3DModel from './Equipment3DModel';
import EquipmentPalette3D from './EquipmentPalette3D';
import { useBabylonDatacenterStore } from '../stores/useBabylonDatacenterStore';
import { CAMERA_CONFIG, EQUIPMENT_PALETTE } from '../constants/config';
import type { EquipmentType } from '../types';

function BabylonDatacenterView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Zustand
  const {
    gridConfig,
    equipment,
    selectedEquipmentId,
    addEquipment,
    setSelectedEquipment,
    setGridConfig,
    updateEquipmentPosition,
  } = useBabylonDatacenterStore();

  // 장비 추가 핸들러
  const handleAddEquipment = (type: EquipmentType) => {
    // 맵 중앙에 추가
    const centerX = Math.floor(gridConfig.columns / 2);
    const centerY = Math.floor(gridConfig.rows / 2);
    addEquipment(type, centerX, centerY);
  };

  // 격자 설정 변경
  const handleGridChange = (key: 'rows' | 'columns', value: number) => {
    setGridConfig({ [key]: Math.max(5, Math.min(30, value)) });
  };

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

    // 배경 클릭 시 선택 해제
    scene.onPointerDown = (_evt, pickResult) => {
      // 아무것도 선택되지 않았거나 바닥을 클릭한 경우
      if (!pickResult.hit || pickResult.pickedMesh?.name === 'ground') {
        setSelectedEquipment(null);
      }
    };

    setIsSceneReady(true);

    // 렌더링 루프
    engine.runRenderLoop(() => {
      scene.render();
    });

    // 리사이즈 핸들러
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [gridConfig.columns, gridConfig.rows, gridConfig.cellSize]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 메인 3D 뷰 영역 */}
      <div className="flex-1 relative">
        {/* 헤더 */}
        <div className="absolute top-0 left-0 right-0 backdrop-blur-sm p-4 z-10">

          
          {/* 격자 설정 */}
          <div className="flex gap-4 items-center text-white text-sm">
            <div className="flex items-center gap-2">
              <label>행:</label>
              <button
                onClick={() => handleGridChange('rows', gridConfig.rows - 1)}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{gridConfig.rows}</span>
              <button
                onClick={() => handleGridChange('rows', gridConfig.rows + 1)}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label>열:</label>
              <button
                onClick={() => handleGridChange('columns', gridConfig.columns - 1)}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{gridConfig.columns}</span>
              <button
                onClick={() => handleGridChange('columns', gridConfig.columns + 1)}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                +
              </button>
            </div>

            <div className="ml-auto text-white">
              배치된 장비: {equipment.length}개
            </div>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full outline-none"
          style={{ touchAction: 'none' }}
        />

        {/* 컨트롤 */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white text-xs max-w-xs">
          <div className="font-semibold mb-2">⌨️ 컨트롤</div>
          <ul className="space-y-1">
            <li>• 좌클릭 드래그 (배경): 카메라 회전</li>
            <li>• 좌클릭 드래그 (장비): 장비 이동</li>
            <li>• 우클릭 드래그: 카메라 이동</li>
            <li>• 마우스 휠: 줌 인/아웃</li>
          </ul>
        </div>

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
                />
              );
            })}
          </>
        )}
      </div>

      {/* 오른쪽 팔레트 */}
      <div className="w-70 h-full flex-shrink-0">
        <EquipmentPalette3D onAddEquipment={handleAddEquipment} />
      </div>
    </div>
  );
}

export default BabylonDatacenterView
