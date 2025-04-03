import { redirect } from "next/navigation";

import SettingsSideBar from "@/components/settings-sidebar";

import { getAuthSession, getUserDetails } from "../_actions/config-actions";

async function AccountSettingsLayout({ children }) {
  const authSession = await getAuthSession();
  const session = await getUserDetails();

  if (!authSession?.accessToken) redirect("/login");

  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SettingsSideBar options={"account_settings"} session={session} />
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        {children}
      </div>
    </main>
  );
}

export default AccountSettingsLayout;
