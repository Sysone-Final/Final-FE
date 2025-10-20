// [수정] 현재 파일(types)의 부모 폴더(floorPlan)로 올라간 뒤 store 폴더로 내려가도록 경로를 수정합니다.
import type { Mode } from "../store/floorPlanStore";

// 자산의 상태를 나타내는 타입을 정의합니다. (정상, 경고, 위험)
export type AssetStatus = "normal" | "warning" | "danger";

// 캔버스에 렌더링될 개별 자산(Asset)의 데이터 구조를 정의합니다.
export interface Asset {
  id: string;
  type: "rack"; // 향후 'wall', 'door' 등 확장 가능
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;

  // 'rack' 타입일 경우 가질 수 있는 선택적 데이터
  status?: AssetStatus;
  data?: {
    temperature?: number;
  };
}

// Zustand 스토어의 전체 상태 타입을 정의합니다.
export interface FloorPlanState {
  mode: Mode;
  assets: Asset[]; // 캔버스에 표시될 모든 자산 데이터
  selectedAssetIds: string[]; // 현재 선택된 자산의 ID 목록
  toggleMode: () => void;
  selectAsset: (id: string) => void; // 자산을 선택하는 액션
}
