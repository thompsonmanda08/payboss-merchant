'use client'
import Image from 'next/image'
import payBossLogo from '@/images/logos/payboss.svg'
import payBossLogoIcon from '@/images/logos/payboss-icon.svg'
import Link from 'next/link'

function Logo({ isCollapsedNavBar }) {
  if (isCollapsedNavBar) {
    return (
      <div
        className={`${
          isCollapsedNavBar
            ? 'mx-auto max-h-[48px] min-h-12 max-w-10'
            : 'max-h-[50px] w-full'
        } flex aspect-square min-w-fit items-center justify-center`}
      >
        <Link href={'/'}>
          <Image
            className="object-contain"
            src={payBossLogoIcon}
            width={60}
            height={50}
            alt="logo"
            priority
          />
        </Link>
      </div>
    )
  } else {
    return (
      <div className={`aspect-auto max-h-[50px] min-h-12 min-w-fit`}>
        <Link href={'/'}>
          <Image
            className="scale-[0.8] object-contain transition-all duration-300 ease-in-out sm:scale-90 md:scale-95 lg:translate-x-0 lg:scale-100"
            src={payBossLogo}
            width={120}
            height={48}
            alt="logo"
            priority
          />
        </Link>
      </div>
    )
  }
}
export default Logo
