import { redirect } from 'next/navigation';

import { BGS_SUPER_MERCHANT_ID } from '@/lib/constants';

async function GoToRegisterPage() {
  return redirect(`/register/${BGS_SUPER_MERCHANT_ID}`);
}

export default GoToRegisterPage;
