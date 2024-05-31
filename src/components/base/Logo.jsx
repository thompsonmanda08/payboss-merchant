'use client'
import Image from 'next/image'
import payBossLogo from '@/images/logos/payboss.svg'
import payBossLogoIcon from '@/images/logos/payboss-icon.svg'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function Logo({ isCollapsedNavBar, className, containerClasses }) {
  if (isCollapsedNavBar) {
    return (
      <div
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
      </div>
    )
  } else {
    return (
      <div
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
            'scale-[0.8] object-contain transition-all duration-300 ease-in-out sm:scale-90 md:scale-95 lg:translate-x-0 lg:scale-100',
            className,
          )}
          src={payBossLogo}
          width={120}
          height={48}
          alt="logo"
          priority
        />
      </div>
    )
  }
}
export default Logo
