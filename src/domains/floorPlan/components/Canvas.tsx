import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { useFloorPlanStore } from '../store/floorPlanStore';
import AssetRenderer from './AssetRenderer';

/**
 * Canvas: 2D 평면도가 렌더링될 핵심 작업 공간입니다.
 * 부모 요소의 크기에 맞춰 동적으로 크기를 조절하고, 스토어의 자산 데이터를 렌더링합니다.
 */
const Canvas: React.FC = () => {
  // 스토어에서 상태와 액션을 가져옵니다.
  const assets = useFloorPlanStore((state) => state.assets);
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const selectAsset = useFloorPlanStore((state) => state.selectAsset);

  // 캔버스를 감싸는 div 요소에 대한 참조를 생성합니다.
  const containerRef = useRef<HTMLDivElement>(null);

  // 캔버스의 크기를 저장할 상태를 생성합니다.
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // [수정] useEffect 대신 useLayoutEffect를 사용하여 렌더링 직전에 동기적으로 크기를 측정합니다.
  // 이렇게 하면 깜빡임이나 0x0 크기 문제를 방지할 수 있습니다.
  useLayoutEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasSize({ width: clientWidth, height: clientHeight });
      }
    };

    // 초기 크기 측정
    checkSize();

    // 창 크기가 변경될 때마다 크기를 다시 측정하도록 이벤트 리스너를 추가합니다.
    window.addEventListener('resize', checkSize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => window.removeEventListener('resize', checkSize);
  }, []); // 의존성 배열이 비어있으므로 마운트 시 한 번만 실행됩니다.

  return (
    <main
      className="canvas-container" // CSS 클래스를 사용합니다.
      ref={containerRef}
    >
      {/* [수정] 캔버스 크기가 유효할 때(0보다 클 때)만 Stage를 렌더링합니다. */}
      {canvasSize.width > 0 && canvasSize.height > 0 && (
        <Stage width={canvasSize.width} height={canvasSize.height}>
          <Layer>
            {assets.map((asset) => (
              <AssetRenderer
                key={asset.id}
                asset={asset}
                isSelected={selectedAssetIds.includes(asset.id)}
                onSelect={() => selectAsset(asset.id)}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </main>
  );
};

export default Canvas;

