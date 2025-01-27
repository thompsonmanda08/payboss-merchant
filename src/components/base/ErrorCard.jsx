import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import Logo from "./Logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ErrorCard({
  title,
  message,
  status,
  href,
  handleReload,
  className,
  buttonText,
}) {
  const router = useRouter();
  return (
    <Card
      className={cn(
        "mx-auto aspect-square w-full max-w-sm flex-1 p-6 font-inter",
        className
      )}
    >
      <CardHeader>
        <Logo href="/" className="mx-auto" containerClasses={"mx-auto"} />
      </CardHeader>
      <CardBody className="flex cursor-pointer select-none flex-col items-center justify-center p-0">
        <p className="text-[clamp(32px,5vw,60px)] font-bold leading-normal text-primary-700">
          {status || "404"}
        </p>
        <h1 className="text-lg font-semibold capitalize text-gray-900">
          {title || "Page not found"}
        </h1>
        <p className="my-3 max-w-[300px] text-center text-sm font-medium text-foreground/70">
          {message || "Sorry, we couldn’t find the page you’re looking for."}
        </p>
      </CardBody>

      <CardFooter>
        {handleReload && !href ? (
          <Button
            className="w-full"
            onClick={() => {
              router.refresh();
              handleReload();
            }}
          >
            {buttonText || "Reload"}
          </Button>
        ) : (
          <Button as={Link} href={href || "/"} className="w-full">
            Go back home
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function PermissionDenied() {
  const router = useRouter();

  return (
    <div className="flex-2 m-auto flex min-h-[50svh] w-full flex-1 items-center justify-center">
      <ErrorCard
        status={"401"}
        title={"Permission Denied"}
        message={"You do have the permissions to view this page"}
        handleReload={() => router.back()}
        buttonText={"Go back"}
      />
    </div>
  );
}

export function MissingConfigurationError() {
  const router = useRouter();

  return (
    <div className="flex-2 m-auto flex min-h-[50svh] w-full flex-1 items-center justify-center">
      <ErrorCard
        status={"Error"}
        title={"Missing Configuration"}
        message={
          "Start the action again to correctly set the configuration variables"
        }
        handleReload={() => router.back()}
        buttonText={"Go back"}
      />
    </div>
  );
}
