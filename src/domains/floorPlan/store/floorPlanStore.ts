import { create } from "zustand";
import type {
  FloorPlanState,
  Asset,
  DisplayOptions,
  DisplayMode,
} from "../types";

export type Mode = "view" | "edit";

export const useFloorPlanStore = create<FloorPlanState>((set) => ({
  // --- 초기 상태 ---
  mode: "view",
  displayMode: "status", // 기본 표시 모드는 '상태 임계값'
  displayOptions: {
    showName: true,
    showStatusIndicator: true,
    showTemperature: true,
  },

  // [수정] 그리드 좌표 기반의 목업 데이터 (40x14 가정)
  assets: [
    {
      id: "A-01",
      type: "rack",
      name: "A-01",
      status: "normal",
      data: { temperature: 22 },
      gridX: 3,
      gridY: 2,
      widthInCells: 2,
      heightInCells: 4,
      customColor: "#a9f3a9",
    },
    {
      id: "A-02",
      type: "rack",
      name: "A-02",
      status: "danger",
      data: { temperature: 28 },
      gridX: 8,
      gridY: 2,
      widthInCells: 2,
      heightInCells: 4,
      customColor: "#f3a9a9",
    },
    {
      id: "B-01",
      type: "rack",
      name: "B-01",
      status: "warning",
      data: { temperature: 25 },
      gridX: 3,
      gridY: 8,
      widthInCells: 2,
      heightInCells: 4,
      customColor: "#f3e9a9",
    },
  ] as Asset[],

  selectedAssetIds: [],

  // --- 액션(Actions) ---
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "view" ? "edit" : "view",
    })),

  selectAsset: (id: string) => set({ selectedAssetIds: [id] }),

  // [신규] 표시 옵션 변경 액션
  setDisplayOptions: (newOptions: Partial<DisplayOptions>) =>
    set((state) => ({
      displayOptions: { ...state.displayOptions, ...newOptions },
    })),

  // [신규] 표시 모드 변경 액션
  setDisplayMode: (newMode: DisplayMode) => set({ displayMode: newMode }),
}));
