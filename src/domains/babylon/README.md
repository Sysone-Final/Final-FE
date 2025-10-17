# Babylon.js 3D 데이터센터 뷰

Babylon.js를 사용한 3D 데이터센터 시각화 시스템입니다.

## 🎯 주요 기능

### ✅ 구현된 기능
- **3D 렌더링**: Babylon.js 엔진 기반 실시간 3D 렌더링
- **아이소메트릭 뷰**: 초기 카메라를 아이소메트릭 각도로 설정
- **자유 카메라 조작**: 
  - 좌클릭 드래그: 카메라 회전
  - 우클릭 드래그: 카메라 이동
  - 마우스 휠: 줌 인/아웃
- **동적 격자**: 행/열 개수를 동적으로 조절 가능 (5~30)
- **3D 모델 로딩**: GLTF 형식의 3D 모델 로드 및 표시
- **장비 배치**: 격자 기반 장비 배치 시스템
- **충돌 감지**: 같은 격자에 중복 배치 방지
- **장비 선택**: 클릭으로 장비 선택 및 하이라이트

### 🚧 향후 추가 예정
- 드래그 앤 드롭으로 장비 이동
- 장비 회전 기능
- 장비 높이 조절 (Z축 이동)
- 장비별 고유 3D 모델
- 장비 삭제 기능
- 장비 정보 패널

## 📁 프로젝트 구조

```
src/domains/babylon/
├── Babylonmap.tsx              # 메인 진입점
├── components/
│   ├── BabylonDatacenterView.tsx   # 메인 뷰 컴포넌트
│   ├── GridFloor.tsx               # 격자 바닥 렌더링
│   ├── Equipment3DModel.tsx        # 3D 장비 모델
│   └── EquipmentPalette3D.tsx      # 장비 팔레트 UI
├── stores/
│   └── useBabylonDatacenterStore.ts  # Zustand 상태 관리
├── types/
│   └── index.ts                    # TypeScript 타입 정의
├── constants/
│   └── config.ts                   # 설정 상수
├── assets/
│   └── serverRack/
│       ├── scene.gltf             # 3D 모델 파일
│       └── scene.bin              # 3D 모델 바이너리
```

## 🚀 사용 방법

### 1. 패키지 설치
```bash
npm install @babylonjs/core @babylonjs/loaders --legacy-peer-deps
```

### 2. 접속
브라우저에서 `/babylonmap` 경로로 접속

### 3. 기본 조작
1. **장비 추가**: 오른쪽 팔레트에서 장비 버튼 클릭
2. **카메라 회전**: 좌클릭 드래그
3. **카메라 이동**: 우클릭 드래그
4. **줌**: 마우스 휠
5. **격자 조절**: 헤더의 +/- 버튼으로 행/열 개수 조절

## ⚙️ 주요 설정

### 격자 설정
```typescript
// constants/config.ts
export const DEFAULT_GRID_CONFIG = {
  rows: 10,        // 격자 행 개수
  columns: 10,     // 격자 열 개수
  cellSize: 2,     // 각 격자 크기 (미터)
};
```

### 카메라 설정
```typescript
export const CAMERA_CONFIG = {
  alpha: -Math.PI / 4,           // 초기 수평 각도 (-45도)
  beta: Math.PI / 3.5,           // 초기 수직 각도 (아이소메트릭)
  radius: 30,                    // 카메라 거리
  lowerRadiusLimit: 10,          // 최소 줌
  upperRadiusLimit: 100,         // 최대 줌
};
```

## 🎨 Konva vs Babylon.js 비교

### Konva (2D)
- **장점**: 빠른 렌더링, 간단한 구현
- **단점**: 2D 제한, 깊이감 부족
- **경로**: `/datacenterview`

### Babylon.js (3D)
- **장점**: 
  - 실제 3D 공간감
  - 자유로운 시점 변경
  - 실제 3D 모델 사용 가능
  - 더 직관적인 시각화
- **단점**: 상대적으로 무거움
- **경로**: `/babylonmap`

## 🔧 기술 스택

- **React 18.3.1**: UI 프레임워크
- **Babylon.js 7.x**: 3D 엔진
- **Zustand**: 상태 관리
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링

## 📝 데이터 구조

### Equipment3D
```typescript
interface Equipment3D {
  id: string;
  type: EquipmentType;
  gridX: number;    // 격자 X 좌표
  gridY: number;    // 격자 Y 좌표
  gridZ: number;    // 격자 Z 좌표 (높이)
  rotation: number; // Y축 회전 (라디안)
}
```

### GridConfig
```typescript
interface GridConfig {
  rows: number;      // 격자 행 개수
  columns: number;   // 격자 열 개수
  cellSize: number;  // 한 격자 크기
}
```

## 🎯 다음 단계

1. **드래그 앤 드롭 구현**
   - Babylon.js의 Drag Behavior 사용
   - 격자에 스냅하는 로직 추가

2. **장비별 3D 모델 추가**
   - 서버, 스토리지, 네트워크 등 각각의 모델
   - Blender 등으로 제작 또는 무료 모델 활용

3. **UI 개선**
   - 장비 정보 패널
   - 장비 삭제 버튼
   - 회전/높이 조절 컨트롤

4. **성능 최적화**
   - LOD (Level of Detail) 적용
   - 인스턴싱으로 같은 모델 재사용

## 📚 참고 자료

- [Babylon.js 공식 문서](https://doc.babylonjs.com/)
- [Babylon.js Playground](https://playground.babylonjs.com/)
- [GLTF 모델 다운로드](https://sketchfab.com/)
