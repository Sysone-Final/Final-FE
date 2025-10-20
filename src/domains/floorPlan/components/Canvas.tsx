import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDroppable } from '@dnd-kit/core';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';

const CANVAS_VIEW_CONFIG = {
  CELL_SIZE: 40,
  HEADER_PADDING: 40,
};

const Canvas: React.FC = () => {
  // [수정] Zustand 스토어에서 상태를 더 안전하게 가져오기 위해 개별 selector를 사용합니다.
  const assets = useFloorPlanStore((state) => state.assets);
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const displayMode = useFloorPlanStore((state) => state.displayMode);
  const displayOptions = useFloorPlanStore((state) => state.displayOptions);
  const gridCols = useFloorPlanStore((state) => state.gridCols);
  const gridRows = useFloorPlanStore((state) => state.gridRows);
  const stage = useFloorPlanStore((state) => state.stage);
  
  const selectAsset = useFloorPlanStore((state) => state.selectAsset);
  const setStage = useFloorPlanStore((state) => state.setStage);

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

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const stageNode = e.target.getStage();
    if (stageNode) {
      setStage({
        scale: stageNode.scaleX(),
        x: stageNode.x(),
        y: stageNode.y(),
      });
    }
  };

  // [수정] stage 상태가 아직 준비되지 않았다면 렌더링을 잠시 멈춰 오류를 방지합니다.
  if (!stage) {
    return <main className="canvas-container" ref={containerRef}><div>Loading Canvas...</div></main>;
  }

  return (
    <main className="canvas-container" ref={containerRef}>
      <div ref={setNodeRef} style={{ width: '100%', height: '100%' }}>
        {stageSize.width > 0 && (
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onWheel={handleWheel}
            draggable
            onDragEnd={handleDragEnd}
            scaleX={stage.scale}
            scaleY={stage.scale}
            x={stage.x}
            y={stage.y}
          >
            <Layer>
              <CanvasGrid
                gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE}
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
      </div>
    </main>
  );
};

export default Canvas;

