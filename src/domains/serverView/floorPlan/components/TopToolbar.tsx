// // 사용하지 않는 코드 보존용

// import React, { useState } from 'react';
// import { useStore } from 'zustand';
// import { useFloorPlanStore } from '../store/floorPlanStore';
// // 아이콘 라이브러리 임포트
// import { Settings, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Palette } from 'lucide-react';

// const TopToolbar: React.FC = () => {
//   // --- 상태 관리---
//   const mode = useFloorPlanStore((state) => state.mode);
//   const toggleMode = useFloorPlanStore((state) => state.toggleMode);
//   const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
//   const groupSelectedAssets = useFloorPlanStore((state) => state.groupSelectedAssets);
//   const displayMode = useFloorPlanStore((state) => state.displayMode);
//   const setDisplayMode = useFloorPlanStore((state) => state.setDisplayMode);
//   const zoom = useFloorPlanStore((state) => state.zoom);
  
//   const undo = useStore(useFloorPlanStore.temporal, (state) => state.undo);
//   const redo = useStore(useFloorPlanStore.temporal, (state) => state.redo);

//   // --- UI를 위한 로컬 상태 ---
//   const [viewDimension, setViewDimension] = useState<'2D' | '3D'>('2D');

//   // --- 이벤트 핸들러 ---
//   const handleToggleMode = () => {
//     if (mode === 'view' && selectedAssetIds.length > 1) {
//       if (window.confirm(
//         `여러 개의 자산(${selectedAssetIds.length}개)이 선택되었습니다.\n이 자산들을 하나의 그룹으로 묶으시겠습니까?`
//       )) {
//         groupSelectedAssets();
//       }
//     }
//     toggleMode();
//   };

//   const handleDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setDisplayMode(e.target.value as 'status' | 'customColor');
//   };

//   return (
//     <div className="shadow-md p-3 flex justify-between items-center w-full z-10">
//       {/* 왼쪽: 타이틀 */}
//    <h1 className="text-title-page">제1서버실 A-Zone</h1>

//    {/* 오른쪽: 컨트롤 버튼 */}
//    <div className="flex items-center gap-4">

//     {/* --- 보기 모드 컨트롤 --- */}
//     {mode === 'view' && (
//      <>
//       {/* 보기 모드 선택 */}
//       <div className="flex items-center gap-2">
//               <Palette className="w-5 h-5" />
//               <select
//                 value={displayMode}
//                 onChange={handleDisplayModeChange}
//                 className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
//               >
//                 <option value="status">상태 임계값</option>
//                 <option value="customColor">사용자 지정 색상</option>
//               </select>
//             </div>

//             {/* 2D/3D 토글 */}
//       <div className="flex items-center rounded-full p-1">
//        <button
//         onClick={() => setViewDimension('2D')}
//         className={`px-3 py-1 rounded-full transition-colors text-button ${viewDimension === '2D' ? 'shadow' : ''}`}
//        >
//         2D
//        </button>
//        <button
//         onClick={() => setViewDimension('3D')}
//         className={`px-3 py-1 rounded-full transition-colors text-button ${viewDimension === '3D' ? 'shadow' : ''}`}
//        >
//         3D
//        </button>
//       </div>
            
//             {/* 줌 컨트롤 */}
//       <div className="flex items-center border rounded-lg p-1">
//        <button onClick={() => zoom('out')} className="p-1 rounded-md text-button">
//         <ZoomOut className="w-5 h-5"/>
//        </button>
//        <span className="px-2 select-none text-body-primary">Zoom</span>
//        <button onClick={() => zoom('in')} className="p-1 rounded-md text-button">
//         <ZoomIn className="w-5 h-5"/>
//        </button>
//       </div>
//      </>
//     )}

//     {/* --- 편집 모드 컨트롤 --- */}
//     {mode === 'edit' && (
//      <div className="flex items-center gap-2 border rounded-lg p-1">
//       <button onClick={() => undo()} className="p-2 rounded-md flex items-center gap-1.5 text-button">
//        <Undo2 className="w-4 h-4"/> 되돌리기
//       </button>
//       <button onClick={() => redo()} className="p-2 rounded-md flex items-center gap-1.5 text-button">
//        <Redo2 className="w-4 h-4"/> 다시 실행
//       </button>
//      </div>
//     )}

//         {/* --- 메인 모드 전환 버튼 --- */}
//         <button
//      onClick={handleToggleMode}
//      className="py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-button"
//     >
//      {mode === 'view' ? <Settings className="w-5 h-5"/> : <Eye className="w-5 h-5" />}
//      {mode === 'view' ? '편집 모드' : '보기 모드'}
//     </button>
//    </div>
//     </div>
//   );
// };

// export default TopToolbar;

