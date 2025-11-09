import type { TableEmptyProps } from '../types/table.types';

/**
 * 테이블 빈 상태 컴포넌트
 * 
 * @param message - 표시할 메시지
 * @param colSpan - 컬럼 span 개수
 */
export default function TableEmpty({ 
  message = '표시할 데이터가 없습니다.', 
  colSpan 
}: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="text-center py-10 text-gray-500 text-placeholder"
      >
        {message}
      </td>
    </tr>
  );
}
