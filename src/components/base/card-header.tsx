"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import React from "react";

function CardHeader({
  title,
  infoText,
  handleClose,
  className,
  classNames,
}: {
  title: string | React.ReactNode;
  infoText?: string | React.ReactNode;
  className?: string;
  classNames?: {
    titleClasses?: string;
    infoClasses?: string;
    innerWrapper?: string;
  };
  handleClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between ",
        className,
      )}
    >
      {title && (
        <div className={cn("flex flex-col", classNames?.innerWrapper)}>
          <h3
            className={cn(
              "font-semibold leading-8 tracking-tight text-foreground/80",
              classNames?.titleClasses,
            )}
          >
            {title}
          </h3>
          {infoText && (
            <p
              className={cn(
                "text-sm text-foreground-500",
                classNames?.infoClasses,
              )}
            >
              {infoText}
            </p>
          )}
        </div>
      )}
      {handleClose && (
        <div
          className="absolute -right-1 -top-2 cursor-pointer rounded-full p-2 text-primary/30 transition-all duration-300 ease-in-out hover:bg-primary/5 hover:text-primary"
          onClick={(e) => {
            handleClose();
            e.stopPropagation();
          }}
        >
          <XMarkIcon className="aspect-square w-5" />
        </div>
      )}
    </div>
  );
}

export default CardHeader;
