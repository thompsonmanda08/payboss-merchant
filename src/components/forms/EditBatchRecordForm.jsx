'use client'
import { Input } from '@/components/ui/InputField'
import usePaymentsStore from '@/context/paymentsStore'
import { Button } from '../ui/Button'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BATCH_DETAILS_QUERY_KEY } from '@/lib/constants'
import StatusMessage from '../base/StatusMessage'

export default function EditBatchRecordForm({ onClose }) {
  const {
    updateSelectedRecord,
    selectedRecord,
    loading,
    setLoading,
    saveSelectedRecord,
    error,
    setError,
  } = usePaymentsStore()
  const queryClient = useQueryClient()

  async function onSubmit(e) {
    e.preventDefault()
    updateSelectedRecord({ remarks: 'Record Modified', edited: true })
    setLoading(true)
    const response = await saveSelectedRecord()

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [BATCH_DETAILS_QUERY_KEY, selectedRecord?.batchID],
      })
      onClose()
    }
  }

  useEffect(() => {
    setError({ status: false, message: '' })
  }, [selectedRecord])

  return (
    <form action="#" onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          label="First Name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          value={selectedRecord?.first_name}
          required
          onChange={(e) => updateSelectedRecord({ first_name: e.target.value })}
        />
        <Input
          label="Last Name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          value={selectedRecord?.last_name}
          required
          onChange={(e) => updateSelectedRecord({ last_name: e.target.value })}
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={selectedRecord?.email}
          required
          onChange={(e) => updateSelectedRecord({ email: e.target.value })}
        />
        <Input
          label="Mobile No"
          name="contact"
          type="tel"
          autoComplete="tel"
          value={selectedRecord?.contact}
          required
          onChange={(e) => updateSelectedRecord({ contact: e.target.value })}
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          label="NRC"
          name="nrc"
          type="text"
          onChange={(e) => updateSelectedRecord({ nrc: e.target.value })}
          autoComplete="nrc"
          value={selectedRecord?.nrc}
          required
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          label="Destination Account No."
          name="destination"
          type="text"
          autoComplete="account_number"
          value={selectedRecord?.destination}
          required
          onChange={(e) =>
            updateSelectedRecord({ destination: e.target.value })
          }
        />
        <Input
          label="Amount"
          name="amount"
          type="text"
          autoComplete="amount"
          value={selectedRecord?.amount}
          isDisabled
          required
          onChange={(e) => updateSelectedRecord({ amount: e.target.value })}
        />
      </div>

      {error?.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      <div className="mt-4 flex w-full flex-col gap-4 md:justify-end">
        <Button
          aria-label="save"
          type={'submit'}
          color="primary"
          isLoading={loading}
          isDisabled={loading}
          className="w-full  "
          // onClick={saveSelectedRecord}
        >
          Save Changes
        </Button>
        <Button
          aria-label="back"
          color="danger"
          variant="light"
          className={'w-full bg-red-50'}
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
