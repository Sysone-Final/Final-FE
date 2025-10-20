import type { Mode } from "../store/floorPlanStore";

export type AssetStatus = "normal" | "warning" | "danger";
export type DisplayMode = "status" | "customColor";

export interface DisplayOptions {
  showName: boolean;
  showStatusIndicator: boolean;
  showTemperature: boolean;
}

export interface Asset {
  id: string;
  type: "rack" | "wall" | "door";
  name: string;
  gridX: number;
  gridY: number;
  widthInCells: number;
  heightInCells: number;
  rotation?: number;
  isLocked?: boolean;
  customColor?: string;
  status?: AssetStatus;
  data?: {
    temperature?: number;
  };
}

export interface FloorPlanState {
  mode: Mode;
  displayMode: DisplayMode;
  displayOptions: DisplayOptions;
  assets: Asset[];
  selectedAssetIds: string[];
  gridCols: number;
  gridRows: number;
  // [신규] 캔버스 상태 추가
  stage: {
    scale: number;
    x: number;
    y: number;
  };
  toggleMode: () => void;
  selectAsset: (id: string) => void;
  setDisplayOptions: (options: Partial<DisplayOptions>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setGridSize: (cols: number, rows: number) => void;
  // [신규] 새 액션 타입 추가
  addAsset: (asset: Omit<Asset, "id">) => void;
  setStage: (stage: FloorPlanState["stage"]) => void;
}
