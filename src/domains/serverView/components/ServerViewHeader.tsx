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
} from '../floorPlan/store/floorPlanStore';

import { useBabylonDatacenterStore } from '../view3d/stores/useBabylonDatacenterStore';
import { Settings, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Palette } from 'lucide-react';
import { useSidebarStore } from '../floorPlan/store/useSidebarStore';

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

  const mode = useFloorPlanStore((state) => state.mode);
  const hasUnsavedChanges = useHasUnsavedChanges();
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const displayMode = useFloorPlanStore((state) => state.displayMode);

const handleBackNavigation = () => {

    navigate('/server-room-dashboard');
  };

  // temporal 훅은 그대로 사용합니다.
  const undo = useStore(useFloorPlanStore.temporal, (state) => state.undo);
  const redo = useStore(useFloorPlanStore.temporal, (state) => state.redo);

  const { setLeftSidebarOpen, setRightSidebarOpen } = useSidebarStore(); // (HEAD)
  const mode3d = useBabylonDatacenterStore((state) => state.mode); // (main)
  const toggleMode3d = useBabylonDatacenterStore((state) => state.toggleMode); // (main)

  const handleToggleMode2D = () => {
    if (mode === 'view') {
      if (selectedAssetIds.length > 1) {
        if (
          window.confirm(
            `여러 개의 자산(${selectedAssetIds.length}개)이 선택되었습니다.\n이 자산들을 하나의 그룹으로 묶으시겠습니까?`,
          )
        ) {
          groupSelectedAssets();
        }
      }
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    } else {
      // "편집" -> "보기" 모드로 전환 시
      setRightSidebarOpen(false);
    }

    toggleMode(); // 2D 모드 전환 실행
  };

  const handleToggleMode3D = () => { // (main)
    toggleMode3d();
  };
  
  const handleDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayMode(e.target.value as 'status' | 'customColor');
  };

  const handleZoomIn = () => zoom('in'); // (HEAD)
  const handleZoomOut = () => zoom('out'); // (HEAD)

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-2 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
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

