// [수정] import 목록에 Mode 추가
import type { Mode } from "../store/floorPlanStore";

export type AssetStatus = "normal" | "warning" | "danger";
export type DisplayMode = "status" | "customColor"; // '상태 임계값' 또는 '사용자 지정 색상'

// [신규] 어떤 정보를 표시할지에 대한 옵션 타입
export interface DisplayOptions {
  showName: boolean;
  showStatusIndicator: boolean;
  showTemperature: boolean;
  // uUsage 등 추후 확장 가능
}

export interface Asset {
  id: string;
  type: "rack" | "wall" | "door";
  name: string;
  // [수정] 픽셀 좌표(x, y) 대신 그리드 좌표(gridX, gridY)를 사용합니다.
  gridX: number;
  gridY: number;
  widthInCells: number; // 너비 (셀 단위)
  heightInCells: number; // 높이 (셀 단위)

  rotation?: number;
  isLocked?: boolean;

  // [수정] 사용자 지정 색상 필드 추가
  customColor?: string;

  status?: AssetStatus;
  data?: {
    temperature?: number;
  };
}

export interface FloorPlanState {
  mode: Mode;
  // [신규] 표시 모드와 옵션 상태 추가
  displayMode: DisplayMode;
  displayOptions: DisplayOptions;
  assets: Asset[];
  selectedAssetIds: string[];
  toggleMode: () => void;
  selectAsset: (id: string) => void;
  // [신규] 표시 옵션을 변경하는 액션 추가
  setDisplayOptions: (options: Partial<DisplayOptions>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
}
