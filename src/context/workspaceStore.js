import { assignUsersToWorkspace } from '@/app/_actions/user-actions'
import { deleteUserFromWorkspace } from '@/app/_actions/workspace-actions'
import { notify } from '@/lib/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_STATE = {
  addedUsers: [],
  error: {
    status: false,
    message: '',
  },
  isLoading: false,
  isEditingRole: false,
  selectedUser: null,
}

const useWorkspaceStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setAddedUsers: (users) => set({ addedUsers: users }),
  setIsLoading: (status) => set({ isLoading: status }),
  setIsEditingRole: (status) => set({ isEditingRole: status }),
  setError: (error) => set({ error }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // METHODS AND ACTIONS

  handleAddToWorkspace: (user) => {
    // Filter out the user with the matching email, if exists then don't add
    const userExists = get().addedUsers.find((u) => u.ID === user.ID)

    if (userExists) {
      notify('error', 'User is already Added!')
      return
    }

    // Filter out the user with role == "owner", if exists then don't add
    if (user?.role?.toLowerCase() == 'owner') {
      notify('error', 'Owner is already part of the workspace!')
      return
    }

    set((state) => {
      return {
        addedUsers: [...state.addedUsers, user],
      }
    })

    notify('success', `You Added ${user?.first_name}!`)
  },

  handleRemoveFromWorkspace: (user) => {
    if (!user || !user.ID) {
      console.error('Invalid user or user ID')
      return
    }

    // Filter out the user with the matching ID
    // Update the state with the new users list
    set((state) => {
      return {
        addedUsers: state.addedUsers.filter((u) => u.ID != user.ID),
      }
    })

    notify('success', `You Removed ${user?.first_name}!`)
  },

  handleUserRoleChange: (user, roleID) => {
    console.log(roleID)
    console.log(user)
    // console.log(addedUsers)

    // Map through the users and add the property workspaceRole = roleID to the user with the matching ID and return the other as they are

    // console.log(updatedUsers)
    set((state) => {
      return {
        addedUsers: state.addedUsers.map((u) => {
          if (u.ID === user.ID) {
            u.workspaceRole = roleID
          }

          return u
        }),
      }
    })
  },

  handleSubmitAddedUsers: async (workspaceID) => {
    const { addedUsers } = get()
    set({
      isLoading: true,
      error: { status: false, message: '' },
    })

    // check if the addedUsers list is empty
    if (addedUsers.length === 0) {
      notify('error', 'Please select at least one user')
      set({
        isLoading: false,
      })
      return
    }

    // Check is all users in the addedUSers list have a role assigned
    const userHasNoRole = !addedUsers?.every((user) => user.workspaceRole)

    if (userHasNoRole) {
      notify('error', 'Please assign a role to all users')
      set({
        isLoading: false,
      })
      return
    }

    const usersPayload = addedUsers.map((user) => ({
      userID: user.ID,
      roleID: user.workspaceRole,
    }))

    return await assignUsersToWorkspace(usersPayload, workspaceID)
  },

  handleDeleteFromWorkspace: async (workspaceID) => {
    set({ isLoading: true })
    const { selectedUser } = get()

    const response = await deleteUserFromWorkspace(selectedUser?.ID)

    if (response.success) {
      notify('success', `You Removed ${user?.first_name}!`)
    }

    notify('error', response.message)
  },

  handleClearAllSelected: () => {
    // IF NOT SELECTED USERS RETURN
    if (!get().addedUsers.length) return

    set({
      addedUsers: [],
      error: { status: false, message: '' },
      isLoading: false,
    })
  },

  // CLear & Reset
  resetWorkspaces: () =>
    set({
      ...INITIAL_STATE,
    }),
}))

export default useWorkspaceStore
