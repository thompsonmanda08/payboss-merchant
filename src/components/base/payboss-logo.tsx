"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const payBossLogo = "/images/logos/payboss.svg";
const payBossLogoWhite = "/images/logos/payboss_white.svg";
const payBossLogoIcon = "/images/logos/payboss-icon.svg";

function Logo({
  isWhite = false,
  isCollapsedNavBar,
  className,
  classNames,
  href,
  src,
}: {
  isWhite?: boolean;
  isCollapsedNavBar?: boolean;
  className?: string;
  classNames?: any;
  href?: string;
  src?: string;
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
        className={cn(
          "flex aspect-square min-w-fit items-center justify-center ",

          classNames?.wrapper,
          {
            "mx-auto max-h-[48px] min-h-12 max-w-10": isCollapsedNavBar,
            "max-h-[50px] w-full": !isCollapsedNavBar,
          },
        )}
        href={href || "/"}
      >
        <Image
          priority
          alt="logo"
          className={cn("object-contain", className)}
          height={50}
          src={src || logoUrl}
          width={60}
        />
      </Link>
    );
  } else {
    return (
      <Link
        className={cn(
          "aspect-auto max-h-[50px] min-h-12 min-w-fit",
          classNames?.wrapper,
          {
            // 'mx-auto max-h-[48px] min-h-12 max-w-10': isCollapsedNavBar,
            // 'max-h-[50px] w-full': !isCollapsedNavBar,
          },
        )}
        href={href || "/"}
      >
        <Image
          priority
          alt="logo"
          className={cn(
            "-translate-x-2 scale-[0.9] object-contain transition-all duration-300 ease-in-out sm:scale-90 md:scale-95 lg:translate-x-0 lg:scale-100",
            className,
          )}
          height={48}
          src={src ? src : isWhite ? payBossLogoWhite : logoUrl}
          width={120}
        />
      </Link>
    );
  }
}
export default Logo;
