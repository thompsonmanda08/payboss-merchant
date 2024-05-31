import { Button } from '@/components/ui/Button'
import React from 'react'
import { PAYMENT_TYPES } from '.'
import { cn } from '@/lib/utils'

const PaymentTypeOption = ({
  fieldOption,
  selected,
  handleSelect,
  className,
}) => {
  return (
    <>
      <button
        onClick={handleSelect}
        className={cn(
          `border-primary-100 flex aspect-square max-h-40 flex-1 cursor-pointer items-center justify-center rounded-md   border bg-white p-5 text-[24px] tracking-tighter text-primary transition-colors duration-200 ease-in-out `,
          className,
          {
            'bg-primary text-white shadow-xl': selected,
          },
        )}
      >
        {fieldOption}
      </button>
    </>
  )
}

const CreatePayment = ({
  changeScreen,
  paymentAction,
  updatePaymentFields,
}) => {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex h-5/6 w-full items-center gap-2">
        {PAYMENT_TYPES.map((type, index) => {
          return (
            <PaymentTypeOption
              fieldOption={type}
              selected={paymentAction?.type == type}
              handleSelect={() => {
                updatePaymentFields({ type })
              }}
            />
          )
        })}
      </div>
      <div className="mt-4 flex h-1/6 w-full items-end justify-end">
        <Button onClick={() => changeScreen(1)}>Next</Button>
      </div>
    </div>
  )
}

export default CreatePayment
