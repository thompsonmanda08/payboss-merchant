'use client';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { ButtonProps } from '@heroui/react';

export default function NavItemIcon({
  isSelected,
  Icon,
  activeLayer,
  isExpanded,
  onIconPress,
  className,
  classNames,
  size,
}: {
  isSelected?: boolean;
  Icon: any;
  size?: ButtonProps['size'];
  activeLayer?: boolean;
  isExpanded?: boolean;
  onIconPress?: () => void;
  className?: string;
  classNames?: {
    button?: string;
    icon?: string;
  };
}) {
  return (
    <Button
      size={size}
      isIconOnly
      className={cn(
        'z-10 flex h-10 w-10 items-center justify-center rounded-lg dark:bg-primary-400/5 bg-background shadow-none shadow-slate-700/10 transition-all duration-500 ease-in-out group-hover:bg-primary group-hover:text-white',
        className,
        {
          ' bg-gradient-to-tr from-primary to-blue-300 font-bold':
            isSelected || (isSelected && activeLayer),
          ' bg-gradient-to-tr from-primary to-blue-300 text-white': activeLayer,
          'shadow-none bg-gradient-to-tr from-primary to-blue-300': isExpanded,
        },
        classNames?.button,
      )}
      onClick={onIconPress}
    >
      <Icon
        className={cn(
          'h-5 w-5 text-foreground/50 group-hover:text-white',
          {
            'text-white': isSelected || activeLayer || isExpanded,
          },
          classNames?.icon,
        )}
        fontSize={18}
      />
    </Button>
  );
}
