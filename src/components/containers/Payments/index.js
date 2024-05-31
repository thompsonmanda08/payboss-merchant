import { EmptyState, Modal } from '@/components/base'
import useCustomTabsHook from '@/hooks/CustomTabsHook'
import usePaymentsStore from '@/state/paymentsStore'
import CreatePayment from './CreatePayment'
import UploadCSVFile from './UploadCSVFile'
import BatchPaymentDetails from './BatchDetails'

export const PAYMENT_TYPES = ['Bulk Payment', 'Single Payment']

export const ALL_STEPS = []

const BatchPayment = ({}) => {
  const {
    updatePaymentFields,
    resetPaymentData,
    openPaymentsModal,
    setOpenPaymentsModal,
    paymentAction,
  } = usePaymentsStore((state) => state)

  // ** INITIALIZED PAYMENT TYPE FIELDS **//

  //************ STEPS TO CREATE A TASK FOR A STUDY PLAN *****************/
  const { activeTab, tabs, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CreatePayment
      key={'step-1'}
      screens={ALL_STEPS}
      changeScreen={handleScreenChange} //  forwards => navigateTo(1)
      paymentAction={paymentAction}
      updatePaymentFields={updatePaymentFields}
    />,
    <UploadCSVFile
      key={'step-2'}
      screens={ALL_STEPS}
      changeScreen={handleScreenChange} //  forwards => navigateTo(2)
      paymentAction={paymentAction}
      updatePaymentFields={updatePaymentFields}
    />,
    <BatchPaymentDetails
      key={'step-3'}
      screens={ALL_STEPS}
      changeScreen={handleScreenChange} //  backwards => navigateTo(2)
      paymentAction={paymentAction}
      updatePaymentFields={updatePaymentFields}
    />,
  ])

  // ** FUNCTION TO HANDLE THE SCREEN CHANGE **//
  function handleScreenChange(step) {
    return navigateTo(step)
  }

  return (
    <Modal
      show={openPaymentsModal}
      width={900}
      title="Create a payment"
      infoText={'Choose a payment you would like to initiate'}
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

export default BatchPayment
