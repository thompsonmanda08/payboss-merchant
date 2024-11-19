import React, { useCallback, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Avatar,
  useDisclosure,
  Pagination,
} from "@nextui-org/react";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { cn, getUserInitials, notify } from "@/lib/utils";
import useWorkspaceStore from "@/context/workspaces-store";
import PromptModal from "@/components/base/Prompt";
import { useQueryClient } from "@tanstack/react-query";
import {
  rowsPerPageOptions,
  WORKSPACE_MEMBERS_QUERY_KEY,
} from "@/lib/constants";
import Loader from "@/components/ui/loader";
import EmptyLogs from "@/components/base/EmptyLogs";
import { usePathname } from "next/navigation";
import SelectField from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { SingleSelectionDropdown } from "@/components/ui/dropdown-button";
import Search from "@/components/ui/search";
import CreateNewUserModal from "../users/CreateNewUserModal";

const ACCOUNT_ROLES = [
  {
    name: "Owner",
    uid: "owner",
  },
  {
    name: "Admin",
    uid: "admin",
  },
  {
    name: "Viewer",
    uid: "viewer",
  },
];

const WORKSPACE_ROLES = [
  {
    name: "Admin",
    uid: "admin",
  },
  {
    name: "Approver",
    uid: "approver",
  },
  {
    name: "Initiator",
    uid: "initiator",
  },
  {
    name: "Viewer",
    uid: "viewer",
  },
];

export const roleColorMap = {
  owner: "success",
  admin: "primary",
  approver: "secondary",
  initiator: "warning",
  viewer: "default",
};

