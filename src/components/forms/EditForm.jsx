import { Input } from '@/components/ui/InputField'

export default function EditForm() {
  return (
    <form action="#" className="mt-10">
      <div className="my-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="First Name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          required
        />
        <Input
          label="Last Name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          required
        />
      </div>
      <div className="my-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Input
          label="Phone #"
          name="phone_number"
          type="tel"
          autoComplete="tel"
          required
        />
      </div>
      <div className="my-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input label="NRC" name="nrc" type="text" autoComplete="nrc" required />
        <Input
          label="Account Type"
          name="account_type"
          type="text"
          autoComplete="acount-type"
          required
        />
      </div>
      <div className="my-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="Account #"
          name="account_number"
          type="text"
          autoComplete="acount-number"
          required
        />
        <Input
          label="Amount"
          name="amount"
          type="text"
          autoComplete="amount"
          required
        />
      </div>
      <div className="my-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <Input
          label="Bank Code"
          name="bank_code"
          type="text"
          autoComplete="bank-code"
          required
        />
        <Input
          label="Currency"
          name="currency"
          type="text"
          autoComplete="currency"
          required
        />
      </div>
    </form>
  )
}
