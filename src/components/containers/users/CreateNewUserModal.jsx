'use client'
import { Input } from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { isValidZambianMobileNumber, notify } from '@/lib/utils'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { StatusMessage } from '@/components/base'
import { useQueryClient } from '@tanstack/react-query'
import { USERS } from '@/lib/constants'
import {
  createNewUser,
  updateSystemUserData,
} from '@/app/_actions/user-actions'
import useNavigation from '@/hooks/useNavigation'
import useWorkspaceStore from '@/context/workspaceStore'
import { changeUserRoleInWorkspace } from '@/app/_actions/workspace-actions'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'

function CreateNewUserModal({ isOpen, onClose }) {
  const { isEditingRole, selectedUser, setSelectedUser, setIsEditingRole } =
    useWorkspaceStore()
  const queryClient = useQueryClient()
  const { isAccountLevelSettingsRoute, isUsersRoute } = useNavigation()

  const [loading, setLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    role: '',
    changePassword: true,
    password: 'PB0484G@#$%Szm',
  })
  const [error, setError] = useState({ status: false, message: '' })
  const { workspaceRoles, accountRoles } = useAllUsersAndRoles()

  // const [selectedKeys, setSelectedKeys] = useState(
  //   new Set([ROLES.map((role) => role.label)[0]]),
  // )

  // const selectedValue = useMemo(
  //   () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
  //   [selectedKeys],
  // )

  console.log(accountRoles)

  // ON CREATE => NO IDS are needed for now... only the role name
  const USER_ROLES = getUserRoles()

  const phoneNoError =
    !isValidZambianMobileNumber(newUser?.phone_number) &&
    newUser?.phone_number?.length > 3

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
    if (!isValidData()) {
      notify('error', 'Error: Invalid Details')
      setLoading(false)
      return
    }

    let response = await createNewUser(newUser)

    if (response?.success) {
      notify('success', 'User created successfully!')
      setError({ status: false, message: '' })
      onClose()
      queryClient.invalidateQueries([USERS])
      setLoading(false)
      return
    }

    notify('error', 'Error creating user!')
    setError({ status: true, message: response?.message })
    setLoading(false)
  }

  async function handleUpdateSystemUser() {
    setLoading(true)
    console.log(newUser)

    const recordID = selectedUser?.ID

    const userMapping = {
      ...newUser,
      userID: newUser?.userID,
      roleID: newUser?.role,
      recordID,
    }

    let response = await updateSystemUserData(recordID, userMapping)

    if (response?.success) {
      queryClient.invalidateQueries([USERS])
      notify('success', 'User updated successfully!')
      setError({ status: false, message: '' })
      setLoading(false)
      handleClose()
      return
    }

    notify('error', 'Error updating user!')
    setError({ status: true, message: response?.message })
    setLoading(false)
  }

  async function handleUpdateWorkspaceUserRole() {
    setLoading(true)

    const recordID = selectedUser?.ID

    const userMapping = {
      userID: newUser?.userID,
      roleID: newUser?.role,
      recordID,
    }

    let response = await changeUserRoleInWorkspace(userMapping, recordID)

    if (response?.success) {
      queryClient.invalidateQueries([USERS])
      notify('success', 'User updated successfully!')
      setError({ status: false, message: '' })
      setLoading(false)
      handleClose()
      return
    }

    notify('error', 'Error updating user!')
    setError({ status: true, message: response?.message })
    setLoading(false)
  }

  function getUserRoles() {
    // MANAGE ACCOUNT AND NEW USER TO SYSTEM
    if (isAccountLevelSettingsRoute && isUsersRoute) {
      // return accountRoles
      return ['admin', 'viewer']
    }

    // WORKSPACE MEMBER USER ROLE LIST
    if (!isUsersRoute) {
      return workspaceRoles
    }
  }

  function isValidData() {
    let valid = true
    if (!isValidZambianMobileNumber(newUser?.phone_number)) {
      valid = false
      setError((prev) => ({
        ...prev,
        onMobileNo: true,
        message: 'Invalid Mobile Number',
      }))
    }

    if (!newUser?.first_name || newUser?.first_name?.length < 3) {
      valid = false
      setError((prev) => ({
        ...prev,
        onFName: true,
        message: 'Invalid First Name',
      }))
    }

    if (!newUser?.last_name || newUser?.last_name?.length < 3) {
      valid = false
      setError((prev) => ({
        ...prev,
        onLName: true,
        message: 'Invalid Last Name',
      }))
    }

    if (!newUser?.role) {
      valid = false
      setError((prev) => ({
        ...prev,
        onRole: true,
        message: 'User must have a system a role',
      }))
    }

    if (!newUser?.username) {
      valid = false
      setError((prev) => ({
        ...prev,
        onUsername: true,
        message: 'User must have a username',
      }))
    }

    if (
      !newUser?.email ||
      !newUser?.email?.includes('@') ||
      !newUser?.email?.includes('.')
    ) {
      valid = false
      setError((prev) => ({
        ...prev,
        onEmail: true,
        message: 'Invalid Email',
      }))
    }

    return valid
  }

  function onConfirmAction() {
    if (isEditingRole && isUsersRoute) {
      handleUpdateSystemUser()
      return
    }

    if (isEditingRole && !isUsersRoute) {
      handleUpdateWorkspaceUserRole()
      return
    }

    handleCreateUser()
  }

  // CLEAR OUT ALL ERRORS WHEN THE INPUT FIELDS CHANGE
  useEffect(() => {
    setError({})
    setLoading(false)
  }, [newUser])

  useEffect(() => {
    // If a user has already provided, prefill the fields
    if (isEditingRole && Object.keys(selectedUser)?.length > 0) {
      setNewUser(selectedUser)
    }
  }, [selectedUser])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEditingRole && !isUsersRoute
                ? 'Update Workspace User'
                : isEditingRole && isUsersRoute
                  ? 'Update System User'
                  : 'Create New User'}
            </ModalHeader>
            <ModalBody>
              <SelectField
                label={
                  isEditingRole && !isUsersRoute
                    ? 'Workspace Role'
                    : 'System Role'
                }
                required
                onError={error?.onRole}
                value={newUser?.role}
                options={USER_ROLES}
                placeholder={isEditingRole ? newUser?.role : 'Choose a role'}
                listItemName={'role'}
                className="mt-px"
                onChange={(e) => {
                  updateDetails({
                    role: e.target.value,
                    roleID: e.target.value,
                  })
                }}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  autoFocus
                  label="First Name"
                  value={newUser?.first_name}
                  required={!isEditingRole}
                  onError={error?.onFName}
                  errorText="Invalid First Name"
                  isDisabled={isEditingRole}
                  onChange={(e) => {
                    updateDetails({ first_name: e.target.value })
                  }}
                />
                <Input
                  label="Last Name"
                  value={newUser?.last_name}
                  required={!isEditingRole}
                  isDisabled={isEditingRole}
                  onError={error?.onLName}
                  errorText="Invalid Last Name"
                  onChange={(e) => {
                    updateDetails({ last_name: e.target.value })
                  }}
                />
              </div>
              <Input
                label="Username"
                value={newUser?.username}
                required={!isEditingRole}
                isDisabled={isEditingRole}
                onError={error?.onUsername}
                errorText="Username is required"
                onChange={(e) => {
                  updateDetails({ username: e.target.value })
                }}
              />
              <Input
                label="Mobile Number"
                type="number"
                maxLength={12}
                pattern="[0-9]{12}"
                onError={phoneNoError || error?.onMobileNo}
                errorText="Invalid Mobile Number"
                value={newUser?.phone_number}
                required={!isEditingRole}
                isDisabled={isEditingRole}
                onChange={(e) => {
                  updateDetails({ phone_number: e.target.value })
                }}
              />
              <Input
                label="Email Address"
                type="email"
                onError={error?.onEmail}
                errorText="Invalid Email Address"
                value={newUser?.email}
                required={!isEditingRole}
                isDisabled={isEditingRole}
                onChange={(e) => {
                  updateDetails({ email: e.target.value })
                }}
              />

              {isEditingRole ? (
                <p className="mx-auto max-w-[88%] text-center text-xs font-medium italic text-slate-500">
                  The user will be notified of the changes made to their account
                  on PayBoss. If an action is required, the user will also
                  receive an email with instructions.
                </p>
              ) : (
                <p className="mx-auto max-w-[88%] text-center text-xs font-medium italic text-slate-500">
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
              <Button color="danger" onPress={handleClose} isDisabled={loading}>
                Cancel
              </Button>
              {
                <Button
                  color="primary"
                  isLoading={loading}
                  isDisabled={loading}
                  onPress={onConfirmAction}
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
