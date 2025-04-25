import { redirect } from "next/navigation";

import SideNavBar from "@/components/side-navbar";
import TopNavBar from "@/components/top-bar";

import {
  getAuthSession,
  getUserDetails,
  getWorkspaceSession,
} from "../_actions/config-actions";

export default async function DashboardLayout({ children }) {
  const authSession = await getAuthSession();

  if (!authSession?.accessToken) redirect("/login");

  const [session, workspaceSession] = await Promise.all([
    getUserDetails(),
    getWorkspaceSession(),
  ]);


  console.log("session", workspaceSession);

  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SideNavBar workspaceSession={workspaceSession} />
      <div className="flex max-h-screen w-full flex-col overflow-y-auto  p-5 pt-20 lg:pt-8">
        <TopNavBar user={session?.user} workspaceSession={workspaceSession} />
        {children}
      </div>
    </main>
  );
}
