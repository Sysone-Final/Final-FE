export type Mode = "view" | "edit";
export type DoorDirection = "north" | "south" | "east" | "west";
export type AssetStatus = "normal" | "warning" | "danger";
export type DisplayMode = "status" | "customColor";
export type UHeight = 42 | 45 | 48 | 52;

//  자산의 물리적 위치(레이어)를 정의하는 타입
export type AssetLayer = "floor" | "wall" | "overhead";

//  새로운 레이어 기반 분류에 맞춰 자산 타입을 재정의
export type AssetType =
  // Floor Layer
  | "wall"
  | "pillar"
  | "ramp"
  | "rack"
  | "storage"
  | "mainframe"
  | "crash_cart"
  | "crac"
  | "in_row_cooling"
  | "ups_battery"
  | "power_panel"
  | "speed_gate"
  | "fire_suppression"
  // Wall-Mounted Layer
  | "door_single"
  | "door_double"
  | "door_sliding"
  | "access_control"
  | "epo"
  // Overhead Layer
  | "aisle_containment"
  | "cctv"
  | "leak_sensor";

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
  assetType: AssetType;
  //  모든 자산은 어떤 레이어에 속하는지 명시해야 함
  layer: AssetLayer;
  uHeight?: UHeight;
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
