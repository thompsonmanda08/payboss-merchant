import UsersTable from '../../Tables/UsersTable'

//! USERS WHO ARE MEMBERS OF THE ORGANIZATION
export default function InternalGuestUsers() {
  return (
    <div className="flex w-full flex-col gap-y-10 rounded-md p-5">
      <UsersTable />
    </div>
  )
}
