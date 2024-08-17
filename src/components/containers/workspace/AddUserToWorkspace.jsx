'use client'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Chip,
  Tooltip,
} from '@nextui-org/react'

import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import { notify } from '@/lib/utils'
import { Button } from '../../ui/Button'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { UserAvatarComponent } from '../users/UsersTable'
import { assignUsersToWorkspace } from '@/app/_actions/user-actions'
import { ScrollArea } from '../../ui/scroll-area'
import { CardHeader, EmptyState } from '../../base'
import Spinner from '../../ui/Spinner'
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SingleSelectionDropdown } from '@/components/ui/DropdownButton'
import { ROLES } from '../users/ManagePeople'
import SelectField from '@/components/ui/SelectField'

const roleColorMap = {
  owner: 'success',
  admin: 'success',
  member: 'primary',
  guest: 'warning',
}

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'SYSTEM ROLE', uid: 'role' },
  { name: 'ACTION', uid: 'action_add' },
]
const columns_added = [
  { name: 'NAME', uid: 'added_name' },
  { name: 'WORKSPACE ROLE', uid: 'workspace_role' },
  { name: 'ACTION', uid: 'action_remove' },
]

function AddUserToWorkspace({
  isOpen,
  onClose,
  workspaceID,
  workspaceName,
  navigateTo,
}) {
  const queryClient = useQueryClient()
  const { allUsers, workspaceRoles } = useAllUsersAndRoles()
  const router = useRouter()

  const [addedUsers, setAddedUsers] = useState([])
  const [error, setError] = useState({
    status: false,
    message: '',
  })

  function handleAddToWorkspace(user) {
    // Filter out the user with the matching email, if exists then don't add
    const userExists = addedUsers.find((u) => u.ID === user.ID)
    if (userExists) {
      notify('error', 'User is already Added!')
      return
    }

    // Filter out the user with role == "owner", if exists then don't add
    if (user?.role?.toLowerCase() == 'owner') {
      notify('error', 'Owner is already part of the workspace!')
      return
    }

    setAddedUsers((prev) => [
      ...prev,
      {
        ...user,
        workspaceRole: workspaceRoles[1]?.ID,
      },
    ])
    notify('success', `You Added ${user?.first_name}!`)
  }

  function handleRemoveFromWorkspace(user) {
    if (!user || !user.ID) {
      console.error('Invalid user or user ID')
      return
    }

    // Filter out the user with the matching ID
    // Update the state with the new users list
    setAddedUsers((prev) => prev.filter((u) => u.ID != user.ID))
    notify('success', `You Removed ${user?.first_name}!`)
  }

  function handleClearAllSelected() {
    setAddedUsers([])
    notify('success', 'Removed all selected Users!')
  }

  function handleUserRoleChange(user, roleID) {
    console.log(roleID)
    console.log(user)

    // Map through the users and add the property workspaceRole = roleID to the user with the matching ID and return the other as they are
    const updatedUsers = addedUsers.map((u) => {
      if (u.ID === user.ID) {
        u.workspaceRole = roleID
      }
      return u
    })

    console.log(updatedUsers)
    setAddedUsers(updatedUsers)
  }

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name': // FIRST_NAME IDENTIFIED THE ALL USERS TABLE AND LAST NAME IDENTIFIES THE ADDED_USERS TABLE
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
            handleOnSelect={
              !user?.isAdded
                ? () => handleAddToWorkspace(user) // IF USER NOT ADDED THEN ADD THE USER
                : undefined // ELSE NO FUNCTION TO TRIGGER
            }
          />
        )
      case 'added_name': // LAST NAME IDENTIFIES THE ADDED_USERS TABLE
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
            handleOnSelect={
              user?.isAdded ? () => handleRemoveFromWorkspace(user) : undefined // ELSE NO FUNCTION TO TRIGGER
            }
          />
        )

      case 'role':
        return (
          <Chip
            key={cellValue}
            color={roleColorMap[user.role]}
            className="capitalize"
            size="sm"
            variant="flat"
          >
            {user?.role}
          </Chip>
        )

      case 'workspace_role': // TODO => DROPDOWN
        return (
          <>
            <SelectField
              key={cellValue}
              className={'max-w-[200px]'}
              options={workspaceRoles}
              listItemName={'role'}
              name="role"
              value={user?.workspaceRole}
              onChange={(e) => handleUserRoleChange(user, e.target.value)}
            />
          </>
        )

      case 'action_add':
        return (
          <Button
            isIconOnly
            variant="light"
            color="primary"
            size="sm"
            className="relative"
            onPress={() => handleAddToWorkspace(user)}
          >
            <Tooltip color="primary" content="Remove User">
              <span className="cursor-pointer text-lg text-primary active:opacity-50">
                <UserPlusIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </Button>
        )
      case 'action_remove':
        return (
          <Button
            isIconOnly
            variant="light"
            color="danger"
            size="sm"
            className="relative"
            onPress={() => handleRemoveFromWorkspace(user)}
          >
            <Tooltip color="danger" content="Remove User">
              <span className="cursor-pointer text-lg text-danger active:opacity-50">
                <XMarkIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </Button>
        )
      default:
        return cellValue
    }
  }, [])

  function submitAddedUsers() {
    const response = assignUsersToWorkspace(workspaceID, addedUsers)

    if (response.success) {
      notify('success', 'Users Added!')
      queryClient.invalidateQueries()
      onClose()
      navigateTo(1)
    }

    // TODO => HANDLE ERRORS
    console.log(response)
    notify('error', response.message)
    setError({ status: true, message: response.message })
  }

  // console.log(workspaceRoles)
  console.log(addedUsers.length)

  return (
    <Modal
      // IF ROLES AND USERS ARE LOADED THEN RENDER FULL SIZE
      size={workspaceRoles && allUsers?.length > 1 ? 'full' : '5xl'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) =>
          allUsers && workspaceRoles && allUsers?.length > 1 ? (
            <>
              <ModalHeader className="flex gap-1">
                Add User to Workspace
                {workspaceName && <span>({workspaceName})</span>}
              </ModalHeader>
              <ModalBody>
                <section role="user-section" className="flex gap-8">
                  {/**** A LIST OF ALL USERS THAT CAN BE ADDED TO A WORKSPACE ******/}
                  <ScrollArea className="flex h-full w-full flex-1 flex-grow flex-col items-start gap-8">
                    <CardHeader title="All Users" />
                    <div role="ALL_USERS_LIST" className="">
                      <Table
                        aria-label="Table with dynamic content"
                        className="shadow-none"
                      >
                        <TableHeader>
                          {columns.map((column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === 'isAdded' ? 'center' : 'start'
                              }
                            >
                              {column.name}
                            </TableColumn>
                          ))}
                        </TableHeader>
                        <TableBody
                          items={allUsers}
                          emptyContent={'No Users to display.'}
                        >
                          {(user) => (
                            <TableRow
                              key={user?.ID}
                              // TODO: DISABLED OWNER ROW
                              isDisabled={user?.role == 'owner'}
                            >
                              {(columnKey) => (
                                <TableCell>
                                  {renderCell(user, columnKey)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                  {/* ********************************************************* */}

                  {/**** A LIST OF ADDED USERS TO A WORKSPACE ******/}
                  <ScrollArea className=" flex h-[720px] w-full flex-1 flex-grow flex-col items-start gap-8 !shadow-none">
                    <CardHeader title="Added Users" />

                    {error && error.status && (
                      <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
                        <StatusMessage
                          error={error.status}
                          message={error.message}
                        />
                      </div>
                    )}

                    <div role="ADDED_USERS_LIST" className="flex flex-col">
                      <Table aria-label="Table with dynamic content">
                        <TableHeader>
                          {columns_added.map((column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === 'isAdded' ? 'center' : 'start'
                              }
                            >
                              {column.name}
                            </TableColumn>
                          ))}
                        </TableHeader>
                        <TableBody
                          items={addedUsers || []}
                          emptyContent={
                            'You have not selected any all Users to add to this workspace'
                          }
                        >
                          {(user) => (
                            <TableRow key={user?.ID}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderCell(user, columnKey)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>

                      <Button
                        variant="light"
                        color="primary"
                        className={'ml-auto mt-5'}
                        onPress={handleClearAllSelected}
                      >
                        Clear All
                      </Button>
                    </div>
                  </ScrollArea>
                  {/* ********************************************************* */}
                </section>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Back
                </Button>
                <Button color="primary" onPress={submitAddedUsers}>
                  Add Selected Users
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              {/* WHEN THERE ARE NO USERS ADDED TO THE ACCOUNT */}
              <ModalHeader className="flex flex-col gap-1">
                Add User to Workspace
              </ModalHeader>
              <ModalBody>
                {!allUsers || !workspaceRoles ? (
                  <div className="flex aspect-square w-[200px] flex-1 items-center justify-center self-center p-10 ">
                    <Spinner size={64} />
                  </div>
                ) : (
                  <section role="user-section" className="flex gap-8">
                    <EmptyState
                      title={'NO USERS ADDED'}
                      classNames={{
                        heading: 'md:text-[40px] tracking-tight leading-3',
                        paragraph: 'text-[18px] text-slate-600',
                      }}
                      message={
                        'Add allUsers to your workspace to start assigning them.'
                      }
                      buttonText={'Add New Users'}
                      onButtonClick={() => {
                        navigateTo(1)
                        onClose()
                      }}
                    />
                  </section>
                )}
              </ModalBody>
            </>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default AddUserToWorkspace
