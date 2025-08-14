'use client';
import Link from 'next/link';
import { useEffect } from 'react';

import { authenticateUser } from '@/app/_actions/auth-actions';
import { Input } from '@/components/ui/input-field';
import useAuthStore from '@/context/auth-store';
import { LoginPayload } from '@/types/account';

import Card from '../base/custom-card';
import StatusMessage from '../base/status-message';
import { Button } from '../ui/button';

function LoginForm() {
  const {
    loginDetails,
    updateLoginDetails,
    updateErrorStatus,
    setIsLoading,
    error,
    setError,
    isLoading,

    resetAuthData,
  } = useAuthStore();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailusername = formData.get('emailusername') as string;
    const password = formData.get('password') as string;
    const loginDetails: LoginPayload = { emailusername, password };

    if (!emailusername || !password) {
      updateErrorStatus({
        onFields: true,
        status: true,
        message: 'Provide login credentials',
      });
      setIsLoading(false);

      return;
    }

    const response = await authenticateUser(loginDetails);

    if (response?.success) {
      window.location.href = '/workspaces';

      return;
    }

    updateErrorStatus({
      status: !response?.success,
      message: response?.message,
    });
    setIsLoading(false);

    return;
  }

  useEffect(() => {
    // Clean out any errors if the user makes any changes to the form
    setError({});

    // RESET ALL AUTH DATA
    return () => {
      setError({});
      resetAuthData();
    };
  }, [loginDetails]);

  return (
    <Card className="mx-auto w-full max-w-sm flex-auto p-6 ">
      <form className="flex flex-col gap-2" role="form" onSubmit={handleLogin}>
        <Input
          aria-describedby="email-addon"
          aria-label="Email"
          isInvalid={error?.onFields}
          label="Email or Username"
          name={'emailusername'}
          placeholder="Enter your email or username"
          onChange={(e) => {
            updateLoginDetails({ emailusername: e.target.value });
          }}
        />

        <Input
          aria-describedby="password-addon"
          aria-label="Password"
          isInvalid={error?.onFields}
          label="Password"
          name="password"
          placeholder="Enter Password"
          type="password"
          onChange={(e) => {
            updateLoginDetails({ password: e.target.value });
          }}
        />
        <p className="-mt-1 ml-1 text-xs font-medium text-foreground/60 xl:text-sm">
          Forgot password?{' '}
          <Link
            className="text-primary hover:text-primary/80"
            href={'/support'}
          >
            Contact Support
          </Link>
        </p>
        <Button
          className={'mt-4 w-full'}
          isLoading={isLoading}
          loadingText={'Signing In...'}
          type="submit"
        >
          Sign in
        </Button>
      </form>
      {error && error?.status && (
        <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}
    </Card>
  );
}

export default LoginForm;
