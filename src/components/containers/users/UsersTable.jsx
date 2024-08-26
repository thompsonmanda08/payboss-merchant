import React from 'react'
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
} from '@nextui-org/react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

import { cn, getUserInitials } from '@/lib/utils'
import useWorkspaceStore from '@/context/workspaceStore'
import PromptModal from '@/components/base/Prompt'
import useNavigation from '@/hooks/useNavigation'

const roleColorMap = {
  owner: 'success',
  admin: 'success',
  member: 'primary',
  guest: 'warning',
}

// TODO => title ITEM SHOULD BE A DROPDOWN MENU TO CHANGE titleS - IF IN EDIT MODE?

const columns = [
  { name: 'NAME', uid: 'first_name' },
  { name: 'USERNAME/MOBILE NO.', uid: 'username' },
  { name: 'WORKSPACES', uid: 'workspace' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' },
]

//! NOTE: ONLY THE OWNER WILL BE ABLE TO SEE ALL THE USERS
export default function UsersTable({ users = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isUsersRoute } = useNavigation()
  const {
    isLoading,
    setIsEditingRole,
    setSelectedUser,
    selectedUser,
    handleDeleteFromWorkspace,
  } = useWorkspaceStore()

  // TABLE CELL RENDERER
  const renderCell = React.useCallback((user, columnKey) => {
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
            color={roleColorMap[user.role]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            {/* <Tooltip content="View user">
              <span
                onClick={() => setIsViewingUser(true)}
                className="cursor-pointer text-lg text-secondary active:opacity-50"
              >
                <EyeIcon className="h-5 w-5" />
              </span>
            </Tooltip> */}
            <>
              <Tooltip color="primary" content="Edit user">
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
            </>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  function handleDeleteUser() {
    // if (isUsersRoute) {
    //   // TODO: Handle delete from account
    //   handleDeleteUserFromAccount()
    // }

    const response = handleDeleteFromWorkspace()
    if (response.success) onClose()
  }

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        className="max-h-[700px]"
        isStriped
        isHeaderSticky
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
        <TableBody items={users}>
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
        onConfirm={handleDeleteUser}
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
