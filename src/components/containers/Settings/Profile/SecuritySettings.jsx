'use client'
import { Card, Modal } from '@/components/base'
import { Switch } from '@nextui-org/switch'
import useProfileStore from '@/state/profileStore'
import useSettingsStore from '@/state/settingsStore'

export default function ProfileSecuritySettings() {
  const { user } = useProfileStore()
  const { openEditModal, setOpenEditModal } = useSettingsStore()

  function handleToggleModal() {
    setOpenEditModal(!openEditModal)
  }
  function handleConfirm() {
    handleToggleModal()
  }

  return (
    <Card className={'rounded-2xl bg-white/65 backdrop-blur-md'}>
      <div className="flex w-full flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Security
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Update your security settings to protect your account and data.
              </p>
            </div>
            {/* <button
              type="button"
              // USER CHANGES THE PAYMENT PHONE NUMBER TO GENERATE NEW QR CODE
              onClick={handleToggleModal}
              className="font-semibold text-primary hover:text-primary/85"
            >
              Update Details
            </button> */}
          </div>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Password
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">************</div>
                <button
                  type="button"
                  onClick={handleToggleModal}
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="pt-6 opacity-55 grayscale sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                2F Authentication
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="font-medium text-gray-900">
                  [disabled] Coming Soon!
                </div>
                <Switch />
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Recovery Email
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user?.email || 'Not Set'}</div>
                <button
                  type="button"
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {/* {openEditModal && (
        <Modal
          show={openEditModal}
          onClose={handleToggleModal}
          onConfirm={handleConfirm}
          title={'Update Profile Details'}
          infoText={'Ensure that your account information is up to date.'}
        >
          <div className="flex h-24 w-full bg-red-500"></div>
        </Modal>
      )} */}
    </Card>
  )
}
