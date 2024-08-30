'use client'
import { Input } from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { notify } from '@/lib/utils'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'
import { useEffect, useMemo, useState } from 'react'
import { ROLES, SYSTEM_ROLES } from './ManagePeople'
import { Button } from '@/components/ui/Button'
import { StatusMessage } from '@/components/base'
import useAccountProfile from '@/hooks/useProfileDetails'
import { useQueryClient } from '@tanstack/react-query'
import { USERS } from '@/lib/constants'
import { createNewUser } from '@/app/_actions/user-actions'
import useNavigation from '@/hooks/useNavigation'
import useWorkspaceStore from '@/context/workspaceStore'
import { changeUserRoleInWorkspace } from '@/app/_actions/workspace-actions'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'

function CreateNewUserModal({ isOpen, onClose }) {
  const { isEditingRole, selectedUser, setSelectedUser, setIsEditingRole } =
    useWorkspaceStore()
  const queryClient = useQueryClient()
  const { isAccountLevelSettingsRoute } = useNavigation()
  const [loading, setLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    role: 'guest',
    changePassword: true,
    password: 'PB0484G@#$%Szm',
  })
  const [error, setError] = useState({ status: false, message: '' })
  const { workspaceRoles } = useAllUsersAndRoles()

  // const [selectedKeys, setSelectedKeys] = useState(
  //   new Set([ROLES.map((role) => role.label)[0]]),
  // )

  // const selectedValue = useMemo(
  //   () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
  //   [selectedKeys],
  // )

  // ON CREATE => NO IDS are needed for now... only the role name
  const USER_ROLES = isAccountLevelSettingsRoute ? SYSTEM_ROLES : ROLES

  function updateDetails(fields) {
    setNewUser((prev) => ({ ...prev, ...fields }))
  }

  function handleClose() {
    setError({})
    setSelectedUser(null)
    setIsEditingRole(false)
    setNewUser({
      role: 'guest',
      changePassword: true,
      password: 'PB0484G@#$%Szm',
    })
    onClose()
  }

  async function handleCreateUser() {
    setLoading(true)

    let response = await createNewUser(newUser)

    if (response.success) {
      notify('success', 'User created successfully!')
      setError({ status: false, message: '' })
      onClose()
      queryClient.invalidateQueries([USERS])
      setLoading(false)
      return
    }

    notify('error', 'Error creating user!')
    setError({ status: true, message: response.message })
    setLoading(false)
  }

  async function handleUpdateUserRole() {
    setLoading(true)

    const recordID = selectedUser?.ID

    const mapping = {
      userID: newUser?.userID,
      roleID: newUser?.role,
      recordID,
    }

    let response = await changeUserRoleInWorkspace(mapping, recordID)

    if (response.success) {
      queryClient.invalidateQueries([USERS])
      notify('success', 'User updated successfully!')
      setError({ status: false, message: '' })
      setLoading(false)
      handleClose()
      return
    }

    notify('error', 'Error updating user!')
    setError({ status: true, message: response.message })
    setLoading(false)
  }

  // CLEAR OUT ALL ERRORS WHEN THE INPUT FIELDS CHANGE
  useEffect(() => {
    setError({})
    setLoading(false)
  }, [newUser])

  useEffect(() => {
    // If a user has already provided, prefill the fields
    if (isEditingRole && Object.keys(selectedUser).length > 0) {
      setNewUser(selectedUser)
    }
  }, [selectedUser])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEditingRole ? 'Update User' : 'Create New User'}
            </ModalHeader>
            <ModalBody>
              <SelectField
                label="User Role"
                options={isEditingRole ? workspaceRoles : USER_ROLES}
                placeholder={isEditingRole ? newUser?.role : 'Choose a role'}
                listItemName={'role'}
                className="mt-px"
                defaultValue={'guest'}
                value={newUser?.role}
                onChange={(e) => {
                  updateDetails({ role: e.target.value })
                }}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  autoFocus
                  label="First Name"
                  value={newUser?.first_name}
                  required={true}
                  isDisabled={isEditingRole}
                  onChange={(e) => {
                    updateDetails({ first_name: e.target.value })
                  }}
                />
                <Input
                  label="Last Name"
                  value={newUser?.last_name}
                  required={true}
                  isDisabled={isEditingRole}
                  onChange={(e) => {
                    updateDetails({ last_name: e.target.value })
                  }}
                />
              </div>
              <Input
                label="Username"
                value={newUser?.username}
                required={true}
                isDisabled={isEditingRole}
                onChange={(e) => {
                  updateDetails({ username: e.target.value })
                }}
              />
              <Input
                label="Mobile Number"
                type="tel"
                value={newUser?.phone_number}
                required={true}
                isDisabled={isEditingRole}
                onChange={(e) => {
                  updateDetails({ phone_number: e.target.value })
                }}
              />
              <Input
                label="Email Address"
                type="email"
                value={newUser?.email}
                required={true}
                isDisabled={isEditingRole}
                onChange={(e) => {
                  updateDetails({ email: e.target.value })
                }}
              />

              {isEditingRole ? (
                <p className="text-sm font-medium italic text-slate-700">
                  You can only change the role of this user{' '}
                  {isAccountLevelSettingsRoute
                    ? 'for this account'
                    : 'within this workspace.'}
                </p>
              ) : (
                <p className="text-sm font-medium italic text-slate-700">
                  The password will be sent to the provided email. The new user
                  must change it on first login.
                </p>
              )}

              {error && error.status && (
                <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
                  <StatusMessage error={error.status} message={error.message} />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={handleClose}>
                Cancel
              </Button>
              {
                <Button
                  color="primary"
                  isLoading={loading}
                  isDisabled={loading}
                  onPress={
                    isEditingRole
                      ? () => handleUpdateUserRole()
                      : () => handleCreateUser()
                  }
                >
                  {isEditingRole ? 'Save' : 'Create User'}
                </Button>
              }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CreateNewUserModal
