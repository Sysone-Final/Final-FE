import { useState } from 'react';
import type { EquipmentType } from '../types';
import { getEquipmentColors } from '../constants/colors';

interface EquipmentPaletteProps {
  onAddEquipment: (type: EquipmentType) => void;
}

interface PaletteItem {
  type: EquipmentType;
  name: string;
  description: string;
  icon: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'server',
    name: '서버',
    description: '서버 랙',
    icon: '🖥️',
  },
  {
    type: 'storage',
    name: '스토리지',
    description: '저장 장치',
    icon: '💾',
  },
  {
    type: 'network',
    name: '네트워크',
    description: '네트워크 장비',
    icon: '🌐',
  },
  {
    type: 'ups',
    name: 'UPS',
    description: '무정전 전원 장치',
    icon: '🔋',
  },
  {
    type: 'ac',
    name: '에어컨',
    description: '냉각 시스템',
    icon: '❄️',
  },
];

function EquipmentPalette({ onAddEquipment }: EquipmentPaletteProps) {
  const [selectedType, setSelectedType] = useState<EquipmentType | null>(null);

  const handleItemClick = (type: EquipmentType) => {
    setSelectedType(type);
    onAddEquipment(type);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-50 to-gray-100 border-l border-gray-300 shadow-lg overflow-y-auto">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            장비 팔레트
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            클릭하여 맵에 배치하세요
          </p>
        </div>
      </div>

      {/* 장비 리스트 */}
      <div className="p-4 space-y-3">
        {PALETTE_ITEMS.map((item) => {
          const colors = getEquipmentColors(item.type);
          const isSelected = selectedType === item.type;

          return (
            <button
              key={item.type}
              onClick={() => handleItemClick(item.type)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200
                hover:scale-105 hover:shadow-md active:scale-95
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
            >
              {/* 아이콘과 이름 */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>

              {/* 색상 미리보기 */}
              <div className="flex gap-1 mt-2">
                <div
                  className="h-6 flex-1 rounded border border-gray-300"
                  style={{ backgroundColor: colors.front }}
                  title="앞면"
                />
                <div
                  className="h-6 flex-1 rounded border border-gray-300"
                  style={{ backgroundColor: colors.left }}
                  title="왼쪽"
                />
                <div
                  className="h-6 flex-1 rounded border border-gray-300"
                  style={{ backgroundColor: colors.top }}
                  title="위"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 사용법 안내 */}
      <div className="p-4 m-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 text-sm mb-2">💡 사용법</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 장비를 클릭하여 맵 중앙에 배치</li>
          <li>• 드래그하여 원하는 위치로 이동</li>
          <li>• 격자에 자동으로 스냅됩니다</li>
          <li>• 다른 장비와 겹칠 수 없습니다</li>
        </ul>
      </div>

      {/* 통계 정보 (추가 예정) */}
      <div className="p-4 m-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-700 text-sm mb-2">📊 배치 통계</h3>
        <div className="text-xs text-gray-600">
          <p>배치된 장비를 보려면 맵을 확인하세요</p>
        </div>
      </div>
    </div>
  );
}

export default EquipmentPalette;
