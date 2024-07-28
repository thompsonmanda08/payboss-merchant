'use client'
import { useEffect, useState } from 'react'
import { Card, CardHeader, ProgressStep } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import usePaymentsStore from '@/context/paymentsStore'
import UploadCSVFile from './UploadCSVFile'
import PaymentDetails from './PaymentDetails'
import ValidationDetails from './ValidationDetails'
import RecordDetailsViewer from './RecordDetailsViewer'

export const STEPS = [
  {
    title: 'Create a Bulk payment',
    infoText: 'Upload a file with records of the recipient in `.csv` format',
    step: 'Upload File',
  },
  {
    title: 'Create a Bulk payment',
    infoText: 'Provide details for the payment action batch files',
    step: 'Batch Details',
  },
  {
    title: 'Create a payment - File Record Validation',
    infoText:
      'The validation will make sure all record entries do not cause internal errors',
    step: 'Validation',
  },
]

function BulkPaymentAction({ service }) {
  // ** INITIALIZES STEPS **//
  const [currentStep, setCurrentStep] = useState(STEPS[0])

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    updatePaymentFields,
    resetPaymentData,
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
  } = usePaymentsStore()

  //************ STEPS TO CREATE A TASK FOR A STUDY PLAN *****************/
  const {
    activeTab,
    currentTabIndex,
    navigateTo,
    navigateForward,
    navigateBackwards,
  } = useCustomTabsHook([
    <UploadCSVFile
      key={'step-2'}
      navigateForward={goForward}
      navigateBackwards={goBack}
    />,
    <PaymentDetails
      key={'step-3'}
      navigateForward={goForward}
      navigateBackwards={goBack}
    />,
    <ValidationDetails
      key={'step-4'}
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

    // CLEAR DATA WHEN THE THE COMPONENT IS UNMOUNTED
    // return () => {
    //   resetPaymentData()
    // }
  }, [currentTabIndex])

  return (
    <>
      {/************************* COMPONENT RENDERER *************************/}

      <Card className={'max-w-4xl rounded-2xl'}>
        <CardHeader title={currentStep.title} infoText={currentStep.infoText} />
        <ProgressStep STEPS={STEPS} currentTabIndex={currentTabIndex} />
        {activeTab}
      </Card>

      {/**************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {(openAllRecordsModal ||
        openValidRecordsModal ||
        openInvalidRecordsModal) && <RecordDetailsViewer />}
      {/************************************************************************/}
    </>
  )
}

export default BulkPaymentAction
