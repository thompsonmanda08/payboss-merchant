'use client'
import LoadingPage from '@/app/loading'
import { SoftBoxIcon } from '@/components/base'
import { Button } from '@/components/ui/Button'
import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  TicketIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { Suspense } from 'react'

export default function Payments() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4 rounded-lg">
        <Button
          as={Link}
          href={'/dashboard/payments/direct'}
          className="flex h-auto w-full shrink-0 justify-start gap-4 border-[1px] border-primary-50 bg-transparent p-2 hover:border-primary-100 hover:bg-primary-50"
          startContent={
            <SoftBoxIcon className={'w-18 h-20'}>
              <ArrowsRightLeftIcon />
            </SoftBoxIcon>
          }
          endContent={
            <ArrowRightIcon className="ml-auto mr-4 h-6 w-6 self-center text-primary-600" />
          }
        >
          <div>
            <h3 className="heading-5 mb-1 capitalize text-primary-600">
              DIRECT PAYMENTS
            </h3>
            <span className="-mt-1 text-xs font-medium italic text-slate-500">
              Make payments directly into mobile money or bank accounts
            </span>
          </div>
        </Button>
        <Button
          as={Link}
          href={'/dashboard/payments/vouchers'}
          className="flex h-auto w-full shrink-0 justify-start gap-4 border-[1px] border-primary-50 bg-transparent p-2 hover:border-primary-100 hover:bg-primary-50"
          startContent={
            <SoftBoxIcon className={'w-18 h-20'}>
              <TicketIcon />
            </SoftBoxIcon>
          }
          endContent={
            <ArrowRightIcon className="ml-auto mr-4 h-6 w-6 self-center text-primary-600" />
          }
        >
          <div>
            <h3 className="heading-5 mb-1 capitalize text-primary-600">
              VOUCHER PAYMENTS
            </h3>
            <span className="-mt-1 text-xs font-medium italic text-slate-500">
              Payouts to users, with inconsistent money withdraw point
            </span>
          </div>
        </Button>
      </div>
    </Suspense>
  )
}
