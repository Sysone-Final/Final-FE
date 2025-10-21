import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import type {
  FloorPlanState,
  Asset,
  DisplayOptionsType,
  DisplayMode,
} from "../types";

const storeCreator: StateCreator<FloorPlanState> = (set, get) => ({
  mode: "view",
  displayMode: "status",
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
      assetType: "rack",
      layer: "floor", // [추가] 누락된 layer 속성
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
      uHeight: 42,
    },
    {
      id: "A-02",
      assetType: "rack",
      layer: "floor", // [추가] 누락된 layer 속성
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
      uHeight: 42,
    },
    {
      id: "B-01",
      assetType: "rack",
      layer: "floor", // [추가] 누락된 layer 속성
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
      uHeight: 48,
    },
  ] as Asset[],
  selectedAssetIds: [],

  toggleMode: () =>
    set((state) => ({ mode: state.mode === "view" ? "edit" : "view" })),
  setDisplayOptions: (newOptions: Partial<DisplayOptionsType>) =>
    set((state) => ({
      displayOptions: { ...state.displayOptions, ...newOptions },
    })),
  setDisplayMode: (newMode: DisplayMode) => set({ displayMode: newMode }),
  setGridSize: (cols, rows) => set({ gridCols: cols, gridRows: rows }),
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
  deleteAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
      selectedAssetIds: state.selectedAssetIds.filter((sid) => sid !== id),
    })),
  duplicateAsset: (id) =>
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
  selectAsset: (id, isMultiSelect = false) =>
    set((state) => {
      const { selectedAssetIds } = state;
      if (isMultiSelect) {
        const newSelection = selectedAssetIds.includes(id)
          ? selectedAssetIds.filter((sid) => sid !== id)
          : [...selectedAssetIds, id];
        return { selectedAssetIds: newSelection };
      }
      if (selectedAssetIds.length === 1 && selectedAssetIds[0] === id)
        return { selectedAssetIds: [] };
      return { selectedAssetIds: [id] };
    }),
  deselectAll: () => set({ selectedAssetIds: [] }),

  groupSelectedAssets: () => {
    const { selectedAssetIds } = get();
    if (selectedAssetIds.length < 2) return;
    const groupId = `group_${crypto.randomUUID()}`;
    set((state) => ({
      assets: state.assets.map((asset) =>
        selectedAssetIds.includes(asset.id) ? { ...asset, groupId } : asset,
      ),
    }));
  },
  ungroupSelectedAssets: () => {
    const { selectedAssetIds, assets } = get();
    const groupIds = new Set(
      assets
        .filter((a) => selectedAssetIds.includes(a.id))
        .map((a) => a.groupId)
        .filter(Boolean),
    );
    if (groupIds.size === 0) return;
    set((state) => ({
      assets: state.assets.map((asset) =>
        groupIds.has(asset.groupId) ? { ...asset, groupId: undefined } : asset,
      ),
    }));
  },

  zoom: (direction) => {
    const { stage } = get();
    const zoomFactor = 0.25;
    const newScale =
      direction === "in"
        ? stage.scale + zoomFactor
        : Math.max(0.1, stage.scale - zoomFactor);

    set({ stage: { ...stage, scale: newScale } });
  },
});

export const useFloorPlanStore = create<FloorPlanState>()(
  temporal(storeCreator, {
    partialize: (state: FloorPlanState) => ({
      assets: state.assets,
      selectedAssetIds: state.selectedAssetIds,
    }),
  }),
);
