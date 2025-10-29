import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDroppable } from '@dnd-kit/core';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';
import type { AssetLayer } from '../types';

const CANVAS_VIEW_CONFIG = { CELL_SIZE: 80, HEADER_PADDING: 40 };

//  레이어 순서를 정의하여 z-index 효과를 구현
const layerOrder: Record<AssetLayer, number> = {
  floor: 1,
  wall: 2,
  overhead: 3,
};

const Canvas: React.FC = () => {
  const { assets, selectedAssetIds, gridCols, gridRows, stage, setStage, deselectAll } = useFloorPlanStore();
  const displayMode = useFloorPlanStore((state) => state.displayMode);
  const displayOptions = useFloorPlanStore((state) => state.displayOptions);

  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { setNodeRef } = useDroppable({ id: 'canvas-drop-area' });

  const [isInitialZoomSet, setIsInitialZoomSet] = useState(false);

useLayoutEffect(() => {
  const checkSize = (isInitialLoad: boolean) => {
   if (containerRef.current) {
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // 1. 캔버스 크기는 항상 업데이트
    setStageSize({ width: containerWidth, height: containerHeight });

    // 2. "처음 로드 시" 그리고 "아직 줌 설정이 안됐을 때"만 실행
    if (isInitialLoad && !isInitialZoomSet && containerWidth > 0) {
     const { CELL_SIZE, HEADER_PADDING } = CANVAS_VIEW_CONFIG;

     // 3. 전체 평면도의 실제 픽셀 크기 계산
     const totalPlanWidth = gridCols * CELL_SIZE + HEADER_PADDING * 2;
     const totalPlanHeight = gridRows * CELL_SIZE + HEADER_PADDING * 2;

     // 4. 컨테이너에 맞추기 위한 줌 스케일 계산 (약간의 여백 둠)
     const padding = 0.95; // 95%
     const scaleX = (containerWidth * padding) / totalPlanWidth;
     const scaleY = (containerHeight * padding) / totalPlanHeight;
     const newScale = Math.min(scaleX, scaleY); // 가로/세로 중 더 작은 값
     
     // 5. 중앙 정렬을 위한 x, y 위치 계산
     const newX = (containerWidth - totalPlanWidth * newScale) / 2;
     const newY = (containerHeight - totalPlanHeight * newScale) / 2;
    
     // 6. 스토어(Zustand)의 stage 상태 업데이트
     setStage({
      scale: newScale,
      x: newX,
      y: newY,
     });
          
          // 7. 플래그를 true로 설정해 다시 실행되지 않도록 함
     setIsInitialZoomSet(true);
    }
   }
  };
    
    // 처음 마운트될 때 isInitialLoad = true로 호출
  checkSize(true);
    
    // 리사이즈 이벤트 리스너 (isInitialLoad = false로 호출)
  const handleResize = () => checkSize(false);
  window.addEventListener('resize', handleResize);
    
  return () => window.removeEventListener('resize', handleResize);
    
    // --- [수정] 의존성 배열에 추가 ---
 }, [isInitialZoomSet, gridCols, gridRows, setStage]);

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
  
  //  렌더링 전에 자산을 레이어 순서대로 정렬합니다.
  const sortedAssets = [...assets].sort((a, b) => (layerOrder[a.layer] || 0) - (layerOrder[b.layer] || 0));

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
              {/*  정렬된 자산 배열을 사용하여 렌더링합니다. */}
              {sortedAssets.map((asset) => (
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
