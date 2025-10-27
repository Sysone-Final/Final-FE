import { useEffect } from 'react';
import RackView from '../../rack/components/RackView';
import { useBabylonDatacenterStore } from '../stores/useBabylonDatacenterStore';

function RackModal() {
  const { isRackModalOpen, selectedServerId, closeRackModal } = useBabylonDatacenterStore();

  // ESC 키로 패널 닫기
  useEffect(() => {
    if (!isRackModalOpen) return; // 모달이 열려있지 않으면 이벤트 리스너 추가하지 않음
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRackModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isRackModalOpen, closeRackModal]);

  // 패널이 닫혀있으면 아예 렌더링하지 않음 (메모리 절약)
  if (!isRackModalOpen) return null;

  return (
    <div>
      {/* 배경 오버레이 - 패널이 열릴 때만 표시 */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-fadeIn"
        onClick={closeRackModal}
      />
      
      {/* 우측 슬라이드 패널 */}
      <div
        className="fixed top-0 right-0 h-full w-[30vw] z-50 animate-slideInRight"
      >
        {/* 헤더 */}
        {/* <div className="flex items-center justify-between px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-bold text-gray-50">
              Server Rack - {selectedServerId || 'N/A'}
            </h2>
          </div>
          <button
            onClick={closeRackModal}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div> */}

        <div>
          <RackView 
            onClose={closeRackModal} 
            rackName={selectedServerId || 'N/A'} 
          />
        </div>
      </div>
    </div>
  );
}

export default RackModal;
