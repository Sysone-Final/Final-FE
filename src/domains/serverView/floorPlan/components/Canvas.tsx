import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { useDroppable } from '@dnd-kit/core';
import type { KonvaEventObject } from 'konva/lib/Node';
import {
 useFloorPlanStore,
 setStage,
 deselectAll,
} from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';
import CanvasGrid from './CanvasGrid';
import HeatmapLayer from './HeatmapLayer';
import type { AssetLayer, DisplayMode } from '../types';

interface CanvasProps {
 containerRef: React.RefObject<HTMLDivElement>;
}
const CANVAS_VIEW_CONFIG = { CELL_SIZE: 160, HEADER_PADDING: 80 };
const layerOrder: Record<AssetLayer, number> = { floor: 1, wall: 2, overhead: 3 };


const Canvas: React.FC<CanvasProps> = ({ containerRef }) => {
 const isLoading = useFloorPlanStore((state) => state.isLoading);
 const error = useFloorPlanStore((state) => state.error);
 const assets = useFloorPlanStore((state) => state.assets);
 const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
 const gridCols = useFloorPlanStore((state) => state.gridCols);
 const gridRows = useFloorPlanStore((state) => state.gridRows);
 const stage = useFloorPlanStore((state) => state.stage);
//  const displayMode = useFloorPlanStore((state) => state.displayMode);
 const displayOptions = useFloorPlanStore((state) => state.displayOptions);

 const visibleLayers = useFloorPlanStore((state) => state.visibleLayers);
 const visibleSeverities = useFloorPlanStore((state) => state.visibleSeverities);
 const dashboardMetricView = useFloorPlanStore(
  (state) => state.dashboardMetricView,
 );
const synthesizedDisplayMode: DisplayMode =
  dashboardMetricView === 'layout' ? 'customColor' : 'status';

 const isDashboardView = synthesizedDisplayMode === 'status';
 const isHeatmapView =
  isDashboardView && dashboardMetricView.startsWith('heatmap');

 const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
 const { setNodeRef } = useDroppable({ id: 'canvas-drop-area' });
 const [isInitialZoomSet, setIsInitialZoomSet] = useState(false);

 // Effect 1: Resize listener
 useEffect(() => {
  const checkSize = () => {
   if (containerRef.current) {
    console.log(
     'Canvas container size:',
     containerRef.current.clientWidth,
     containerRef.current.clientHeight,
    );
    setStageSize({
     width: containerRef.current.clientWidth,
     height: containerRef.current.clientHeight,
    });
   }
  };
  checkSize();
  window.addEventListener('resize', checkSize);
  return () => window.removeEventListener('resize', checkSize);
 }, [containerRef]); 
 // Effect 2: Initial zoom
 useLayoutEffect(() => {
  if (
   !isLoading &&
   !error &&
   gridCols > 0 &&
   stageSize.width > 0 &&
   !isInitialZoomSet
  ) {
   const { CELL_SIZE, HEADER_PADDING } = CANVAS_VIEW_CONFIG;
   const totalPlanWidth = gridCols * CELL_SIZE + HEADER_PADDING * 2;
   const totalPlanHeight = gridRows * CELL_SIZE + HEADER_PADDING * 2;
   const padding = 0.95;
   const scaleX = (stageSize.width * padding) / totalPlanWidth;
   const scaleY = (stageSize.height * padding) / totalPlanHeight;
   const newScale = Math.min(scaleX, scaleY);
   const newX = (stageSize.width - totalPlanWidth * newScale) / 2;
   const newY = (stageSize.height - totalPlanHeight * newScale) / 2;
   setStage({ scale: newScale, x: newX, y: newY });
   setIsInitialZoomSet(true);
  }
 }, [isLoading, error, gridCols, gridRows, stageSize, isInitialZoomSet]);

 // Event Handlers
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
  const newScale =
   e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
  setStage({
   scale: newScale,
   x: pointer.x - mousePointTo.x * newScale,
   y: pointer.y - mousePointTo.y * newScale,
  });
 };
 const handleStageDragEnd = (e: KonvaEventObject<DragEvent>) => {
  const stageNode = e.target.getStage();
  if (stageNode) {
   setStage({
    scale: stageNode.scaleX(),
    x: stageNode.x(),
    y: stageNode.y(),
   });
  }
 };
 const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
  if (e.target === e.target.getStage()) {
   deselectAll();
  }
 };

 const filteredAndSortedAssets =
  !isLoading && !error
   ? [...assets]
     .filter((asset) => {
      if (!visibleLayers[asset.layer]) {
       return false;
      }
      if (
       isDashboardView &&
       !isHeatmapView &&
       asset.assetType === 'rack'
      ) {
       const status = asset.status ?? 'normal';
       return visibleSeverities[status];
      }
      return true;
     })
     .sort(
      (a, b) => (layerOrder[a.layer] || 0) - (layerOrder[b.layer] || 0),
     )
   : [];

 if (isLoading) {
  return (
   <main
    className="canvas-container w-full h-full flex items-center justify-center text-gray-400"
    ref={containerRef}
   >
    <div>데이터를 불러오는 중입니다...</div>
   </main>
  );
 }

 if (error) {
  return (
   <main
    className="canvas-container w-full h-full flex items-center justify-center text-red-500"
    ref={containerRef}
   >
    <div>오류가 발생했습니다: {error}</div>
   </main>
  );
 }

 return (
  <main className="canvas-container w-full h-full" ref={containerRef}>
   <div ref={setNodeRef} style={{ width: '100%', height: '100%' }}>
    {stageSize.width > 0 && stageSize.height > 0 && (
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
       <CanvasGrid
        cols={gridCols}
        rows={gridRows}
        gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE}
        displayMode={synthesizedDisplayMode}
       />
       {/* 2. 자산 (히트맵 뷰일 때 30% 투명도) */}
       <Group opacity={isHeatmapView ? 0.3 : 1}>
        {filteredAndSortedAssets.map((asset) => (
         <AssetRenderer
          key={asset.id}
          asset={asset}
          gridSize={CANVAS_VIEW_CONFIG.CELL_SIZE}
          headerPadding={CANVAS_VIEW_CONFIG.HEADER_PADDING}
          isSelected={selectedAssetIds.includes(asset.id)}
          displayMode={
           isHeatmapView ? 'customColor' : synthesizedDisplayMode
          }
          displayOptions={displayOptions}
          currentScale={stage.scale}
         />
        ))}
       </Group>
      </Layer>

      {/* 3. 히트맵 레이어 */}
      {isHeatmapView && (
       <Layer>
        <HeatmapLayer viewMode={dashboardMetricView} />
       </Layer>
      )}
     </Stage>
    )}
   </div>
  </main>
 );
};

export default Canvas;