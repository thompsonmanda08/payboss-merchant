import React, { Key } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import { ComputerDesktopIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { TRANSACTION_STATUS_COLOR_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import usePaymentsStore from "@/context/payment-store";
import Loader from "@/components/ui/loader";
import Search from "@/components/ui/search";
import { SingleSelectionDropdown } from "@/components/ui/dropdown-button";
import SelectField from "@/components/ui/select-field";
import { useBulkTransactions, useWorkspaceInit } from "@/hooks/use-query-data";
import EmptyLogs from "@/components/base/empty-logs";
import { BULK_TRANSACTIONS_COLUMN, ColumnType } from "@/lib/table-columns";
import Link from "next/link";

// DEFINE FILTERABLE SERVICES
const SERVICE_FILTERS = [
  {
    name: "direct bulk disbursement",
    uid: "direct bulk disbursement",
  },

  {
    name: "voucher bulk disbursement",
    uid: "voucher bulk disbursement",
  },
];

export default function BulkTransactionsTable({
  workspaceID,
}: {
  workspaceID: string;
}) {
  // DATA FETCHING
  const { data: bulkTransactionsResponse, isLoading } =
    useBulkTransactions(workspaceID);

  const rows = bulkTransactionsResponse?.data?.batches || [];

  const columns = BULK_TRANSACTIONS_COLUMN;
  const { setSelectedBatch, setOpenBatchDetailsModal, setOpenPaymentsModal } =
    usePaymentsStore();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  // DEFINE FILTERABLE COLUMNS
  const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column?.uid);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<
    Set<string> | "all"
  >(new Set(INITIAL_VISIBLE_COLUMNS));

  const [serviceProtocolFilter, setServiceProtocolFilter] =
    React.useState("all");

  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "amount",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

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
      serviceProtocolFilter !== "all" &&
      Array.from(serviceProtocolFilter).length !== SERVICE_FILTERS.length
    ) {
      let filters = Array.from(serviceProtocolFilter);

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

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((row: any, columnKey: string | Key) => {
    const cellValue = row[String(columnKey)];

    switch (columnKey) {
      case "created_at":
        return (
          <span className={cn("text-nowrap capitalize")}>
            {format(cellValue, "dd-MMM-yyyy hh:mm:ss a")}
          </span>
        );
      case "updated_at":
        return (
          <span className={cn("text-nowrap capitalize")}>
            {format(cellValue, "dd-MMM-yyyy hh:mm:ss a")}
          </span>
        );
      case "batch_name":
        return (
          <span className={cn("text-nowrap font-medium capitalize")}>
            {cellValue}
          </span>
        );
      case "service":
        return (
          <span className={cn("text-nowrap capitalize")}>{cellValue}</span>
        );
      case "status":
        return (
          <Button
            className={cn(
              "h-max min-h-max cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white",
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
      case "actions":
        return (
          <Button
            isIconOnly
            className={"max-w-fit p-2"}
            variant="light"
            onPress={() => {
              setSelectedBatch(row);
              setOpenBatchDetailsModal(true);
            }}
            startContent={<ComputerDesktopIcon className="h-6 w-5 mr-2" />}
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
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const loadingContent = React.useMemo(() => {
    return (
      <div className="mt-24 flex flex-1 items-center rounded-lg">
        <Loader
          classNames={{
            wrapper: "bg-foreground-200/50 rounded-xl mt-8 h-full",
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
          className={"my-auto mt-16"}
          classNames={{ heading: "text-sm text-foreground/50 font-medium" }}
          subTitle={""}
          title={"No transaction data records!"}
        />
      </div>
    );
  }, [rows]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-center px-2 py-2">
        {pages > 1 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        )}
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
              className={"hidden min-w-[160px] md:flex"}
              classNames={{
                trigger: "hidden lg:flex",
              }}
              closeOnSelect={false}
              disallowEmptySelection={true}
              dropdownItems={SERVICE_FILTERS}
              name={"Type"}
              selectedKeys={serviceProtocolFilter}
              selectionMode="multiple"
              onSelectionChange={setServiceProtocolFilter}
            />
            <SingleSelectionDropdown
              buttonVariant="flat"
              className={"hidden min-w-[160px] lg:flex"}
              classNames={{
                trigger: "hidden lg:flex",
              }}
              closeOnSelect={false}
              disallowEmptySelection={true}
              dropdownItems={columns}
              name={"Columns"}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              setSelectedKeys={setSelectedKeys}
              onSelectionChange={setVisibleColumns}
            />

            {permissions?.can_initiate && (
              <Button
                as={Link} // BY PASS VOUCHER
                href={`/dashboard/${workspaceID}/payments/create/direct?protocol=direct`}
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                // onPress={() => setOpenPaymentsModal(true)}
              >
                New Batch
              </Button>
            )}
          </div>
        </div>
        <div className="hidden items-center justify-between md:flex">
          <span className="text-small text-default-400">
            Total: {rows.length} transactions
          </span>
          <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-slate-400">
            Rows per page:{" "}
            <SelectField
              className="-mb-1 h-8 min-w-max bg-transparent text-sm text-default-400 outline-none"
              defaultValue={8}
              options={["5", "8", "10", "20"]}
              placeholder={rowsPerPage.toString()}
              onChange={onRowsPerPageChange}
            />
          </label>
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
      classNames={{
        table: cn(
          "align-top min-h-[300px] w-full overflow-scroll items-center justify-center",
        ),
        base: cn("overflow-x-auto", { "": pages <= 1 }),
      }}
      isStriped
      removeWrapper
      aria-label="Transactions table with custom cells"
      bottomContent={bottomContent}
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
              column.uid === "actions" || column.uid === "status"
                ? "center"
                : "start"
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
