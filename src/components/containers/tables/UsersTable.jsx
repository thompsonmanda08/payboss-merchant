import React, { useState } from 'react'
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
} from '@nextui-org/react'
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

import { cn, getUserInitials } from '@/lib/utils'
import useWorkspaceStore from '@/context/workspaceStore'
import PromptModal from '@/components/base/Prompt'
import { useQueryClient } from '@tanstack/react-query'
import { WORKSPACE_MEMBERS_QUERY_KEY } from '@/lib/constants'
import Loader from '@/components/ui/Loader'
import EmptyLogs from '@/components/base/EmptyLogs'
import { usePathname } from 'next/navigation'

export const roleColorMap = {
  owner: 'success',
  admin: 'primary',
  approver: 'secondary',
  initiator: 'warning',
  viewer: 'default',
}

const columns = [
  { name: 'NAME', uid: 'first_name' },
  { name: 'USERNAME/MOBILE NO.', uid: 'username' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' },
]

export default function UsersTable({
  users = [],
  workspaceID,
  removeWrapper,
  isUserAdmin,
  tableLoading,
  rowsPerPage = 8,
}) {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [openResetPasswordPrompt, setOpenResetPasswordPrompt] = useState(false)
  const isUsersRoute = pathname == '/manage-account/users'

  const {
    isLoading,
    setIsLoading,
    setIsEditingRole,
    setSelectedUser,
    selectedUser,
    handleDeleteFromWorkspace,
    handleResetUserPassword,
  } = useWorkspaceStore()

  const pages = Math.ceil(users?.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return users?.slice(start, end)
  }, [page, users, rowsPerPage])

  function ActionButtons({ user }) {
    return isUserAdmin ? (
      <div className="relative flex items-center justify-center gap-4">
        {!isUsersRoute && (
          <Tooltip color="default" content="Edit user">
            <span
              onClick={() => {
                setSelectedUser(user)
                setIsEditingRole(true)
              }}
              className="cursor-pointer text-lg text-primary active:opacity-50"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </span>
          </Tooltip>
        )}
        {isUsersRoute && (
          <Tooltip
            color="secondary"
            content="Reset User Password"
            classNames={{
              base: 'text-white',
              content: 'bg-secondary text-white',
            }}
          >
            <span
              onClick={() => {
                setSelectedUser(user)
                setOpenResetPasswordPrompt(true)
              }}
              className="cursor-pointer text-lg font-bold text-orange-600 active:opacity-50"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </span>
          </Tooltip>
        )}

        <Tooltip color="danger" content="Delete user">
          <span
            onClick={() => {
              setSelectedUser(user)
              onOpen()
            }}
            className="cursor-pointer text-lg text-danger active:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </span>
        </Tooltip>
      </div>
    ) : (
      <>N/A</>
    )
  }

  // TABLE CELL RENDERER
  const renderCell = React.useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey]

      switch (columnKey) {
        case 'first_name':
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
          )
        case 'username':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm !lowercase">{cellValue}</p>
              <code className="text-bold text-sm text-slate-600">
                {user?.phone_number}
              </code>
            </div>
          )
        case 'workspace':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          )
        case 'role':
          return (
            <Chip
              className="capitalize"
              color={roleColorMap[user?.role.toLowerCase()]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          )
        case 'actions':
          return <ActionButtons user={user} />

        default:
          return cellValue
      }
    },
    [isUsersRoute],
  )

  async function _handleResetUserPassword() {
    const response = await handleResetUserPassword()
    if (response) {
      onClose()
      setOpenResetPasswordPrompt(false)
      setIsLoading(false)
    }

    setIsLoading(false)
  }

  async function _handleDeleteFromWorkspace() {
    const response = await handleDeleteFromWorkspace()
    if (response) {
      queryClient.invalidateQueries({
        queryKey: [WORKSPACE_MEMBERS_QUERY_KEY, workspaceID],
      })
      onClose()
      setIsLoading(false)
    }
  }

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
    )
  }, [items.length, page, pages])

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-600">
        <EmptyLogs
          className={'my-auto mt-16'}
          classNames={{ heading: 'text-sm text-slate-500 font-medium' }}
          title={'No users to display.'}
          subTitle={'you have no users to be displayed here.'}
        />
      </div>
    )
  }, [items])

  const loadingContent = React.useMemo(() => {
    return (
      <div className="-mt-8 flex flex-1 items-center rounded-lg">
        <Loader
          size={100}
          classNames={{ wrapper: 'bg-slate-200/50 rounded-xl h-full' }}
        />
      </div>
    )
  }, [tableLoading])

  return (
    <>
      <Table
        aria-label="Users table with custom cells"
        classNames={{
          table: cn('align-top items-start justify-start', {
            'min-h-[400px]': isLoading || !items,
          }),
          wrapper: cn('min-h-[400px]'),
        }}
        isStriped
        isHeaderSticky
        removeWrapper={removeWrapper}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns} className="fixed">
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={tableLoading}
          loadingContent={loadingContent}
          emptyContent={emptyContent}
          items={items}
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
          onClose()
          setSelectedUser(null)
        }}
        title="Remove Workspace User"
        onConfirm={_handleDeleteFromWorkspace}
        confirmText="Remove"
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 text-sm leading-6 text-slate-700">
          Are you sure you want to remove{' '}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}
          </code>{' '}
          from this {isUsersRoute ? 'account' : 'workspace'}.
        </p>
      </PromptModal>

      <PromptModal
        isOpen={openResetPasswordPrompt}
        onOpen={onOpen}
        onClose={() => {
          onClose()
          setOpenResetPasswordPrompt(false)
        }}
        title="Reset User Password"
        onConfirm={_handleResetUserPassword}
        confirmText="Reset"
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 text-sm leading-5 text-slate-700">
          Are you sure you want to reset{' '}
          <code className="rounded-md bg-primary/10 p-0.5 px-2 font-medium text-primary-700">
            {`${selectedUser?.first_name} ${selectedUser?.last_name}`}&apos;s
          </code>{' '}
          password? <br /> An email will be sent with the new default password.
        </p>
      </PromptModal>
    </>
  )
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
  const { wrapper, avatar } = classNames || ''
  return (
    <div
      className={cn(
        'flex max-w-max cursor-pointer items-center justify-start gap-4 transition-all duration-200 ease-in-out',
        wrapper,
      )}
      onClick={(e) => {
        e.stopPropagation()
        handleOnSelect && handleOnSelect()
      }}
    >
      {src ? (
        <Avatar
          className={cn('h-9 w-9 flex-none rounded-xl bg-gray-50', avatar)}
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
          className={cn('text-base font-semibold leading-6 text-slate-800', {})}
        >{`${firstName} ${lastName}`}</p>
        <p className={cn('text-[11px] font-medium text-slate-500', {})}>
          {email}
        </p>
      </div>
    </div>
  )
}
