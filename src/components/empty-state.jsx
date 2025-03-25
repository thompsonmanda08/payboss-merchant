import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function EmptyState({
  title,
  message,
  href,
  buttonText,
  onButtonClick,
  children,
  classNames,
}) {
  const { heading, paragraph } = classNames || "";
  return (
    <div className="my-12 flex h-full w-full flex-col items-center justify-center text-gray-300">
      <h3
        className={cn(
          `text-center text-2xl font-bold leading-8 text-primary-800 md:text-[48px]`,
          heading
        )}
      >
        {title || "Whoops-a-daisy!"}
      </h3>
      <p
        className={cn(
          `my-6 mb-4 max-w-[380px] p-2 px-5 text-center text-sm text-gray-400/80 md:max-w-[480px] md:text-base`,
          paragraph
        )}
      >
        {message || "There is nothing here yet. Please try again later."}
      </p>
      {children ||
        (!onButtonClick ? (
          <Button as={Link} href={href || "/"} className={"h-12 px-8"}>
            {buttonText || "Go Home"}
          </Button>
        ) : (
          <Button className={"px-8 py-3"} onClick={onButtonClick}>
            {buttonText || "Done"}
          </Button>
        ))}
    </div>
  );
}

export default EmptyState;
