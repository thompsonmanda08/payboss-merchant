import {
  RotateCcw as ArrowPathIcon,
  Lock as LockClosedIcon,
  Unlock as LockOpenIcon,
  PenSquare as PencilSquareIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
} from 'lucide-react';
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
  addToast,
  AvatarProps,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import CreateOrUpdateUser from '@/app/manage-account/users/components/new-user-modal';
import EmptyLogs from '@/components/base/empty-logs';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { SingleSelectionDropdown } from '@/components/ui/dropdown-button';
import Loader from '@/components/ui/loader';
import Search from '@/components/ui/search';
import SelectField from '@/components/ui/select-field';
import useWorkspaceStore from '@/context/workspaces-store';
import useKYCInfo from '@/hooks/use-kyc-info';
import { QUERY_KEYS, rowsPerPageOptions } from '@/lib/constants';
import { cn, getUserInitials } from '@/lib/utils';

import type { Key } from '@react-types/shared';

const ACCOUNT_ROLES = [
  {
    name: 'Owner',
    uid: 'owner',
  },
  {
    name: 'Admin',
    uid: 'admin',
  },
  {
    name: 'Viewer',
    uid: 'viewer',
  },
];

const WORKSPACE_ROLES = [
  {
    name: 'Admin',
    uid: 'admin',
  },
  {
    name: 'Approver',
    uid: 'approver',
  },
  {
    name: 'Initiator',
    uid: 'initiator',
  },
  {
    name: 'Viewer',
    uid: 'viewer',
  },
];

export const roleColorMap = {
  owner: 'success',
  admin: 'primary',
  approver: 'secondary',
  initiator: 'warning',
  viewer: 'default',
};

