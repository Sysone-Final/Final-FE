import { EQUIPMENT_PALETTE } from '../constants/config';
import type { EquipmentType } from '../types';

interface EquipmentPalette3DProps {
  onAddEquipment: (type: EquipmentType) => void;
}

export const EquipmentPalette3D = ({ onAddEquipment }: EquipmentPalette3DProps) => {
  return (
    <div className="h-full bg-gray-400 p-6 overflow-y-auto">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
        장비 목록
      </h2>

      <div className="space-y-3">
        {EQUIPMENT_PALETTE.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddEquipment(item.type)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 
                     transition-all duration-200 hover:scale-105 hover:shadow-lg
                     border border-gray-600 hover:border-blue-500
                     flex items-center gap-3 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <div className="flex-1 text-left">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                클릭하여 추가
              </div>
            </div>
            <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              +
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>ℹ️</span>
          사용법
        </h3>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• 장비를 클릭하여 중앙에 추가</li>
          <li>• 마우스로 카메라 회전</li>
          <li>• 스크롤로 줌 인/아웃</li>
          <li>• 우클릭 드래그로 이동</li>
        </ul>
      </div>
    </div>
  );
};
