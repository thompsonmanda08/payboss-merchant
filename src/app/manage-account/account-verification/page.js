import { redirect } from "next/navigation";

import { getAuthSession, getUserDetails } from "@/app/_actions/config-actions";
import AccountVerification from "@/app/manage-account/account-verification/components";

export default async function AccountVerificationPage() {
  const session = await getUserDetails();
  const { accessToken } = await getAuthSession();

  if (!accessToken) redirect("/login");

  return <AccountVerification session={session} />;
}
