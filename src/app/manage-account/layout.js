import SettingsSideBar from "@/components/settings-sidebar";
import React from "react";
import { getAuthSession } from "../_actions/config-actions";
import { redirect } from "next/navigation";

async function AccountSettingsLayout({ children }) {
  const authSession = await getAuthSession();

  if (!authSession?.accessToken) redirect("/login");

  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SettingsSideBar session={authSession} options={"account_settings"} />
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        {children}
      </div>
    </main>
  );
}

export default AccountSettingsLayout;
