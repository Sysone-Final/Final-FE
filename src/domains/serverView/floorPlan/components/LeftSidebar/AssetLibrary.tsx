import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Asset, UHeight, AssetLayer } from '../../types';
import {
  Server,
  // HardDrive,
  // TerminalSquare,
  // HandMetal, 
  // RectangleHorizontal,
  DoorOpen,
  // Component,
  // StretchHorizontal, 
  Wind,
  Snowflake,
  // BatteryCharging,
  // PlugZap,
  // Shield, 
  // ShieldCheck,
  Flame,
  // Video,
  // Fingerprint,
  // Power,
  // Droplets, 
  ChevronDown, 
  Thermometer,
} from 'lucide-react';

interface LibraryAssetTemplate
  extends Omit<Asset, 'id' | 'gridX' | 'gridY' | 'uHeight'> {
  icon: React.ReactNode;
  uHeight?: UHeight;
}

const LIBRARY_CATEGORIES: {
  category: string;
  layer: AssetLayer;
  assets: LibraryAssetTemplate[];
}[] = [
  {
    category: '호환 설비 (Floor Layer)',
    layer: 'floor',
    assets: [
      {
        layer: 'floor',
        assetType: 'rack',
        name: '서버 랙',
        widthInCells: 1,
        heightInCells: 1,
        icon: <Server />,
        customColor: '#dbe4ff',
        uHeight: 42,
        doorDirection: 'south',
      },
      // 2D에서는 문을 벽에 붙이지만, 3D 목록에 맞추기 위해 여기에 포함 (배치 로직에 따라 layer 조정 필요할 수 있음)
      {
        layer: 'wall', // 문은 보통 벽 레이어 처리
        assetType: 'door_single',
        name: '문',
        widthInCells: 1,
        heightInCells: 0.25, // 문 두께 표현
        icon: <DoorOpen />,
        customColor: '#ced4da',
        doorDirection: 'south',
      },
      {
        layer: 'floor',
        assetType: 'crac',
        name: '항온항습기', // Climatic Chamber
        widthInCells: 1,
        heightInCells: 1,
        icon: <Wind />,
        customColor: '#a7d8de',
      },
      {
        layer: 'floor',
        assetType: 'fire_suppression',
        name: '소화기',
        widthInCells: 1,
        heightInCells: 1,
        icon: <Flame />,
        customColor: '#ffc9c9',
      },
      // 온도계 (2D 자산 타입에 추가 필요할 수 있음, 여기서는 기존 leak_sensor 등을 대체하거나 새로 정의)
      {
         layer: 'overhead', // 혹은 floor
         assetType: 'leak_sensor', // 임시 매핑 (온도계용 타입이 없다면)
         name: '온도계',
         widthInCells: 1,
         heightInCells: 1,
         icon: <Thermometer />,
         customColor: '#ffe066',
      },
      {
        layer: 'floor',
        assetType: 'in_row_cooling',
        name: '에어컨',
        widthInCells: 1,
        heightInCells: 1,
        icon: <Snowflake />,
        customColor: '#c1dbe8',
      },
    ],
  },
  // 필요하다면 기존 Overhead 유지, 아니면 제거
];
//     category: '🗺️ 바닥 설비 (Floor Layer)',
//     layer: 'floor',
//     assets: [
//       {
//         layer: 'floor',
//         assetType: 'wall',
//         name: '벽',
//         widthInCells: 0.5,
//         heightInCells: 0.5,
//         icon: <RectangleHorizontal />,
//         customColor: '#868e96',
//       },
//       {
//         layer: 'floor',
//         assetType: 'pillar',
//         name: '기둥',
//         widthInCells: 1,
//         heightInCells: 1,
//         icon: <Component />,
//         customColor: '#adb5bd',
//       },
//       {
//         layer: 'floor',
//         assetType: 'ramp',
//         name: '경사로',
//         widthInCells: 1,
//         heightInCells: 1, 
//         icon: <StretchHorizontal />,
//         customColor: '#e9ecef',
//       },
//       // --- 랙 크기 1x1 기준으로 변경 ---
//       {
//         layer: 'floor',
//         assetType: 'rack',
//         name: '표준 랙 (1x1)', 
//         widthInCells: 1, 
//         heightInCells: 1, 
//         icon: <Server />,
//         customColor: '#dbe4ff',
//         uHeight: 42,
//         doorDirection: 'south',
//       },
//       // {
//       //   layer: 'floor',
//       //   assetType: 'rack',
//       //   name: '중형 랙 (1x2)', 
//       //   widthInCells: 1, 
//       //   heightInCells: 2, 
//       //   icon: <Server />,
//       //   customColor: '#dbe4ff',
//       //   uHeight: 45,
//       //   doorDirection: 'south',
//       // },
//       // {
//       //   layer: 'floor',
//       //   assetType: 'rack',
//       //   name: '대형 랙 (2x2)', 
//       //   widthInCells: 2, 
//       //   heightInCells: 2, 
//       //   icon: <Server />,
//       //   customColor: '#dbe4ff',
//       //   uHeight: 48,
//       //   doorDirection: 'south',
//       // },
//       // ---
//       {
//         layer: 'floor',
//         assetType: 'storage',
//         name: '스토리지',
//         widthInCells: 2,
//         heightInCells: 1, 
//         icon: <HardDrive />,
//         customColor: '#cce5ff',
//       },
//       {
//         layer: 'floor',
//         assetType: 'mainframe',
//         name: '메인프레임',
//         widthInCells: 2,
//         heightInCells: 2, 
//         icon: <TerminalSquare />,
//         customColor: '#b8e0d2',
//       },
//       {
//         layer: 'floor',
//         assetType: 'crash_cart',
//         name: '콘솔 카트',
//         widthInCells: 1,
//         heightInCells: 1,
//         icon: <HandMetal />,
//         customColor: '#fff3bf',
//       },
//       {
//         layer: 'floor',
//         assetType: 'crac',
//         name: '항온항습기',
//         widthInCells: 1,
//         heightInCells: 1, 
//         icon: <Wind />,
//         customColor: '#a7d8de',
//       },
//       {
//         layer: 'floor',
//         assetType: 'in_row_cooling',
//         name: '인-로우 쿨링',
//         widthInCells: 1,
//         heightInCells: 1, 
//         icon: <Snowflake />,
//         customColor: '#c1dbe8',
//       },
//       {
//         layer: 'floor',
//         assetType: 'ups_battery',
//         name: 'UPS/배터리',
//         widthInCells: 2,
//         heightInCells: 2, 
//         icon: <BatteryCharging />,
//         customColor: '#f9dcc4',
//       },
//       {
//         layer: 'floor',
//         assetType: 'power_panel',
//         name: '분전반 (RPP)',
//         widthInCells: 1,
//         heightInCells: 1, 
//         icon: <PlugZap />,
//         customColor: '#f3d9e3',
//       },
//       {
//         layer: 'floor',
//         assetType: 'speed_gate',
//         name: '스피드 게이트',
//         widthInCells: 2,
//         heightInCells: 1,
//         icon: <ShieldCheck />,
//         customColor: '#d4d2d8',
//       },
//       {
//         layer: 'floor',
//         assetType: 'fire_suppression',
//         name: '소화 설비',
//         widthInCells: 1,
//         heightInCells: 1, 
//         icon: <Flame />,
//         customColor: '#ffc9c9',
//       },
//     ],
//   },
//   {
//     category: '🧱 벽면 설비 (Wall-Mounted Layer)',
//     layer: 'wall',
//     assets: [
//       {
//         layer: 'wall',
//         assetType: 'door_single',
//         name: '단일 문',
//         widthInCells: 1,
//         heightInCells: 1, 
//         icon: <DoorOpen />,
//         customColor: '#ced4da',
//         doorDirection: 'south',
//       },
//       {
//         layer: 'wall',
//         assetType: 'door_double',
//         name: '이중 문',
//         widthInCells: 2,
//         heightInCells: 1, 
//         icon: <DoorOpen />,
//         customColor: '#ced4da',
//         doorDirection: 'south',
//       },
//       {
//         layer: 'wall',
//         assetType: 'access_control',
//         name: '출입 통제기',
//         widthInCells: 1,
//         heightInCells: 1,
//         icon: <Fingerprint />,
//         customColor: '#e0e0e0',
//       },
//       {
//         layer: 'wall',
//         assetType: 'epo',
//         name: 'EPO 버튼',
//         widthInCells: 1,
//         heightInCells: 1,
//         icon: <Power />,
//         customColor: '#ffadad',
//       },
//     ],
//   },
//   {
//     category: '💡 상부 설비 (Overhead Layer)',
//     layer: 'overhead',
//     assets: [
//       {
//         layer: 'overhead',
//         assetType: 'aisle_containment',
//         name: '복도 차폐',
//         widthInCells: 2,
//         heightInCells: 1, 
//         icon: <Shield />,
//         customColor: 'rgba(108, 117, 125, 0.3)',
//       },
//       {
//         layer: 'overhead',
//         assetType: 'cctv',
//         name: 'CCTV',
//         widthInCells: 1,
//         heightInCells: 1,
//         icon: <Video />,
//         customColor: '#e0e0e0',
//       },
//       {
//         layer: 'overhead',
//         assetType: 'leak_sensor',
//         name: '누수 감지 센서',
//         widthInCells: 1,
//         heightInCells: 1,
//         icon: <Droplets />,
//         customColor: '#a0c4ff',
//       },
//     ],
//   },
// ];

