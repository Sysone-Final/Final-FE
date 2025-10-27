// src/mocks/handlers.ts
// 여러 도메인의 mock 핸들러를 한 곳으로 모읍니다.
import { handlers as resourceManageHandlers } from "../domains/resourceManage/mocks/handlers";

export const handlers = [
  ...resourceManageHandlers,
  // ... (나중에 다른 도메인 핸들러도 여기에 추가)
];
