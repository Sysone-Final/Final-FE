import { create } from "zustand";
import type { Equipment3D, EquipmentType, GridConfig } from "../types";
import {
  DEFAULT_GRID_CONFIG,
  EQUIPMENT_DEFAULT_ROTATION,
} from "../constants/config";

interface BabylonDatacenterStore {
  // 격자 설정
  gridConfig: GridConfig;
  setGridConfig: (config: Partial<GridConfig>) => void;

  // 장비 목록
  equipment: Equipment3D[];
  selectedEquipmentId: string | null;

  // 장비 관리
  addEquipment: (type: EquipmentType, gridX: number, gridY: number) => void;
  updateEquipmentPosition: (
    id: string,
    gridX: number,
    gridY: number,
    gridZ?: number,
  ) => void;
  updateEquipmentRotation: (id: string, rotation: number) => void;
  removeEquipment: (id: string) => void;
  setSelectedEquipment: (id: string | null) => void;

  // 유틸리티
  isPositionOccupied: (
    gridX: number,
    gridY: number,
    excludeId?: string,
  ) => boolean;
  isValidPosition: (gridX: number, gridY: number) => boolean;
}

export const useBabylonDatacenterStore = create<BabylonDatacenterStore>(
  (set, get) => ({
    // 초기 격자 설정
    gridConfig: DEFAULT_GRID_CONFIG,

    setGridConfig: (config) => {
      set((state) => ({
        gridConfig: { ...state.gridConfig, ...config },
      }));
    },

    // 초기 장비 목록
    equipment: [],
    selectedEquipmentId: null,

    // 장비 추가
    addEquipment: (type, gridX, gridY) => {
      const { isValidPosition, isPositionOccupied } = get();

      // 유효성 검사
      if (!isValidPosition(gridX, gridY) || isPositionOccupied(gridX, gridY)) {
        console.warn("Invalid position or position occupied");
        return;
      }

      // 장비별 기본 회전 각도 가져오기
      const defaultRotation = EQUIPMENT_DEFAULT_ROTATION[type] || 0;

      const newEquipment: Equipment3D = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        gridX,
        gridY,
        gridZ: 0,
        rotation: defaultRotation, // 기본 회전 각도 적용
      };

      set((state) => ({
        equipment: [...state.equipment, newEquipment],
      }));
    },

    // 장비 위치 업데이트
    updateEquipmentPosition: (id, gridX, gridY, gridZ = 0) => {
      const { isValidPosition, isPositionOccupied } = get();

      // 유효성 검사 (자기 자신은 제외)
      if (
        !isValidPosition(gridX, gridY) ||
        isPositionOccupied(gridX, gridY, id)
      ) {
        return;
      }

      set((state) => ({
        equipment: state.equipment.map((eq) =>
          eq.id === id ? { ...eq, gridX, gridY, gridZ } : eq,
        ),
      }));
    },

    // 장비 회전 업데이트
    updateEquipmentRotation: (id, rotation) => {
      set((state) => ({
        equipment: state.equipment.map((eq) =>
          eq.id === id ? { ...eq, rotation } : eq,
        ),
      }));
    },

    // 장비 제거
    removeEquipment: (id) => {
      set((state) => ({
        equipment: state.equipment.filter((eq) => eq.id !== id),
        selectedEquipmentId:
          state.selectedEquipmentId === id ? null : state.selectedEquipmentId,
      }));
    },

    // 선택된 장비 설정
    setSelectedEquipment: (id) => {
      set({ selectedEquipmentId: id });
    },

    // 위치가 점유되었는지 확인
    isPositionOccupied: (gridX, gridY, excludeId) => {
      const { equipment } = get();
      return equipment.some(
        (eq) => eq.id !== excludeId && eq.gridX === gridX && eq.gridY === gridY,
      );
    },

    // 유효한 위치인지 확인
    isValidPosition: (gridX, gridY) => {
      const { gridConfig } = get();
      return (
        gridX >= 0 &&
        gridY >= 0 &&
        gridX < gridConfig.columns &&
        gridY < gridConfig.rows
      );
    },
  }),
);
