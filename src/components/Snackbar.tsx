
import type { Toast } from 'react-hot-toast';

interface SnackbarProps {
  t: Toast;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

// 래퍼 (배경, 그림자, 패딩 등)
const snackbarWrapperStyle = `
  bg-white text-gray-900 
  shadow-lg rounded-lg 
  pointer-events-auto 
  flex items-center justify-between 
  w-full max-w-md p-4
  border border-gray-200 
`;

//  액션 버튼 active 상태 및 transition 
const actionButtonStyle = `
  ml-4 px-3 py-1 
  rounded 
  text-sm font-medium 
  transition-colors duration-150 ease-in-out /* 1. 부드러운 색상 전환 */
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 /* 2. 포커스 링 수정 */
  
  text-white bg-red-600 
  hover:bg-green-500
  active:bg-red-700 /* 3. 클릭 피드백 (active) 추가 */
`;

export default function Snackbar({
  t,
  message,
  actionText,
  onAction,
}: SnackbarProps) {
  return (
    <div
      className={`${snackbarWrapperStyle} ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <span>{message}</span>
      {actionText && onAction && (
        <button className={actionButtonStyle} onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}