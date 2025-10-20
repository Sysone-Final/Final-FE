import { create } from "zustand";
import type {
  FloorPlanState,
  Asset,
  DisplayOptions,
  DisplayMode,
} from "../types";

export type Mode = "view" | "edit";

export const useFloorPlanStore = create<FloorPlanState>((set) => ({
  // --- 기존 상태는 그대로 유지 ---
  mode: "view",
  displayMode: "status",
  displayOptions: {
    showName: true,
    showStatusIndicator: true,
    showTemperature: true,
  },
  gridCols: 40,
  gridRows: 14,
  stage: { scale: 1, x: 0, y: 0 },
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
      widthInCells: 2,
      heightInCells: 2,
      customColor: "#f3e9a9",
    },
  ] as Asset[],
  selectedAssetIds: [],

  // --- 기존 액션은 그대로 유지 ---
  toggleMode: () =>
    set((state) => ({ mode: state.mode === "view" ? "edit" : "view" })),
  selectAsset: (id: string) => set({ selectedAssetIds: [id] }),
  setDisplayOptions: (newOptions: Partial<DisplayOptions>) =>
    set((state) => ({
      displayOptions: { ...state.displayOptions, ...newOptions },
    })),
  setDisplayMode: (newMode: DisplayMode) => set({ displayMode: newMode }),
  setGridSize: (cols: number, rows: number) =>
    set({ gridCols: cols, gridRows: rows }),
  setStage: (newStage) => set({ stage: newStage }),
  addAsset: (newAsset) =>
    set((state) => ({
      assets: [
        ...state.assets,
        { ...newAsset, id: `asset_${crypto.randomUUID()}` },
      ],
    })),

  // [신규] 자산 업데이트 액션 구현
  updateAsset: (id, newProps) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id ? { ...asset, ...newProps } : asset,
      ),
    })),
}));
