/// <reference types="vite/client" />

// GLTF 파일 import를 위한 타입 선언
declare module "*.gltf" {
  const src: string;
  export default src;
}

declare module "*.gltf?url" {
  const src: string;
  export default src;
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.glb?url" {
  const src: string;
  export default src;
}

declare module "*.bin" {
  const src: string;
  export default src;
}
