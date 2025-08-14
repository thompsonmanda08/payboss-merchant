import ProfileSecuritySettings from '@/app/manage-account/profile/components/security-settings';
import UserProfile from '@/components/elements/user-profile-card';
import { getUserSession } from '@/lib/session';
import { User } from '@/types/account';

async function AccountSettings() {
  const session = await getUserSession();
  const user = session?.user;

  return (
    <>
      <section
        className="flex w-full flex-col mb-6 px-4 md:px-4 gap-2"
        role="account-profile-header"
      >
        <h2 className="heading-3 !font-bold tracking-tight text-foreground ">
          Account Profile
        </h2>
        <p className="text-sm text-foreground-600">
          Manage your account profile and security settings.
        </p>
      </section>
      <section
        className="flex flex-col gap-4 px-4"
        role="account-profile-content"
      >
        <div className="flex w-full flex-col md:flex-row gap-4">
          <UserProfile showBusinessDetails user={user as Partial<User>} />
          <ProfileSecuritySettings />
        </div>
      </section>
    </>
  );
}

export default AccountSettings;
