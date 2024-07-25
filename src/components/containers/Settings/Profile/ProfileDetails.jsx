'use client'

import useProfileStore from '@/context/profileStore'
import useSettingsStore from '@/context/settingsStore'
import { maskString } from '@/lib/utils'
import { Card, Modal } from '@/components/base'

export default function ProfileDetails() {
  const { user } = useProfileStore()
  const { openEditModal, setOpenEditModal } = useSettingsStore()

  function handleToggleModal() {
    setOpenEditModal(!openEditModal)
  }

  function handleConfirm() {
    handleToggleModal()
  }

  function handleProfileUpdate() {
    handleToggleModal()
  }
  return (
    <Card className={'rounded-2xl backdrop-blur-md'}>
      <div className="flex w-full flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Personal information and account details
              </p>
            </div>
            <button
              type="button"
              // USER CHANGES THE PAYMENT PHONE NUMBER TO GENERATE NEW QR CODE
              onClick={handleToggleModal}
              className="font-semibold text-primary hover:text-primary/85"
            >
              Update
            </button>
          </div>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Full name
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <p className="text-gray-900">{`${user?.firstName} ${user?.lastName}`}</p>
                {/* <button
                  type="button"
                  onClick={handleProfileUpdate}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button> */}
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Email address
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">
                  {maskString(user?.email, 0, 12)}
                </div>
                {/* <button
                  type="button"
                  onClick={handleProfileUpdate}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button> */}
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Mobile Number
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user?.phone}</div>
                {/* <button
                  type="button"
                  onClick={handleProfileUpdate}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button> */}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Card>
  )
}
