import { notify } from '@/lib/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_STATE = {
  addedUsers: [],
}

const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      //SETTERS
      setAddedUsers: (users) => set({ addedUsers: users }),

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
            addedUsers: [
              ...state.addedUsers,
              user,
              // {
              //   ...user,
              //   workspaceRole: workspaceRoles[1]?.ID,
              // },
            ],
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

      handleClearAllSelected: () => {
        // IF NOT SELECTED USERS RETURN
        if (!get().addedUsers.length) return

        set({ addedUsers: [] })
        notify('success', 'Removed all selected Users!')
      },

      // CLear & Reset
      resetWorkspaces: () =>
        set({
          ...INITIAL_STATE,
        }),
    }),
    {
      name: 'workspace',
    },
  ),
)

export default useWorkspaceStore
