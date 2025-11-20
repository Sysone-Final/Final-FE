import { create } from "zustand";
import type { Equipment3D, EquipmentType, GridConfig } from "../../types";
import {
  DEFAULT_GRID_CONFIG,
  EQUIPMENT_DEFAULT_ROTATION,
} from "../../constants/config";

/**
 * 장비 목록의 변경 여부를 감지
 * - 장비 개수 변화
 * - 장비 위치 변화 (gridX, gridY, gridZ)
 * - 장비 회전 변화
 * - 장비 상태 변화
 */
function hasEquipmentChanges(
  currentEquipment: Equipment3D[],
  newEquipment: Equipment3D[],
): boolean {
  // 개수가 다르면 변경됨
  if (currentEquipment.length !== newEquipment.length) {
    return true;
  }

  // ID 기준으로 맵 생성 (빠른 조회)
  const currentMap = new Map(
    currentEquipment.map((eq) => [eq.equipmentId || eq.id, eq])
  );

  // 각 장비를 비교
  for (const newEq of newEquipment) {
    const currentEq = currentMap.get(newEq.equipmentId || newEq.id);

    // 새로운 장비가 추가됨
    if (!currentEq) {
      return true;
    }

    // 위치나 회전이 변경됨
    if (
      currentEq.gridX !== newEq.gridX ||
      currentEq.gridY !== newEq.gridY ||
      currentEq.gridZ !== newEq.gridZ ||
      Math.abs(currentEq.rotation - newEq.rotation) > 0.01 // 부동소수점 오차 고려
    ) {
      return true;
    }

    // 상태가 변경됨
    if (currentEq.metadata?.status !== newEq.metadata?.status) {
      return true;
    }

    // rackId 변경됨
    if (currentEq.rackId !== newEq.rackId) {
      return true;
    }
  }

  // 모든 검사 통과 - 변경 없음
  return false;
}

interface BabylonDatacenterStore {
  // 격자 설정
  gridConfig: GridConfig;
  gridVersion: number;
  lastAppliedGridVersion: number;
  setGridConfig: (config: Partial<GridConfig>) => void;

  // 장비 목록
  equipment: Equipment3D[];
  selectedEquipmentId: string | null;
  selectedEquipmentIds: string[]; // 다중 선택
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
  toggleMode: () => void;
  currentServerRoomId: string | null;
  initializeServerRoom: (
    serverRoomId: string,
    equipmentList: Equipment3D[]
  ) => void;

  // 다중 선택 영역
  selectionArea: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null;
  setSelectionArea: (
    area: { startX: number; startY: number; endX: number; endY: number } | null
  ) => void;
  selectEquipmentInArea: (
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ) => void;

  // 랙 모달 상태
  isRackModalOpen: boolean;
  selectedServerId: string | null;
  selectedServerRoomId: number | null;
  openRackModal: (serverId: string) => void;
  closeRackModal: () => void;

  // 장비 관리
  addEquipment: (type: EquipmentType, gridX: number, gridY: number) => void;
  updateEquipmentPosition: (
    id: string,
    gridX: number,
    gridY: number,
    gridZ?: number
  ) => boolean; // boolean 반환으로 변경
  updateMultipleEquipmentPositions: (
    updates: {
      id: string;
      gridX: number;
      gridY: number;
      originalGridX: number;
      originalGridY: number;
    }[]
  ) => boolean; // boolean 반환 및 타입 변경
  updateEquipmentRotation: (id: string, rotation: number) => void;
  rotateEquipment90: (id: string, clockwise?: boolean) => void; // 90도 회전 함수 추가
  removeEquipment: (id: string) => void;
  setSelectedEquipment: (id: string | null) => void;
  setSelectedEquipments: (ids: string[]) => void; // 다중 선택 설정
  toggleEquipmentSelection: (id: string) => void; // 토글 선택
  clearSelection: () => void; // 선택 해제
  loadEquipment: (equipmentList: Equipment3D[]) => void; // 장비 목록 일괄 로드

  // 유틸리티
  isPositionOccupied: (
    gridX: number,
    gridY: number,
    excludeId?: string
  ) => boolean;
  isValidPosition: (gridX: number, gridY: number) => boolean;
}

