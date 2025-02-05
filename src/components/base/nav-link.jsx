import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavLink({ href, children, active, Icon, className }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium tracking-tight text-foreground/70 transition-all duration-300 ease-in-out hover:text-primary sm:text-base",
        {
          "font-bold text-primary": active,
        },
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Link>
  );
}
