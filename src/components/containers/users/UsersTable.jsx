import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Avatar,
} from '@nextui-org/react'
import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ScrollArea } from '@/components/ui/scroll-area'

import { cn, getUserInitials } from '@/lib/utils'

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
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    // console.log(users)

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
            <Tooltip content="View user">
              <span className="cursor-pointer text-lg text-secondary active:opacity-50">
                <EyeIcon className="h-5 w-5" />
              </span>
            </Tooltip>
            <Tooltip color="primary" content="Edit user">
              <span className="cursor-pointer text-lg text-primary active:opacity-50">
                <PencilSquareIcon className="h-5 w-5" />
              </span>
            </Tooltip>

            <Tooltip color="danger" content="Delete user">
              <span className="cursor-pointer text-lg text-danger active:opacity-50">
                <TrashIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
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
  )
}

function UserAvatarComponent({
  firstName,
  lastName,
  src,
  email,
  classNames,
  ...props
}) {
  const { wrapper, avatar } = classNames || ''
  return (
    <div
      className={cn(
        'flex max-w-max cursor-pointer items-center justify-start gap-4 transition-all duration-200 ease-in-out',
        wrapper,
      )}
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
      <span className="hidden lg:items-center xl:flex">
        <div className="flex min-w-[120px] flex-col items-start">
          <p
            className={cn(
              'text-base font-semibold leading-6 text-slate-800',
              {},
            )}
          >{`${firstName} ${lastName}`}</p>
          <p className={cn('text-[11px] font-medium text-slate-500', {})}>
            {email}
          </p>
        </div>
      </span>
    </div>
  )
}
