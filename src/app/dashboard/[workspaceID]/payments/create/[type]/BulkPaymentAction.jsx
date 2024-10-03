'use client'
import { useEffect, useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import usePaymentsStore from '@/context/paymentsStore'
import UploadCSVFile from '@/components/containers/disbursements/UploadCSVFile'
import PaymentDetails from '@/components/containers/disbursements/BulkPaymentDetails'
import ValidationDetails from '@/components/containers/disbursements/ValidationDetails'
import RecordDetailsViewer from '@/components/containers/disbursements/RecordDetailsViewer'
import { useRouter, useSearchParams } from 'next/navigation'
import ApproverAction from '@/components/containers/disbursements/ApproverAction'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import Card from '@/components/base/Card'
import CardHeader from '@/components/base/CardHeader'
import ProgressStep from '@/components/elements/ProgressStep'
import InitiatorsLog from '@/components/containers/disbursements/InitiatorsLog'
import LoadingPage from '@/app/loading'

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

function BulkPaymentAction({ workspaceID }) {
  // ** INITIALIZES STEPS **//
  const [currentStep, setCurrentStep] = useState(STEPS[0])
  const urlParams = useSearchParams()
  const protocol = urlParams.get('protocol')

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    selectedProtocol,
    setSelectedProtocol,
    setSelectedActionType,
  } = usePaymentsStore()

  const router = useRouter()

  //************ STEPS TO CREATE A BULK PAYMENT ACTION *****************/
  const { activeTab, currentTabIndex, navigateForward, navigateBackwards } =
    useCustomTabsHook([
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

  //**************** USER ROLE CHECK *************************************** //
  // if (!role?.can_initiate) return router.back()

  // *************** CHECK FOR SERVICE PROTOCOL - REQUIRED *************** //
  // TODO: MAKE WORKSPACE USER COOKIE
  // if (!selectedProtocol) return <MissingConfigurationError />

  return !workspaceID && !selectedProtocol ? (
    <LoadingPage />
  ) : (
    <>
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
      <InitiatorsLog />

      {/**************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {(openAllRecordsModal ||
        openValidRecordsModal ||
        openInvalidRecordsModal) && <RecordDetailsViewer />}
      {/************************************************************************/}
    </>
  )
}

export default BulkPaymentAction
