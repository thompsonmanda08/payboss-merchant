import SupportForm from "@/components/forms/support-form";
import Logo from "@/components/base/logo";
import WorkspaceHeader from "@/components/welcome-header";

import AuthLayout from "../(auth)/layout";
import { getUserDetails } from "../_actions/config-actions";

async function Support() {
  const session = await getUserDetails();

  return (
    <AuthLayout>
      {session?.user && <WorkspaceHeader user={session?.user} />}
      <div className="-mt-[496px] flex flex-col items-center rounded-t-2xl border-b-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-black/40 via-black/5 to-transparent p-6 pb-10 pt-24">
        <Logo
          isWhite
          classNames={{
            wrapper: "scale-[1.5] mb-4",
          }}
        />
        <h2
          className={
            "w-full text-center text-[clamp(18px,18px+1vw,48px)] font-bold text-transparent text-white"
          }
        >
          Contact Support
        </h2>
        <p className="text-shadow-sm mb-0 text-center text-foreground">
          Need help with something?
        </p>
      </div>
      <SupportForm />
    </AuthLayout>
  );
}

export default Support;
