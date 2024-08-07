'use client'
import { Card } from '@/components/base'
import { Switch } from '@nextui-org/switch'
import useSettingsStore from '@/context/settingsStore'
import { useSetupConfig } from '@/hooks/useQueryHooks'

function AccountPreferences() {
  const { data: response } = useSetupConfig()
  const user = response?.data?.userDetails
  const { openEditModal, setOpenEditModal } = useSettingsStore()

  function handleToggleModal() {
    setOpenEditModal(!openEditModal)
  }
  function handleConfirm() {
    handleToggleModal()
  }

  const APPLICATION_CONFIG = [
    {
      title: 'Account Workspace SandBox',
      active: true,
    },
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
    <Card className={'rounded-2xl bg-white/70 backdrop-blur-md'}>
      <div className="flex w-full flex-col rounded-md p-4">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Platform Preferences
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Manage your preferences and other platform options
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {APPLICATION_CONFIG.map((config, index) => (
              <div key={config.title} className="mt-4 pt-4 sm:flex">
                <div className="mt-1 flex items-center gap-x-4 sm:mt-0 sm:flex-auto">
                  <Switch />
                  <p className="font-medium text-gray-900">{config.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default AccountPreferences
