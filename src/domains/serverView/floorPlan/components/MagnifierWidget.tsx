import React, { useMemo, memo } from 'react';
import { Stage, Layer } from 'react-konva';
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';
import type { DisplayMode } from '../types';

interface MagnifierWidgetProps {
  mousePosition: { x: number; y: number } | null;
  containerWidth: number;
  containerHeight: number;
}

const MagnifierWidget: React.FC<MagnifierWidgetProps> = ({
  mousePosition,
  containerWidth,
  containerHeight,
}) => {
  const assets = useFloorPlanStore((state) => state.assets);
  const gridCols = useFloorPlanStore((state) => state.gridCols);
  const gridRows = useFloorPlanStore((state) => state.gridRows);
  const stage = useFloorPlanStore((state) => state.stage);
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const displayOptions = useFloorPlanStore((state) => state.displayOptions);
  const visibleLayers = useFloorPlanStore((state) => state.visibleLayers);
  const visibleSeverities = useFloorPlanStore((state) => state.visibleSeverities);

  const synthesizedDisplayMode: DisplayMode = 'status';

  // 화면 크기의 1/4로 확대경 크기 계산
  const MAGNIFIER_WIDTH = Math.floor(containerWidth / 2);
  const MAGNIFIER_HEIGHT = Math.floor(containerHeight / 2);
  const MAGNIFIER_MARGIN = 20;
  const ZOOM_SCALE = 2.0;
  const CELL_SIZE = 160;
  const HEADER_PADDING = 80;

  // 확대경 위치 계산 (우하단에 고정)
  const magnifierPosition = useMemo(() => {
    return {
      x: containerWidth - MAGNIFIER_WIDTH - MAGNIFIER_MARGIN,
      y: containerHeight - MAGNIFIER_HEIGHT - MAGNIFIER_MARGIN,
    };
  }, [containerWidth, containerHeight, MAGNIFIER_WIDTH, MAGNIFIER_HEIGHT]);

  // 마우스 위치를 Stage 좌표로 변환
  const stageMousePosition = useMemo(() => {
    if (!mousePosition) return null;
    
    return {
      x: (mousePosition.x - stage.x) / stage.scale,
      y: (mousePosition.y - stage.y) / stage.scale,
    };
  }, [mousePosition, stage]);

  // 확대경의 중심을 마우스 위치로 설정
  const magnifierStagePosition = useMemo(() => {
    if (!stageMousePosition) return { x: 0, y: 0, scale: ZOOM_SCALE };

    const centerX = MAGNIFIER_WIDTH / 2;
    const centerY = MAGNIFIER_HEIGHT / 2;

    return {
      x: centerX - stageMousePosition.x * ZOOM_SCALE,
      y: centerY - stageMousePosition.y * ZOOM_SCALE,
      scale: ZOOM_SCALE,
    };
  }, [stageMousePosition, MAGNIFIER_WIDTH, MAGNIFIER_HEIGHT]);

  // 마우스 위치가 없으면 렌더링하지 않음
  if (!mousePosition || !stageMousePosition) {
    return null;
  }

  // 필터링된 자산 (레이어 및 상태별)
  const filteredAssets = assets.filter((asset) => {
    const layerVisible = visibleLayers[asset.layer];
    const severityVisible = asset.status ? visibleSeverities[asset.status] : true;
    return layerVisible && severityVisible;
  });

  // 레이어별 자산 그룹화
  const layerOrder: Array<'floor' | 'wall' | 'overhead'> = ['floor', 'wall', 'overhead'];
  const assetsByLayer = layerOrder.map((layer) =>
    filteredAssets.filter((a) => a.layer === layer)
  );

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: magnifierPosition.x,
        top: magnifierPosition.y,
        width: MAGNIFIER_WIDTH,
        height: MAGNIFIER_HEIGHT,
      }}
    >
      {/* 확대경 외곽 프레임 */}
      <div className="absolute inset-0 border-4 border-blue-500 rounded-lg shadow-2xl bg-gray-900/95 backdrop-blur-sm overflow-hidden">
        {/* 상단 라벨 */}
        <div className="absolute top-0 left-0 right-0 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 flex items-center justify-between z-10">
          <span>🔍 확대경 ({ZOOM_SCALE}x)</span>
          <span className="text-blue-100">
            {Math.round(stageMousePosition.x)}, {Math.round(stageMousePosition.y)}
          </span>
        </div>

        {/* Konva Stage */}
        <Stage
          width={MAGNIFIER_WIDTH}
          height={MAGNIFIER_HEIGHT}
          scaleX={magnifierStagePosition.scale}
          scaleY={magnifierStagePosition.scale}
          x={magnifierStagePosition.x}
          y={magnifierStagePosition.y}
          className="mt-6"
        >
          {/* 그리드 레이어 */}
          <Layer>
            <CanvasGrid
              cols={gridCols}
              rows={gridRows}
              gridSize={CELL_SIZE}
              displayMode={synthesizedDisplayMode}
            />
          </Layer>

          {/* 자산 레이어 (레이어 순서대로) */}
          {assetsByLayer.map((layerAssets, idx) => (
            <Layer key={layerOrder[idx]}>
              {layerAssets.map((asset) => (
                <AssetRenderer
                  key={asset.id}
                  asset={asset}
                  gridSize={CELL_SIZE}
                  headerPadding={HEADER_PADDING}
                  isSelected={selectedAssetIds.includes(asset.id)}
                  displayMode={synthesizedDisplayMode}
                  displayOptions={displayOptions}
                  currentScale={ZOOM_SCALE}
                />
              ))}
            </Layer>
          ))}
        </Stage>

        {/* 중심 십자선 */}
        <div className="absolute left-1/2 top-1/2 pointer-events-none">
          <div className="absolute w-8 h-0.5 bg-red-400/70 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-0.5 h-8 bg-red-400/70 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

const MemoizedMagnifierWidget = memo(MagnifierWidget);
export default MemoizedMagnifierWidget;
