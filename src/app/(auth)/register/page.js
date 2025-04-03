"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";

import SignUpForm from "@/components/forms/signup-form";
import Spinner from "@/components/ui/spinner";
import useConfigOptions from "@/hooks/useConfigOptions";
import useAuthStore from "@/context/auth-store";
import { Button } from "@/components/ui/button";
import Logo from "@/components/base/logo";
import EmptyState from "@/components/empty-state";

export default function Register() {
  const { isLoading, isError } = useConfigOptions();
  const accountCreated = useAuthStore((state) => state.accountCreated);
  const router = useRouter();

  return (
    <div className="relative -mt-[260px] md:-mt-[412px] xl:-mt-[432px] flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none ">
      {!accountCreated && (
        <div className="pt bg-red-5000 z-10 -mt-16 flex flex-col items-center rounded-t-2xl border-b-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-black/40 via-black/5 to-transparent p-6 pb-10 pt-24">
          <Logo isWhite classNames={{ wrapper: "scale-[1.5] mb-4" }} />
          <h2
            className={
              "w-full text-center text-[clamp(18px,18px+1vw,48px)] font-bold text-transparent text-white"
            }
          >
            Create an Account
          </h2>
          <p className="text-shadow-sm mb-0 text-center text-white">
            Join the PayBoss family and handle your payments easily!
          </p>
        </div>
      )}

      {/********************* REGISTER FORM *********************/}
      {isLoading ? (
        <Card className="flex h-[300px] w-full max-w-md items-center justify-center self-center bg-background p-5">
          <Spinner size={100} />
        </Card>
      ) : isError ? (
        <Card className="flex max-w-md items-center justify-center self-center bg-background p-5">
          <EmptyState
            buttonText={"Reload"}
            message={"Something went wrong. Try reloading the page!"}
            title={"Error"}
            onButtonClick={() => router.refresh()}
          />
        </Card>
      ) : accountCreated ? (
        <AccountCreatedSuccess />
      ) : (
        <SignUpForm />
      )}
      {/********************* REGISTER FORM *********************/}
      <div className="my-10 bg-transparent text-center">
        <p className="mx-auto font-inter text-base font-medium leading-6 tracking-normal text-foreground/50">
          Already have an account?
          <Link
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-bold text-transparent"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AccountCreatedSuccess() {
  return (
    <>
      <Card className="m-auto mt-24 flex max-w-[600px] flex-col items-center justify-center lg:mt-40">
        <div className="mx-auto mb-4 flex">
          <Logo />
        </div>
        <h2
          className={
            "w-full bg-gradient-to-tr from-primary via-primary/80 to-primary-light bg-clip-text text-center text-[clamp(18px,18px+0.5vw,36px)] font-bold text-transparent"
          }
        >
          Account Created Successfully!
        </h2>
        <p className="max-w-md py-4 pb-6 text-center text-sm leading-6 tracking-tight text-foreground/70 md:text-base">
          You will need to login and upload verification documents to verify
          your account. Approval takes up to{" "}
          <span className="font-bold">2 working days</span>, however you have
          limited access to your account until approval is completed.
        </p>

        <div className="grid w-full">
          <Button as={Link} className={"w-full flex-1"} href={"/login"}>
            Login
          </Button>
        </div>
      </Card>
    </>
  );
}
