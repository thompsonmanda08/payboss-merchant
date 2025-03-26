"use client";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

function CardHeader({ title, infoText, handleClose, className, classNames }) {
  const { titleClasses, infoClasses, innerWrapper } = classNames || "";
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between ",
        className
      )}
    >
      {title && (
        <div className={cn("flex flex-col", innerWrapper)}>
          <h3
            className={cn(
              "font-semibold leading-8 tracking-tight text-foreground/80",
              titleClasses
            )}
          >
            {title}
          </h3>
          {infoText && (
            <p className={cn("text-sm text-foreground-500", infoClasses)}>
              {infoText}
            </p>
          )}
        </div>
      )}
      {handleClose && (
        <div
          onClick={handleClose}
          className="absolute -right-1 -top-2 cursor-pointer rounded-full p-2 text-primary/30 transition-all duration-300 ease-in-out hover:bg-primary/5 hover:text-primary"
        >
          <XMarkIcon className="aspect-square w-5" />
        </div>
      )}
    </div>
  );
}

export default CardHeader;
