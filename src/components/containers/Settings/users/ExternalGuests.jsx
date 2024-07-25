import UsersTable from "../../Tables/UsersTable";




// ! USERS WITH READ ACCESS ONLY
export default function ExternalGuestUsers() {
  return (
    <div className="flex w-full flex-col gap-y-10 rounded-md p-5">
      <UsersTable />
    </div>
  )
}
