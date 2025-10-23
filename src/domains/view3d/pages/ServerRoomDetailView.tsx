import { useParams, useNavigate } from 'react-router-dom';
import BabylonDatacenterView from '../components/BabylonDatacenterView';

function ServerRoomDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
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
            서버실 3D 뷰 - {id}
          </h1>
        </div>
        <div className="text-sm text-gray-100">
          뷰어 모드
        </div>
      </header>

      {/* 3D 뷰 */}
      <div className="flex-1 overflow-hidden">
        <BabylonDatacenterView mode="view" serverRoomId={id} />
      </div>
    </div>
  );
}

export default ServerRoomDetailView;
