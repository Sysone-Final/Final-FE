import { create } from "zustand";

// 사이드바의 열림/닫힘 상태를 관리하기 위한 인터페이스
interface SidebarState {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  setLeftSidebarOpen: (isOpen: boolean) => void;
  setRightSidebarOpen: (isOpen: boolean) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
}

// 사이드바 상태 관리를 위한 Zustand 스토어 생성
export const useSidebarStore = create<SidebarState>((set) => ({
  isLeftSidebarOpen: true, // 왼쪽 사이드바는 기본적으로 열린 상태
  isRightSidebarOpen: false, // 오른쪽 사이드바는 기본적으로 닫힌 상태
  setLeftSidebarOpen: (isOpen) => set({ isLeftSidebarOpen: isOpen }),
  setRightSidebarOpen: (isOpen) => set({ isRightSidebarOpen: isOpen }),
  toggleLeftSidebar: () =>
    set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
}));
