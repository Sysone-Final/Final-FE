import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Asset, UHeight } from '../../types';
import {
  Server, HardDrive, TerminalSquare, HandMetal, // Core Equipment
  RectangleHorizontal, DoorOpen, Component, StretchHorizontal, // Structure
  Wind, Snowflake, BatteryCharging, PlugZap, Shield, // Power & Cooling
  ShieldCheck, Flame, Video, Fingerprint, Power, Droplets, // Safety
  ChevronDown, // [추가] 아코디언 아이콘
} from 'lucide-react';

interface LibraryAssetTemplate extends Omit<Asset, 'id' | 'gridX' | 'gridY' | 'uHeight'> {
  icon: React.ReactNode;
  uHeight?: UHeight;
}

// [수정] 자산들의 기본 크기를 전반적으로 축소 조정했습니다.
const LIBRARY_CATEGORIES: { category: string; assets: LibraryAssetTemplate[] }[] = [
  {
    category: '🏛️ 구조물 (Structure)',
    assets: [
      { assetType: 'wall', name: '벽', widthInCells: 5, heightInCells: 1, icon: <RectangleHorizontal />, customColor: '#868e96' },
      { assetType: 'door_single', name: '단일 문', widthInCells: 1, heightInCells: 1, icon: <DoorOpen />, customColor: '#ced4da' },
      { assetType: 'door_double', name: '이중 문', widthInCells: 2, heightInCells: 1, icon: <DoorOpen />, customColor: '#ced4da' },
      { assetType: 'pillar', name: '기둥', widthInCells: 1, heightInCells: 1, icon: <Component />, customColor: '#adb5bd' },
      { assetType: 'ramp', name: '경사로', widthInCells: 2, heightInCells: 3, icon: <StretchHorizontal />, customColor: '#e9ecef' },
    ],
  },
  {
    category: '📦 핵심 장비 (Core Equipment)',
    assets: [
      { assetType: 'rack', name: '표준 랙 (1x2)', widthInCells: 1, heightInCells: 2, icon: <Server />, customColor: '#dbe4ff', uHeight: 42 },
      { assetType: 'rack', name: '중형 랙 (1x3)', widthInCells: 1, heightInCells: 3, icon: <Server />, customColor: '#dbe4ff', uHeight: 45 },
      { assetType: 'rack', name: '대형 랙 (2x3)', widthInCells: 2, heightInCells: 3, icon: <Server />, customColor: '#dbe4ff', uHeight: 48 },
      { assetType: 'storage', name: '스토리지', widthInCells: 2, heightInCells: 2, icon: <HardDrive />, customColor: '#cce5ff' },
      { assetType: 'mainframe', name: '메인프레임', widthInCells: 3, heightInCells: 2, icon: <TerminalSquare />, customColor: '#b8e0d2' },
      { assetType: 'crash_cart', name: '콘솔 카트', widthInCells: 1, heightInCells: 1, icon: <HandMetal />, customColor: '#fff3bf' },
    ],
  },
  {
    category: '⚡❄️ 전력 및 공조 (Power & Cooling)',
    assets: [
      { assetType: 'crac', name: '항온항습기', widthInCells: 2, heightInCells: 3, icon: <Wind />, customColor: '#a7d8de' },
      { assetType: 'in_row_cooling', name: '인-로우 쿨링', widthInCells: 1, heightInCells: 3, icon: <Snowflake />, customColor: '#c1dbe8' },
      { assetType: 'ups_battery', name: 'UPS/배터리', widthInCells: 3, heightInCells: 2, icon: <BatteryCharging />, customColor: '#f9dcc4' },
      { assetType: 'power_panel', name: '분전반 (RPP)', widthInCells: 2, heightInCells: 1, icon: <PlugZap />, customColor: '#f3d9e3' },
      { assetType: 'aisle_containment', name: '복도 차폐', widthInCells: 5, heightInCells: 1, icon: <Shield />, customColor: 'rgba(108, 117, 125, 0.3)' },
    ],
  },
  {
    category: '🔒 안전 및 접근 (Safety & Access)',
    assets: [
      { assetType: 'speed_gate', name: '스피드 게이트', widthInCells: 2, heightInCells: 1, icon: <ShieldCheck />, customColor: '#d4d2d8' },
      { assetType: 'fire_suppression', name: '소화 설비', widthInCells: 2, heightInCells: 1, icon: <Flame />, customColor: '#ffc9c9' },
      { assetType: 'cctv', name: 'CCTV', widthInCells: 1, heightInCells: 1, icon: <Video />, customColor: '#e0e0e0' },
      { assetType: 'access_control', name: '출입 통제기', widthInCells: 1, heightInCells: 1, icon: <Fingerprint />, customColor: '#e0e0e0' },
      { assetType: 'epo', name: 'EPO 버튼', widthInCells: 1, heightInCells: 1, icon: <Power />, customColor: '#ffadad' },
      { assetType: 'leak_sensor', name: '누수 감지 센서', widthInCells: 1, heightInCells: 1, icon: <Droplets />, customColor: '#a0c4ff' },
    ],
  },
];

const DraggableAsset = ({ template }: { template: LibraryAssetTemplate }) => {
  const { icon, ...assetData } = template;
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${template.assetType}-${template.name}`,
    data: assetData,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
    cursor: 'grabbing',
  } : {
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-asset-item">
      <span className="asset-icon">{icon}</span>
      <span className="asset-name">{template.name}</span>
    </div>
  );
};

// [추가] 개별 아코디언 카테고리 컴포넌트
const AccordionCategory = ({ category, assets, isOpen, onToggle }: {
  category: string;
  assets: LibraryAssetTemplate[];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div>
      <button onClick={onToggle} className="category-title-button">
        <span className="font-bold">{category}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="accordion-content">
          {assets.map((template) => (
            <DraggableAsset key={`${template.assetType}-${template.name}`} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};


const AssetLibrary: React.FC = () => {
  // [추가] 아코디언 상태 관리
  const [openCategory, setOpenCategory] = useState<string | null>('📦 핵심 장비 (Core Equipment)');

  const handleToggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    // [수정] 스크롤 및 아코디언 UI를 위한 구조 변경
    <div className="asset-library-container">
      <h3 className="sidebar-subtitle">자산 라이브러리</h3>
      <div className="flex flex-col gap-2">
        {LIBRARY_CATEGORIES.map(({ category, assets }) => (
          <AccordionCategory
            key={category}
            category={category}
            assets={assets}
            isOpen={openCategory === category}
            onToggle={() => handleToggleCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetLibrary;

