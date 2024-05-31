'use client'
import useSettingsStore from '@/state/settingsStore'
import { Fragment, useState } from 'react'
import { DotsVerticalIcon, TrashIcon } from "@radix-ui/react-icons"
import { Avatar, Modal } from '@/components/base'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

const people = [
    { name: 'Mwansa Mwila', title: 'Financial Analyst', phone: '+260 770 000 000', email: 'mwansa.mwila@example.com', role: 'Admin' },
    { name: 'Chisomo Banda', title: 'Software Developer', phone: '+260 770 000 000', email: 'chisomo.banda@example.com', role: 'Initiator' },
    { name: 'Misozi Zulu', title: 'Marketing Manager', phone: '+260 770 000 000', email: ' misozi.zulu@example.com', role: 'Member' },
    { name: 'Kunda Phiri', title: 'Human Resources Specialist', phone: '+260 770 000 000', email: 'kunda.phiri@example.com', role: 'Approver' },
    { name: 'Chanda Mulenga', title: 'IT Consultant', phone: '+260 770 000 000', email: 'chanda.mulenga@example.com', role: 'Member' },
    { name: 'Mwaka Tembo', title: 'Business Analyst', phone: '+260 770 000 000', email: 'mwaka.tembo@example.com', role: 'Initiator' },
  ]
  
  const permissions_data = [
    {
      permissions_name: 'Permissions',
      data: [
        {
          name: 'Approver',
          switch: <ToggleSwitch />,
          do: 'Can approve transaction',
        },
        {
          name: 'Initiator',
          switch: <ToggleSwitch />,
          do: 'Can initiate transaction',
        },
        {
          name: 'Member',
          switch: <ToggleSwitch />,
          do: 'Can only view',
          },]
        }
      ];


  export default function UsersTable() {
    const { openEditModal, setOpenEditModal, openCreateUserModal, setOpenCreateUserModal } = useSettingsStore()


    function handleToggleModal() {
      setOpenEditModal(!openEditModal)
    }

    function handleConfirm() {
      handleToggleModal()
    }
    function handleCreateModal() {
      setOpenEditModal(!openCreateUserModal)
    }

    function handleCreate() {
      handleCreateModal()
    }

    return (
     <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="divide-x divide-gray-200">
                    <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                      phone #
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.email} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.title}</td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.phone}</td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.email}</td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">{person.role}</td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        <DotsVerticalIcon  onClick={handleToggleModal} className=" h-5 w-5 cursor-pointer hover:text-primary"/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {openEditModal && (
        <Modal
          show={openEditModal}
          onClose={handleToggleModal}
          onConfirm={handleConfirm}
          title={'User Permissions'}
          infoText={'Ensure that your account information is up to date.'}
        >
           <div className='pb-4 flex justify-between items-center'>
           <Avatar userData={{firstName:'Ael', lastName:'Mbewe', email:'ael@gmail.com'}}/>
           <span className='flex space-x-1 cursor-pointer group'>
           <p className='text-[13px] text-red-400 group-hover:text-red-600 font-semibold '>Delete</p>
           <TrashIcon className='h-5 w-5 text-red-400 group-hover:text-red-600'/>
           </span>
           </div>
           {permissions_data.map((permissions, index) => (
            <Fragment key={index}>
              {permissions.data.map((permission, index) => (
                <div
                  className='border-b flex justify-between items-center p-2'
                  key={index}
                >
                  <div className='flex flex-col'>
                  <span className='text-[13px] text-[#222] font-semibold '>
                    {permission.name}
                  </span>
                  <span className='text-[13px] text-[#222] font-light '>
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
     </>
    )
  }
  