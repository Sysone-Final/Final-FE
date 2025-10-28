import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { useFloorPlanStore } from '../floorPlan/store/floorPlanStore';
import { Settings, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Palette } from 'lucide-react';

interface ServerViewHeaderProps {
  serverRoomId?: string;
  viewDimension: '2D' | '3D';
  onViewDimensionChange: (dimension: '2D' | '3D') => void;
}

const ServerViewHeader: React.FC<ServerViewHeaderProps> = ({
  serverRoomId,
  viewDimension,
  onViewDimensionChange,
}) => {
  const navigate = useNavigate();

  // FloorPlan store 상태들 (2D 뷰에서만 사용)
  const mode = useFloorPlanStore((state) => state.mode);
  const toggleMode = useFloorPlanStore((state) => state.toggleMode);
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const groupSelectedAssets = useFloorPlanStore((state) => state.groupSelectedAssets);
  const displayMode = useFloorPlanStore((state) => state.displayMode);
  const setDisplayMode = useFloorPlanStore((state) => state.setDisplayMode);
  const zoom = useFloorPlanStore((state) => state.zoom);

  const undo = useStore(useFloorPlanStore.temporal, (state) => state.undo);
  const redo = useStore(useFloorPlanStore.temporal, (state) => state.redo);

  // 편집/보기 모드 전환 핸들러
  const handleToggleMode = () => {
    if (mode === 'view' && selectedAssetIds.length > 1) {
      if (
        window.confirm(
          `여러 개의 자산(${selectedAssetIds.length}개)이 선택되었습니다.\n이 자산들을 하나의 그룹으로 묶으시겠습니까?`
        )
      ) {
        groupSelectedAssets();
      }
    }
    toggleMode();
  };

  const handleDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayMode(e.target.value as 'status' | 'customColor');
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
      {/* 왼쪽: 뒤로가기 & 타이틀 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/server-room-dashboard')}
          className="flex items-center gap-2 text-gray-100 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>뒤로 가기</span>
        </button>
        <div className="h-6 w-px bg-gray-600" />
        <h1 className="text-xl font-bold text-white">
          {serverRoomId ? `서버실 ${serverRoomId}` : '제1서버실 A-Zone'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* 2D 뷰일 때만 표시되는 컨트롤들 */}
        {viewDimension === '2D' && (
          <>
            {/* 보기 모드 컨트롤 */}
            {mode === 'view' && (
              <>
                {/* 보기 모드 선택 */}
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-gray-100" />
                  <select
                    value={displayMode}
                    onChange={handleDisplayModeChange}
                    className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  >
                    <option value="status">상태 임계값</option>
                    <option value="customColor">사용자 지정 색상</option>
                  </select>
                </div>

                {/* 줌 컨트롤 */}
                <div className="flex items-center border border-gray-600 rounded-lg p-1 bg-gray-700/50">
                  <button
                    onClick={() => zoom('out')}
                    className="p-1 rounded-md text-gray-100 hover:bg-gray-600 transition-colors"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="px-2 select-none text-gray-100">Zoom</span>
                  <button
                    onClick={() => zoom('in')}
                    className="p-1 rounded-md text-gray-100 hover:bg-gray-600 transition-colors"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {/* 편집 모드 컨트롤 */}
            {mode === 'edit' && (
              <div className="flex items-center gap-2 border border-gray-600 rounded-lg p-1 bg-gray-700/50">
                <button
                  onClick={() => undo()}
                  className="p-2 rounded-md flex items-center gap-1.5 text-gray-100 hover:bg-gray-600 transition-colors"
                >
                  <Undo2 className="w-4 h-4" /> 되돌리기
                </button>
                <button
                  onClick={() => redo()}
                  className="p-2 rounded-md flex items-center gap-1.5 text-gray-100 hover:bg-gray-600 transition-colors"
                >
                  <Redo2 className="w-4 h-4" /> 다시 실행
                </button>
              </div>
            )}

            {/* 편집/보기 모드 전환 버튼 */}
            <button
              onClick={handleToggleMode}
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
            2D
          </button>
          <button
            onClick={() => onViewDimensionChange('3D')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewDimension === '3D'
                ? 'bg-gray-400 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            3D
          </button>
        </div>
      </div>
    </header>
  );
};

export default ServerViewHeader;
