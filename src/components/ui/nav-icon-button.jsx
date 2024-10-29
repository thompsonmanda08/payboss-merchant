"use client";
import { cn } from "@/lib/utils";
import { Button } from "./button";

function NavIconButton({ className, onClick, children }) {
  return (
    <Button
      className={cn(
        "cursor-pointer p-1 rounded-lg hover:text-primary text-slate-400 dark:text-slate-200 dark:bg-primary bg-foreground/5 text-foreground/60 dark:text-primary-foreground transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-[0.99] max-w-8 max-h-8 aspect-square",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default NavIconButton;
