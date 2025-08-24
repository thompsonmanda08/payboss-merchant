import { EyeIcon, FunnelIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Tooltip,
  Chip,
} from '@heroui/react';
import { format } from 'date-fns';
import React, { Key } from 'react';

import EmptyLogs from '@/components/base/empty-logs';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import SelectField from '@/components/ui/select-field';
import usePaymentsStore from '@/context/payment-store';
import { useDebounce } from '@/hooks/use-debounce';
import {
  SERVICE_PROVIDER_COLOR_MAP,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/lib/constants';
import { Columns, ColumnType } from '@/lib/table-columns';
import { cn } from '@/lib/utils';

import { SingleSelectionDropdown } from '../ui/dropdown-button';
import Search from '../ui/search';
import { Pagination as TPagination } from '@/types';

const STATUSES = [
  {
    name: 'Successful',
    uid: 'successful',
  },
  {
    name: 'Failed',
    uid: 'failed',
  },
  {
    name: 'Pending',
    uid: 'pending',
  },
  {
    name: 'Submitted',
    uid: 'submitted',
  },
];

type CustomTableProps = {
  columns: Columns;
  rows: any;
  selectedKeys?: any;
  setSelectedKeys?: any;
  limitPerRow?: any;
  selectionBehavior?: any;
  isLoading?: any;
  removeWrapper?: any;
  onRowAction?: any;
  emptyCellValue?: any;
  emptyDescriptionText?: any;
  emptyTitleText?: any;
  classNames?: any;
  permissions?: any;
  searchKeys?: any;
  useRowDataAsKey?: any;
  pagination: TPagination;
  handlePageChange?: (page: number) => void;
  rowKey?: any;
  filters?: {
    dateFormat?: 'dd-MMM-yyyy hh:mm:ss a' | 'dd-MM-yyyy' | 'dd/MM/yyyy';
    status?: {
      enabled: boolean;
      options?: any;
    };
    columns?: {
      enabled: boolean;
      options?: any;
    };
  };
};

export default function CustomTable({
  columns,
  rows,
  selectedKeys,
  setSelectedKeys,
  limitPerRow,
  selectionBehavior,
  isLoading,
  removeWrapper,
  onRowAction = () => {},
  handlePageChange = () => {},
  emptyCellValue = 'N/A',
  emptyDescriptionText,
  emptyTitleText,
  classNames,
  permissions = {},
  searchKeys = [],
  useRowDataAsKey = false,
  rowKey,
  pagination,
  filters = {
    dateFormat: 'dd-MMM-yyyy hh:mm:ss a',
    status: {
      enabled: false,
      options: [],
    },
    columns: {
      enabled: true,
      options: [],
    },
  },
}: CustomTableProps) {
  const { setSelectedBatch, setOpenBatchDetailsModal } = usePaymentsStore();
  const [rowsPerPage, setRowsPerPage] = React.useState(limitPerRow || 6);
  const [page, setPage] = React.useState(1);

  // DEFINE FILTERABLE COLUMNS
  const INITIAL_VISIBLE_COLUMNS = columns.map(
    (column: ColumnType) => column?.uid,
  );
  const [visibleColumns, setVisibleColumns] = React.useState<
    Set<string> | 'all'
  >(new Set(INITIAL_VISIBLE_COLUMNS));

  const [filterValue, setFilterValue] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const debouncedSearchQuery = useDebounce(filterValue, 500);

  // HANDLE EXPLICIT SEARCH
  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'amount',
    direction: 'ascending',
  });

  const pages =
    pagination?.total_pages || Math.ceil(rows?.length / rowsPerPage);

  const hasSearchFilter = Boolean(debouncedSearchQuery);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  // GETS ROWS ARRAY AND APPLIES FILTERS AND RETURNS A FILTERED ARRAY
  const filteredItems = React.useMemo(() => {
    let filteredRows = [...rows];

    const STATUS_FILTERS =
      filters?.status?.enabled && filters.status.options
        ? filters?.status.options
        : STATUSES;

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter((row) =>
        searchKeys.some((key: string) =>
          row?.[key]
            ?.toString()
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
        ),
      );
    }

    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== STATUS_FILTERS.length
    ) {
      const selectedFilters = Array.from(statusFilter);

      filteredRows = filteredRows.filter((row) =>
        selectedFilters.includes(row?.status),
      );
    }

    return filteredRows;
  }, [rows, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((row: any, columnKey: Key | string) => {
    const cellValue = row[String(columnKey)];

    switch (columnKey) {
      case 'name':
        return (
          <span className={cn('text-nowrap font-medium capitalize')}>
            {cellValue}
          </span>
        );

      case 'created_at':
        return (
          <span className={cn('text-nowrap capitalize')}>
            {format(cellValue, filters.dateFormat || 'dd-MMM-yyyy hh:mm:ss a')}
          </span>
        );

      case 'status':
        return (
          <Chip
            className={cn(
              'h-max min-h-max cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white',
              TRANSACTION_STATUS_COLOR_MAP[
                row.status as keyof typeof TRANSACTION_STATUS_COLOR_MAP
              ],
            )}
            size="sm"
            variant="light"
          >
            {cellValue.replace('_', ' ')}
          </Chip>
        );

      case 'service_provider':
        return (
          <Tooltip
            closeDelay={500}
            color="default"
            content={
              row?.mno_status_description ||
              row?.status_description ||
              'No description'
            }
            delay={500}
            placement="right"
            showArrow={true}
          >
            <Chip
              className={cn(
                'mx-auto self-center capitalize',
                SERVICE_PROVIDER_COLOR_MAP[
                  row?.service_provider?.toLowerCase() as keyof typeof SERVICE_PROVIDER_COLOR_MAP
                ],
              )}
              classNames={{
                content: 'font-semibold',
              }}
              color="primary"
              variant="flat"
            >
              {cellValue}
            </Chip>
          </Tooltip>
        );

      case 'link':
        return (
          <Button
            isIconOnly
            className={'max-w-fit p-2'}
            variant="light"
            onPress={() => {
              setSelectedBatch(row);
              setOpenBatchDetailsModal(true);
            }}
          >
            <EyeIcon className="h-6 w-5" />
          </Button>
        );

      default:
        return cellValue || emptyCellValue || 'N/A';
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(pagination.page || 1);
  }, []);

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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Search
            placeholder="Search..."
            value={filterValue}
            onChange={(v) => onSearchChange(v)}
          />
          <div className="relative flex gap-3">
            {filters?.status?.enabled && (
              <SingleSelectionDropdown
                buttonVariant="flat"
                className={'min-w-[160px]'}
                closeOnSelect={false}
                disallowEmptySelection={true}
                dropdownItems={STATUSES}
                name={'Status'}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                startContent={<FunnelIcon className="h-5 w-5" />}
                onSelectionChange={setStatusFilter}
              />
            )}
            {filters?.columns && (
              <SingleSelectionDropdown
                buttonVariant="flat"
                className={'min-w-[160px]'}
                closeOnSelect={false}
                disallowEmptySelection={true}
                dropdownItems={columns}
                name={'Columns'}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                setSelectedKeys={setSelectedKeys}
                onSelectionChange={setVisibleColumns}
              />
            )}

            {permissions?.create && <Button color="primary">ACTION</Button>}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    rows.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full items-center justify-between">
        <span className="text-small text-foreground-400">
          Total: {hasSearchFilter ? items.length || 0 : pagination.total || 0}{' '}
          transactions
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pagination.page || page}
          total={pagination.total_pages || pages || 1}
          onChange={(page) => {
            if (!handlePageChange) {
              setPage(page);
            } else {
              handlePageChange(page);
            }
          }}
        />
        <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-foreground-400">
          Rows per page:{' '}
          <SelectField
            className="h-8 min-w-max bg-transparent text-sm text-foreground-400 outline-none"
            defaultValue={10}
            options={['5', '10', '15', '20']}
            placeholder={rowsPerPage.toString()}
            onChange={onRowsPerPageChange}
          />
        </label>
      </div>
    );
  }, [rows, pages]);

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

  return (
    <Table
      isHeaderSticky
      isStriped
      aria-label="Example table with custom cells"
      classNames={{
        table: cn(
          'align-top items-start justify-start',
          {
            'min-h-[400px]': isLoading || !rows,
          },
          classNames?.table,
        ),

        base: cn(
          'overflow-x-auto flex-1 py-5',
          { 'min-h-max': pages <= 1 },
          classNames?.wrapper,
        ),
      }}
      // classNames={}
      // showSelectionCheckboxes
      // selectionMode="multiple"
      bottomContent={bottomContent}
      className="max-h-[1080px]"
      removeWrapper={removeWrapper}
      selectedKeys={selectedKeys}
      selectionBehavior={selectionBehavior}
      selectionMode="single"
      sortDescriptor={sortDescriptor as any}
      topContent={topContent}
      onRowAction={(key) => onRowAction(key)}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor as any}
    >
      <TableHeader className="fixed" columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'status' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        // align={"top" as any}
        emptyContent={emptyContent}
        isLoading={isLoading}
        items={sortedItems}
        loadingContent={loadingContent}
      >
        {(item) => (
          <TableRow
            key={
              useRowDataAsKey
                ? item
                : rowKey
                  ? item?.[rowKey]
                  : item?.transactionID || item?.ID
            }
            // align="top"
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
