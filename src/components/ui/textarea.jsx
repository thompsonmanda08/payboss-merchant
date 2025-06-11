import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, onError, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "border-red-500 focus:border-red-500/70 focus-visible:ring-red-500/30":
            onError,
          "opacity-50": isDisabled || props?.isDisabled || props?.disabled,
        },
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
