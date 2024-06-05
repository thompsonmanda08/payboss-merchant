'use client'
import { EmptyState, Modal } from '@/components/base'
import useCustomTabsHook from '@/hooks/CustomTabsHook'
import usePaymentsStore from '@/state/paymentsStore'
import CreatePayment from './CreatePayment'
import UploadCSVFile from './UploadCSVFile'
import PaymentDetails from './PaymentDetails'
import {
  ArrowRightCircleIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'
import ValidationDetails from './ValidationDetails'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { capitalize } from '@/lib/utils'

export const PAYMENT_TYPES = [
  { name: 'Bulk Payment', Icon: CircleStackIcon },
  { name: 'Single Payment', Icon: ArrowRightCircleIcon },
]

export const STEPS = [
  {
    title: 'Create a payment',
    infoText: 'Choose a payment you would like to initiate',
  },
  {
    title: 'Create a payment - Upload File',
    infoText: 'Upload a file with records of the recipient in `.csv` format',
  },
  {
    title: 'Create a payment - Details',
    infoText: 'Provide details for the payment action batch files',
  },
  {
    title: 'Create a payment - File Record Validation',
    infoText:
      'The validation will make sure all record entries do not cause internal errors',
  },
]

const PaymentsAction = ({}) => {
  // ** INITIALIZES STEPS **//
  const [currentStep, setCurrentStep] = useState(STEPS[0])

  const pathname = usePathname()

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    updatePaymentFields,
    paymentAction,
    resetPaymentData,
    openPaymentsModal,
    setOpenPaymentsModal,
  } = usePaymentsStore()

  //************ STEPS TO CREATE A TASK FOR A STUDY PLAN *****************/
  const {
    activeTab,
    tabs,
    currentTabIndex,
    navigateTo,
    navigateForward,
    navigateBackwards,
  } = useCustomTabsHook([
    <CreatePayment
      key={'step-1'}
      changeScreen={handleScreenChange} //  forwards => navigateTo(1)
      updatePaymentFields={updatePaymentFields}
      paymentAction={paymentAction}
      navigateForward={goForward}
      navigateBackwards={goBack}
    />,
    <UploadCSVFile
      key={'step-2'}
      changeScreen={handleScreenChange} //  forwards => navigateTo(2)
      paymentAction={paymentAction}
      updatePaymentFields={updatePaymentFields}
      navigateForward={goForward}
      navigateBackwards={goBack}
    />,
    <PaymentDetails
      key={'step-3'}
      changeScreen={handleScreenChange} //  forwards => navigateTo(3)
      paymentAction={paymentAction}
      updatePaymentFields={updatePaymentFields}
      navigateForward={goForward}
      navigateBackwards={goBack}
    />,
    <ValidationDetails
      key={'step-4'}
      changeScreen={handleScreenChange} //  backwards => navigateTo(3)
      paymentAction={paymentAction}
      updatePaymentFields={updatePaymentFields}
      navigateForward={goForward}
      navigateBackwards={goBack}
    />,
  ])

  // ** FUNCTIONS TO HANDLE THE SCREEN CHANGE **//
  function handleScreenChange(step) {
    return navigateTo(step)
  }

  function goForward() {
    navigateForward()
  }

  function goBack() {
    navigateBackwards()
  }

  useEffect(() => {
    setCurrentStep(STEPS[currentTabIndex])
  }, [currentTabIndex])

  useEffect(() => {
    const pathArr = pathname.split('/')
    const service = pathArr[pathArr.length - 1].replaceAll('-', ' ')

    updatePaymentFields({ serviceAction: service.toUpperCase() })
  }, [])

  return (
    <Modal
      show={openPaymentsModal}
      width={900}
      title={currentStep.title}
      infoText={currentStep.infoText}
      disableAction={true}
      removeCallToAction={true}
      onClose={() => {
        setOpenPaymentsModal(false)
        resetPaymentData()
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-between gap-2 pt-2">
        {tabs ? (
          activeTab
        ) : (
          <EmptyState
            title={'Oops Sorry!'}
            message={'There seems to be a problem here, Try again later.'}
          >
            <div></div>
          </EmptyState>
        )}
      </div>
    </Modal>
  )
}

export default PaymentsAction
