"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

import SignUpForm from "@/components/forms/signup-form";
import Spinner from "@/components/ui/custom-spinner";
import useConfigOptions from "@/hooks/use-config-options";
import useAuthStore from "@/context/auth-store";
import Logo from "@/components/base/payboss-logo";
import EmptyState from "@/components/elements/empty-state";
import { Button } from "@/components/ui/button";
import { BGS_SUPER_MERCHANT_ID } from "@/lib/constants";

export default function Register() {
  const params = useParams();
  const superMerchantID = params.ID || BGS_SUPER_MERCHANT_ID;
  const { isLoading, isError } = useConfigOptions();
  const { isAccountCreated } = useAuthStore((state) => state);
  const router = useRouter();

  return (
    <div className="relative -mt-[260px] md:-mt-[412px] xl:-mt-[432px] flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none ">
      {!isAccountCreated && (
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
      ) : isAccountCreated ? (
        <AccountCreatedSuccess />
      ) : (
        <SignUpForm superMerchantID={superMerchantID} />
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
    <Card className="m-auto mt-24 flex max-w-[600px] flex-col items-center justify-center lg:mt-40">
      <CardHeader className="items-center justify-center">
        <Logo href={"#"} />
      </CardHeader>
      <CardBody>
        <h2
          className={
            "w-full bg-gradient-to-tr from-primary via-primary/80 to-primary-light bg-clip-text text-center text-[clamp(18px,18px+0.5vw,36px)] font-bold text-transparent py-2"
          }
        >
          Account Created Successfully!
        </h2>
        <p className="max-w-md text-center text-xs leading-6 tracking-tight text-foreground/70 xl:text-sm">
          You will need to login and complete KYC to activate your account.
          Approval takes up to <span className="font-bold">48 Hours</span> after
          KYC is complete and submitted for review.
        </p>
      </CardBody>

      <CardFooter className="px-6">
        <Button as={Link} className={"w-full flex-1 my-2"} href={"/login"}>
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
