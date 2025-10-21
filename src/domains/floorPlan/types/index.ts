// [수정] 자기 자신을 import하는 순환 참조 코드를 제거합니다.
// import type { Mode } from "./index";

// [추가] Mode 타입을 여기서 정의하고 다른 파일에서 사용할 수 있도록 export 합니다.
export type Mode = "view" | "edit";
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
  rotation?: number;
  opacity?: number;
  doorDirection?: DoorDirection;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  groupId?: string;
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
  stage: { scale: number; x: number; y: number };
  toggleMode: () => void;
  setDisplayOptions: (options: Partial<DisplayOptionsType>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setGridSize: (cols: number, rows: number) => void;
  addAsset: (asset: Omit<Asset, "id">) => void;
  setStage: (stage: FloorPlanState["stage"]) => void;
  updateAsset: (id: string, newProps: Partial<Omit<Asset, "id">>) => void;
  selectAsset: (id: string, isMultiSelect?: boolean) => void;
  deselectAll: () => void;
  deleteAsset: (id: string) => void;
  duplicateAsset: (id: string) => void;
  groupSelectedAssets: () => void;
  ungroupSelectedAssets: () => void;
  zoom: (direction: "in" | "out") => void;
}
