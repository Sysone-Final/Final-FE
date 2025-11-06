import { flexRender } from '@tanstack/react-table';
import type {
  Table as TanStackTable,
  HeaderGroup,
  Row,
  Cell,
} from '@tanstack/react-table';
import type { Resource } from '../types/resource.types';
import { columns } from './resourceTable.config';

/**
 * 테이블 스켈레톤 UI를 위한 단일 행
 */
const SkeletonRow = () => {
  // 컬럼 정의(columns) 개수만큼 스켈레톤 셀을 생성
  const cells = Array.from({ length: columns.length }, (_, i) => (
    <td key={i} className="px-6 py-4 whitespace-nowrap">
      {/* [수정] 스켈레톤 색상을 검색창 테두리와 유사하게 변경 
        (bg-gray-700 -> bg-slate-700/50) 
      */}
      <div className="h-4 bg-slate-700/50 rounded animate-pulse"></div>
    </td>
  ));
  {/* [수정] 스켈레톤 행의 호버 효과를 새 디자인에 맞게 변경
    (hover:bg-gray-700 -> hover:bg-white/10)
  */}
  return <tr className="hover:bg-white/10">{cells}</tr>;
};


interface ResourceTableProps {
  table: TanStackTable<Resource>;
  isLoading: boolean;
}

export default function ResourceTable({ table, isLoading }: ResourceTableProps) {

  return (
    /* [수정 1]
      테이블 전체를 감싸는 div입니다.
      - 배경색(bg-gray-800)을 검색창과 동일한 반투명(bg-gray-700/50)으로 변경
      - 테두리(border-gray-700)를 검색창과 동일한(border-slate-300/40)로 변경
    */
    <div className="overflow-x-auto bg-gray-700/50 rounded-lg shadow-md border border-slate-300/40"> 
      <table className="min-w-full"> {/* [수정] divide-y 제거 (tbody에서 관리) */}
        
        {/* [수정 2]
          테이블 헤더입니다.
          - 배경색(bg-gray-900) 제거
          - 헤더 셀(th)에 하단 테두리(border-b)를 추가해 구분
        */}
        <thead className=""> 
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<Resource>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  // [수정] 헤더 텍스트 색상 및 하단 테두리 추가
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-slate-300/40" 
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* [수정 3]
          테이블 본문입니다.
          - 배경색(bg-gray-800) 제거
          - 행(tr) 구분선(divide-y)의 색상을 검색창 테두리와 동일하게 변경
        */}
        <tbody className="divide-y divide-slate-300/40"> 
          {isLoading ? (
            // (스켈레톤 UI)
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : table.getRowModel().rows.length > 0 ? (
            // (데이터가 있을 때)
            table.getRowModel().rows.map((row: Row<Resource>) => (
              /*
                [수정 4]
                - 행 호버 색상을 더 은은하게 변경 (hover:bg-gray-700 -> hover:bg-white/10)
              */
              <tr key={row.id} className="hover:bg-white/10"> 
                {row.getVisibleCells().map((cell: Cell<Resource, unknown>) => (
                  <td
                    key={cell.id}
                    // 셀 텍스트 색상
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300" 
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // (데이터가 없을 때)
            <tr>
              <td
                colSpan={columns.length}
                // 빈 테이블 텍스트 색상
                className="text-center py-10 text-gray-500 text-placeholder" 
              >
                표시할 자원이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}