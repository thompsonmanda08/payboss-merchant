import { Button } from '@/components/ui/Button'
import React from 'react'
import { PAYMENT_TYPES } from '.'

const CreatePayment = ({
  changeScreen,
  paymentAction,
  updatePaymentFields,
}) => {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="bg-primary-50/50 text-primary-900 flex w-full items-center justify-center rounded-md py-2.5 text-center text-sm font-semibold tracking-tighter lg:text-base xl:text-lg">
        Start a payment
      </div>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-5/6 w-full flex-col items-center justify-center gap-2 text-center ">
          <div className="text-primary-900 mr-auto w-full self-start pt-4 text-sm tracking-tight  lg:text-base">
            What type of payment would you like to initiate
          </div>
          <div className="flex h-5/6 w-full items-center gap-2">
            <div
              onClick={() => {
                updatePaymentFields({ type: PAYMENT_TYPES[0] })
              }}
              className={`border-primary-100 flex aspect-square max-h-40 flex-1 cursor-pointer items-center justify-center rounded-md   border p-5 text-[24px] tracking-tighter transition-colors duration-200 ease-in-out 
              ${
                paymentAction?.type == PAYMENT_TYPES[0]
                  ? 'bg-primary text-white shadow-xl'
                  : 'bg-white text-primary'
              }
            `}
            >
              Bulk Payments
            </div>
            <div
              onClick={() => {
                updatePaymentFields({ type: PAYMENT_TYPES[0] })
              }}
              className={`border-primary-100 flex aspect-square max-h-40 flex-1 cursor-pointer items-center justify-center rounded-md border p-5 text-[24px] tracking-tighter transition-colors duration-200 ease-linear
              ${
                paymentAction?.type == PAYMENT_TYPES[1]
                  ? 'bg-primary text-white shadow-xl'
                  : 'text-primary-900 bg-white'
              }
              `}
            >
              Single Payments
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex h-1/6 w-full items-end justify-end">
        <Button onClick={() => changeScreen(1)}>Proceed</Button>
      </div>
    </div>
  )
}

export default CreatePayment
