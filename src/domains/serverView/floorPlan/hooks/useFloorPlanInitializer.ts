// import { useEffect, useState } from 'react';
// import { useFloorPlanStore, fetchFloorPlan, initialState } from '../store/floorPlanStore';
// import { useSidebarStore } from '../store/useSidebarStore';

// /**
//  * FloorPlan 초기화를 담당하는 훅
//  * - 스토어 상태 초기화
//  * - 사이드바 초기화
//  * - 데이터 페칭
//  */
// export const useFloorPlanInitializer = (serverRoomId: string | undefined) => {
//   const [isInitialized, setIsInitialized] = useState(false);
//   const { setLeftSidebarOpen, setRightSidebarOpen } = useSidebarStore();

//   useEffect(() => {
//     if (serverRoomId && !isInitialized) {
//       console.log('Initializing FloorPlan State...');
      
//       // A. 스토어 상태를 초기값으로 리셋
//       useFloorPlanStore.setState(initialState, true);
//       useFloorPlanStore.temporal.getState().clear();

//       // B. 사이드바 상태를 초기값으로 리셋
//       setLeftSidebarOpen(true);
//       setRightSidebarOpen(false);

//       // C. 데이터 페칭
//       fetchFloorPlan(serverRoomId);
//       setIsInitialized(true);
//     }
//   }, [serverRoomId, isInitialized, setLeftSidebarOpen, setRightSidebarOpen]);

//   return { isInitialized };
// };