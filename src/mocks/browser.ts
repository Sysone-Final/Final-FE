import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 모든 핸들러를 사용해 워커를 설정합니다.
export const worker = setupWorker(...handlers);
