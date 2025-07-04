"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { Input } from "@/components/ui/input-field";
import useAuthStore from "@/context/auth-store";
import { authenticateUser } from "@/app/_actions/auth-actions";

import { Button } from "../ui/button";
import Card from "../base/custom-card";
import StatusMessage from "../base/status-message";

function LoginForm() {
  const { push } = useRouter();
  const {
    loginDetails,
    updateLoginDetails,
    updateErrorStatus,
    setIsLoading,
    error,
    setError,
    isLoading,
    setAuth,
    resetAuthData,
  } = useAuthStore();

  const urlParams = useSearchParams();
  const queryClient = useQueryClient();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const emailusername = formData.get("emailusername");
    const password = formData.get("password");
    const loginDetails = { emailusername, password };

    if (!emailusername || !password) {
      updateErrorStatus({
        onFields: true,
        status: true,
        message: "Provide login credentials",
      });
      setIsLoading(false);

      return;
    }

    const response = await authenticateUser(loginDetails);

    if (!response?.success) {
      updateErrorStatus({
        status: !response?.success,
        message: response?.message,
      });
      setIsLoading(false);

      return;
    }
    console.log("REDIRECTING TO WORKSPACES ==>", response);

    // queryClient.invalidateQueries();
    setAuth(response?.data);
    const loginUrl = urlParams.get("callbackUrl") || "/workspaces";

    push(loginUrl);
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
          label="Email or Username"
          name={"emailusername"}
          placeholder="Enter your email or username"
          onChange={(e) => {
            updateLoginDetails({ emailusername: e.target.value });
          }}
          onError={error?.onFields}
        />

        <Input
          aria-describedby="password-addon"
          aria-label="Password"
          label="Password"
          name="password"
          placeholder="Enter Password"
          type="password"
          onChange={(e) => {
            updateLoginDetails({ password: e.target.value });
          }}
          onError={error?.onFields}
        />
        <p className="-mt-1 ml-1 text-xs font-medium text-foreground/60 xl:text-sm">
          Forgot password?{" "}
          <Link
            className="text-primary hover:text-primary/80"
            href={"/support"}
          >
            Contact Support
          </Link>
        </p>
        <Button
          className={"mt-4 w-full"}
          isLoading={isLoading}
          loadingText={"Signing In..."}
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
