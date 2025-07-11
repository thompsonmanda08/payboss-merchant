import Link from "next/link";

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function NavLink({
  href,
  children,
  active,
  Icon,
  className,
}: PropsWithChildren & {
  href: string;
  active?: boolean;
  Icon?: React.ElementType;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium tracking-tight text-foreground/70 transition-all duration-300 ease-in-out hover:text-primary sm:text-base",
        {
          "font-bold text-primary": active,
        },
        className,
      )}
      href={href}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Link>
  );
}
