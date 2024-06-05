import { Button } from '@/components/ui/Button'
import React from 'react'
import { PAYMENT_TYPES } from '.'
import { cn, notify } from '@/lib/utils'
import { CircleStackIcon } from '@heroicons/react/24/outline'

const PaymentTypeOption = ({
  fieldOption,
  selected,
  handleSelect,
  Icon,
  className,
}) => {
  return (
    <>
      <button
        onClick={handleSelect}
        className={cn(
          `border-primary-100 relative flex aspect-square max-h-40 flex-1 cursor-pointer items-center justify-center   rounded-md border bg-white p-5 text-[24px] tracking-tighter text-primary transition-colors duration-200 ease-in-out`,
          className,
          {
            'bg-primary text-white shadow-xl shadow-slate-500/10': selected,
          },
        )}
      >
        <Icon
          className={cn(
            'absolute left-20 z-0 h-24 w-24 font-bold text-gray-200/50 transition-all duration-150 ease-in-out',
            {
              'left-8': selected,
            },
          )}
        />
        <span className="z-10 font-bold">{fieldOption}</span>
      </button>
    </>
  )
}

const CreatePayment = ({
  changeScreen,
  paymentAction,
  updatePaymentFields,
  navigateForward,
  navigateBackwards,
}) => {
  function handleProceed() {
    if (paymentAction?.type == PAYMENT_TYPES[0].name) {
      navigateForward()
      return
    }
    notify('error', 'Not Available, Try again later')
  }
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex h-5/6 w-full items-center gap-2">
        {PAYMENT_TYPES.map((type, index) => {
          return (
            <PaymentTypeOption
              fieldOption={type.name}
              Icon={type.Icon}
              selected={paymentAction?.type == type.name}
              handleSelect={() => {
                updatePaymentFields({ type: type.name })
              }}
            />
          )
        })}
      </div>
      <div className="mt-4 flex h-1/6 w-full items-end justify-end">
        <Button onClick={handleProceed}>Next</Button>
      </div>
    </div>
  )
}

export default CreatePayment
