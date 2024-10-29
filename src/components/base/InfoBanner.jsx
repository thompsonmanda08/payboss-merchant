"use client";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useAccountProfile from "@/hooks/useProfileDetails";

function InfoBanner({
  buttonText,
  infoText,
  onButtonPress,
  href,
  classNames,
  className,
  children,
  user,
}) {
  const { allowUserToSubmitKYC, isApprovedUser } = useAccountProfile();
  const { infoTextClasses, buttonClasses } = classNames || "";

  return (
    allowUserToSubmitKYC &&
    !isApprovedUser && (
      <div
        className={cn(
          "mb-4 flex max-h-16 flex-1 items-center justify-between rounded-lg bg-secondary/10 p-2 pl-5 text-orange-600",
          className
        )}
      >
        {children ? (
          //IF CHILDREN ARE PROVIDED
          <>{children}</>
        ) : (
          <>
            <div
              className={cn(
                "flex select-none items-center text-xs font-semibold tracking-tight text-orange-600 md:text-sm",
                infoTextClasses
              )}
            >
              <span className="-mt-1 mr-2 text-2xl">⚠️ </span> {infoText}
            </div>
            {!href ? (
              <Button
                size="sm"
                className={cn("text-xs", buttonClasses)}
                onClick={onButtonPress}
              >
                {buttonText}
              </Button>
            ) : (
              <Button
                as={Link}
                href={href}
                size="sm"
                className={cn("bg-secondary text-xs text-white", buttonClasses)}
              >
                {buttonText}
              </Button>
            )}
          </>
        )}
      </div>
    )
  );
}

export default InfoBanner;
