import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';

// 셀 크기나 헤더 여백 등, 뷰에만 관련된 설정은 상수로 남겨둡니다.
const CANVAS_VIEW_CONFIG = {
  CELL_SIZE: 40,
  HEADER_PADDING: 40,
};

const Canvas: React.FC = () => {
  // [수정] 스토어에서 gridCols와 gridRows를 가져옵니다.
  const { assets, selectedAssetIds, selectAsset, displayMode, displayOptions, gridCols, gridRows } = useFloorPlanStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

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

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    
    setStage({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <main className="canvas-container" ref={containerRef}>
      {stageSize.width > 0 && (
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onWheel={handleWheel}
          draggable
          scaleX={stage.scale}
          scaleY={stage.scale}
          x={stage.x}
          y={stage.y}
        >
          <Layer>
            <CanvasGrid
              gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE}
              // [수정] 스토어에서 가져온 값으로 그리드를 그립니다.
              cols={gridCols}
              rows={gridRows}
            />
            {assets.map((asset) => (
              <AssetRenderer
                key={asset.id}
                asset={asset}
                gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE}
                headerPadding={CANVAS_VIEW_CONFIG.HEADER_PADDING}
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

