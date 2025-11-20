import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/domains/login/store/useAuthStore';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string | string[];
  fallback?: React.ReactNode;
}

function RoleProtectedRoute({ children, requiredRole, fallback = null }: RoleProtectedRouteProps) {
  const { user, authenticated } = useAuthStore();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  // requiredRole을 배열로 정규화
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // 권한이 없는 경우
  if (!user?.role || !requiredRoles.includes(user.role)) {
    // fallback이 제공된 경우 해당 컴포넌트 렌더링
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // 기본적으로 권한 없음 페이지 표시
    return <AccessDenied userRole={user?.role} requiredRoles={requiredRoles} />;
  }

  return <>{children}</>;
}

// 권한 없음 페이지 컴포넌트
function AccessDenied({ userRole, requiredRoles }: { userRole?: string; requiredRoles: string[] }) {
  const navigate = useNavigate();
  const requiredRolesText = requiredRoles.join(' 또는 ');

  return (
    <div className="min-h-full bg-neutral-900 flex items-center justify-center">
      <div className="max-w-md w-full rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-50 mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-200 mb-4">
            이 페이지에 접근하려면 <span className="font-semibold text-green-600">{requiredRolesText}</span> 권한이 필요합니다.
          </p>
          <p className="text-sm text-gray-500">
            현재 권한: <span className="font-medium">{userRole || '알 수 없음'}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2 text-gray-50 bg-green-500 rounded-lg hover:bg-green-700 transition-colors"
          >
            대시보드로 이동
          </button>
        </div>
        
        <div className="mt-6 py-4 rounded-lg">
          <p className="text-base text-gray-50">
            권한이 필요한 기능에 접근하려면 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleProtectedRoute;
