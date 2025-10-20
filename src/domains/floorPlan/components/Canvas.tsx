import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';

const GRID_CONFIG = {
  COLS: 40,
  ROWS: 14,
  CELL_SIZE: 40,
  HEADER_PADDING: 40,
};

const Canvas: React.FC = () => {
  const { assets, selectedAssetIds, selectAsset, displayMode, displayOptions } = useFloorPlanStore();
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
          draggable // 드래그(이동) 기능 활성화
          scaleX={stage.scale}
          scaleY={stage.scale}
          x={stage.x}
          y={stage.y}
        >
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

