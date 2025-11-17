
import React from 'react';
import { useFloorPlanStore } from '../store/floorPlanStore';
import type { Asset, DisplayMode, DisplayOptionsType } from '../types';
import type { KonvaEventObject } from 'konva/lib/Node';
import LayoutAssetView from './LayoutAssetView';
import DashboardAssetView from './DashboardAssetView';

export interface AssetRendererProps {
  asset: Asset;
  gridSize: number;
  headerPadding: number;
  isSelected: boolean;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
  currentScale: number;
  onContextMenu?: (e: KonvaEventObject<PointerEvent>) => void;
}

const AssetRenderer: React.FC<AssetRendererProps> = (props) => {
  // 1. 훅 호출을 컴포넌트 최상단으로 이동시킵니다.
  const mode = useFloorPlanStore((state) => state.mode);

  // 2. 훅 호출 이후에 조건부 반환(early return)을 수행합니다.
  if (!props.asset) {
    console.error('AssetRenderer received undefined asset prop!');
    return null;
  }
  const { displayMode, asset } = props; 

  // 1. "편집" 모드일 때는 항상 LayoutAssetView (모든 자산)
  if (mode === 'edit') {
    return <LayoutAssetView {...props} />;
  }

  // 2. "보기" 모드일 때
if (mode === 'view') {
    if (displayMode === 'status') { // '상태 임계값' 모드
      if (asset.assetType === 'rack') {
        // 🌟 2. currentScale prop 전달
        return <DashboardAssetView {...props} />;
      } else {
        // 🌟 2. currentScale prop 전달
        return <LayoutAssetView {...props} />;
      }
    } else {
      // 🌟 2. currentScale prop 전달
      return <LayoutAssetView {...props} />;
    }
  }

  return null;
};

export default AssetRenderer;