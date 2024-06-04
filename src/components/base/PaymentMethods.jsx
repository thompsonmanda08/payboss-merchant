import React from 'react'
import { Card } from '.'
import { Button } from '../ui/Button'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import MaterCardLogo from '@/images/logos/mastercard-logo.svg'
import VisaLogo from '@/images/logos/visa-logo.svg'
import PayBossLogo from '@/images/logos/payboss-icon.svg'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

export function CardDetails({ logoSrc, cardNumber, handleEdit }) {
  return (
    <div className="flex flex-1 items-center justify-between gap-4 rounded-xl border p-4">
      <div className="flex h-10 w-12">
        <Image
          className="flex w-full scale-75 object-contain"
          src={logoSrc || PayBossLogo}
          width={60}
          height={36}
          alt=""
        />
      </div>
      <p className="text-nowrap text-base font-medium leading-6 tracking-wide text-gray-600">
        {cardNumber || '**** **** **** 4545'}
      </p>
      <button onClick={handleEdit} className="ml-auto">
        <PencilSquareIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

function PaymentMethods() {
  return (
    <Card className={'w-full flex-1 gap-4 rounded-2xl'}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 sm:text-base">
          Payment Methods
        </h2>
        <Button>
          <PlusIcon className="mr-2 h-5 w-5 font-bold" /> ADD NEW
        </Button>
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <CardDetails logoSrc={VisaLogo} />
        <CardDetails logoSrc={MaterCardLogo} />
        <CardDetails />
      </div>
    </Card>
  )
}

export default PaymentMethods
