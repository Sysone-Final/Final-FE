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
  displayMode: "status",
  displayOptions: {
    showName: true,
    showStatusIndicator: true,
    showTemperature: true,
  },

  // [수정] 랙의 크기를 더 작게 조정합니다 (width: 2 -> 1, height: 4 -> 2)
  assets: [
    {
      id: "A-01",
      type: "rack",
      name: "A-01",
      status: "normal",
      data: { temperature: 22 },
      gridX: 3,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 2,
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
      widthInCells: 1,
      heightInCells: 2,
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
      widthInCells: 1,
      heightInCells: 1,
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

  setDisplayOptions: (newOptions: Partial<DisplayOptions>) =>
    set((state) => ({
      displayOptions: { ...state.displayOptions, ...newOptions },
    })),

  setDisplayMode: (newMode: DisplayMode) => set({ displayMode: newMode }),
}));
