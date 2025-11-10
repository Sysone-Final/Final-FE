import type { Table, TableMeta, ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

/**
 * 공용 테이블 설정 인터페이스
 */
export interface DataTableConfig {
  /** 페이지네이션 활성화 여부 */
  enablePagination?: boolean;
  /** 정렬 활성화 여부 */
  enableSorting?: boolean;
  /** 행 선택 활성화 여부 */
  enableRowSelection?: boolean;
  /** 다중 정렬 활성화 여부 */
  enableMultiSort?: boolean;
  /** 초기 페이지 크기 */
  initialPageSize?: number;
  /** 페이지 크기 옵션 */
  pageSizeOptions?: number[];
}

/**
 * 공용 테이블 Props (제네릭)
 */
export interface DataTableProps<TData> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>;
  /** 컬럼 정의 */
  columns: ColumnDef<TData, ReactNode>[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 에러 상태 */
  isError?: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 스켈레톤 행 개수 */
  skeletonRows?: number;
}

/**
 * 페이지네이션 Props
 */
export interface DataTablePaginationProps<TData> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>;
  /** 선택된 행 개수 표시 여부 */
  showSelectedCount?: boolean;
  /** 페이지 크기 선택 표시 여부 */
  showPageSizeSelector?: boolean;
  /** 페이지 크기 옵션 */
  pageSizeOptions?: number[];
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 액션 버튼 Props
 */
export interface DataTableActionsProps<TData> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>;
  /** 대량 삭제 핸들러 */
  onDeleteSelected?: () => void;
  /** 대량 작업 추가 버튼들 */
  customActions?: React.ReactNode;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 테이블 메타 확장 인터페이스 (제네릭)
 */
export interface ExtendedTableMeta<TData> extends TableMeta<TData> {
  /** 수정 핸들러 */
  onEdit?: (row: TData) => void;
  /** 삭제 핸들러 */
  onDelete?: (id: string | number) => void;
  /** 커스텀 액션 핸들러 */
  customActions?: Record<string, (row: TData) => void>;
}

/**
 * 스켈레톤 Props
 */
export interface TableSkeletonProps {
  /** 행 개수 */
  rows?: number;
  /** 열 개수 */
  columns: number;
}

/**
 * 빈 상태 Props
 */
export interface TableEmptyProps {
  /** 표시할 메시지 */
  message?: string;
  /** 컬럼 span */
  colSpan: number;
}
