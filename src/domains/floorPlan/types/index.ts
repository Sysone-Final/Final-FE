// 현재 어플리케이션의 모드를 정의합니다. '보기' 또는 '편집' 모드가 있습니다.
export type Mode = "view" | "edit";

// FloorPlan 스토어의 상태(state) 타입을 정의합니다.
export interface FloorPlanState {
  mode: Mode; // 현재 모드
  toggleMode: () => void; // 모드를 전환하는 함수
}
