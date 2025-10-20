import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
// [수정] 빌드 도구가 모듈을 더 명확하게 찾을 수 있도록 경로에 파일 확장자를 추가합니다.
import { useFloorPlanStore } from '../store/floorPlanStore.ts';
import AssetRenderer from './AssetRenderer.tsx';
import CanvasGrid from './CanvasGrid.tsx';

// 그리드 설정값을 상수로 관리합니다.
const GRID_CONFIG = {
  COLS: 40,
  ROWS: 14,
  CELL_SIZE: 30, // 각 셀의 크기 (픽셀)
  HEADER_PADDING: 30, // 헤더를 위한 여백
};

const Canvas: React.FC = () => {
  const { assets, selectedAssetIds, selectAsset, displayMode, displayOptions } = useFloorPlanStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <main className="canvas-container" ref={containerRef}>
      {stageSize.width > 0 && (
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            <CanvasGrid
              gridSize={GRID_CONFIG.CELL_SIZE}
              cols={GRID_CONFIG.COLS}
              rows={GRID_CONFIG.ROWS}
            />
            {assets.map((asset) => (
              <AssetRenderer
                key={asset.id}
                asset={asset}
                gridSize={GRID_CONFIG.CELL_SIZE}
                headerPadding={GRID_CONFIG.HEADER_PADDING}
                isSelected={selectedAssetIds.includes(asset.id)}
                onSelect={() => selectAsset(asset.id)}
                displayMode={displayMode}
                displayOptions={displayOptions}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </main>
  );
};

export default Canvas;

