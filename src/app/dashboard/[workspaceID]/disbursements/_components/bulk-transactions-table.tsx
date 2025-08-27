'use client';
import { Monitor as ComputerDesktopIcon, Plus as PlusIcon } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@heroui/react';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { Key, useCallback } from 'react';

import EmptyLogs from '@/components/base/empty-logs';
import { Button } from '@/components/ui/button';
import { SingleSelectionDropdown } from '@/components/ui/dropdown-button';
import Loader from '@/components/ui/loader';
import Search from '@/components/ui/search';
import SelectField from '@/components/ui/select-field';
import usePaymentsStore from '@/context/payment-store';
import { useBulkTransactions, useWorkspaceInit } from '@/hooks/use-query-data';
import { TRANSACTION_STATUS_COLOR_MAP } from '@/lib/constants';
import { BULK_TRANSACTIONS_COLUMN } from '@/lib/table-columns';
import { cn, formatDate } from '@/lib/utils';
import { Pagination as PaginationType, DateRangeFilter } from '@/types';

// DEFINE FILTERABLE SERVICES
const SERVICE_FILTERS = [
  {
    name: 'direct bulk disbursement',
    uid: 'direct bulk disbursement',
  },

  {
    name: 'voucher bulk disbursement',
    uid: 'voucher bulk disbursement',
  },
];

