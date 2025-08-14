import {
  Cog6ToothIcon,
  ComputerDesktopIcon,
  ListBulletIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
  Tooltip,
} from '@heroui/react';
import { format } from 'date-fns';
import React from 'react';

import SoftBoxIcon from '@/components/base/soft-box-icon';
import Loader from '@/components/ui/loader';
import { Columns } from '@/lib/table-columns';
import { cn, formatCurrency } from '@/lib/utils';

const columns: Columns = [
  { name: 'TERMINAL', uid: 'terminal_name' },
  { name: 'CREATED BY', uid: 'created_by' },
  { name: 'DATE CREATED', uid: 'created_at' },
  // { name: "ACTION", uid: "action" },
];

export default function TerminalsTable({
  rows,
  isLoading,
  removeWrapper,
  onRowAction = () => {},
  handleAddTerminal,
  selectedKeys,
}: {
  rows: any[];
  isLoading: boolean;
  removeWrapper?: boolean;
  onRowAction?: (item: any) => void;
  handleAddTerminal?: () => void;
  emptyDescriptionText?: string;
  emptyTitleText?: string;
  selectedKeys?: any;
  setSelectedKeys?: any;
}) {
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'age',
    direction: 'ascending',
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(rows?.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows?.slice(start, end);
  }, [page, rows, rowsPerPage]);

  const renderCell = React.useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'terminal_name':
        return (
          <TerminalInfo
            terminalID={item?.terminalID}
            terminalName={item?.terminal_name}
          />
        );

      case 'created_by':
        return (
          <Chip
            className="capitalize"
            color={'default'}
            size="sm"
            variant="flat"
          >
            {cellValue || 'N/A'}
          </Chip>
        );

      case 'created_at':
        return format(cellValue || new Date(), 'dd-MMM-yyyy hh:mm:ss a');

      case 'action':
        return (
          <div className="flex items-center justify-end gap-4">
            <Tooltip color="primary" content="Manage Terminal">
              <Cog6ToothIcon
                // onClick={() => setOpenViewConfig(true)}
                className="h-5 w-5 cursor-pointer text-secondary hover:opacity-90"
              />
            </Tooltip>
            <Tooltip color="default" content="View Terminal Transactions">
              <ListBulletIcon
                className={`h-6 w-6 cursor-pointer text-primary`}
                // onClick={() => copyToClipboard(apiKey?.key)}
              />
            </Tooltip>
          </div>
        );

      default:
        return cellValue || 'N/A';
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      // NUMBER OF TERMINALS SHOULD BE MORE THAN 3
      pages > 1 && (
        <div className="flex items-center justify-center px-2 py-2">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
          {/* <div className="hidden w-[30%] justify-end gap-2 sm:flex">
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div> */}
        </div>
      )
    );
  }, [selectedKeys, items.length, page, pages]);

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mb-2 mt-4 flex h-full flex-1 items-center justify-center rounded-2xl bg-slate-50 text-sm font-medium dark:bg-foreground/5">
        <Button
          className={
            'max-h-auto h-full w-full flex-1 font-medium text-primary-600'
          }
          startContent={<PlusIcon className="h-5 w-5 cursor-pointer" />}
          variant="light"
          onPress={handleAddTerminal}
        >
          Add Terminal
        </Button>
      </div>
    );
  }, [rows]);

  const loadingContent = React.useMemo(() => {
    return (
      <div className="-mt-8 flex flex-1 items-center rounded-lg">
        <Loader
          classNames={{ wrapper: 'bg-foreground-200/50 rounded-xl h-full' }}
          size={100}
        />
      </div>
    );
  }, [isLoading]);

  return (
    <Table
      isHeaderSticky
      aria-label="Terminals table with custom cells"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        table: cn('align-top items-start justify-start', {
          'min-h-[400px]': isLoading || !rows,
        }),
      }}
      color="primary"
      removeWrapper={removeWrapper}
      onRowAction={(key) => onRowAction(key)}
      onSortChange={setSortDescriptor as any}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'action' ? 'center' : 'start'}
            allowsSorting={column?.sortable}
            width={(column.uid === 'name' ? '60%' : 'auto') as any}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        // align="top"
        emptyContent={emptyContent}
        isLoading={isLoading}
        items={items}
        loadingContent={loadingContent}
      >
        {(item) => (
          <TableRow
            key={item.terminalID}
            //  isDisabled={item?.isLocked}
          >
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function TerminalInfo({
  onClick,
  terminalName,
  terminalID,
  count,
  value,
  className,
  ...props
}: {
  onClick?: () => void;
  terminalName?: string;
  terminalID?: string;
  count?: number;
  value?: number;
  className?: string;
}) {
  return (
    <Button
      className={cn(
        'flex h-auto w-full justify-start gap-2  bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100 max-w-xs',
        className,
      )}
      startContent={
        <SoftBoxIcon className={'h-12 w-12'}>
          <ComputerDesktopIcon />
        </SoftBoxIcon>
      }
      onPress={onClick}
      {...props}
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-start gap-1">
          <h3 className="ml-1 font-bold uppercase text-primary-600">
            {terminalName || 'Terminal #'}
          </h3>
          <Chip
            className="truncate text-xs font-medium text-orange-600"
            color="secondary"
            size="sm"
            variant="flat"
          >
            ID: {terminalID || '******'}
          </Chip>
        </div>
        {count && value && (
          <Tooltip
            classNames={{
              content: 'text-white',
            }}
            color="success"
            content="Successful Transactions"
          >
            <div className="ml-auto flex flex-col items-end gap-px">
              <div className="flex max-w-[260px] justify-between gap-2">
                <p className="truncate text-sm font-medium text-slate-600">
                  {Number(count) == 1
                    ? `${count} Transaction`
                    : `${count} Transactions`}
                </p>
              </div>
              <Chip
                className="text-[clamp(0.8rem,1vw,1rem)] !font-bold uppercase text-success-600"
                color="success"
                size="sm"
                variant="flat"
              >
                {value ? formatCurrency(value) : 'ZMW 0.00'}
              </Chip>
            </div>
          </Tooltip>
        )}
      </div>
    </Button>
  );
}
