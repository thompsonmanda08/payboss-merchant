"use client";
import { cn } from "@/lib/utils";

import Spinner from "./custom-spinner";

function Loader({
  size = 50,
  loadingText,
  color,
  className,
  classNames,
  isLandscape,
}) {
  const { container, wrapper, spinner, text } = classNames || "";

  return (
    <div
      className={cn(
        "grid min-h-80 min-w-80 flex-1 flex-grow place-items-center rounded-xl bg-card/10 py-8",
        wrapper
      )}
    >
      <div
        className={cn(
          "flex w-max flex-col items-center justify-start gap-4",
          container,
          className,
          { "flex-row": isLandscape }
        )}
      >
        <Spinner className={spinner} color={color} size={size} />
        {loadingText && (
          <p
            className={cn(
              "mt-4 max-w-sm break-words font-bold text-foreground/80",
              text
            )}
          >
            {loadingText}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loader;
