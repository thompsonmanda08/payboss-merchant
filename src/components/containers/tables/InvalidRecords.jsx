'use client'
import { useState } from 'react'
import SummaryTable from './SummaryTable'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Drawer from '@/components/base/Drawer'
import usePaymentsStore, { validationColumns } from '@/context/paymentsStore'
import PromptModal from '@/components/base/Prompt'
import { useDisclosure } from '@nextui-org/react'
import { EditBatchRecordForm } from '@/components/forms'

export default function InvalidRecords({ records }) {
  const { setSelectedRecord, selectedRecord, updateSelectedRecord } =
    usePaymentsStore()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const closeDeleteModal = () => {
    setSelectedRecord(null)
    onClose()
  }

  function closeEditDrawer() {
    setIsDrawerOpen(false)
    setSelectedRecord(null)
    onClose()
  }

  function handleDeleteEntry() {
    setDeleteLoading(true)
    // DELETE RECORD FROM API HERE

    setTimeout(() => {
      setDeleteLoading(false)
      closeDeleteModal()
    }, 2000)
  }

  // RENDER ACTIONS TO MODIFY/DELETE RECORD ENTRY
  const renderActions = (record) => (
    <div className="flex items-center justify-between">
      <PencilSquareIcon
        onClick={() => {
          setIsDrawerOpen(true)
          setSelectedRecord(record)
        }}
        className="h-5 w-5 cursor-pointer text-primary hover:text-primary/50"
      />
      <TrashIcon
        onClick={() => {
          onOpen()
          setSelectedRecord(record)
        }}
        className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-300"
      />
    </div>
  )

  return (
    <div className="">
      <SummaryTable
        columns={validationColumns}
        data={records}
        actions={renderActions}
      />

      {/* MODALS */}
      <PromptModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          closeDeleteModal()
          onClose()
        }}
        title="Delete Entry"
        onConfirm={handleDeleteEntry}
        confirmText="Deactivate"
        isDisabled={deleteLoading}
        isLoading={deleteLoading}
        isDismissable={false}
      >
        <p className="m-0 -mb-2">
          <strong>
            Are you sure you want to delete this entry from batch?
          </strong>
        </p>
        <p className="text-sm text-slate-700">
          This action cannot be undone. The record for{' '}
          <strong>{`${selectedRecord?.first_name} ${selectedRecord?.last_name}`}</strong>{' '}
          every will be lost{' '}
          <code className="rounded-md bg-red-50 p-1 px-2 text-xs font-semibold text-red-600">
            FOREVER
          </code>{' '}
          but your batch file will not be tempered with.
        </p>
      </PromptModal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Edit Entry"
      >
        <EditBatchRecordForm onClose={closeEditDrawer} />
      </Drawer>
    </div>
  )
}