export default function BulkTransactionsTable({
  workspaceID,
  dateRange,
  pagination,
}: {
  workspaceID: string;
  dateRange?: DateRangeFilter;
  pagination?: PaginationType;
}) {
  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const { setSelectedBatch, setOpenBatchDetailsModal } = usePaymentsStore();
  const [filters, setFilters] = React.useState<
    PaginationType & DateRangeFilter
  >({
    start_date: dateRange?.start_date || start_date,
    end_date: dateRange?.end_date || end_date,
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
  });

  // DATA FETCHING
  const { data: bulkTransactionsResponse, isLoading } = useBulkTransactions({
    workspaceID,
    filters,
  });

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };
  const updateFilters = useCallback(
    (fields: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...fields }));
    },
    [filters],
  );

  const rows = bulkTransactionsResponse?.data?.batches || [];
  const columns = BULK_TRANSACTIONS_COLUMN;
  const PAGINATION = {
    page: filters.page,
    limit: filters.limit,
    ...bulkTransactionsResponse?.data?.pagination, // PAGINATION DETAILS FROM SERVER
  };

  // DEFINE FILTERABLE COLUMNS
  const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column?.uid);

  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<
    Set<string> | 'all'
  >(new Set(INITIAL_VISIBLE_COLUMNS));

  const [serviceProtocolFilter, setServiceProtocolFilter] =
    React.useState('all');

  const [rowsPerPage, setRowsPerPage] = React.useState(filters.limit || 10);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'amount',
    direction: 'ascending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRows = [...rows];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          row?.batch_name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
          row?.amount?.toLowerCase().includes(filterValue?.toLowerCase()),
      );
    }
    if (
      serviceProtocolFilter !== 'all' &&
      Array.from(serviceProtocolFilter).length !== SERVICE_FILTERS.length
    ) {
      const filters = Array.from(serviceProtocolFilter);

      filteredRows = filteredRows.filter((row) =>
        filters.includes(row?.service),
      );
    }

    return filteredRows;
  }, [rows, filterValue, serviceProtocolFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

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

  const renderCell = React.useCallback((row: any, columnKey: string | Key) => {
    const cellValue = row[String(columnKey)];

    switch (columnKey) {
      case 'created_at':
        return (
          <span className={cn('text-nowrap capitalize')}>
            {format(cellValue, 'dd-MMM-yyyy hh:mm:ss a')}
          </span>
        );

      case 'updated_at':
        return (
          <span className={cn('text-nowrap capitalize')}>
            {format(cellValue, 'dd-MMM-yyyy hh:mm:ss a')}
          </span>
        );

      case 'batch_name':
        return (
          <span className={cn('text-nowrap font-medium capitalize')}>
            {cellValue}
          </span>
        );

      case 'service':
        return (
          <span className={cn('text-nowrap capitalize')}>{cellValue}</span>
        );

      case 'status':
        return (
          <Button
            className={cn(
              'h-max min-h-max cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white',
              TRANSACTION_STATUS_COLOR_MAP[
                row.status as keyof typeof TRANSACTION_STATUS_COLOR_MAP
              ],
            )}
            size="sm"
            variant="light"
            onPress={() => {
              setSelectedBatch(row);
              setOpenBatchDetailsModal(true);
            }}
          >
            {cellValue}
          </Button>
        );

      case 'actions':
        return (
          <Button
            isIconOnly
            className={'max-w-fit p-2'}
            startContent={<ComputerDesktopIcon className="h-6 w-5 mr-2" />}
            variant="light"
            onPress={() => {
              setSelectedBatch(row);
              setOpenBatchDetailsModal(true);
            }}
          >
            View
          </Button>
        );

      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      updateFilters({ limit: parseInt(e.target.value), page: 1 });
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
      updateFilters({ page: 1, limit: rowsPerPage });
    } else {
      setFilterValue('');
    }
  }, []);

  const loadingContent = React.useMemo(() => {
    return (
      <div className="mt-24 flex flex-1 items-center rounded-lg">
        <Loader
          classNames={{
            wrapper: 'bg-foreground-200/50 rounded-xl mt-8 h-full',
          }}
          size={100}
        />
      </div>
    );
  }, [isLoading]);

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-600 dark:bg-foreground/5">
        <EmptyLogs
          className={'my-auto mt-16'}
          classNames={{ heading: 'text-sm text-foreground/50 font-medium' }}
          subTitle={''}
          title={'No transaction data records!'}
        />
      </div>
    );
  }, [rows]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full items-center justify-between">
        <span className="text-small text-foreground-400">
          Total: {hasSearchFilter ? items.length : PAGINATION?.total || 0}{' '}
          transactions
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={PAGINATION?.page || page}
          total={PAGINATION?.total_pages || pages || 1}
          onChange={(page: any) => {
            if (!handlePageChange) {
              setPage(Number(page));
            } else {
              handlePageChange(page);
              setPage(Number(page));
            }
          }}
        />
        <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-foreground-400">
          Rows per page:{' '}
          <SelectField
            size="sm"
            className="h-8 min-w-fit bg-transparent text-sm text-foreground-400 outline-none"
            defaultValue={10}
            options={['5', '10', '15', '20']}
            placeholder={rowsPerPage.toString()}
            onChange={onRowsPerPageChange}
          />
        </label>
      </div>
    );
  }, [rows, pages]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Search
            placeholder="Search by name..."
            value={filterValue}
            onChange={(v) => onSearchChange(v)}
          />
          <div className="relative flex items-center gap-3">
            <SingleSelectionDropdown
              buttonVariant="flat"
              className={'hidden min-w-[160px] md:flex'}
              classNames={{
                trigger: 'hidden lg:flex',
              }}
              closeOnSelect={false}
              disallowEmptySelection={true}
              dropdownItems={SERVICE_FILTERS}
              name={'Type'}
              selectedKeys={serviceProtocolFilter}
              selectionMode="multiple"
              onSelectionChange={setServiceProtocolFilter}
            />
            <SingleSelectionDropdown
              buttonVariant="flat"
              className={'hidden min-w-[160px] lg:flex'}
              classNames={{
                trigger: 'hidden lg:flex',
              }}
              closeOnSelect={false}
              disallowEmptySelection={true}
              dropdownItems={columns}
              name={'Columns'}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              setSelectedKeys={setSelectedKeys}
              onSelectionChange={setVisibleColumns}
            />

            {permissions?.can_initiate && (
              <Button
                as={Link} // BY PASS VOUCHER
                color="primary"
                href={`/dashboard/${workspaceID}/disbursements/create/direct?protocol=direct`}
                endContent={<PlusIcon className="h-5 w-5" />}
                // onPress={() => setOpenPaymentsModal(true)}
              >
                New Batch
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    serviceProtocolFilter,
    visibleColumns,
    permissions,
    onRowsPerPageChange,
    rows.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  return (
    <Table
      isHeaderSticky
      isStriped
      removeWrapper
      aria-label="Transactions table with custom cells"
      bottomContent={bottomContent}
      classNames={{
        table: cn(
          'align-top min-h-[400px] w-full overflow-scroll items-center justify-center',
        ),
        base: cn('overflow-x-auto', { '': pages <= 1 }),
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor as any}
      topContent={topContent}
      onSelectionChange={setSelectedKeys as any}
      onSortChange={setSortDescriptor as any}
    >
      <TableHeader className="fixed w-full" columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              column.uid === 'actions' || column.uid === 'status'
                ? 'center'
                : 'start'
            }
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        // align="top"
        emptyContent={emptyContent}
        isLoading={isLoading}
        items={isLoading ? [] : sortedItems}
        loadingContent={loadingContent}
      >
        {(item) => (
          <TableRow
            key={item?.id || item}
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
