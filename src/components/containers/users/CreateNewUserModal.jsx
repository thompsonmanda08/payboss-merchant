import { Modal } from '@/components/base'
import { Input } from '@/components/ui/input'

function CreateNewUserModal({ openCreateUserModal, toggleCreateUserModal }) {
  function handleCreateUser() {
    // CREATE A USER
  }

  return (
    openCreateUserModal && (
      <Modal
        show={openCreateUserModal}
        onClose={toggleCreateUserModal}
        onConfirm={handleCreateUser}
        title={'Create New User'}
        infoText={''}
      >
        <div className="mb-2"></div>
        <div className="flex flex-col gap-y-2">
          <Input label="Full Name" />
          <Input label="Phone #" />
          <Input label="Email Address" />
          <Input label="Job Title" />
        </div>
      </Modal>
    )
  )
}

export default CreateNewUserModal
