import { create } from 'zustand';
import type { DatacenterEquipment, EquipmentType } from '../types';
import { DATACENTER_CONFIG } from '../constants/config';

interface DatacenterStore {
  equipment: DatacenterEquipment[];
  selectedEquipmentId: string | null;
  
  // Actions
  addEquipment: (type: EquipmentType, x: number, y: number) => void;
  updateEquipmentPosition: (id: string, x: number, y: number) => void;
  removeEquipment: (id: string) => void;
  setSelectedEquipment: (id: string | null) => void;
  setEquipmentDragging: (id: string, isDragging: boolean) => void;
  validateEquipmentPosition: (id: string, x: number, y: number) => boolean;
  
  // Utility
  checkCollision: (id: string, x: number, y: number, width: number, depth: number) => boolean;
  snapToGrid: (pos: number) => number;
}

export const useDatacenterStore = create<DatacenterStore>((set, get) => ({
  equipment: [],
  selectedEquipmentId: null,
  
  // 장비 추가
  addEquipment: (type, x, y) => {
    const { CUBE_SIZE } = DATACENTER_CONFIG;
    const newEquipment: DatacenterEquipment = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      x: get().snapToGrid(x),
      y: get().snapToGrid(y),
      z: 0,
      width: CUBE_SIZE,
      depth: CUBE_SIZE,
      height: CUBE_SIZE,
      type,
      isDragging: false,
      valid: true,
    };
    
    // 충돌 확인
    if (!get().checkCollision(newEquipment.id, newEquipment.x, newEquipment.y, newEquipment.width, newEquipment.depth)) {
      set((state) => ({
        equipment: [...state.equipment, newEquipment],
      }));
    }
  },
  
  // 장비 위치 업데이트
  updateEquipmentPosition: (id, x, y) => {
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id
          ? {
              ...eq,
              x: get().snapToGrid(x),
              y: get().snapToGrid(y),
              valid: !get().checkCollision(id, x, y, eq.width, eq.depth),
            }
          : eq
      ),
    }));
  },
  
  // 장비 제거
  removeEquipment: (id) => {
    set((state) => ({
      equipment: state.equipment.filter((eq) => eq.id !== id),
      selectedEquipmentId: state.selectedEquipmentId === id ? null : state.selectedEquipmentId,
    }));
  },
  
  // 선택된 장비 설정
  setSelectedEquipment: (id) => {
    set({ selectedEquipmentId: id });
  },
  
  // 드래깅 상태 설정
  setEquipmentDragging: (id, isDragging) => {
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, isDragging } : eq
      ),
    }));
  },
  
  // 위치 검증
  validateEquipmentPosition: (id, x, y) => {
    const equipment = get().equipment.find((eq) => eq.id === id);
    if (!equipment) return false;
    
    const { ROOM_WIDTH, ROOM_HEIGHT } = DATACENTER_CONFIG;
    const snappedX = get().snapToGrid(x);
    const snappedY = get().snapToGrid(y);
    
    // 경계 확인
    if (snappedX < 0 || snappedY < 0 || 
        snappedX + equipment.width > ROOM_WIDTH || 
        snappedY + equipment.depth > ROOM_HEIGHT) {
      return false;
    }
    
    // 충돌 확인
    return !get().checkCollision(id, snappedX, snappedY, equipment.width, equipment.depth);
  },
  
  // 충돌 감지
  checkCollision: (id, x, y, width, depth) => {
    const equipment = get().equipment;
    const snappedX = get().snapToGrid(x);
    const snappedY = get().snapToGrid(y);
    
    return equipment.some((eq) => {
      if (eq.id === id) return false;
      
      // AABB (Axis-Aligned Bounding Box) 충돌 감지
      return !(
        snappedX + width <= eq.x ||
        eq.x + eq.width <= snappedX ||
        snappedY + depth <= eq.y ||
        eq.y + eq.depth <= snappedY
      );
    });
  },
  
  // 격자에 스냅
  snapToGrid: (pos) => {
    const { GRID_SIZE } = DATACENTER_CONFIG;
    return Math.round(pos / GRID_SIZE) * GRID_SIZE;
  },
}));
