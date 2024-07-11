'use client'
import { Card, Modal } from '@/components/base'
import { Switch } from '@nextui-org/switch'
import useProfileStore from '@/state/profileStore'
import useSettingsStore from '@/state/settingsStore'

export default function AccountPreferences() {
  const { user } = useProfileStore()
  const { openEditModal, setOpenEditModal } = useSettingsStore()

  function handleToggleModal() {
    setOpenEditModal(!openEditModal)
  }
  function handleConfirm() {
    handleToggleModal()
  }

  const APPLICATION_CONFIG = [
    {
      title: 'Receive Email Notifications',
      active: true,
    },
    {
      title: 'Receive SMS Notifications',
      active: false,
    },
    {
      title: 'Subscribe to newsletters',
      active: false,
    },
  ]

  return (
    <Card className={'rounded-2xl bg-white/65 backdrop-blur-md'}>
      <div className="flex w-full flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Platform Preferences{' '}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Manage your info, option and privacy preferences
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {/* <div className="pt-6 sm:flex">
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
            </div> */}
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Platform
            </h3>
            {APPLICATION_CONFIG.map((config, index) => (
              <div className="pt-6 sm:flex">
                <dd className="mt-1 flex items-center gap-x-6 sm:mt-0 sm:flex-auto">
                  <Switch />
                  <p className="font-medium text-gray-900">{config.title}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    
    </Card>
  )
}