const DraggableAsset = ({
  template,
  isCompact,
}: {
  template: LibraryAssetTemplate;
  isCompact: boolean;
}) => {
  const { icon, ...assetData } = template;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${template.assetType}-${template.name}`,
    data: assetData,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        cursor: 'grabbing',
      }
    : {
        cursor: 'grab',
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`draggable-asset-item ${isCompact ? 'p-2' : 'p-3'}`}
    >
      <span className={`asset-icon ${isCompact ? 'text-base' : 'text-lg'}`}>
        {icon}
      </span>
      <span
        className={`asset-name ${
          isCompact ? 'text-xs' : 'text-sm'
        } text-body-primary`}
      >
        {template.name}
      </span>
    </div>
  );
};
const AccordionCategory = ({
  category,
  assets,
  isOpen,
  onToggle,
}: {
  category: string;
  assets: LibraryAssetTemplate[];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div>
      <button onClick={onToggle} className="category-title-button">
        <span className="font-bold text-body-primary">{category}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="accordion-content">
          <div className={'grid grid-cols-2 gap-2'}>
            {assets.map((template) => (
              <DraggableAsset
                key={`${template.assetType}-${template.name}`}
                template={template}
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
  const [openCategory, setOpenCategory] = useState<string | null>(
    '호환 설비 (Floor Layer)',
  );

  const handleToggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="asset-library-container">
      <h3 className="sidebar-subtitle text-heading">자산 라이브러리</h3>
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
