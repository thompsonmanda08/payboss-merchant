import { cn } from '@/lib/utils'
import { AvatarIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export function NavLink({ href, children, active, Icon }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium tracking-tight text-gray-500 transition-all duration-300 ease-in-out hover:text-primary sm:text-base',
        {
          'text-primary': active,
        },
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Link>
  )
}
