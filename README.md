# 함께 수정되는 코드 파일끼리 하나의 디렉토리를 이루도록 구조를 개선
src/
├── components/          # 전체 프로젝트에서 사용되는 컴포넌트
│   ├──layout/         # 공용 레이아웃 
│      ├── Header.tsx
│      ├── Sidebar.tsx
│      └── MainLayout.tsx
├── hooks/              # 전체 프로젝트에서 사용되는 훅
│   ├── useToast.tsx
│   ├── useAuth.tsx
│   └── useApi.tsx
├── utils/              # 전체 프로젝트에서 사용되는 유틸리티
├── types/              # 전체 프로젝트에서 사용되는 타입
├── api/                # 전체 프로젝트에서 사용되는 API
└── domains/
    ├── datacenter/     # 데이터센터 전용
    └── login/          # 로그인 전용

아직 개선해야할 부분이 남음 (참고 Frontend Fundamentals)