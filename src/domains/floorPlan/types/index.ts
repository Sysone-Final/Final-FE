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
  // [신규] 그리드 크기 상태 추가
  gridCols: number;
  gridRows: number;
  toggleMode: () => void;
  selectAsset: (id: string) => void;
  setDisplayOptions: (options: Partial<DisplayOptions>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  // [신규] 그리드 크기 변경 액션 타입 추가 (미래를 위해)
  setGridSize: (cols: number, rows: number) => void;
}
