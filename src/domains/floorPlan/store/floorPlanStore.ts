import { create } from "zustand";
import { FloorPlanState } from "../types";

// useFloorPlanStore 훅을 생성합니다. 이 훅을 통해 컴포넌트에서 상태와 액션을 가져올 수 있습니다.
export const useFloorPlanStore = create<FloorPlanState>((set) => ({
  // 초기 상태 설정
  mode: "view", // 앱이 처음 시작될 때의 기본 모드는 '보기' 모드입니다.

  // 상태를 변경하는 액션(Action) 정의
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "view" ? "edit" : "view",
    })),
}));
