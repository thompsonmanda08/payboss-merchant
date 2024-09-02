'use client'
import { cn, notify } from '@/lib/utils'
import { Modal } from '@/components/base'
import usePaymentsStore from '@/context/paymentsStore'
import { usePathname, useRouter } from 'next/navigation'
import useNavigation from '@/hooks/useNavigation'
import {
  ArrowRightCircleIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import CustomRadioGroup from '@/components/ui/CustomRadioGroup'
import { PAYMENT_PROTOCOL } from '@/lib/constants'
import { useEffect } from 'react'

const SelectPaymentType = () => {
  const router = useRouter()

  const {
    paymentAction,
    openPaymentsModal,
    updatePaymentFields,
    setOpenPaymentsModal,
    setSelectedProtocol,
    selectedProtocol,
    setSelectedActionType,
  } = usePaymentsStore()

  const { dashboardRoute } = useNavigation()

  const PAYMENT_SERVICE_TYPES = [
    {
      name: 'Bulk Transfer',
      Icon: CircleStackIcon,
      href: `${dashboardRoute}/payments/create/bulk`,
      index: 0,
    },
    {
      name: 'Single Transfer',
      Icon: ArrowRightCircleIcon,
      href: `${dashboardRoute}/payments/create/single`,
      index: 1,
    },
  ]

  function handleSelectServiceType(type) {
    updatePaymentFields({ type: type?.name })
    setSelectedActionType(type)
    setTimeout(() => {
      if (type?.name === '') {
        notify('warning', 'Selected Service Type')
        return
      }

      if (!setSelectedProtocol) {
        notify('warning', 'Please select a service protocol')
        return
      }

      router.push(`${type.href}/?protocol=${selectedProtocol}`)
      setOpenPaymentsModal(false)
    }, 800)
  }

  function handleProtocolSelection(option) {
    setSelectedProtocol(PAYMENT_PROTOCOL[option])
    updatePaymentFields({ protocol: PAYMENT_PROTOCOL[option] })
  }

  useEffect(() => {
    if (!selectedProtocol) {
      setSelectedProtocol(PAYMENT_PROTOCOL[0])
    }
  }, [])

  return (
    <>
      {/************************* MAIN MODAL RENDERER *************************/}
      <Modal
        show={openPaymentsModal}
        width={900}
        title={'Create a payment'}
        infoText={'Choose a payment you would like to initiate'}
        disableAction={true}
        removeCallToAction={true}
        onClose={() => {
          setOpenPaymentsModal(false)
        }}
      >
        <div className="flex h-full w-full flex-col justify-between">
          <div className="my-4">
            <CustomRadioGroup
              onChange={(option) => handleProtocolSelection(option)}
              labelText="Service Protocol"
              defaultValue={selectedProtocol}
              options={PAYMENT_PROTOCOL?.map((item, index) => (
                <div key={index} className="flex flex-1 capitalize">
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            />
          </div>
          <div className="flex h-5/6 w-full items-center gap-2">
            {PAYMENT_SERVICE_TYPES.map((type, index) => {
              return (
                <PaymentTypeOption
                  key={index}
                  fieldOption={type?.name}
                  Icon={type?.Icon}
                  href={type?.href}
                  selected={paymentAction?.type == type?.name}
                  handleSelect={() => handleSelectServiceType(type)}
                />
              )
            })}
          </div>
        </div>
      </Modal>
    </>
  )
}

function PaymentTypeOption({
  fieldOption,
  selected,
  handleSelect,
  Icon,
  className,
}) {
  return (
    <Button
      onClick={handleSelect}
      className={cn(
        `relative flex aspect-square h-40 max-h-40 flex-1 cursor-pointer items-center justify-center rounded-md border border-primary-100 bg-white p-5 text-[24px] tracking-tighter text-primary transition-colors duration-200 ease-in-out`,
        className,
        {
          'bg-primary text-white shadow-xl shadow-slate-500/10': selected,
        },
      )}
    >
      <Icon
        className={cn(
          'absolute left-20 z-0 scale-[2.5] font-bold text-gray-200/50 transition-all duration-150 ease-in-out',
          {
            'left-10': selected,
          },
        )}
      />
      <span className="z-10 font-bold">{fieldOption}</span>
    </Button>
  )
}

export default SelectPaymentType
