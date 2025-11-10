import type { TableSkeletonProps } from '../types/table';

/**
 * 단일 스켈레톤 행 컴포넌트
 */
const SkeletonRow = ({ columns }: { columns: number }) => {
  const cells = Array.from({ length: columns }, (_, i) => (
    <td key={i} className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
    </td>
  ));
  return <tr className="hover:bg-gray-700">{cells}</tr>;
};

/**
 * 테이블 스켈레톤 UI 컴포넌트
 * 
 * @param rows - 표시할 스켈레톤 행 개수 (기본값: 5)
 * @param columns - 열 개수
 */
export default function TableSkeleton({ rows = 5, columns }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </>
  );
}