export const useBabylonDatacenterStore = create<BabylonDatacenterStore>(
  (set, get) => ({
    // 초기 격자 설정
    gridConfig: DEFAULT_GRID_CONFIG,
    gridVersion: 0,
    lastAppliedGridVersion: 0,

    setGridConfig: (config) => {
      set((state) => {
        const nextConfig = { ...state.gridConfig, ...config };
        const rowsChanged =
          config.rows !== undefined && config.rows !== state.gridConfig.rows;
        const columnsChanged =
          config.columns !== undefined &&
          config.columns !== state.gridConfig.columns;

        return {
          gridConfig: nextConfig,
          gridVersion:
            rowsChanged || columnsChanged
              ? state.gridVersion + 1
              : state.gridVersion,
        };
      });
    },

    // 초기 장비 목록
    equipment: [],
    selectedEquipmentId: null,
    selectedEquipmentIds: [],
    mode: "view",
    currentServerRoomId: null,
    selectionArea: null,

    setMode: (nextMode) =>
      set((state) => {
        if (state.mode === nextMode) {
          return {};
        }

        return {
          mode: nextMode,
          selectedEquipmentId:
            nextMode === "view" ? null : state.selectedEquipmentId,
          isRackModalOpen: nextMode === "view" ? false : state.isRackModalOpen,
          selectedServerId: nextMode === "view" ? null : state.selectedServerId,
        };
      }),

    toggleMode: () =>
      set((state) => {
        const nextMode = state.mode === "view" ? "edit" : "view";
        return {
          mode: nextMode,
          selectedEquipmentId:
            nextMode === "view" ? null : state.selectedEquipmentId,
          isRackModalOpen: nextMode === "view" ? false : state.isRackModalOpen,
          selectedServerId: nextMode === "view" ? null : state.selectedServerId,
        };
      }),

    initializeServerRoom: (serverRoomId, equipmentList) => {
      const currentState = get();
      const gridChanged =
        currentState.lastAppliedGridVersion !== currentState.gridVersion;
      
      // 같은 서버실이고 장비 데이터가 동일하면 업데이트하지 않음 (성능 최적화)
      if (currentState.currentServerRoomId === serverRoomId) {
        const hasChanges = hasEquipmentChanges(currentState.equipment, equipmentList);
        if (!hasChanges && !gridChanged) {
          console.log('📦 장비 데이터 변경 없음 - 업데이트 스킵');
          return;
        }
        console.log('🔄 장비 데이터 변경 감지 - 업데이트 진행');
      }

      set({
        currentServerRoomId: serverRoomId,
        equipment: equipmentList,
        selectedEquipmentId: null,
        isRackModalOpen: false,
        selectedServerId: null,
        mode: "view",
        lastAppliedGridVersion: currentState.gridVersion,
      });
    },

    // 랙 모달 상태
    isRackModalOpen: false,
    selectedServerId: null,
    selectedServerRoomId: null,

    openRackModal: (serverId: string) => {
      set({
        isRackModalOpen: true,
        selectedServerId: serverId,
      });
    },

    closeRackModal: () => {
      set({
        isRackModalOpen: false,
        selectedServerId: null,
        selectedServerRoomId: null,
      });
    },

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
      const { isValidPosition, isPositionOccupied, equipment } = get();

      console.log(
        `🔧 [Store] updateEquipmentPosition 호출 - id: ${id}, pos: (${gridX}, ${gridY})`
      );

      // 현재 장비의 위치 가져오기
      const currentEquipment = equipment.find((eq) => eq.id === id);
      if (!currentEquipment) {
        console.log(`❌ [Store] 장비를 찾을 수 없음 - id: ${id}`);
        return false;
      }

      // 동일한 위치로 이동하는 경우 아무것도 하지 않음
      if (
        currentEquipment.gridX === gridX &&
        currentEquipment.gridY === gridY
      ) {
        console.log(`ℹ️ [Store] 동일한 위치로 이동 - 업데이트 생략`);
        return true;
      }

      // 유효성 검사 (자기 자신은 제외)
      const valid = isValidPosition(gridX, gridY);
      const occupied = isPositionOccupied(gridX, gridY, id);

      console.log(
        `🔧 [Store] isValidPosition: ${valid}, isPositionOccupied: ${occupied}`
      );

      if (!valid || occupied) {
        console.log(
          `❌ [Store] 위치 업데이트 거부 - valid: ${valid}, occupied: ${occupied}`
        );
        return false;
      }

      console.log(`✅ [Store] 위치 업데이트 승인`);
      set((state) => ({
        equipment: state.equipment.map((eq) =>
          eq.id === id ? { ...eq, gridX, gridY, gridZ } : eq
        ),
      }));

      return true;
    },

    // 다중 장비 위치 업데이트
    updateMultipleEquipmentPositions: (updates) => {
      const { isValidPosition, isPositionOccupied } = get();

      console.log(
        `🔧 [Store] updateMultipleEquipmentPositions 호출 - ${updates.length}개 장비`
      );

      // 모든 장비의 유효성 검사
      for (const update of updates) {
        // 원래 위치와 동일한지 확인
        const isSamePosition =
          update.gridX === update.originalGridX &&
          update.gridY === update.originalGridY;
        if (isSamePosition) {
          continue; // 동일한 위치로 이동하는 장비는 검사 생략
        }

        // 유효성 검사
        const valid = isValidPosition(update.gridX, update.gridY);
        const occupied = isPositionOccupied(
          update.gridX,
          update.gridY,
          update.id
        );

        if (!valid) {
          console.log(
            `❌ [Store] 다중 이동 거부 - 장비 ${update.id}가 격자 범위를 벗어남`
          );
          return false;
        }

        if (occupied) {
          console.log(
            `❌ [Store] 다중 이동 거부 - 장비 ${update.id}의 목표 위치가 점유됨`
          );
          return false;
        }
      }

      console.log(`✅ [Store] 다중 이동 승인`);

      // 모든 검사를 통과하면 위치 업데이트
      set((state) => {
        const updatesMap = new Map(updates.map((u) => [u.id, u]));
        return {
          equipment: state.equipment.map((eq) => {
            const update = updatesMap.get(eq.id);
            return update
              ? { ...eq, gridX: update.gridX, gridY: update.gridY }
              : eq;
          }),
        };
      });

      return true;
    },

    // 장비 회전 업데이트
    updateEquipmentRotation: (id, rotation) => {
      set((state) => ({
        equipment: state.equipment.map((eq) =>
          eq.id === id ? { ...eq, rotation } : eq
        ),
      }));
    },

    // 장비 90도 회전 (시계방향)
    rotateEquipment90: (id: string, clockwise: boolean = true) => {
      set((state) => ({
        equipment: state.equipment.map((eq) => {
          if (eq.id === id) {
            // 90도 = π/2 라디안
            const rotation90 = Math.PI / 2;
            const newRotation = clockwise
              ? eq.rotation + rotation90
              : eq.rotation - rotation90;

            // 0 ~ 2π 범위로 정규화
            const normalizedRotation =
              ((newRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

            return { ...eq, rotation: normalizedRotation };
          }
          return eq;
        }),
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
      set({ selectedEquipmentId: id, selectedEquipmentIds: id ? [id] : [] });
    },

    // 다중 선택 설정
    setSelectedEquipments: (ids) => {
      set({
        selectedEquipmentIds: ids,
        selectedEquipmentId: ids.length === 1 ? ids[0] : null,
      });
    },

    // 토글 선택 (Ctrl+클릭)
    toggleEquipmentSelection: (id) => {
      set((state) => {
        const isSelected = state.selectedEquipmentIds.includes(id);
        const newIds = isSelected
          ? state.selectedEquipmentIds.filter((i) => i !== id)
          : [...state.selectedEquipmentIds, id];

        return {
          selectedEquipmentIds: newIds,
          selectedEquipmentId: newIds.length === 1 ? newIds[0] : null,
        };
      });
    },

    // 선택 해제
    clearSelection: () => {
      set({
        selectedEquipmentIds: [],
        selectedEquipmentId: null,
        selectionArea: null,
      });
    },

    // 장비 목록 일괄 로드 (뷰어 모드에서 사용)
    loadEquipment: (equipmentList) => {
      set({
        equipment: equipmentList,
        selectedEquipmentId: null,
        selectedEquipmentIds: [],
        selectionArea: null,
      });
    },

    // 선택 영역 설정
    setSelectionArea: (area) => {
      set({ selectionArea: area });
    },

    // 영역 내의 장비 선택
    selectEquipmentInArea: (startGridX, startGridY, endGridX, endGridY) => {
      const { equipment } = get();

      // 시작과 끝 좌표 정규화 (최소/최대값 정렬)
      const minX = Math.min(startGridX, endGridX);
      const maxX = Math.max(startGridX, endGridX);
      const minY = Math.min(startGridY, endGridY);
      const maxY = Math.max(startGridY, endGridY);

      // 영역 내에 있는 장비 찾기
      const equipmentInArea = equipment.filter(
        (eq) =>
          eq.gridX >= minX &&
          eq.gridX <= maxX &&
          eq.gridY >= minY &&
          eq.gridY <= maxY
      );

      const selectedIds = equipmentInArea.map((eq) => eq.id);

      set({
        selectedEquipmentIds: selectedIds,
        selectedEquipmentId: selectedIds.length === 1 ? selectedIds[0] : null,
      });
    },

    // 위치가 점유되었는지 확인
    isPositionOccupied: (gridX, gridY, excludeId) => {
      const { equipment } = get();
      return equipment.some(
        (eq) => eq.id !== excludeId && eq.gridX === gridX && eq.gridY === gridY
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
  })
);
