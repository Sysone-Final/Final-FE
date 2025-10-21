import { create } from "zustand";
import type {
  FloorPlanState,
  Asset,
  DisplayOptionsType,
  DisplayMode,
} from "../types";

export type Mode = "view" | "edit";

export const useFloorPlanStore = create<FloorPlanState>((set) => ({
  // --- 상태 ---
  mode: "view",
  displayMode: "status",
  // [수정] types/index.ts에 정의된 DisplayOptionsType의 모든 속성에 대한 초기값을 설정합니다.
  displayOptions: {
    showName: true,
    showStatusIndicator: true,
    showTemperature: true,
    showUUsage: false,
    showPowerStatus: false,
    showAisle: false,
    showPUE: false,
    showFacilities: false,
    showSensors: false,
    useLOD: true,
    showGridLine: true,
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
      data: { temperature: 22, uUsage: 60 },
      gridX: 3,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 2,
      customColor: "#a9f3a9",
      doorDirection: "south",
      createdAt: new Date().toISOString(),
    },
    {
      id: "A-02",
      type: "rack",
      name: "A-02",
      status: "danger",
      data: { temperature: 28, uUsage: 85 },
      gridX: 8,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 2,
      customColor: "#f3a9a9",
      doorDirection: "south",
      createdAt: new Date().toISOString(),
    },
    {
      id: "B-01",
      type: "rack",
      name: "B-01",
      status: "warning",
      data: { temperature: 25, uUsage: 70 },
      gridX: 3,
      gridY: 8,
      widthInCells: 2,
      heightInCells: 2,
      customColor: "#f3e9a9",
      doorDirection: "east",
      createdAt: new Date().toISOString(),
    },
  ] as Asset[],
  selectedAssetIds: [],

  // --- 액션 ---
  toggleMode: () =>
    set((state) => ({ mode: state.mode === "view" ? "edit" : "view" })),
  setDisplayOptions: (newOptions: Partial<DisplayOptionsType>) =>
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
        {
          ...newAsset,
          id: `asset_${crypto.randomUUID()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateAsset: (id, newProps) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id
          ? { ...asset, ...newProps, updatedAt: new Date().toISOString() }
          : asset,
      ),
    })),
  selectAsset: (id, isMultiSelect = false) =>
    set((state) => {
      const { selectedAssetIds } = state;
      if (isMultiSelect) {
        const newSelection = selectedAssetIds.includes(id)
          ? selectedAssetIds.filter((sid) => sid !== id)
          : [...selectedAssetIds, id];
        return { selectedAssetIds: newSelection };
      }
      if (selectedAssetIds.length === 1 && selectedAssetIds[0] === id) {
        return { selectedAssetIds: [] };
      }
      return { selectedAssetIds: [id] };
    }),
  deselectAll: () => set({ selectedAssetIds: [] }),
  deleteAsset: (id: string) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
      selectedAssetIds: state.selectedAssetIds.filter(
        (selectedId) => selectedId !== id,
      ),
    })),
  duplicateAsset: (id: string) =>
    set((state) => {
      const original = state.assets.find((a) => a.id === id);
      if (!original) return state;
      const duplicate: Asset = {
        ...original,
        id: `asset_${crypto.randomUUID()}`,
        name: `${original.name} (Copy)`,
        gridX: original.gridX + 1,
        gridY: original.gridY + 1,
        createdAt: new Date().toISOString(),
        updatedAt: undefined,
      };
      return { assets: [...state.assets, duplicate] };
    }),
}));
