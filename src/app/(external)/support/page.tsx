import WorkspaceHeader from '@/components/elements/welcome-header';
import SupportForm from '@/components/forms/support-form';

import { getUserDetails } from '../../_actions/config-actions';
import AuthLayout from '@/app/(auth)/layout';

async function Support() {
  const [session] = await Promise.all([getUserDetails()]);

  return (
    <AuthLayout>
      {session?.user && (
        <WorkspaceHeader
          accountState={session?.kyc?.state}
          permissions={session?.userPermissions}
        />
      )}
      <div className="flex flex-col items-center border-b-0 p-6 ">
        <h2
          className={
            'w-full text-center text-[clamp(18px,18px+1vw,48px)] font-bold text-foreground'
          }
        >
          Contact Support
        </h2>
        <p className="text-shadow-sm mb-0 text-foreground">
          Need help with something?
        </p>
      </div>
      <SupportForm />
    </AuthLayout>
  );
}

export default Support;