const columns = [
  { name: "NAME", uid: "first_name", sortable: true },
  { name: "USERNAME/MOBILE NO.", uid: "username", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export default function UsersTable({
  users = [],
  workspaceID,
  removeWrapper,
  isUserAdmin,
  tableLoading,
  rowLimit = 5,
  allowUserCreation,
  isApprovedUser,
  onAddUser,
}) {
  const {
    isLoading,
    isEditingRole,
    setIsLoading,
    setIsEditingRole,
    setSelectedUser,
    selectedUser,
    handleDeleteFromWorkspace,
    handleResetUserPassword,
  } = useWorkspaceStore();

  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: createUserModal,
    onOpen: openCreateUserModal,
    onClose: closeCreateUserModal,
  } = useDisclosure();
  const [openResetPasswordPrompt, setOpenResetPasswordPrompt] = useState(false);
  const isUsersRoute = pathname == "/manage-account/users";

  const ROLE_FILTERS = isUsersRoute ? ACCOUNT_ROLES : WORKSPACE_ROLES;

  // DEFINE FILTERABLE COLUMNS
  const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column?.uid);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [roleFilter, setRoleFilter] = React.useState("all");

  const [rowsPerPage, setRowsPerPage] = React.useState(rowLimit);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "amount",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // GETS USERS ARRAY AND APPLIES FILTERS AND RETURNS A FILTERED ARRAY
  const filteredItems = React.useMemo(() => {
    let filteredrows = [...users];

    if (hasSearchFilter) {
      filteredrows = filteredrows.filter(
        (row) =>
          row?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          row?.first_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          row?.last_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          row?.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
          row?.username?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      roleFilter !== "all" &&
      Array.from(roleFilter).length !== ROLE_FILTERS.length
    ) {
      let filters = Array.from(roleFilter);

      filteredrows = filteredrows.filter((row) => filters.includes(row?.role));
    }

    return filteredrows;
  }, [users, filterValue, roleFilter]);

  const pages = Math.ceil(users?.length / rowsPerPage);

  // ITEMS TO BE DISPLAYED ON THE FIRST RENDER OF THE TABLE
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // ITEMS ARRAY THAT HAS BEEN SORTED
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // MOVE TO THE NEXT PAGE
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  // MOVE TO THE PREV PAGE
  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  // CHANGE THE ROW NUMBER LIMIT
  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  // AHNDLE EXPLICIT SEARCH
  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  // RENDER ACTION BUTTONS
  const renderActionButtons = React.useCallback(
    (user) => {
      if (isUserAdmin) {
        return (
          <div className="relative flex items-center justify-center gap-4">
            {/* EDIT USER ROLE */}
            {!isUsersRoute && (
              <Tooltip color="default" content="Edit user">
                <span
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditingRole(true);
                  }}
                  className="cursor-pointer text-lg text-primary active:opacity-50"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </span>
              </Tooltip>
            )}

            {/* RESET USER PASSOWRD BY ACCOUNT ADMIN */}
            {isUsersRoute && (
              <Tooltip
                color="secondary"
                content="Reset User Password"
                classNames={{
                  base: "text-white",
                  content: "bg-secondary text-white",
                }}
              >
                <span
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenResetPasswordPrompt(true);
                  }}
                  className="cursor-pointer text-lg font-bold text-orange-600 active:opacity-50"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </span>
              </Tooltip>
            )}

            {/* DELETE USER BY ACCOUNT ADMIN OR REMOVE USER FROM WORKSPACE */}
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  setSelectedUser(user);
                  onOpen();
                }}
                className="cursor-pointer text-lg text-danger active:opacity-50"
              >
                <TrashIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </div>
        );
      }

      return <span className="text-default">No Action</span>;
    },
    [isUserAdmin]
  );

  // TABLE CELL RENDERER
  const renderCell = React.useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "first_name":
          return (
            <UserAvatarComponent
              key={cellValue}
              firstName={user?.first_name}
              lastName={user?.last_name}
              email={user?.email}
              size="sm"
              className="rounded-md"
              src={user?.image}
              isBordered
              radius="md"
            />
          );
        case "username":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm !lowercase">{cellValue}</p>
              <code className="text-bold text-sm text-slate-600">
                {user?.phone_number}
              </code>
            </div>
          );
        case "workspace":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "role":
          return (
            <Chip
              className="capitalize"
              color={roleColorMap[user?.role.toLowerCase()]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return renderActionButtons(user);

        default:
          return cellValue;
      }
    },
    [isUsersRoute]
  );

  async function resetUserPassword() {
    const response = await handleResetUserPassword();
    if (response) {
      onClose();
      setOpenResetPasswordPrompt(false);
      setIsLoading(false);
    }

    setIsLoading(false);
  }

  async function handleRemoveUser() {
    // TO REMOVE A USER FROM THE MERCHANT ACCOUNT AND ALL WORKSPACES
    if (isUsersRoute) {
      notify("error", "You can't delete a user, contact support!");
      setIsLoading(false);
      return;
    }

    // The last person cannot be removed from the workspace
    if (users.length == 1) {
      notify("error", "Workspace cannot be empty!");
      setIsLoading(false);
      return;
    }

    // BY DEFFAULT ONLY REMOVE USER FROM WORKSPACE
    const response = await handleDeleteFromWorkspace();
    if (response) {
      queryClient.invalidateQueries({
        queryKey: [WORKSPACE_MEMBERS_QUERY_KEY, workspaceID],
      });
      onClose();
      setIsLoading(false);
    }
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Search
            placeholder="Search by name..."
            value={filterValue}
            // onClear={() => onClear()}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="relative flex gap-3">
            <SingleSelectionDropdown
              name={"Role"}
              className={"min-w-[160px]"}
              disallowEmptySelection={true}
              closeOnSelect={false}
              buttonVariant="flat"
              selectionMode="multiple"
              selectedKeys={roleFilter}
              dropdownItems={ROLE_FILTERS}
              onSelectionChange={setRoleFilter}
            />
            <SingleSelectionDropdown
              name={"Columns"}
              className={"min-w-[160px]"}
              closeOnSelect={false}
              buttonVariant="flat"
              selectionMode="multiple"
              disallowEmptySelection={true}
              onSelectionChange={setVisibleColumns}
              dropdownItems={columns}
              selectedKeys={visibleColumns}
              setSelectedKeys={setSelectedKeys}
            />

            {allowUserCreation && isApprovedUser && isUsersRoute && (
              <Button
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                onPress={openCreateUserModal}
              >
                Create New User
              </Button>
            )}
            {isUserAdmin && !isUsersRoute && (
              <Button
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                onPress={onAddUser}
              >
                Add Workspace Members
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total: {users.length} Users
          </span>
          <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-slate-400">
            Rows per page:{" "}
            <SelectField
              className="-mb-1 h-8 min-w-max bg-transparent text-sm text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
              placeholder={rowsPerPage.toString()}
              options={rowsPerPageOptions}
              defaultValue={8}
            />
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    roleFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full items-center justify-between px-2 py-2">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${users.length} selected`}
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

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 dark:bg-foreground/5 text-sm font-semibold text-slate-600">
        <EmptyLogs
          className={"my-auto mt-16"}
          classNames={{ heading: "text-sm text-foreground/50 font-medium" }}
          title={"No users to display."}
          subTitle={"you have no users to be displayed here."}
        />
      </div>
    );
  }, [items]);

  const loadingContent = React.useMemo(() => {
    return (
      <div className="mt-32 flex flex-1 items-center rounded-lg">
        <Loader
          size={100}
          classNames={{ wrapper: "bg-foreground-200/50 rounded-xl h-full" }}
        />
      </div>
    );
  }, [tableLoading]);

  return (
    <>
      <Table
        aria-label="Users table with custom cells"
        className="max-h-[980px] "
        classNames={{
          table: cn("align-top items-center justify-center", {}),
        }}
        removeWrapper={removeWrapper}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        bottomContent={bottomContent}
        onSortChange={setSortDescriptor}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        isStriped
        isHeaderSticky
        bottomContentPlacement="outside"
      >
        <TableHeader columns={headerColumns} className="fixed">
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              align={
                column.uid === "actions" || column.uid === "status"
                  ? "center"
                  : "start"
              }
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={tableLoading}
          loadingContent={loadingContent}
          emptyContent={emptyContent}
          items={tableLoading ? [] : sortedItems}
        >
          {(item) => (
            <TableRow key={item?.ID}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* MODALS */}
      <PromptModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setSelectedUser(null);
        }}
        title="Remove Workspace User"
        onConfirm={handleRemoveUser}
        confirmText="Remove"
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 text-sm leading-6 text-foreground/70">
          Are you sure you want to remove{" "}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}
          </code>{" "}
          from this {isUsersRoute ? "account" : "workspace"}.
        </p>
      </PromptModal>

      {/* PROMPT TO RESET USER PASSWORD */}
      <PromptModal
        isOpen={openResetPasswordPrompt}
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setOpenResetPasswordPrompt(false);
        }}
        title="Reset User Password"
        onConfirm={resetUserPassword}
        confirmText="Reset"
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 text-sm leading-5 text-foreground/70">
          Are you sure you want to reset{" "}
          <code className="rounded-md bg-primary/10 p-0.5 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}&apos;s
          </code>{" "}
          password? <br /> An email will be sent with the new default password.
        </p>
      </PromptModal>

      {/* CREATE  A NEW USER  */}
      <CreateNewUserModal
        isOpen={isEditingRole || createUserModal}
        onClose={closeCreateUserModal}
      />
    </>
  );
}