const columns = [
  { name: 'NAME', uid: 'first_name', sortable: true },
  { name: 'USERNAME/MOBILE NO.', uid: 'username', sortable: true },
  { name: 'ROLE', uid: 'role', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function UsersTable({
  users = [],
  workspaceID,
  removeWrapper,
  tableLoading,
  rowLimit = 10,
  onAddUser,
  permissions = {},
  workspaceRoles,
  systemRoles,
  roles = undefined, // BY DEFAULT ==> SUPPLIED TO OVERRIDE THE GET ROLES FUNCTION,
}: any) {
  const {
    isLoading,
    isEditingUser,
    setIsLoading,
    setIsEditingUser,
    setSelectedUser,
    selectedUser,
    handleDeleteFromWorkspace,
    handleDeleteFromAccount,
    handleResetUserPassword,
    handleUnlockSystemUser,
  } = useWorkspaceStore();

  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isApprovedUser } = useKYCInfo();
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [openUnlockUserPrompt, setOpenUnlockUserPrompt] = useState(false);
  const [openResetPasswordPrompt, setOpenResetPasswordPrompt] = useState(false);

  const isUsersRoute = pathname == '/manage-account/users';

  const ROLE_FILTERS = isUsersRoute ? ACCOUNT_ROLES : WORKSPACE_ROLES;

  const getRoles = () => {
    // EDITING USER FROM WORKSPACE
    if (!isUsersRoute && isEditingUser) {
      return workspaceRoles;
    }

    return systemRoles;
  };

  // DEFINE FILTERABLE COLUMNS
  const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column?.uid);

  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [roleFilter, setRoleFilter] = React.useState('all');

  const [rowsPerPage, setRowsPerPage] = React.useState(rowLimit);

  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: Key;
    direction: 'ascending' | 'descending';
  }>({
    column: 'amount',
    direction: 'ascending',
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    // if (visibleColumns === "all") return columns;
    if (visibleColumns.size === columns.length) return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  // GETS USERS ARRAY AND APPLIES FILTERS AND RETURNS A FILTERED ARRAY
  const filteredItems = React.useMemo(() => {
    let filteredRows = [...users];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          row?.name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
          row?.first_name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
          row?.last_name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
          row?.email?.toLowerCase().includes(filterValue?.toLowerCase()) ||
          row?.username?.toLowerCase().includes(filterValue?.toLowerCase()),
      );
    }

    if (
      roleFilter !== 'all' &&
      Array.from(roleFilter).length !== ROLE_FILTERS.length
    ) {
      const filters = Array.from(roleFilter);

      filteredRows = filteredRows.filter((row) => filters.includes(row?.role));
    }

    return filteredRows;
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
      const columnKey = sortDescriptor.column as string;
      const first = a[columnKey];
      const second = b[columnKey];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
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
  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  // HANDLE EXPLICIT SEARCH
  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  // RENDER ACTION BUTTONS
  const renderActionButtons = React.useCallback(
    (user: any) => {
      if (permissions?.edit || permissions?.create) {
        return (
          <div className="relative flex items-center justify-center gap-4">
            {/* EDIT USER ROLE */}
            <Tooltip color="default" content="Edit user">
              <span
                className="cursor-pointer text-lg text-primary active:opacity-50"
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditingUser(true);
                }}
              >
                <PencilSquareIcon className="h-5 w-5" />
              </span>
            </Tooltip>

            {/* RESET USER PASSWORD BY ACCOUNT ADMIN */}
            {isUsersRoute && (
              <>
                {user?.isLockedOut && (
                  <Tooltip color="default" content="Unlock User">
                    <span
                      className="cursor-pointer text-lg font-bold text-green-600 active:opacity-50"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenUnlockUserPrompt(true);
                      }}
                    >
                      <LockOpenIcon className="h-5 w-5" />
                    </span>
                  </Tooltip>
                )}
                <Tooltip
                  classNames={{
                    base: 'text-white',
                    content: 'bg-secondary text-white',
                  }}
                  color="secondary"
                  content="Reset User Password"
                >
                  <span
                    className="cursor-pointer text-lg font-bold text-orange-600 active:opacity-50"
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenResetPasswordPrompt(true);
                    }}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </span>
                </Tooltip>
              </>
            )}

            {/* DELETE USER BY ACCOUNT ADMIN OR REMOVE USER FROM WORKSPACE */}
            <Tooltip color="danger" content="Delete user">
              <span
                className="cursor-pointer text-lg text-danger active:opacity-50"
                onClick={() => {
                  setSelectedUser(user);
                  onOpen();
                }}
              >
                <TrashIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </div>
        );
      }

      return (
        <Tooltip color="default" content="If you are an admin, try reloading!">
          <span className="text-default">No Action</span>;
        </Tooltip>
      );
    },
    [permissions?.edit, permissions?.create, isUsersRoute],
  );

  // TABLE CELL RENDERER
  const renderCell = React.useCallback(
    (user: any, columnKey: Key) => {
      const cellValue = user[String(columnKey)];

      switch (columnKey) {
        case 'first_name':
          return (
            <UserAvatarComponent
              key={cellValue}
              isBordered
              className="rounded-md"
              email={
                <span className="flex items-center gap-1">
                  {user?.email}{' '}
                  {user?.isLockedOut && (
                    <LockClosedIcon className="h-3 w-3 text-primary" />
                  )}
                </span>
              }
              firstName={user?.first_name}
              lastName={user?.last_name}
              radius="md"
              size="sm"
              src={user?.image}
            />
          );

        case 'username':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm !lowercase">{cellValue}</p>
              <code className="text-bold text-sm text-slate-600">
                {user?.phone_number}
              </code>
            </div>
          );

        case 'workspace':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );

        case 'role':
          return (
            <Chip
              className="capitalize"
              color={
                roleColorMap[
                  user?.role?.toLowerCase() as keyof typeof roleColorMap
                ] as any
              }
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );

        case 'actions':
          return renderActionButtons(user);

        default:
          return cellValue;
      }
    },
    [isUsersRoute],
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
      // ONLY OWNER CAN NOT BE REMOVED FROM ACCOUNT
      if (selectedUser?.role == 'owner') {
        addToast({
          title: 'Error',
          color: 'danger',
          description: 'Owner cannot be removed!',
        });
        setIsLoading(false);

        return;
      }

      const response = await handleDeleteFromAccount();

      if (response) {
        onClose();
        setIsLoading(false);

        return;
      }

      // RETURN AFTER DELETING USER FROM ACCOUNT
      return;
    }

    // The last person cannot be removed from the workspace
    if (users.length == 1) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Workspace cannot be empty!',
      });
      setIsLoading(false);

      return;
    }

    // BY DEFAULT ONLY REMOVE USER FROM WORKSPACE
    const response = await handleDeleteFromWorkspace(workspaceID);

    if (response) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACE_MEMBERS, workspaceID],
      });
      onClose();
    }
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Search
            placeholder="Search by name..."
            value={filterValue}
            onChange={(v) => onSearchChange(v)}
          />
          <div className="relative flex gap-3">
            <SingleSelectionDropdown
              buttonVariant="flat"
              className={'min-w-[160px]'}
              closeOnSelect={false}
              disallowEmptySelection={true}
              dropdownItems={ROLE_FILTERS}
              name={'Role'}
              selectedKeys={roleFilter}
              selectionMode="multiple"
              onSelectionChange={setRoleFilter}
            />
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

            {permissions?.create && isApprovedUser && isUsersRoute && (
              <Button
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                onPress={() => {
                  onOpen();
                  setIsCreateUser(true);
                }}
              >
                Create New User
              </Button>
            )}
            {(permissions?.create || permissions?.edit) && !isUsersRoute && (
              <Button
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                onPress={onAddUser}
              >
                Add Members
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total: {users.length} Users
          </span>
          <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-slate-400">
            Rows per page:{' '}
            <SelectField
              className="-mb-1 h-8 min-w-max bg-transparent text-sm text-default-400 outline-none"
              defaultValue={8}
              options={rowsPerPageOptions}
              placeholder={rowsPerPage.toString()}
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            />
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    roleFilter,
    visibleColumns,
    isApprovedUser,
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
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-600 dark:bg-foreground/5">
        <EmptyLogs
          className={'my-auto mt-16'}
          classNames={{ heading: 'text-sm text-foreground/50 font-medium' }}
          subTitle={'you have no users to be displayed here.'}
          title={'No users to display.'}
        />
      </div>
    );
  }, [items]);

  const loadingContent = React.useMemo(() => {
    return (
      <div className="mt-32 flex flex-1 items-center rounded-lg">
        <Loader
          classNames={{ wrapper: 'bg-foreground-200/50 rounded-xl h-full' }}
          size={100}
        />
      </div>
    );
  }, [tableLoading]);

  function handleClosePrompts() {
    onClose();
    setIsCreateUser(false);
    setIsEditingUser(false);
    setSelectedUser(null);
    setOpenUnlockUserPrompt(false);
    setOpenResetPasswordPrompt(false);
  }

  const USER_ROLES = roles || getRoles();

  return (
    <>
      <Table
        isHeaderSticky
        isStriped
        aria-label="Users table with custom cells"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        className="max-h-[980px]"
        classNames={{
          table: cn('align-top items-center justify-center', {}),
        }}
        removeWrapper={removeWrapper}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        onSelectionChange={setSelectedKeys as any}
        onSortChange={setSortDescriptor}
      >
        <TableHeader className="fixed" columns={headerColumns}>
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
          emptyContent={emptyContent}
          isLoading={tableLoading}
          items={tableLoading ? [] : sortedItems}
          loadingContent={loadingContent}
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

      {/* PROMPT TO UNLOCK A LOCKED USER ACCOUNT */}
      <PromptModal
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={openUnlockUserPrompt}
        title="Unlock User Account"
        onClose={handleClosePrompts}
        onConfirm={handleUnlockSystemUser}
        // onOpen={setOpenUnlockUserPrompt}
      >
        <p className="-mt-4 text-sm leading-5 text-foreground/70">
          By unlocking{' '}
          <code className="rounded-md bg-primary/10 p-0.5 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}&apos;s
          </code>{' '}
          account, an email will be sent to {selectedUser?.email} with a new
          password. Are you sure you want to proceed?
        </p>
      </PromptModal>

      {/* PROMPT TO RESET USER PASSWORD */}
      <PromptModal
        confirmText="Reset"
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={openResetPasswordPrompt}
        title="Reset User Password"
        onClose={handleClosePrompts}
        onConfirm={resetUserPassword}
        // onOpen={onOpen}
      >
        <p className="-mt-4 text-sm leading-5 text-foreground/70">
          Are you sure you want to reset{' '}
          <code className="rounded-md bg-primary/10 p-0.5 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}&apos;s
          </code>{' '}
          password? <br /> An email will be sent with the new default password.
        </p>
      </PromptModal>

      {/* PROMPT TO DELETE USER FROM ACCOUNT OR WORKSPACE */}
      <PromptModal
        confirmText="Remove"
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isOpen && selectedUser !== null}
        title={`Remove ${isUsersRoute ? 'Account' : 'Workspace'} User?`}
        onClose={handleClosePrompts}
        onConfirm={handleRemoveUser}
        // onOpen={onOpen}
        className={'max-w-lg'}
      >
        <p className="-mt-4 text-sm leading-6 text-foreground/70">
          You are about to remove{' '}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}
          </code>{' '}
          from this {isUsersRoute ? 'account' : 'workspace'}.?
        </p>
      </PromptModal>

      {/* CREATE  A NEW USER  */}
      <CreateOrUpdateUser
        isOpen={(isEditingUser || isCreateUser) && isOpen}
        isUsersRoute={isUsersRoute}
        roles={USER_ROLES}
        workspaceID={workspaceID}
        onClose={handleClosePrompts}
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
}: AvatarProps & {
  firstName: string;
  lastName: string;
  src?: string;
  email: any;
  classNames?: {
    wrapper?: string;
    avatar?: string;
  };
  handleOnSelect?: () => void;
}) {
  const { wrapper, avatar } = classNames || {};

  return (
    <div
      className={cn(
        'flex max-w-max cursor-pointer items-center justify-start gap-4 transition-all duration-200 ease-in-out',
        wrapper,
      )}
      onClick={(e) => {
        e.stopPropagation();
        handleOnSelect && handleOnSelect();
      }}
    >
      {src ? (
        <Avatar
          alt={`Image - ${firstName} ${lastName}`}
          className={cn('h-9 w-9 flex-none rounded-xl bg-gray-50', avatar)}
          height={200}
          src={src}
          width={200}
          {...props}
        />
      ) : (
        <div className="text-md grid h-9 w-9 flex-none scale-90 place-items-center items-center justify-center rounded-xl bg-primary-700 font-medium uppercase text-white ring-2 ring-primary ring-offset-1">
          {getUserInitials(`${firstName} ${lastName}`)}
        </div>
      )}
      <div className="flex min-w-[120px] flex-col items-start">
        <p
          className={cn(
            'text-base font-semibold leading-6 text-foreground/80',
            {},
          )}
        >{`${firstName} ${lastName}`}</p>
        <p className={cn('text-[11px] font-medium text-foreground/50', {})}>
          {email}
        </p>
      </div>
    </div>
  );
}
