import { Wallet as WalletIcon } from 'lucide-react';
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
} from '@heroui/react';
import { format } from 'date-fns';
import React, { Key } from 'react';

import EmptyLogs from '@/components/base/empty-logs';
import SoftBoxIcon from '@/components/base/soft-box-icon';
import Loader from '@/components/ui/loader';
import { Columns } from '@/lib/table-columns';
import { cn, formatCurrency } from '@/lib/utils';

const columns: Columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'PREFUND AMOUNT', uid: 'amount' },
  { name: 'DISBURSED AMOUNT', uid: 'disbursed_amount' },
  { name: 'STATUS', uid: 'status' },
  { name: 'DATE CREATED', uid: 'created_at' },
  { name: 'VALID TIL', uid: 'expires_on' },
];

type PrefundTableProps = {
  rows: any[];
  isLoading: boolean;
  removeWrapper?: boolean;
  onRowAction?: any;
  emptyCellValue?: string;
  emptyDescriptionText?: string;
  emptyTitleText?: string;
  selectedKeys?: any;
  setSelectedKeys?: (k: any) => void;
};

export default function PrefundsTable({
  rows,
  isLoading,
  removeWrapper,
  // onRowAction = () => {},
  // emptyCellValue,
  emptyDescriptionText,
  emptyTitleText,
  selectedKeys,
  setSelectedKeys = (k: any) => {},
}: PrefundTableProps) {
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [sortDescriptor, setSortDescriptor] = React.useState({
  //   column: 'age',
  //   direction: 'ascending',
  // });
  const rowsPerPage = 5;
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(rows?.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows?.slice(start, end);
  }, [page, rows, rowsPerPage]);

  const renderCell = React.useCallback((item: any, columnKey: Key | string) => {
    const cellValue = item[String(columnKey)];

    switch (columnKey) {
      case 'name':
        return (
          <Button
            isDisabled
            className={cn(
              'flex h-auto w-full justify-start gap-4  bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100',
            )}
            startContent={
              <SoftBoxIcon className={'h-12 w-12'}>
                <WalletIcon />
              </SoftBoxIcon>
            }
          >
            <div className="flex flex-col items-start gap-1">
              <h3 className="mb-1 text-[clamp(1rem,1vw,1.25rem)] font-semibold uppercase text-primary-600">
                {item?.name}
              </h3>
              {item?.available_balance && (
                <div className="flex max-w-[260px] justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-600">
                    Available Balance: {formatCurrency(item?.available_balance)}
                  </p>
                </div>
              )}
            </div>
          </Button>
        );

      case 'status':
        return (
          <Chip
            className="capitalize"
            color={item?.isLocked ? 'default' : 'success'}
            size="sm"
            variant="flat"
          >
            {item?.isLocked ? 'Locked' : 'Active'}
          </Chip>
        );

      case 'created_at':
        return format(cellValue, 'dd-MMM-yyyy hh:mm:ss a');

      default:
        return cellValue;
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-center px-2 py-2">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${rows.length} selected`}
        </span> */}
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
    );
  }, [selectedKeys, items.length, page, pages]);

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-600 dark:bg-foreground/5">
        <EmptyLogs
          className={'my-auto mt-16'}
          classNames={{ heading: 'text-sm text-foreground/50 font-medium' }}
          subTitle={
            emptyDescriptionText || 'you have no data to be displayed here.'
          }
          title={emptyTitleText || 'No data to display.'}
        />
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

  function handlePrefundSelection(key: any) {
    // there can only be one selected prefund at a time

    // create an array from selected keys
    const keys = Array.from(key);

    // if the length of the array is 3 or the keys are all, then clear the selected keys
    if (keys.length === 3 || keys.join() == 'all') {
      setSelectedKeys(new Set([]));

      return;
    }

    // if the length of the array is 2, then set the selected keys to the second key
    if (keys.length > 1) {
      setSelectedKeys(new Set([keys[1]]));

      return;
    }

    // if the length of the array is 1, then set the selected keys to the first key
    setSelectedKeys(key);
  }

  return (
    <Table
      isHeaderSticky
      aria-label="Prefunds table with custom cells"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className="max-h-[480px]"
      classNames={{
        table: cn('align-top items-start justify-start', {
          'min-h-[400px]': isLoading || !rows,
        }),
        base: cn('overflow-x-auto', { '': pages <= 1 }),
      }}
      color="primary"
      removeWrapper={removeWrapper}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={handlePrefundSelection}
      // onSortChange={setSortDescriptor as any}
      // onRowAction={(key) => onRowAction(key)}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'status' ? 'center' : 'start'}
            allowsSorting={Boolean(column?.sortable)}
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
            key={item?.ID}
            // isDisabled={Boolean(item?.isLocked)}
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
