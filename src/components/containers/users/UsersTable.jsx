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
} from '@nextui-org/react'
import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ScrollArea } from '@/components/ui/scroll-area'

const roleColorMap = {
  owner: 'success',
  admin: 'success',
  member: 'primary',
  guest: 'warning',
}

// TODO => title ITEM SHOULD BE A DROPDOWN MENU TO CHANGE titleS - IF IN EDIT MODE?

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'TITLE', uid: 'title' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' },
]

//! NOTE: ONLY THE OWNER WILL BE ABLE TO SEE ALL THE USERS
export default function UsersTable({ users }) {
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        )
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.workspace}
            </p>
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
      className="max-h-[600px]"
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
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
