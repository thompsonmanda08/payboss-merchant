'use client'
import { EmptyState, Modal } from '@/components/base'
import usePaymentsStore from '@/context/paymentsStore'

export const ADD_EDIT_MODES = [
  {
    title: 'Add Payment MEthod',
    infoText: 'Add a payment method you would like to use',
  },
  {
    title: 'Edit Payment Method',
    infoText: 'Upload a file with records of the recipient in `.csv` format',
  },
]

const AddOrEditPaymentMethod = ({}) => {
  const { openAddOrEditModal, setOpenAddOrEditModal } = usePaymentsStore()

  return (
    <Modal
      show={openAddOrEditModal}
      width={500}
      title={currentStep.title}
      infoText={currentStep.infoText}
      // disableAction={true}
      // removeCallToAction={true}
      onClose={() => {
        setOpenAddOrEditModal(false)
        resetPaymentData()
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-between gap-2 pt-2">
        ADD OR EDIT INPUT FIELDS GO HERE
      </div>
    </Modal>
  )
}

export default AddOrEditPaymentMethod
