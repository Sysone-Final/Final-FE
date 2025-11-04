import { EQUIPMENT_PALETTE } from '../constants/config';
import type { EquipmentType } from '../types';

interface EquipmentPalette3DProps {
  onAddEquipment: (type: EquipmentType) => void;
}

function EquipmentPalette3D({ onAddEquipment }: EquipmentPalette3DProps) {
  const handleDragStart = (e: React.DragEvent, type: EquipmentType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('equipmentType', type);
  };

  return (
    <div className="h-full bg-gray-500/10 backdrop-blur-md rounded-2xl p-6 overflow-y-auto shadow-2xl border border-slate-300/40">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
        장비 목록
      </h2>

      <div className="space-y-3">
        {EQUIPMENT_PALETTE.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddEquipment(item.type)}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            className="w-full bg-gray-700/70 hover:bg-gray-600 text-white rounded-lg p-4 
                     transition-all duration-200 hover:shadow-lg
                     border border-gray-600 hover:border-slate-300/40
                     flex items-center gap-3 group cursor-grab active:cursor-grabbing"
          >
            <span className="text-3xl transition-transform">
              {item.icon}
            </span>
            <div className="flex-1 text-left">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                클릭 또는 드래그하여 추가
              </div>
            </div>
            <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              +
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default EquipmentPalette3D