
import React from 'react';
import { useFloorPlanStore } from '../store/floorPlanStore';
import type { Asset, DisplayMode, DisplayOptionsType } from '../types';

import LayoutAssetView from './LayoutAssetView';
import DashboardAssetView from './DashboardAssetView';

export interface AssetRendererProps {
  asset: Asset;
  gridSize: number;
  headerPadding: number;
  isSelected: boolean;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
}

const AssetRenderer: React.FC<AssetRendererProps> = (props) => {
  if (!props.asset) {
    console.error("AssetRenderer received undefined asset prop!");
    return null;
  }

  const mode = useFloorPlanStore((state) => state.mode);
  const { displayMode, asset } = props; 

  // 1. "편집" 모드일 때는 항상 LayoutAssetView (모든 자산)
  if (mode === 'edit') {
    return <LayoutAssetView {...props} />;
  }

  // 2. "보기" 모드일 때
  if (mode === 'view') {
    if (displayMode === 'status') { // '상태 임계값' 모드
      if (asset.assetType === 'rack') {
        // 랙만 DashboardAssetView로 렌더링
        return <DashboardAssetView {...props} />;
      } else {
        // 랙이 아닌 다른 자산(벽, 문 등)은 LayoutAssetView로 렌더링
        // (이때 LayoutAssetView는 '상면도 모드'처럼 동작해야 합니다. displayMode를 'customColor'로 넘겨주어 일반적인 모습으로 렌더링되게 합니다.)
        // return <LayoutAssetView {...props} displayMode="customColor" />; 
        return <LayoutAssetView {...props} />;
        // 혹은, 필요에 따라 DashboardAssetView에서도 '다른 자산'을 위한 렌더링을 추가할 수 있지만, 
        // 복잡해지므로 LayoutAssetView를 사용하는 것이 좋습니다.
      }
    } else { // '상면도' (customColor) 모드일 때
      // 모든 자산을 LayoutAssetView로 렌더링
      return <LayoutAssetView {...props} />;
    }
  }


  return null; // 예외 처리
};

export default AssetRenderer;