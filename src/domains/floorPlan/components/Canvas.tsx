import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDroppable } from '@dnd-kit/core';
import type { KonvaEventObject } from 'konva/lib/Node';
// [수정] 올바른 상대 경로로 수정합니다.
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';

const CANVAS_VIEW_CONFIG = { CELL_SIZE: 40, HEADER_PADDING: 40 };

const Canvas: React.FC = () => {
  const { assets, selectedAssetIds, gridCols, gridRows, stage, setStage, deselectAll } = useFloorPlanStore();
  const displayMode = useFloorPlanStore((state) => state.displayMode);
  const displayOptions = useFloorPlanStore((state) => state.displayOptions);

  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { setNodeRef } = useDroppable({ id: 'canvas-drop-area' });

  useLayoutEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stageNode = e.target.getStage();
    if (!stageNode) return;
    const oldScale = stageNode.scaleX();
    const pointer = stageNode.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stageNode.x()) / oldScale,
      y: (pointer.y - stageNode.y()) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setStage({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleStageDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const stageNode = e.target.getStage();
    if (stageNode) {
      setStage({ scale: stageNode.scaleX(), x: stageNode.x(), y: stageNode.y() });
    }
  };
  
  const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) {
      deselectAll();
    }
  };

  if (!stage) return <main className="canvas-container" ref={containerRef}><div>Loading...</div></main>;

  return (
    <main className="canvas-container" ref={containerRef}>
      <div ref={setNodeRef} style={{ width: '100%', height: '100%' }}>
        {stageSize.width > 0 && (
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onWheel={handleWheel}
            draggable
            onDragEnd={handleStageDragEnd}
            onClick={handleStageClick}
            onTap={handleStageClick}
            scaleX={stage.scale}
            scaleY={stage.scale}
            x={stage.x}
            y={stage.y}
          >
            <Layer>
              <CanvasGrid gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE} cols={gridCols} rows={gridRows} />
              {assets.map((asset) => (
                <AssetRenderer
                  key={asset.id}
                  asset={asset}
                  gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE}
                  headerPadding={CANVAS_VIEW_CONFIG.HEADER_PADDING}
                  isSelected={selectedAssetIds.includes(asset.id)}
                  displayMode={displayMode}
                  displayOptions={displayOptions}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </main>
  );
};

export default Canvas;

