import { useEffect } from 'react';
import RackView from '../../../rack/components/RackView';
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
        className="fixed top-0 right-0 h-full w-full max-w-[700px] sm:w-[30vw] sm:max-w-[600px] z-50 animate-slideInRight overflow-hidden"
      >
        <RackView 
          onClose={closeRackModal} 
          rackName={selectedServerId || 'N/A'} 
        />
      </div>
    </div>
  );
}

export default RackModal;
