"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input-field";
import { Button } from "../ui/button";
import useAuthStore from "@/context/auth-store";
import { authenticateUser } from "@/app/_actions/auth-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Card from "../base/Card";
import StatusMessage from "../base/status-message";
import Link from "next/link";

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

    queryClient.invalidateQueries();
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
      <form role="form" onSubmit={handleLogin} className="flex flex-col gap-2">
        <Input
          placeholder="Enter your email or username"
          aria-label="Email"
          name={"emailusername"}
          label="Email or Username"
          aria-describedby="email-addon"
          onError={error?.onFields}
          onChange={(e) => {
            updateLoginDetails({ emailusername: e.target.value });
          }}
        />

        <Input
          type="password"
          name="password"
          placeholder="Enter Password"
          aria-label="Password"
          label="Password"
          aria-describedby="password-addon"
          onError={error?.onFields}
          onChange={(e) => {
            updateLoginDetails({ password: e.target.value });
          }}
        />
        <p className="-mt-1 ml-1 text-xs font-medium text-foreground/60 xl:text-sm">
          Forgot password?{" "}
          <Link
            href={"/support"}
            className="text-primary hover:text-primary/80"
          >
            Contact Support
          </Link>
        </p>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText={"Signing In..."}
          className={"mt-4 w-full"}
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
