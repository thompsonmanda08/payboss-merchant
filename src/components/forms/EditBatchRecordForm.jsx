'use client'
import { Input } from '@/components/ui/InputField'
import usePaymentsStore from '@/context/paymentsStore'
import { Button } from '../ui/Button'

export default function EditBatchRecordForm({ onClose }) {
  const {
    updateSelectedRecord,
    selectedRecord,
    loading,
    setLoading,
    saveSelectedRecord,
  } = usePaymentsStore()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await saveSelectedRecord()
    onClose()
  }
  return (
    <form action="#" onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
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
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
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
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="NRC"
          name="nrc"
          type="text"
          onChange={(e) => updateSelectedRecord({ nrc: e.target.value })}
          autoComplete="nrc"
          value={selectedRecord?.nrc}
          required
        />
        <Input
          label="Account Type"
          name="account_type"
          type="text"
          autoComplete="account-type"
          value={selectedRecord?.account_type}
          required
          onChange={(e) =>
            updateSelectedRecord({ account_type: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="Mobile/Account No."
          name="account_number"
          type="text"
          autoComplete="account_number"
          value={selectedRecord?.account_number}
          required
          onChange={(e) =>
            updateSelectedRecord({ account_number: e.target.value })
          }
        />
        <Input
          label="Amount"
          name="amount"
          type="text"
          autoComplete="amount"
          value={selectedRecord?.amount}
          required
          onChange={(e) => updateSelectedRecord({ amount: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="Bank Code"
          name="bank_code"
          type="text"
          autoComplete="bank_code"
          value={selectedRecord?.bank_code}
          required
          onChange={(e) => updateSelectedRecord({ bank_code: e.target.value })}
        />
      </div>
      <div className="mt-4 flex w-full items-end justify-center gap-4 md:justify-end">
        <Button
          aria-label="back"
          color="danger"
          className={'w-full max-w-xs'}
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          aria-label="save"
          type={'submit'}
          color="primary"
          isLoading={loading}
          isDisabled={loading}
          className="w-full max-w-xs "
          // onClick={saveSelectedRecord}
        >
          Save Changes
        </Button>
      </div>
    </form>
  )
}
