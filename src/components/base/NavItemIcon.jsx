'use client'

import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'

export default function NavItemIcon({
  isSelected,
  Icon,
  activeLayer,
  isExpanded,
  onIconPress,
}) {
  return (
    <Button
      isIconOnly
      onClick={onIconPress}
      className={cn(
        'z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-none shadow-slate-700/10 transition-all duration-500 ease-in-out group-hover:bg-primary group-hover:text-white',
        {
          ' bg-gradient-to-tr from-primary to-blue-300 font-bold':
            isSelected || (isSelected && activeLayer),
          ' bg-gradient-to-tr from-primary to-blue-300 text-white': activeLayer,
          'shadow-none': isExpanded,
        },
      )}
    >
      <Icon
        fontSize={18}
        className={cn('h-5 w-5 text-slate-500 group-hover:text-white', {
          'text-white': isSelected || activeLayer,
        })}
      />
    </Button>
  )
}
