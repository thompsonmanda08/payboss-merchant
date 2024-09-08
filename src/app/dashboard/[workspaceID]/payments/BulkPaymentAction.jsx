'use client'
import { useEffect, useState } from 'react'
import { Card, CardHeader, ProgressStep } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import usePaymentsStore from '@/context/paymentsStore'
import UploadCSVFile from '@/components/containers/disbursements/UploadCSVFile'
import PaymentDetails from '@/components/containers/disbursements/BulkPaymentDetails'
import ValidationDetails from '@/components/containers/disbursements/ValidationDetails'
import RecordDetailsViewer from '@/components/containers/disbursements/RecordDetailsViewer'
import { useRouter, useSearchParams } from 'next/navigation'
import ApproverAction from '@/components/containers/disbursements/ApproverAction'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'

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
  {
    title: 'Create a payment - Approval Status',
    infoText: 'Approvals can only be done by account admins',
    step: 'Approval',
  },
]

function BulkPaymentAction({}) {
  // ** INITIALIZES STEPS **//
  const [currentStep, setCurrentStep] = useState(STEPS[0])
  const urlParams = useSearchParams()
  const protocol = urlParams.get('protocol')
  const router = useRouter()

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    updatePaymentFields,
    resetPaymentData,
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    selectedProtocol,
    setSelectedProtocol,
    setSelectedActionType,
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
    <ApproverAction
      key={'step-5'}
      // navigateForward={goForward}
      // navigateBackwards={goBack}
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
    setSelectedActionType(PAYMENT_SERVICE_TYPES[0])

    //TODO: => CLEAR DATA WHEN THE THE COMPONENT IS UNMOUNTED
    // return () => {
    //   resetPaymentData()
    // }
  }, [currentTabIndex])

  useEffect(() => {
    if (protocol) {
      setSelectedProtocol(protocol)
    }
  }, [protocol])

  return (
    <>
      {/************************* COMPONENT RENDERER *************************/}

      <Card className={'max-w-[1200px] flex-[2] rounded-2xl'}>
        <CardHeader
          title={
            <>
              {currentStep.title}
              {
                selectedProtocol && (
                  <span className="capitalize"> ({selectedProtocol})</span>
                ) //ONLY FOR THE CREATE PAYMENTS PAGE
              }
            </>
          }
          infoText={currentStep.infoText}
          handleClose={() => router.back()}
        />
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
