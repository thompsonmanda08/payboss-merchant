import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Tooltip,
} from "@heroui/react";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
  SERVICE_PROVIDER_COLOR_MAP,
  TRANSACTION_STATUS_COLOR_MAP,
} from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import usePaymentsStore from "@/context/payment-store";
import Loader from "@/components/ui/loader";
import Search from "@/components/ui/search";
import { SingleSelectionDropdown } from "@/components/ui/dropdown-button";
import SelectField from "@/components/ui/select-field";
import { useSingleTransactions, useWorkspaceInit } from "@/hooks/useQueryHooks";
import EmptyLogs from "@/components/base/empty-logs";
import { SINGLE_TRANSACTIONS_COLUMNS } from "@/lib/table-columns";
import { convertSingleTransactionToCSV } from "@/app/_actions/file-conversion-actions";
import { useDebounce } from "@/hooks/use-debounce";

// DEFINE FILTERABLE SERVICES
const SERVICE_FILTERS = [
  {
    name: "direct disbursement",
    uid: "direct disbursement",
  },
  {
    name: "voucher disbursement",
    uid: "voucher disbursement",
  },
];

export default function SingleTransactionsTable({
  workspaceID,
  onRowAction,
  rowData,
  columnData,
  removeWrapper,
}) {
  const { data: transactionsResponse, isLoading } =
    useSingleTransactions(workspaceID);

  // DEFINE FILTERABLE ROWS AND COLUMNS
  const columns = columnData || SINGLE_TRANSACTIONS_COLUMNS;
  const rows = rowData || transactionsResponse?.data?.data || [];

  const {
    setTransactionDetails,
    setOpenTransactionDetailsModal,
    setOpenPaymentsModal,
  } = usePaymentsStore();

  const { data: initialization } = useWorkspaceInit(workspaceID);
  const permissions = initialization?.data?.workspacePermissions;

  const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column?.uid);

  const [filterValue, setFilterValue] = React.useState("");
  const debouncedSearchQuery = useDebounce(filterValue, 500);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [serviceProtocolFilter, setServiceProtocolFilter] =
    React.useState("all");

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "amount",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(debouncedSearchQuery);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRows = [...rows];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          row?.first_name
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.last_name
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.nrc
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.destination
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.mno_rrn
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.amount
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase())
      );
    }

    if (
      serviceProtocolFilter !== "all" &&
      Array.from(serviceProtocolFilter).length !== SERVICE_FILTERS.length
    ) {
      filteredRows = filteredRows.filter((row) =>
        Array.from(serviceProtocolFilter).includes(row?.service)
      );
    }

    return filteredRows;
  }, [rows, debouncedSearchQuery, serviceProtocolFilter]);

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

  const renderCell = React.useCallback((row, columnKey) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "created_at":
        return (
          <span className={cn("text-nowrap capitalize")}>
            {formatDate(cellValue).replaceAll("-", " ")}
          </span>
        );
      case "updated_at":
        return (
          <span className={cn("text-nowrap capitalize")}>
            {formatDate(cellValue).replaceAll("-", " ")}
          </span>
        );

      case "amount":
        return (
          <span className={cn("text-nowrap font-medium capitalize")}>
            {formatCurrency(cellValue)}
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
              TRANSACTION_STATUS_COLOR_MAP[row.status]
            )}
            size="sm"
            variant="light"
            onPress={() => {
              setTransactionDetails(row);
              setOpenTransactionDetailsModal(true);
            }}
          >
            {cellValue}
          </Button>
        );
      case "service_provider":
        return (
          <Tooltip
            closeDelay={500}
            color="default"
            content={row?.remarks}
            delay={500}
            placement="right"
            showArrow={true}
          >
            <Chip
              className={cn(
                "mx-auto self-center capitalize",
                SERVICE_PROVIDER_COLOR_MAP[row?.service_provider?.toLowerCase()]
              )}
              classNames={{
                content: "font-semibold",
              }}
              color="primary"
              variant="flat"
            >
              {cellValue}
            </Chip>
          </Tooltip>
        );
      // case 'actions':
      //   return (
      //     <Button
      //       variant="light"
      //       className={'max-w-fit p-2'}
      //       isIconOnly
      //       onPress={() => {
      //         setTransactionDetails(row)
      //         setOpenTransactionDetailsModal(true)
      //       }}
      //     >
      //       <EyeIcon className="h-6 w-5" />
      //     </Button>
      //   )

      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
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
      <div className="flex w-full items-center justify-between px-2 py-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
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
        </div>
      </div>
    );
  }, [items.length, page, pages]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Search
            // TODO => Implement Clear button on input
            isClearable={true}
            placeholder="Search by name..."
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="relative flex gap-3">
            <SingleSelectionDropdown
              buttonVariant="flat"
              className={"min-w-[160px]"}
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
              className={"min-w-[160px]"}
              closeOnSelect={false}
              disallowEmptySelection={true}
              dropdownItems={columns}
              name={"Columns"}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              setSelectedKeys={setSelectedKeys}
              onSelectionChange={setVisibleColumns}
            />

            <Button
              onPress={() =>
                convertSingleTransactionToCSV({
                  objArray: rows,
                })
              }
            >
              <ArrowDownTrayIcon className="h-5 w-5" /> Export
            </Button>

            {permissions?.can_initiate && (
              <Button
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                onPress={() => setOpenPaymentsModal(true)}
              >
                Create New
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
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
    onRowsPerPageChange,
    rows.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  return (
    <Table
      isHeaderSticky
      isStriped
      aria-label="Transactions table with custom cells"
      bottomContent={bottomContent}
      className="max-h-[780px]"
      classNames={{
        table: cn("align-top min-h-[300px] items-center justify-center", {
          "min-h-max": pages <= 1,
          "min-h-[300px]": isLoading || !rows,
        }),
        // wrapper: cn('min-h-max', { 'min-h-max': pages <= 1 }),
      }}
      removeWrapper={removeWrapper}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      onRowAction={
        onRowAction ? (key, value) => onRowAction(key, value) : undefined
      }
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader className="fixed" columns={headerColumns}>
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
        align="top"
        emptyContent={emptyContent}
        isLoading={isLoading}
        items={isLoading ? [] : sortedItems}
        loadingContent={loadingContent}
      >
        {(item) => (
          <TableRow
            key={item?.ID || item?.key }
            // className="hover:bg-primary-50"
            align="top"
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