export function UserAvatarComponent({
  firstName,
  lastName,
  src,
  email,
  classNames,
  handleOnSelect,

  ...props
}) {
  const { wrapper, avatar } = classNames || "";
  return (
    <div
      className={cn(
        "flex max-w-max cursor-pointer items-center justify-start gap-4 transition-all duration-200 ease-in-out",
        wrapper
      )}
      onClick={(e) => {
        e.stopPropagation();
        handleOnSelect && handleOnSelect();
      }}
    >
      {src ? (
        <Avatar
          className={cn("h-9 w-9 flex-none rounded-xl bg-gray-50", avatar)}
          src={src}
          alt={`Image - ${firstName} ${lastName}`}
          width={200}
          height={200}
          {...props}
        />
      ) : (
        <div className="text-md grid h-9 w-9 flex-none scale-90 place-items-center items-center justify-center rounded-xl bg-primary-700 font-medium uppercase text-white ring-2 ring-primary  ring-offset-1">
          {getUserInitials(`${firstName} ${lastName}`)}
        </div>
      )}
      <div className="flex min-w-[120px] flex-col items-start">
        <p
          className={cn(
            "text-base font-semibold leading-6 text-foreground/80",
            {}
          )}
        >{`${firstName} ${lastName}`}</p>
        <p className={cn("text-[11px] font-medium text-foreground/50", {})}>
          {email}
        </p>
      </div>
    </div>
  );
}
