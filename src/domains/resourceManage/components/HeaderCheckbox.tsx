import React, { useRef, useEffect } from 'react';
import type { Table } from '@tanstack/react-table';
import type { Resource } from '../types/resource.types';

interface HeaderCheckboxProps {
  table: Table<Resource>;
}

// NOTE(user): 'indeterminate' prop은 React 컴포넌트에서 직접 사용
export default function HeaderCheckbox({ table }: HeaderCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = table.getIsSomeRowsSelected();
    }
  }, [table.getIsSomeRowsSelected()]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="rounded border-gray-300"
      checked={table.getIsAllRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  );
}