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
  //  그리드 크기를 목업 데이터에 맞게 확장
  gridCols: 50,
  gridRows: 25,
  stage: { scale: 1, x: 0, y: 0 },
  //  현실적인 데이터센터 레이아웃을 반영한 새로운 목업 데이터
  assets: [
    // --- Walls and Structure ---
    {
      id: "wall_top",
      assetType: "wall",
      layer: "floor",
      name: "상단 벽",
      gridX: 1,
      gridY: 1,
      widthInCells: 48,
      heightInCells: 1,
      customColor: "#868e96",
      isLocked: true,
    },
    {
      id: "wall_bottom",
      assetType: "wall",
      layer: "floor",
      name: "하단 벽",
      gridX: 1,
      gridY: 23,
      widthInCells: 48,
      heightInCells: 1,
      customColor: "#868e96",
      isLocked: true,
    },
    {
      id: "wall_left",
      assetType: "wall",
      layer: "floor",
      name: "좌측 벽",
      gridX: 1,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 21,
      customColor: "#868e96",
      isLocked: true,
    },
    {
      id: "wall_right",
      assetType: "wall",
      layer: "floor",
      name: "우측 벽",
      gridX: 48,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 21,
      customColor: "#868e96",
      isLocked: true,
    },
    {
      id: "main_door",
      assetType: "door_double",
      layer: "wall",
      name: "주 출입문",
      gridX: 24,
      gridY: 23,
      widthInCells: 4,
      heightInCells: 1,
      customColor: "#ced4da",
      doorDirection: "south",
      isLocked: true,
    },

    // --- Rack Row A (Hot Aisle) ---
    ...Array.from({ length: 10 }).map((_, i) => ({
      id: `A-${String(i + 1).padStart(2, "0")}`,
      assetType: "rack" as const,
      layer: "floor" as const,
      name: `A-${String(i + 1).padStart(2, "0")}`,
      status: "normal" as const,
      data: { temperature: 22 + i * 0.2, uUsage: 60 + i },
      gridX: 4 + i * 2,
      gridY: 4,
      widthInCells: 1,
      heightInCells: 2,
      customColor: "#dbe4ff",
      doorDirection: "south" as const,
      createdAt: new Date().toISOString(),
      uHeight: 42 as const,
    })),

    // --- Rack Row B (Hot Aisle) ---
    ...Array.from({ length: 10 }).map((_, i) => ({
      id: `B-${String(i + 1).padStart(2, "0")}`,
      assetType: "rack" as const,
      layer: "floor" as const,
      name: `B-${String(i + 1).padStart(2, "0")}`,
      status: "normal" as const,
      data: { temperature: 23 + i * 0.1, uUsage: 55 + i * 2 },
      gridX: 4 + i * 2,
      gridY: 7,
      widthInCells: 1,
      heightInCells: 2,
      customColor: "#dbe4ff",
      doorDirection: "north" as const,
      createdAt: new Date().toISOString(),
      uHeight: 42 as const,
    })),

    // --- Rack Row C (with warning/danger) ---
    ...Array.from({ length: 12 }).map((_, i) => ({
      id: `C-${String(i + 1).padStart(2, "0")}`,
      assetType: "rack" as const,
      layer: "floor" as const,
      name: `C-${String(i + 1).padStart(2, "0")}`,
      status: i === 5 ? "warning" : i === 8 ? "danger" : ("normal" as const),
      data: {
        temperature: i === 5 ? 28 : i === 8 ? 32 : 24,
        uUsage: 70 + i * 2,
      },
      gridX: 25 + i * 2,
      gridY: 4,
      widthInCells: 1,
      heightInCells: 2,
      customColor: "#dbe4ff",
      doorDirection: "south" as const,
      createdAt: new Date().toISOString(),
      uHeight: 45 as const,
    })),

    // --- Cooling & Power ---
    {
      id: "crac-1",
      assetType: "crac",
      layer: "floor",
      name: "항온항습기-01",
      gridX: 4,
      gridY: 12,
      widthInCells: 2,
      heightInCells: 4,
      customColor: "#a7d8de",
    },
    {
      id: "crac-2",
      assetType: "crac",
      layer: "floor",
      name: "항온항습기-02",
      gridX: 45,
      gridY: 12,
      widthInCells: 2,
      heightInCells: 4,
      customColor: "#a7d8de",
    },
    {
      id: "ups-1",
      assetType: "ups_battery",
      layer: "floor",
      name: "UPS-01",
      gridX: 4,
      gridY: 18,
      widthInCells: 4,
      heightInCells: 2,
      customColor: "#f9dcc4",
    },
    {
      id: "rpp-1",
      assetType: "power_panel",
      layer: "floor",
      name: "RPP-A",
      gridX: 25,
      gridY: 8,
      widthInCells: 2,
      heightInCells: 1,
      customColor: "#f3d9e3",
    },
    {
      id: "rpp-2",
      assetType: "power_panel",
      layer: "floor",
      name: "RPP-B",
      gridX: 28,
      gridY: 8,
      widthInCells: 2,
      heightInCells: 1,
      customColor: "#f3d9e3",
    },

    // --- Overhead & Wall-mounted items ---
    {
      id: "cctv-1",
      assetType: "cctv",
      layer: "overhead",
      name: "CCTV-코너-좌상",
      gridX: 2,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 1,
      customColor: "#e0e0e0",
    },
    {
      id: "cctv-2",
      assetType: "cctv",
      layer: "overhead",
      name: "CCTV-코너-우상",
      gridX: 47,
      gridY: 2,
      widthInCells: 1,
      heightInCells: 1,
      customColor: "#e0e0e0",
    },
    {
      id: "cctv-3",
      assetType: "cctv",
      layer: "overhead",
      name: "CCTV-중앙",
      gridX: 26,
      gridY: 12,
      widthInCells: 1,
      heightInCells: 1,
      customColor: "#e0e0e0",
    },
    {
      id: "epo-1",
      assetType: "epo",
      layer: "wall",
      name: "EPO",
      gridX: 29,
      gridY: 23,
      widthInCells: 1,
      heightInCells: 1,
      customColor: "#ffadad",
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
