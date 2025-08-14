import { BGS_SUPER_MERCHANT_ID } from '@/lib/constants';

import Register from './register';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ ID: string }>;
}) {
  const urlParams = await params;
  const superMerchantID = urlParams.ID || BGS_SUPER_MERCHANT_ID;

  return <Register superMerchantID={superMerchantID} />;
}
