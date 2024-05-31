'use client'
import { Modal } from '@/components/base'
import useProfileStore from '@/state/profileStore'
import useSettingsStore from '@/state/settingsStore'
import { useState } from 'react'

export default function BusinessSettings() {
  const { user } = useProfileStore()
  const { openEditModal, setOpenEditModal } = useSettingsStore()
  const [openCreateQRCodeModal, setOpenCreateQRCodeModal] = useState(false)

  function handleToggleModal() {
    setOpenEditModal(!openEditModal)
  }
  function handleToggleQRCodeModal() {
    setOpenCreateQRCodeModal(!openEditModal)
  }

  function handleConfirm() {
    handleToggleModal()
  }

  function handleProfileUpdate() {
    handleToggleModal()
  }
  return (
    <>
      <div className="flex w-full flex-col gap-y-10 rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Business Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Add or update your Business information
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
                Business name
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">Chipolopolo Zambia LTD</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Business Mobile Number
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">+(260) 977 552 653</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Business Email
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">business@mail.com</div>
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Payments Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Below are the details where your funds will be transferred after
            each trading cycle
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Merchant ID
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">*******CHIPZM</div>
                <button
                  type="button"
                  // USER CHANGES THE PAYMENT PHONE NUMBER TO GENERATE NEW QR CODE
                  onClick={handleToggleQRCodeModal}
                  className="font-semibold text-primary hover:text-primary/85"
                >
                  Update
                </button>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Payment Mobile Number
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">+(260)976 565 225</div>
                {/* <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Change
                </button> */}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {openEditModal && (
        <Modal
          show={openEditModal}
          onClose={handleToggleModal}
          onConfirm={handleConfirm}
          title={'Update Profile Details'}
          infoText={'Ensure that your account information is up to date.'}
        >
          <div className="flex h-24 w-full bg-red-500"></div>
        </Modal>
      )}
      {/********** HANDLE GENERATE QR CODE FOR MERCHANT **********/}
      {openCreateQRCodeModal && (
        <Modal
          show={openCreateQRCodeModal}
          onClose={handleToggleQRCodeModal}
          onConfirm={handleConfirm}
          title={'Create QR Code'}
          infoText={'You will be able to scan this QR code on your phone.'}
        >
          <div className="flex h-24 w-full bg-blue-500"></div>
        </Modal>
      )}
    </>
  )
}
