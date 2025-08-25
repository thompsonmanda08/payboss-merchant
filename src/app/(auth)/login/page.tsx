import Link from 'next/link';

import LoginForm from '@/components/forms/login-form';
import { BGS_SUPER_MERCHANT_ID } from '@/lib/constants';

function LoginPage() {
  return (
    <div className="relative flex-1 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none">
      {/********************* LOGIN FORM *********************/}
      <LoginForm />
      {/********************* LOGIN FORM *********************/}
      <div className="my-10 bg-transparent text-center">
        <p className="mx-auto  font-inter text-base font-medium leading-6 tracking-normal text-foreground/50">
          Don&apos;t have an account?
          <Link
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-bold text-transparent"
            href={`/register/${BGS_SUPER_MERCHANT_ID}`}
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
