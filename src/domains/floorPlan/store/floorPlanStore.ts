import { create } from "zustand";
// [수정] verbatimModuleSyntax 규칙에 따라 'type' 키워드로 타입을 가져옵니다.
import type { FloorPlanState, Asset } from "../types";

// Mode 타입을 여기서 직접 정의하거나, types/index.ts에서 가져올 수 있습니다.
// 다른 곳에서 사용하지 않는다면 여기에 두는 것이 편리합니다.
export type Mode = "view" | "edit";

// 'useFloorPlanStore' 라는 이름의 훅(저장소)을 생성하여 내보냅니다.
export const useFloorPlanStore = create<FloorPlanState>((set) => ({
  // --- 초기 상태 ---
  mode: "view",

  // 와이어프레임 기반의 목업(mockup) 자산 데이터
  assets: [
    {
      id: "A-01",
      type: "rack",
      name: "A-01",
      status: "normal",
      data: { temperature: 22 },
      x: 50,
      y: 100,
      width: 80,
      height: 150,
    },
    {
      id: "A-02",
      type: "rack",
      name: "A-02",
      status: "danger",
      data: { temperature: 28 },
      x: 200,
      y: 100,
      width: 80,
      height: 150,
    },
    {
      id: "B-01",
      type: "rack",
      name: "B-01",
      status: "warning",
      data: { temperature: 25 },
      x: 50,
      y: 300,
      width: 80,
      height: 150,
    },
  ] as Asset[],

  // 선택된 자산 ID를 저장할 배열
  selectedAssetIds: [],

  // --- 액션(Actions) ---
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "view" ? "edit" : "view",
    })),

  // 자산 선택 액션 (단일 선택)
  selectAsset: (id: string) => set({ selectedAssetIds: [id] }),
}));
