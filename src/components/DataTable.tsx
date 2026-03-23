import React, { useState, useMemo } from 'react';
import './DataTable.css';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: keyof T;
  pageSize?: number;
  filterPlaceholder?: string;
  filterKeys?: (keyof T)[];
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  pageSize: defaultPageSize = 5,
  filterPlaceholder = 'Search...',
  filterKeys = [],
  emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filter
  const filtered = useMemo(() => {
    if (!filterText.trim() || filterKeys.length === 0) return data;
    const lower = filterText.toLowerCase();
    return data.filter((row) =>
      filterKeys.some((key) =>
        String(row[key] ?? '').toLowerCase().includes(lower)
      )
    );
  }, [data, filterText, filterKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? '');
      const bVal = String(b[sortKey] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setCurrentPage(1);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    setCurrentPage(1);
  };

  const sortIcon = (key: keyof T) => {
    const isActive = sortKey === key;
    const iconClass = `dt-sort-icon${isActive ? ' dt-sort-icon--active' : ''}`;
    const icon = !isActive ? '⇅' : sortDir === 'asc' ? '↑' : '↓';
    return <span className={iconClass}>{icon}</span>;
  };

  return (
    <div className="dt-wrapper">
      {/* Toolbar */}
      <div className="dt-toolbar">
        <input
          type="text"
          value={filterText}
          onChange={handleFilter}
          placeholder={filterPlaceholder}
          className="dt-filter-input"
        />
        <div className="dt-page-size-wrap">
          <label className="dt-page-size-label">Rows:</label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="dt-page-size-select"
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="dt-table-wrap">
        <table className="dt-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`dt-th${col.sortable ? ' dt-th--sortable' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.header}
                  {col.sortable && sortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="dt-empty">{emptyMessage}</td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={String(row[rowKey])} className={i % 2 === 0 ? 'dt-row--even' : 'dt-row--odd'}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="dt-td">
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="dt-pagination">
        <span className="dt-page-info">
          {sorted.length === 0 ? '0' : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, sorted.length)}`}
          {' of '}{sorted.length} records
        </span>
        <div className="dt-page-buttons">
          <button className="dt-page-btn" onClick={() => setCurrentPage(1)}          disabled={safePage === 1}>«</button>
          <button className="dt-page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={safePage === 1}>‹</button>
          <span className="dt-page-num">{safePage} / {totalPages}</span>
          <button className="dt-page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={safePage === totalPages}>›</button>
          <button className="dt-page-btn" onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}
