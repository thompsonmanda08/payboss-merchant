'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const payBossLogo = '/images/logos/payboss.svg';
const payBossLogoWhite = '/images/logos/payboss_white.svg';

function Logo({
  isWhite = false,
  isBlack = false,
  className,
  classNames,
  href = '/',
  src,
}: {
  isBlack?: boolean;
  isWhite?: boolean;
  className?: string;
  classNames?: any;
  href?: string;
  src?: string;
}) {
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState(payBossLogo);

  useEffect(() => {
    if (src) return; // Use custom src if provided
    
    if (isWhite) {
      setLogoUrl(payBossLogoWhite);
    } else if (isBlack) {
      setLogoUrl(payBossLogo);
    } else {
      // Auto-switch based on theme
      setLogoUrl(theme === 'dark' ? payBossLogoWhite : payBossLogo);
    }
  }, [theme, isWhite, isBlack, src]);

  return (
    <Link
      className={cn(
        'aspect-auto max-h-[50px] min-h-12 min-w-fit',
        classNames?.wrapper
      )}
      href={href}
    >
      <Image
        priority
        alt="PayBoss Logo"
        className={cn(
          'object-contain transition-all duration-300 ease-in-out',
          className
        )}
        height={48}
        src={src || logoUrl}
        width={120}
      />
    </Link>
  );
}

export default Logo;
