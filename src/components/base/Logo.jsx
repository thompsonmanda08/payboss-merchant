'use client'
import Image from 'next/image'
import payBossLogo from '@/images/logos/payboss.svg'
import payBossLogoWhite from '@/images/logos/payboss_white.svg'
import payBossLogoIcon from '@/images/logos/payboss-icon.svg'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function Logo({
  isWhite = false,
  isCollapsedNavBar,
  className,
  containerClasses,
  href,
}) {
  if (isCollapsedNavBar) {
    return (
      <Link
        href={href || '/'}
        className={cn(
          'flex aspect-square min-w-fit items-center justify-center ',
          containerClasses,
          {
            'mx-auto max-h-[48px] min-h-12 max-w-10': isCollapsedNavBar,
            'max-h-[50px] w-full': !isCollapsedNavBar,
          },
        )}
      >
        <Image
          className={cn('object-contain', className)}
          src={payBossLogoIcon}
          width={60}
          height={50}
          alt="logo"
          priority
        />
      </Link>
    )
  } else {
    return (
      <Link
        href={href || '/'}
        className={cn(
          'aspect-auto max-h-[50px] min-h-12 min-w-fit',
          containerClasses,
          {
            // 'mx-auto max-h-[48px] min-h-12 max-w-10': isCollapsedNavBar,
            // 'max-h-[50px] w-full': !isCollapsedNavBar,
          },
        )}
      >
        <Image
          className={cn(
            '-translate-x-2 scale-[0.9] object-contain transition-all duration-300 ease-in-out sm:scale-90 md:scale-95 lg:translate-x-0 lg:scale-100',
            className,
          )}
          src={isWhite ? payBossLogoWhite : payBossLogo}
          width={120}
          height={48}
          alt="logo"
          priority
        />
      </Link>
    )
  }
}
export default Logo
