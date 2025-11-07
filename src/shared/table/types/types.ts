import type { Table as TanStackTable } from '@tanstack/react-table';

/**
 * 공통 테이블 Props
 * @template TData - 테이블에서 사용할 데이터 타입 (제네릭)
 */
export interface CommonTableProps<TData> {
  /** TanStack Table 인스턴스 */
  table: TanStackTable<TData>;
  
  /** 로딩 상태 */
  isLoading?: boolean;
  
  /** 데이터가 없을 때 표시할 메시지 */
  emptyMessage?: string;
  
  /** 스켈레톤 로딩 행 개수 (기본값: 5) */
  skeletonRows?: number;
  
  /** 테이블 컨테이너 커스텀 클래스 */
  containerClassName?: string;
  
  /** 테이블 헤더 커스텀 클래스 */
  headerClassName?: string;
  
  /** 테이블 바디 커스텀 클래스 */
  bodyClassName?: string;
  
  /** 테이블 행 커스텀 클래스 */
  rowClassName?: string;
  
  /** 테이블 셀 커스텀 클래스 */
  cellClassName?: string;
}

/**
 * 테이블 메타 데이터 기본 인터페이스
 * 각 도메인에서 필요한 메타 데이터를 확장해서 사용
 * 
 * @example
 * ```ts
 * interface MyTableMeta extends BaseTableMeta {
 *   editHandler: (item: MyData) => void;
 *   deleteHandler: (id: string) => void;
 * }
 * ```
 */
export interface BaseTableMeta {
  [key: string]: unknown;
}
