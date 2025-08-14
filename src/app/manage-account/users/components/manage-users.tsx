'use client';
import UsersTable from '@/components/tables/users-table';
import { cn } from '@/lib/utils';

function ManagePeople({
  users,
  roles,
  permissions,
}: {
  users: any;
  roles: any;
  permissions: any;
}) {
  return (
    <div className={cn('flex w-full flex-col gap-8')}>
      <div className="flex w-full flex-col">
        <h2 className="heading-3 !font-bold tracking-tight text-foreground">
          Manage People
        </h2>
        <p className="text-sm text-foreground-600">
          Streamline the management of user accounts and their workspaces.
        </p>
      </div>

      <UsersTable
        key={'all-users'}
        permissions={permissions}
        roles={roles}
        users={users}
      />
    </div>
  );
}

export default ManagePeople;
