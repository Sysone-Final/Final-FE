import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import {
  useFloorPlanStore,
  toggleMode,
  groupSelectedAssets,
  setDisplayMode,
  zoom,
  // useHasUnsavedChanges,
} from '../floorPlan/store/floorPlanStore';

import { useBabylonDatacenterStore } from '../view3d/stores/useBabylonDatacenterStore';
import { Settings, Eye, Undo2, Redo2, ZoomIn, ZoomOut, 
  // Palette 
} from 'lucide-react';
import { useSidebarStore } from '../floorPlan/store/useSidebarStore';
import { useConfirmationModal } from '../floorPlan/components/ConfirmationModal';
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

  const { confirm } = useConfirmationModal();

  // 스토어에서는 '데이터'만 가져옵니다.
  const mode = useFloorPlanStore((state) => state.mode);
  // const hasUnsavedChanges = useHasUnsavedChanges();
  const selectedAssetIds = useFloorPlanStore((state) => state.selectedAssetIds);
  const displayMode = useFloorPlanStore((state) => state.displayMode);

const handleBackNavigation = () => {
    // 1. window.confirm() 로직을 '모두 삭제'합니다.
    // 2. 히스토리 클리어 로직을 '삭제'합니다. (Gatekeeper가 처리)
    
    // 3. 오직 "나가겠다"는 신호(navigate)만 보냅니다.
    //    이후의 모든 처리는 ServerViewPage.tsx의 useBlocker가 담당합니다.
    navigate('/server-room-dashboard');
  };

  const undo = useStore(useFloorPlanStore.temporal, (state) => state.undo);
  const redo = useStore(useFloorPlanStore.temporal, (state) => state.redo);

  const { setLeftSidebarOpen, setRightSidebarOpen } = useSidebarStore();
  const mode3d = useBabylonDatacenterStore((state) => state.mode); 
  const toggleMode3d = useBabylonDatacenterStore((state) => state.toggleMode); 

  const handleToggleMode2D = () => {
    if (mode === 'view') {
      // 공통으로 실행될 로직
      const switchToEditMode = (shouldGroup: boolean) => {
        if (shouldGroup) {
          groupSelectedAssets();
        }
        setLeftSidebarOpen(true);
        setRightSidebarOpen(true);
        toggleMode(); // 2D 모드 전환 실행
      };

      if (selectedAssetIds.length > 1) {
        // 5. window.confirm()을 confirm() 훅으로 대체
        confirm({
          title: '자산 그룹화',
          message: (
            <p>
              여러 개의 자산(<strong>{selectedAssetIds.length}개</strong>)이
              선택되었습니다.
              <br />이 자산들을 하나의 그룹으로 묶으시겠습니까?
            </p>
          ),
          confirmText: '그룹화',
          confirmAction: () => switchToEditMode(true), // 확인 시 그룹화 후 전환
          cancelAction: () => switchToEditMode(false), // 취소 시 그냥 전환
        });
      } else {
        // 그룹화할 자산이 없으면 바로 전환
        switchToEditMode(false);
      }
    } else {
      // "편집" -> "보기" 모드로 전환 시
      setRightSidebarOpen(false);
      toggleMode(); // 2D 모드 전환 실행
    }
  };


  //  3D 토글 핸들러(main)와 Zoom 핸들러(HEAD)를 모두 유지합니다.
  const handleToggleMode3D = () => { 
    toggleMode3d();
  };
  
  // 활성화된 'handleDisplayModeChange' 함수를 사용
  // const handleDisplayModeChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   setDisplayMode(e.target.value as 'status' | 'customColor');
  // };

  const handleZoomIn = () => zoom('in'); 
  const handleZoomOut = () => zoom('out'); 

  return (
    // 헤더 태그 
    <header className="bg-gray-500/30 backdrop-blur-sm border-b border-gray-700 px-6 py-2 flex items-center justify-between flex-shrink-0">
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
        {/* 3D/2D 분기를 위해 '?' 삼항 연산자 사용  */}
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
            {/*  'handleToggleMode2D'를 호출하는 버튼 사용 (main) */}
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

