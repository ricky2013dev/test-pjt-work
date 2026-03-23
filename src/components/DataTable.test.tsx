import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DataTable, ColumnDef } from './DataTable';

interface Row {
  id: string;
  name: string;
  score: string;
}

const columns: ColumnDef<Row>[] = [
  { key: 'id',    header: 'ID',    sortable: true },
  { key: 'name',  header: 'Name',  sortable: true },
  { key: 'score', header: 'Score', sortable: true },
];

const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id:    `R${String(i + 1).padStart(3, '0')}`,
    name:  `Student ${i + 1}`,
    score: ['A', 'B', 'C'][i % 3],
  }));

describe('DataTable', () => {
  describe('Rendering', () => {
    it('renders column headers', () => {
      render(<DataTable data={[]} columns={columns} rowKey="id" />);
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Score')).toBeInTheDocument();
    });

    it('renders empty message when data is empty', () => {
      render(<DataTable data={[]} columns={columns} rowKey="id" emptyMessage="No data." />);
      expect(screen.getByText('No data.')).toBeInTheDocument();
    });

    it('renders row data', () => {
      render(<DataTable data={makeRows(3)} columns={columns} rowKey="id" />);
      expect(screen.getByText('Student 1')).toBeInTheDocument();
      expect(screen.getByText('Student 2')).toBeInTheDocument();
      expect(screen.getByText('Student 3')).toBeInTheDocument();
    });

    it('uses custom render function', () => {
      const cols: ColumnDef<Row>[] = [
        ...columns.slice(0, 2),
        { key: 'score', header: 'Score', render: (v) => <b data-testid="score">{String(v)}!</b> },
      ];
      render(<DataTable data={makeRows(1)} columns={cols} rowKey="id" />);
      expect(screen.getByTestId('score').textContent).toBe('A!');
    });
  });

  describe('Pagination', () => {
    it('shows only pageSize rows', () => {
      render(<DataTable data={makeRows(12)} columns={columns} rowKey="id" pageSize={5} />);
      expect(screen.getAllByText(/^Student \d+$/).length).toBe(5);
    });

    it('navigates to next page', () => {
      render(<DataTable data={makeRows(12)} columns={columns} rowKey="id" pageSize={5} />);
      fireEvent.click(screen.getByText('›'));
      expect(screen.getByText('Student 6')).toBeInTheDocument();
    });

    it('navigates to last page', () => {
      render(<DataTable data={makeRows(12)} columns={columns} rowKey="id" pageSize={5} />);
      fireEvent.click(screen.getByText('»'));
      expect(screen.getByText('Student 11')).toBeInTheDocument();
      expect(screen.getByText('Student 12')).toBeInTheDocument();
    });

    it('disables prev buttons on first page', () => {
      render(<DataTable data={makeRows(10)} columns={columns} rowKey="id" pageSize={5} />);
      expect(screen.getByText('«')).toBeDisabled();
      expect(screen.getByText('‹')).toBeDisabled();
    });

    it('disables next buttons on last page', () => {
      render(<DataTable data={makeRows(5)} columns={columns} rowKey="id" pageSize={5} />);
      expect(screen.getByText('›')).toBeDisabled();
      expect(screen.getByText('»')).toBeDisabled();
    });

    it('shows record count info', () => {
      render(<DataTable data={makeRows(12)} columns={columns} rowKey="id" pageSize={5} />);
      expect(screen.getByText(/1–5 of 12/)).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('filters rows by search text', () => {
      render(
        <DataTable
          data={makeRows(10)}
          columns={columns}
          rowKey="id"
          filterKeys={['name']}
          filterPlaceholder="Search"
        />
      );
      fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Student 3' } });
      expect(screen.getByText('Student 3')).toBeInTheDocument();
      expect(screen.queryByText('Student 1')).not.toBeInTheDocument();
    });

    it('shows empty message when filter matches nothing', () => {
      render(
        <DataTable
          data={makeRows(5)}
          columns={columns}
          rowKey="id"
          filterKeys={['name']}
          emptyMessage="No results."
        />
      );
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'zzz' } });
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });

    it('resets to page 1 after filtering', () => {
      render(
        <DataTable data={makeRows(12)} columns={columns} rowKey="id" pageSize={5} filterKeys={['name']} />
      );
      fireEvent.click(screen.getByText('›'));
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Student' } });
      expect(screen.getByText(/1–5/)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts ascending on first click', () => {
      render(<DataTable data={makeRows(5)} columns={columns} rowKey="id" pageSize={5} />);
      fireEvent.click(screen.getByText('Name'));
      const cells = screen.getAllByText(/^Student \d+$/);
      expect(cells[0].textContent).toBe('Student 1');
    });

    it('sorts descending on second click', () => {
      render(<DataTable data={makeRows(5)} columns={columns} rowKey="id" pageSize={5} />);
      fireEvent.click(screen.getByText('Name'));
      fireEvent.click(screen.getByText('Name'));
      const cells = screen.getAllByText(/^Student \d+$/);
      // "Student 5" sorts last alphabetically among 5 rows
      expect(cells[0].textContent).toBe('Student 5');
    });
  });
});
