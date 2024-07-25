import UsersTable from '../../Tables/UsersTable'

//! USERS WHO BELONG TO A WORKSPACE
export default function WorkspaceMembers() {
  return (
    <div className="flex w-full flex-col gap-y-10 rounded-md p-5">
      <UsersTable />
    </div>
  )
}
