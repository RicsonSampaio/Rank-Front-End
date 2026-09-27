import type { PropsWithChildren } from "react";
import { RecordMenu } from "./RecordMenu";

export interface RecordTableColumn {
  id: string;
  label: string;
  width: number;
}

interface RecordTableProps extends PropsWithChildren {
  label: string;
  columns: RecordTableColumn[];
  rowCount: number;
}

export function RecordTable({ label, columns, rowCount, children }: RecordTableProps) {
  return (
    <div
      role="region" aria-label={"Listagem de " + label.toLowerCase() + " com rolagem"} tabIndex={0}
      className="max-h-[calc(100vh_-_200px)] overflow-auto rounded border border-gray-100 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      <div role="table" aria-label={label} aria-colcount={columns.length + 1} aria-rowcount={rowCount + 1} className="w-max min-w-full">
        <div role="rowgroup" className="sticky top-0 z-10 bg-gray-50">
          <div role="row" className="inline-flex w-full items-center justify-start border-b border-gray-100">
            {columns.map((column) => <RecordTableHeader key={column.id} column={column} />)}
            <div role="columnheader" className="sticky right-0 ml-auto flex h-9 w-16 shrink-0 items-center justify-center border-l border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">Ações</div>
          </div>
        </div>
        <div role="rowgroup" className="flex flex-col items-start justify-start">{children}</div>
      </div>
    </div>
  );
}

export function RecordTableHeader({ column }: { column: RecordTableColumn }) {
  return (
    <div role="columnheader" className="flex h-9 shrink-0 items-center justify-start overflow-hidden px-3 text-sm font-medium text-gray-600" style={{ width: column.width, minWidth: column.width, maxWidth: column.width }} title={column.label}>
      <span className="truncate">{column.label}</span>
    </div>
  );
}

export function RecordTableRow({ children }: PropsWithChildren) {
  return (
    <div role="row" className="group inline-flex max-h-9 min-h-9 w-full items-center justify-start self-stretch border-b border-gray-100 text-sm transition-colors hover:bg-gray-50">
      {children}
    </div>
  );
}

interface RecordTableCellProps extends PropsWithChildren {
  width: number;
  title?: string;
  primary?: boolean;
}

export function RecordTableCell({ width, title, primary = false, children }: RecordTableCellProps) {
  return (
    <div role="cell" className="flex h-9 shrink-0 items-center justify-start overflow-hidden" style={{ width, minWidth: width, maxWidth: width }}>
      <div className={"mr-0.5 w-full truncate px-3 " + (primary ? "text-gray-900" : "text-gray-500")} title={title}>{children}</div>
    </div>
  );
}

export function RecordTableActions({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div role="cell" className="sticky right-0 ml-auto flex h-9 w-16 shrink-0 items-center justify-center border-l border-gray-200 bg-white group-hover:bg-gray-50">
      <RecordMenu label={label} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
