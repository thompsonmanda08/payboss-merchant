'use client'
import useSettingsStore from '@/state/settingsStore'
import { Fragment, useState } from 'react'
import { Avatar, EmptyState, Modal } from '@/components/base'
import { Switch } from '@nextui-org/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import Search from '@/components/base/Search'
import {
  CheckIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const people = [
  {
    name: 'Mwansa Mwila',
    title: 'Financial Analyst',
    phone: '+260 770 000 000',
    email: 'mwansa.mwila@example.com',
    role: 'Admin',
  },
  {
    name: 'Chisomo Banda',
    title: 'Software Developer',
    phone: '+260 770 000 000',
    email: 'chisomo.banda@example.com',
    role: 'Initiator',
  },
  {
    name: 'Misozi Zulu',
    title: 'Marketing Manager',
    phone: '+260 770 000 000',
    email: 'misozi.zulu@example.com',
    role: 'Member',
  },
  {
    name: 'Kunda Phiri',
    title: 'Human Resources Specialist',
    phone: '+260 770 000 000',
    email: 'kunda.phiri@example.com',
    role: 'Approver',
  },
  {
    name: 'Chanda Mulenga',
    title: 'IT Consultant',
    phone: '+260 770 000 000',
    email: 'chanda.mulenga@example.com',
    role: 'Member',
  },
  {
    name: 'Mwaka Tembo',
    title: 'Business Analyst',
    phone: '+260 770 000 000',
    email: 'mwaka.tembo@example.com',
    role: 'Initiator',
  },
]

const permissions_data = [
  {
    permissions_name: 'Permissions',
    data: [
      {
        name: 'Approver',
        switch: (
          <Switch startContent={<XMarkIcon />} endContent={<CheckIcon />} />
        ),
        do: 'Can approve transaction',
      },
      {
        name: 'Initiator',
        switch: (
          <Switch startContent={<XMarkIcon />} endContent={<CheckIcon />} />
        ),
        do: 'Can initiate transaction',
      },
      {
        name: 'Member',
        switch: (
          <Switch startContent={<XMarkIcon />} endContent={<CheckIcon />} />
        ),
        do: 'Can only view',
      },
    ],
  },
]

export default function UsersTable() {
  const {
    openEditModal,
    setOpenEditModal,
    openCreateUserModal,
    setOpenCreateUserModal,
  } = useSettingsStore()
  const [selectedContact, setSelectedContact] = useState(null)
  const [search, setSearch] = useState('')

  function handleToggleModal(contact = null) {
    setSelectedContact(contact)
    setOpenEditModal(!openEditModal)
  }

  function handleConfirm() {
    handleToggleModal()
  }

  function handleCreateModal() {
    setOpenCreateUserModal(!openCreateUserModal)
  }

  function handleCreate() {
    handleCreateModal()
  }

  function deleteUser() {
    notify('success', 'Deleted successfully')
    handleToggleModal()
  }

  const users = people?.filter((user) => {
    return (
      user?.email.toLowerCase().includes(search.toLowerCase()) ||
      user?.name.toLowerCase().includes(search.toLowerCase()) ||
      user?.role.toLowerCase().includes(search.toLowerCase())
    )
  })
  function handleSearch(event) {
    setSearch(event.target.value)
  }

  return (
    <>
      <div className="sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <Button onClick={handleCreateModal} type="button">
            Add User
          </Button>
        </div>
        <div className="mt-6 flow-root rounded-md border">
          <div className="m-4 sm:flex-auto">
            <Search onChange={handleSearch} value={search} />
          </div>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {users.length === 0 ? (
                <EmptyState>
                  <span></span>
                </EmptyState>
              ) : (
                <table className="min-w-full divide-y divide-gray-300 border-t">
                  <thead>
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Phone #
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((person, index) => (
                      <tr
                        key={person.email}
                        className="divide-x divide-gray-200"
                      >
                        <td
                          className={`whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 ${index === people.length - 1 ? 'rounded-bl-md' : ''}`}
                        >
                          {person.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {person.title}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {person.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {person.email}
                        </td>
                        <td
                          className={`whitespace-nowrap px-4 py-4 text-sm text-gray-500 ${index === people.length - 1 ? 'rounded-br-md' : ''}`}
                        >
                          {person.role}
                        </td>
                        <td
                          className={`whitespace-nowrap px-4 py-4 text-sm text-gray-500 ${index === people.length - 1 ? 'rounded-br-md' : ''}`}
                        >
                          <EllipsisVerticalIcon
                            onClick={() => handleToggleModal(person)}
                            className="h-5 w-5 cursor-pointer hover:text-primary"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {openEditModal && selectedContact && (
        <Modal
          show={openEditModal}
          onClose={handleToggleModal}
          onConfirm={handleConfirm}
          title={'User Permissions'}
          infoText={'Ensure that your account information is up to date.'}
        >
          <div className="flex items-center justify-between pb-4">
            <Avatar
              userData={{
                firstName: selectedContact.name.split(' ')[0],
                lastName: selectedContact.name.split(' ')[1],
                email: selectedContact.email,
              }}
            />
            <span
              className="group flex cursor-pointer space-x-1"
              onClick={deleteUser}
            >
              <p className="text-[13px] font-semibold text-red-400 group-hover:text-red-600 ">
                Delete
              </p>
              <TrashIcon className="h-5 w-5 text-red-400 group-hover:text-red-600" />
            </span>
          </div>
          {permissions_data.map((permissions, index) => (
            <Fragment key={index}>
              {permissions.data.map((permission, index) => (
                <div
                  className="flex items-center justify-between border-b p-2"
                  key={index}
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#222] ">
                      {permission.name}
                    </span>
                    <span className="text-[13px] font-light text-[#222] ">
                      {permission.do}
                    </span>
                  </div>
                  <div>{permission.switch}</div>
                </div>
              ))}
            </Fragment>
          ))}
        </Modal>
      )}
      {openCreateUserModal && (
        <Modal
          show={openCreateUserModal}
          onClose={handleCreateModal}
          onConfirm={handleCreate}
          title={'Create New User'}
          infoText={''}
        >
          <div className="mb-2"></div>
          <div className="flex flex-col gap-y-2">
            <Input label="Full Name" />
            <Input label="Phone #" />
            <Input label="Email Address" />
            <Input label="Job Title" />
          </div>
        </Modal>
      )}
    </>
  )
}
