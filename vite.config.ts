import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // [신규] Vite의 의존성 최적화 설정을 추가합니다.
  // 이 설정은 Vite가 konva와 react-konva를 브라우저 환경에 맞게
  // 올바르게 사전 번들링하도록 명시적으로 지시하는 역할을 합니다.
  optimizeDeps: {
    include: ["konva", "react-konva"],
  },
});
