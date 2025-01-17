"use client";
import Image from "next/image";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const payBossLogo = "/images/logos/payboss.svg";
const payBossLogoWhite = "/images/logos/payboss_white.svg";
const payBossLogoIcon = "/images/logos/payboss-icon.svg";

function Logo({
  isWhite = false,
  isCollapsedNavBar,
  className,
  containerClasses,
  href,
}) {
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState(payBossLogo);

  useEffect(() => {
    let logoType;
    if (isCollapsedNavBar) {
      logoType = payBossLogoIcon;
    } else {
      logoType = logoType = theme === "light" ? payBossLogo : payBossLogoWhite;
    }

    setLogoUrl(logoType);
  }, [theme, isCollapsedNavBar]);

  if (isCollapsedNavBar) {
    return (
      <Link
        href={href || "/"}
        className={cn(
          "flex aspect-square min-w-fit items-center justify-center ",
          containerClasses,
          {
            "mx-auto max-h-[48px] min-h-12 max-w-10": isCollapsedNavBar,
            "max-h-[50px] w-full": !isCollapsedNavBar,
          }
        )}
      >
        <Image
          className={cn("object-contain", className)}
          src={logoUrl}
          width={60}
          height={50}
          alt="logo"
          priority
        />
      </Link>
    );
  } else {
    return (
      <Link
        href={href || "/"}
        className={cn(
          "aspect-auto max-h-[50px] min-h-12 min-w-fit",
          containerClasses,
          {
            // 'mx-auto max-h-[48px] min-h-12 max-w-10': isCollapsedNavBar,
            // 'max-h-[50px] w-full': !isCollapsedNavBar,
          }
        )}
      >
        <Image
          className={cn(
            "-translate-x-2 scale-[0.9] object-contain transition-all duration-300 ease-in-out sm:scale-90 md:scale-95 lg:translate-x-0 lg:scale-100",
            className
          )}
          src={isWhite ? payBossLogoWhite : logoUrl}
          width={120}
          height={48}
          alt="logo"
          priority
        />
      </Link>
    );
  }
}
export default Logo;
