# 공용 테이블 시스템 (Shared Table)

TanStack Table v8 기반의 재사용 가능한 테이블 컴포넌트 시스템입니다.

## 📁 구조

```
src/shared/table/
├── components/
│   ├── DataTable.tsx              # 메인 테이블 컴포넌트
│   ├── DataTablePagination.tsx    # 페이지네이션 컴포넌트
│   ├── TableHeaderCheckbox.tsx    # 전체 선택 체크박스
│   ├── TableSkeleton.tsx          # 로딩 스켈레톤 UI
│   └── TableEmpty.tsx             # 빈 상태 UI
├── types/
│   └── table.types.ts             # 공용 타입 정의
└── index.ts                       # 진입점
```

## ✨ 주요 기능

- ✅ **제네릭 타입 지원** - 어떤 데이터 타입이든 사용 가능
- ✅ **페이지네이션** - 클라이언트 사이드 페이지네이션
- ✅ **정렬** - 다중 컬럼 정렬 지원
- ✅ **행 선택** - 체크박스를 통한 다중 선택 (indeterminate 상태 포함)
- ✅ **검색/필터** - 유연한 필터링 로직
- ✅ **스켈레톤 로딩** - 로딩 상태 UX
- ✅ **다크 모드** - Tailwind CSS 다크 테마
- ✅ **타입 안정성** - TypeScript 완벽 지원

## 🚀 사용법

### 1. 타입 정의

```typescript
// types/member.types.ts
export interface Member {
  id: number;
  userName: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  lastLoginAt: string | null;
}

export interface MemberTableMeta extends TableMeta<Member> {
  onEdit?: (member: Member) => void;
  onDelete?: (id: number) => void;
}
```

### 2. 컬럼 정의

```typescript
// components/memberTable.config.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { TableHeaderCheckbox } from '@/shared/table';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

export const memberColumns: ColumnDef<Member>[] = [
  // 선택 체크박스
  {
    id: 'select',
    header: ({ table }) => <TableHeaderCheckbox table={table} />,
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="rounded border-gray-600 bg-gray-700"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
  },
  
  // 정렬 가능한 컬럼
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        이름 <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
  },
  
  // 액션 컬럼
  {
    id: 'actions',
    header: '관리',
    cell: ({ row, table }) => (
      <div className="flex gap-2">
        <button onClick={() => table.options.meta?.onEdit?.(row.original)}>
          <Pencil size={16} />
        </button>
        <button onClick={() => table.options.meta?.onDelete?.(row.original.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];
```

### 3. 페이지 구현

```typescript
// pages/MemberPage.tsx
import { useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { DataTable, DataTablePagination } from '@/shared/table';
import { memberColumns } from '../components/memberTable.config';

export default function MemberPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  
  const { data = [], isLoading, isError } = useGetMembers();
  
  const table = useReactTable({
    data,
    columns: memberColumns,
    state: { pagination, rowSelection, sorting },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    meta: {
      onEdit: handleEdit,
      onDelete: handleDelete,
    },
  });

  return (
    <div>
      <DataTable
        table={table}
        columns={memberColumns}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="데이터가 없습니다."
      />
      
      <DataTablePagination
        table={table}
        showSelectedCount={true}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 20, 30, 50]}
      />
    </div>
  );
}
```

## 📚 API 문서

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `Table<TData>` | required | TanStack Table 인스턴스 |
| `columns` | `ColumnDef<TData>[]` | required | 컬럼 정의 배열 |
| `isLoading` | `boolean` | `false` | 로딩 상태 |
| `isError` | `boolean` | `false` | 에러 상태 |
| `emptyMessage` | `string` | `'표시할 데이터가 없습니다.'` | 빈 상태 메시지 |
| `errorMessage` | `string` | `'데이터 로딩 중 오류가 발생했습니다.'` | 에러 메시지 |
| `skeletonRows` | `number` | `5` | 스켈레톤 행 개수 |

### DataTablePagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `Table<TData>` | required | TanStack Table 인스턴스 |
| `showSelectedCount` | `boolean` | `true` | 선택된 행 개수 표시 여부 |
| `showPageSizeSelector` | `boolean` | `true` | 페이지 크기 선택 표시 여부 |
| `pageSizeOptions` | `number[]` | `[10, 20, 30, 50]` | 페이지 크기 옵션 |
| `disabled` | `boolean` | `false` | 비활성화 여부 |

## 🎨 커스터마이징

### 스타일 수정

모든 컴포넌트는 Tailwind CSS를 사용하므로, 필요에 따라 클래스를 수정할 수 있습니다.

```typescript
// 예: 테이블 배경색 변경
<div className="overflow-x-auto bg-white dark:bg-gray-800 ...">
```

### 컬럼 타입

- **기본 컬럼**: 텍스트 표시
- **정렬 가능 컬럼**: `header`에 버튼 추가
- **커스텀 렌더링**: `cell` 함수 사용
- **액션 컬럼**: 버튼을 통한 이벤트 처리

## 📝 예제

### 상태 Badge 컬럼

```typescript
{
  accessorKey: 'status',
  header: '상태',
  cell: ({ getValue }) => {
    const status = getValue<string>();
    const colorMap = {
      ACTIVE: 'bg-green-700',
      INACTIVE: 'bg-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded ${colorMap[status]}`}>
        {status}
      </span>
    );
  },
}
```

### 날짜 포맷 컬럼

```typescript
{
  accessorKey: 'createdAt',
  header: '생성일',
  cell: ({ getValue }) => {
    const date = getValue<string>();
    return new Date(date).toLocaleDateString('ko-KR');
  },
}
```

## 🔄 서버 사이드 페이지네이션 지원 (향후)

현재는 클라이언트 사이드 페이지네이션만 지원하지만, 서버 사이드 페이지네이션이 필요한 경우:

```typescript
const table = useReactTable({
  // ...
  manualPagination: true,
  pageCount: totalPageCount,
});
```

## 💡 팁

1. **성능 최적화**: 대량 데이터의 경우 `React.memo` 사용
2. **타입 안정성**: 항상 제네릭 타입 명시
3. **재사용성**: 도메인별 컬럼 설정 파일 분리
4. **접근성**: 버튼에 `aria-label` 추가
5. **반응형**: Tailwind의 반응형 클래스 활용

## 🐛 문제 해결

### Q: 체크박스 indeterminate 상태가 표시되지 않아요
A: `TableHeaderCheckbox` 컴포넌트를 사용하고 있는지 확인하세요.

### Q: 정렬이 작동하지 않아요
A: `getSortedRowModel()`과 `sorting` 상태가 제대로 연결되었는지 확인하세요.

### Q: 페이지네이션이 작동하지 않아요
A: `getPaginationRowModel()`과 `pagination` 상태가 제대로 연결되었는지 확인하세요.
