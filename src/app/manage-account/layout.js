import SettingsSideBar from "@/components/elements/settings-sidebar";

async function AccountSettingsLayout({ children }) {
  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SettingsSideBar />
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        {children}
      </div>
    </main>
  );
}

export default AccountSettingsLayout;
