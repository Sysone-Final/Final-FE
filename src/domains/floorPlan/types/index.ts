import type { Mode } from "../store/floorPlanStore";

// [신규] 랙의 문 방향을 위한 타입
export type DoorDirection = "north" | "south" | "east" | "west";
export type AssetStatus = "normal" | "warning" | "danger";
export type DisplayMode = "status" | "customColor";

export interface DisplayOptionsType {
  showName: boolean;
  showStatusIndicator: boolean;
  showTemperature: boolean;
  showUUsage: boolean;
  showPowerStatus: boolean;
  showAisle: boolean;
  showPUE: boolean;
  showFacilities: boolean;
  showSensors: boolean;
  useLOD: boolean;
  showGridLine: boolean;
}

export interface Asset {
  id: string;
  name: string;
  gridX: number;
  gridY: number;
  widthInCells: number;
  heightInCells: number;
  type: "rack" | "wall" | "door";
  status?: AssetStatus;
  customColor?: string;
  isLocked?: boolean;
  rotation?: number; // 0-360 도
  opacity?: number; // 0-1 (0%~100%)
  doorDirection?: DoorDirection; // 랙 문 방향
  description?: string; // 메모
  createdAt?: string; // ISO 날짜
  updatedAt?: string; // ISO 날짜
  data?: {
    uUsage?: number;
    temperature?: number;
  };
}

export interface FloorPlanState {
  mode: Mode;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
  assets: Asset[];
  selectedAssetIds: string[];
  gridCols: number;
  gridRows: number;
  stage: {
    scale: number;
    x: number;
    y: number;
  };
  toggleMode: () => void;
  setDisplayOptions: (options: Partial<DisplayOptionsType>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setGridSize: (cols: number, rows: number) => void;
  addAsset: (asset: Omit<Asset, "id">) => void;
  setStage: (stage: FloorPlanState["stage"]) => void;
  updateAsset: (id: string, newProps: Partial<Omit<Asset, "id">>) => void;
  // ✨ 다중 선택/해제를 지원하도록 수정
  selectAsset: (id: string, isMultiSelect?: boolean) => void;
  deselectAll: () => void;
  // ✨ 고급 기능 액션 추가
  deleteAsset: (id: string) => void;
  duplicateAsset: (id: string) => void;
}
