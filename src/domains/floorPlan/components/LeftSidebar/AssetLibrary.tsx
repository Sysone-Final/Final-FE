import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Asset, UHeight, AssetLayer } from '../../types';
import {
  Server, HardDrive, TerminalSquare, HandMetal, // Core Equipment
  RectangleHorizontal, DoorOpen, Component, StretchHorizontal, // Structure
  Wind, Snowflake, BatteryCharging, PlugZap, Shield, // Power & Cooling
  ShieldCheck, Flame, Video, Fingerprint, Power, Droplets, // Safety
  ChevronDown, // Accordion Icon
} from 'lucide-react';

interface LibraryAssetTemplate extends Omit<Asset, 'id' | 'gridX' | 'gridY' | 'uHeight'> {
  icon: React.ReactNode;
  uHeight?: UHeight;
}

const LIBRARY_CATEGORIES: { category: string; layer: AssetLayer; assets: LibraryAssetTemplate[] }[] = [
  {
    category: '🗺️ 바닥 설비 (Floor Layer)',
    layer: 'floor',
    assets: [
      { layer: 'floor', assetType: 'wall', name: '벽', widthInCells: 5, heightInCells: 1, icon: <RectangleHorizontal />, customColor: '#868e96' },
      { layer: 'floor', assetType: 'pillar', name: '기둥', widthInCells: 1, heightInCells: 1, icon: <Component />, customColor: '#adb5bd' },
      { layer: 'floor', assetType: 'ramp', name: '경사로', widthInCells: 2, heightInCells: 3, icon: <StretchHorizontal />, customColor: '#e9ecef' },
      { layer: 'floor', assetType: 'rack', name: '표준 랙 (1x2)', widthInCells: 1, heightInCells: 2, icon: <Server />, customColor: '#dbe4ff', uHeight: 42, doorDirection: 'south' },
      { layer: 'floor', assetType: 'rack', name: '중형 랙 (1x3)', widthInCells: 1, heightInCells: 3, icon: <Server />, customColor: '#dbe4ff', uHeight: 45, doorDirection: 'south' },
      { layer: 'floor', assetType: 'rack', name: '대형 랙 (2x3)', widthInCells: 2, heightInCells: 3, icon: <Server />, customColor: '#dbe4ff', uHeight: 48, doorDirection: 'south' },
      { layer: 'floor', assetType: 'storage', name: '스토리지', widthInCells: 2, heightInCells: 2, icon: <HardDrive />, customColor: '#cce5ff' },
      { layer: 'floor', assetType: 'mainframe', name: '메인프레임', widthInCells: 3, heightInCells: 2, icon: <TerminalSquare />, customColor: '#b8e0d2' },
      { layer: 'floor', assetType: 'crash_cart', name: '콘솔 카트', widthInCells: 1, heightInCells: 1, icon: <HandMetal />, customColor: '#fff3bf' },
      { layer: 'floor', assetType: 'crac', name: '항온항습기', widthInCells: 2, heightInCells: 3, icon: <Wind />, customColor: '#a7d8de' },
      { layer: 'floor', assetType: 'in_row_cooling', name: '인-로우 쿨링', widthInCells: 1, heightInCells: 3, icon: <Snowflake />, customColor: '#c1dbe8' },
      { layer: 'floor', assetType: 'ups_battery', name: 'UPS/배터리', widthInCells: 3, heightInCells: 2, icon: <BatteryCharging />, customColor: '#f9dcc4' },
      { layer: 'floor', assetType: 'power_panel', name: '분전반 (RPP)', widthInCells: 2, heightInCells: 1, icon: <PlugZap />, customColor: '#f3d9e3' },
      { layer: 'floor', assetType: 'speed_gate', name: '스피드 게이트', widthInCells: 2, heightInCells: 1, icon: <ShieldCheck />, customColor: '#d4d2d8' },
      { layer: 'floor', assetType: 'fire_suppression', name: '소화 설비', widthInCells: 2, heightInCells: 1, icon: <Flame />, customColor: '#ffc9c9' },
    ],
  },
  {
    category: '🧱 벽면 설비 (Wall-Mounted Layer)',
    layer: 'wall',
    assets: [
        { layer: 'wall', assetType: 'door_single', name: '단일 문', widthInCells: 2, heightInCells: 1, icon: <DoorOpen />, customColor: '#ced4da', doorDirection: 'south' },
        { layer: 'wall', assetType: 'door_double', name: '이중 문', widthInCells: 4, heightInCells: 1, icon: <DoorOpen />, customColor: '#ced4da', doorDirection: 'south' },
        { layer: 'wall', assetType: 'access_control', name: '출입 통제기', widthInCells: 1, heightInCells: 1, icon: <Fingerprint />, customColor: '#e0e0e0' },
        { layer: 'wall', assetType: 'epo', name: 'EPO 버튼', widthInCells: 1, heightInCells: 1, icon: <Power />, customColor: '#ffadad' },
    ],
  },
  {
    category: '💡 상부 설비 (Overhead Layer)',
    layer: 'overhead',
    assets: [
        { layer: 'overhead', assetType: 'aisle_containment', name: '복도 차폐', widthInCells: 5, heightInCells: 1, icon: <Shield />, customColor: 'rgba(108, 117, 125, 0.3)' },
        { layer: 'overhead', assetType: 'cctv', name: 'CCTV', widthInCells: 1, heightInCells: 1, icon: <Video />, customColor: '#e0e0e0' },
        { layer: 'overhead', assetType: 'leak_sensor', name: '누수 감지 센서', widthInCells: 1, heightInCells: 1, icon: <Droplets />, customColor: '#a0c4ff' },
    ],
  },
];


const DraggableAsset = ({ template, isCompact }: { template: LibraryAssetTemplate; isCompact: boolean }) => {
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
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} 
      className={`draggable-asset-item ${isCompact ? 'p-2' : 'p-3'}`}
    >
      <span className={`asset-icon ${isCompact ? 'text-base' : 'text-lg'}`}>{icon}</span>
      <span className={`asset-name ${isCompact ? 'text-xs' : 'text-sm'}`}>{template.name}</span>
    </div>
  );
};

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
          {/*  모든 카테고리에 항상 2행 그리드 레이아웃을 적용합니다. */}
          <div className={'grid grid-cols-2 gap-2'}>
            {assets.map((template) => (
              <DraggableAsset
                key={`${template.assetType}-${template.name}`}
                template={template}
                //  모든 아이템을 Compact 모드로 표시하여 그리드에 맞춥니다.
                isCompact={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const AssetLibrary: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>('🗺️ 바닥 설비 (Floor Layer)');

  const handleToggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="asset-library-container">
      <h3 className="sidebar-subtitle">자산 라이브러리</h3>
      <div className="asset-list-scroll-container">
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
    </div>
  );
};

export default AssetLibrary;

