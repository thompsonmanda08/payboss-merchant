'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  FunnelIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  Square2StackIcon,
} from '@heroicons/react/24/outline'
import { Switch } from '@nextui-org/react'
import { notify } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import ConfirmationModal from '@/components/base/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'

const APIIntegration = () => {
  const [apiKeys, setApiKeys] = useState([
    { name: 'Keeps-store', key: 'xlkekiebteyeb273ndjdhdn', enabled: false },
    { name: 'Data-sync', key: 'rtyu890jklrtyu67cvbnm890', enabled: true },
    { name: 'Order-process', key: 'asdfghjkloiuytrewq23456', enabled: false },
    { name: 'Inventory-check', key: 'mnbvcxzlkjhgfdsapoiuyt', enabled: true },
    { name: 'User-management', key: 'qwertyuiopasdfghjklzxc', enabled: true },
  ])
  const [copiedKey, setCopiedKey] = useState(null)
  const [createKey, setCreateKey] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [name, setName] = useState('')

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    notify('success', 'Copied to clipboard')
  }

  function deleteUser() {
    notify('success', 'Deleted successfully')
  }

  const handleSave = () => {
    const newKey = {
      name: name,
      key: Math.random().toString(36).substring(2, 15),
      enabled: false,
    }
    setApiKeys([...apiKeys, newKey])
    setCreateKey(false)
    setName('')
  }

  return (
    <div className="mt-1 flex w-full flex-col rounded-xl bg-white p-12">
      <div className="mb-4 flex justify-end space-x-10">
        <Button variant="bordered">
          <FunnelIcon className="mr-2 h-5 w-5 font-bold" /> Filters
        </Button>
        <Button disabled={createKey} onClick={() => setCreateKey(!createKey)}>
          <PlusIcon className="mr-2 h-5 w-5 font-bold" /> ADD NEW
        </Button>
      </div>

      <AnimatePresence>
        {createKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-y-6 overflow-hidden"
          >
            <Input
              label="API Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-600">
              Use the API key associated with name to integrate with your
              system.
            </p>
            <div className="mb-4 flex items-center space-x-10">
              <Button disabled={!name} onClick={handleSave}>
                Save
              </Button>
              <Button variant="bordered" onClick={() => setCreateKey(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                API Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Enable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {apiKeys.map((api, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-6 py-4">{api.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{api.key}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Switch
                    checked={api.enabled}
                    startContent={<XMarkIcon />}
                    endContent={<CheckIcon />}
                    onChange={() => {
                      const newApiKeys = [...apiKeys]
                      newApiKeys[index].enabled = !newApiKeys[index].enabled
                      setApiKeys(newApiKeys)
                    }}
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Square2StackIcon
                      className={`h-6 w-6 cursor-pointer ${
                        copiedKey === api.key ? 'text-primary' : 'text-gray-500'
                      } hover:text-primary`}
                      onClick={() => copyToClipboard(api.key)}
                    />
                    <TrashIcon
                      onClick={() => setIsDelete(true)}
                      className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-300"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        title="Delete API Key"
        content="Are you sure you want to delete this API Key?"
        show={isDelete}
        setShow={setIsDelete}
        confirmText="Done"
        onConfirm={() => {
          setIsDelete(false)
          deleteUser()
        }}
      />
    </div>
  )
}

export default APIIntegration
