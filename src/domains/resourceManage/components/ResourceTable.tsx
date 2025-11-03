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
   <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
  </td>
 ));
 return <tr className="hover:bg-gray-700">{cells}</tr>;
};


interface ResourceTableProps {
 table: TanStackTable<Resource>;
 isLoading: boolean;
}

export default function ResourceTable({ table, isLoading }: ResourceTableProps) {

 return (
  // NOTE(user): 공통 레이아웃에 맞춰 배경/그림자 조정 (예: bg-white shadow-md rounded-lg)
  <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md border border-gray-700"> 
   <table className="min-w-full divide-y divide-gray-700">
    {/* 테이블 헤더 다크 모드 */}
    <thead className="bg-gray-900"> 
     {table.getHeaderGroups().map((headerGroup: HeaderGroup<Resource>) => (
      <tr key={headerGroup.id}>
       {headerGroup.headers.map((header) => (
        <th
         key={header.id}
         // 헤더 텍스트 색상
         className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" 
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
    {/* 테이블 바디 다크 모드 */}
    <tbody className="bg-gray-800 divide-y divide-gray-700"> 
     {isLoading ? (
      // 페이지 크기(예: 10)만큼 스켈레톤 행을 보여주거나, 임의의 개수(예: 5)를 하드코딩합니다.
      // 여기서는 5개만 예시로 보여줍니다.
      <>
       <SkeletonRow />
       <SkeletonRow />
       <SkeletonRow />
       <SkeletonRow />
       <SkeletonRow />
      </>
     ) : table.getRowModel().rows.length > 0 ? (
      // (기존) 데이터가 있을 때
      table.getRowModel().rows.map((row: Row<Resource>) => (
       // 행 호버 색상
       <tr key={row.id} className="hover:bg-gray-700"> 
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
      // (기존) 데이터가 없을 때
      <tr>
       <td
        colSpan={columns.length}
        // 빈 테이블 텍스트 색상 및 클래스
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