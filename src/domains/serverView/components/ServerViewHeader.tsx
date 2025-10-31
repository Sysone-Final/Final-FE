import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';

import {
  useFloorPlanStore,
  toggleMode,
  groupSelectedAssets,
  setDisplayMode,
  zoom, 
  useHasUnsavedChanges,
} from '../floorPlan/stores/floorPlanStore';

import { useBabylonDatacenterStore } from '../view3d/stores/useBabylonDatacenterStore';
import { Settings, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Palette } from 'lucide-react';


interface ServerViewHeaderProps {
  serverRoomId?: string;
  viewDimension: '2D' | '3D';
  onViewDimensionChange: (dimension: '2D' | '3D') => void;
}

function ServerViewHeader({
  serverRoomId,
  viewDimension,
  onViewDimensionChange,
}: ServerViewHeaderProps) {
  const navigate = useNavigate();

  // 스토어에서는 '데이터'만 가져옵니다.
  const mode = useFloorPlanStore((state) => state.mode);
  const hasUnsavedChanges = useHasUnsavedChanges();
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const displayMode = useFloorPlanStore((state) => state.displayMode);

  const handleBackNavigation = () => {
    // 편집 모드이고, 저장 안한게 있으면
    if (mode === 'edit' && hasUnsavedChanges) {
      if (
        !window.confirm(
          '저장하지 않은 변경 사항이 있습니다.\n정말로 이 페이지를 벗어나시겠습니까?',
        )
      ) {
        return; // 이탈 취소
      }
    }
    // (이탈 확정 시) 히스토리 클리어
    useFloorPlanStore.temporal.getState().clear();
    navigate('/server-room-dashboard');
  };

  // temporal 훅은 그대로 사용합니다.
  const undo = useStore(useFloorPlanStore.temporal, (state) => state.undo);
  const redo = useStore(useFloorPlanStore.temporal, (state) => state.redo);

  // [MERGE] 님의 사이드바 스토어(HEAD)와 팀원의 3D 스토어(main)를 모두 가져옵니다.
  const { setLeftSidebarOpen, setRightSidebarOpen } = useSidebarStore(); // (HEAD)
  const mode3d = useBabylonDatacenterStore((state) => state.mode); // (main)
  const toggleMode3d = useBabylonDatacenterStore((state) => state.toggleMode); // (main)

  // [MERGE] 팀원의 'handleToggleMode2D' 함수에(main) 님의 사이드바 로직(HEAD)을 합칩니다.
  const handleToggleMode2D = () => {
    if (mode === 'view') {
      // "보기" -> "편집" 모드로 전환 시
      // (main)의 그룹핑 확인 로직 (더 상세한 메시지 버전)
      if (selectedAssetIds.length > 1) {
        if (
          window.confirm(
            `여러 개의 자산(${selectedAssetIds.length}개)이 선택되었습니다.\n이 자산들을 하나의 그룹으로 묶으시겠습니까?`,
          )
        ) {
          groupSelectedAssets();
        }
      }
      // (HEAD) 님의 사이드바 열기 로직
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    } else {
      // "편집" -> "보기" 모드로 전환 시
      // (HEAD) 님의 오른쪽 사이드바 닫기 로직
      setRightSidebarOpen(false);
    }

    toggleMode(); // 2D 모드 전환 실행
  };

  // [MERGE] 3D 토글 핸들러(main)와 Zoom 핸들러(HEAD)를 모두 유지합니다.
  const handleToggleMode3D = () => { // (main)
    toggleMode3d();
  };
  
  // [MERGE] 활성화된 'handleDisplayModeChange' 함수를 사용합니다. (main)
  const handleDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayMode(e.target.value as 'status' | 'customColor');
  };

  const handleZoomIn = () => zoom('in'); // (HEAD)
  const handleZoomOut = () => zoom('out'); // (HEAD)

  return (
    // [MERGE] 헤더 태그 (main) - (py-2 사용. 님의 py-4로 바꾸셔도 무방합니다)
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-2 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* ... (뒤로가기 버튼 코드) ... */}
        <button
          onClick={handleBackNavigation}
          className="flex items-center gap-2 text-gray-100 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {' '}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />{' '}
          </svg>
          <span>뒤로 가기</span>
        </button>
        <div className="h-6 w-px bg-gray-600" />
        <h1 className="text-xl font-bold text-white">
          {serverRoomId ? `서버실 ${serverRoomId}` : '제1서버실 A-Zone'}
        </h1>
      </div>

      {/* 오른쪽 컨트롤 영역 */}
      <div className="flex items-center gap-4">
        {/* [MERGE] 3D/2D 분기를 위해 '?' 삼항 연산자 사용 (main) */}
        {viewDimension === '2D' ? (
          <>
            {/* 보기 모드 컨트롤 */}
            {mode === 'view' && (
              <>
                {/* Display Mode Select */}
                <div className="flex items-center rounded-md p-1 bg-gray-700/50 border border-gray-600">
                  <button
                    onClick={() => setDisplayMode('customColor')} // '상면도' 모드
                    className={`px-3 py-1 rounded-md transition-colors ${
                      displayMode === 'customColor'
                        ? 'bg-gray-400 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    🖥️ 상면도
                  </button>
                  <button
                    onClick={() => setDisplayMode('status')} // '상태 임계값' 모드
                    className={`px-3 py-1 rounded-md transition-colors ${
                      displayMode === 'status'
                        ? 'bg-gray-400 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    📊 상태 임계값
                  </button>
                </div>
                {/* Zoom Buttons */}
                {displayMode === 'customColor' && (
                  <div className="flex items-center border border-gray-600 rounded-lg p-1 bg-gray-700/50">
                    <button
                      onClick={handleZoomOut}
                      className="p-1 rounded-md text-gray-100 hover:bg-gray-600 transition-colors"
                    >
                      {' '}
                      <ZoomOut className="w-5 h-5" />{' '}
                    </button>
                    <span className="px-2 select-none text-gray-100">Zoom</span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1 rounded-md text-gray-100 hover:bg-gray-600 transition-colors"
                    >
                      {' '}
                      <ZoomIn className="w-5 h-5" />{' '}
                    </button>
                  </div>
                )}
              </>
            )}
            {/* 편집 모드 컨트롤 */}
            {mode === 'edit' && (
              <div className="flex items-center gap-2 border border-gray-600 rounded-lg p-1 bg-gray-700/50">
                <button
                  onClick={() => undo()}
                  className="p-2 rounded-md flex items-center gap-1.5 text-gray-100 hover:bg-gray-600 transition-colors"
                >
                  {' '}
                  <Undo2 className="w-4 h-4" /> 되돌리기{' '}
                </button>
                <button
                  onClick={() => redo()}
                  className="p-2 rounded-md flex items-center gap-1.5 text-gray-100 hover:bg-gray-600 transition-colors"
                >
                  {' '}
                  <Redo2 className="w-4 h-4" /> 다시 실행{' '}
                </button>
              </div>
            )}
            {/* [MERGE] 'handleToggleMode2D'를 호출하는 버튼 사용 (main) */}
            <button
              onClick={handleToggleMode2D}
              className="py-2 px-4 rounded-lg flex items-center gap-2 transition-colors bg-gray-700/50 text-gray-100 hover:bg-gray-600 border border-gray-600"
            >
              {mode === 'view' ? (
                <Settings className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              {mode === 'view' ? '편집 모드' : '보기 모드'}
            </button>
          </>
        ) : (
          // 3D 뷰일 때 표시되는 컨트롤
          <button
            onClick={handleToggleMode3D}
            className="py-2 px-4 rounded-lg flex items-center gap-2 transition-colors bg-gray-700/50 text-gray-100 hover:bg-gray-600 border border-gray-600"
          >
            {mode3d === 'view' ? (
              <Settings className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            {mode3d === 'view' ? '편집 모드' : '보기 모드'}
          </button>
        )}
        {/* 2D/3D 토글 버튼 */}
        <div className="flex items-center rounded-md p-1 bg-gray-700/50 border border-gray-600">
          <button
            onClick={() => onViewDimensionChange('2D')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewDimension === '2D'
                ? 'bg-gray-400 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {' '}
            2D{' '}
          </button>
          <button
            onClick={() => onViewDimensionChange('3D')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewDimension === '3D'
                ? 'bg-gray-400 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {' '}
            3D{' '}
          </button>
        </div>
      </div>
    </header>
  );
}

export default ServerViewHeader;

