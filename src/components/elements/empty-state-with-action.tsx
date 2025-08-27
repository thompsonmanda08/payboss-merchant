import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CircleAlertIcon } from 'lucide-react';

function ActionableEmptyState({
  Icon = CircleAlertIcon,
  title,
  description,
  className,
  classNames,
  href,
  buttonText,
  onButtonClick,
  children,
}: PropsWithChildren & {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  className?: string;
  classNames?: {
    icon?: string;
    container?: string;
    title?: string;
    description?: string;
  };
  href?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div
      className={cn(
        'my-12 flex h-full w-full flex-col items-center justify-center text-gray-300',
        className,
      )}
    >
      <Icon className={cn('w-16 h-16 ', classNames?.icon)} />
      <h4
        className={cn(
          'text-center text-lg leading-6 text-foreground font-semibold',
          classNames?.title,
        )}
      >
        {title}
      </h4>
      <p
        className={cn(
          'mb-2 text-center text-xs sm:text-sm text-gary-400',
          classNames?.description,
        )}
      >
        {description}
      </p>
      {children ||
        (!onButtonClick ? (
          <Button as={Link} className={'h-12 px-8'} href={href || '/'}>
            {buttonText || 'Go Home'}
          </Button>
        ) : (
          <Button className={'px-8 py-3'} onClick={onButtonClick}>
            {buttonText || 'Done'}
          </Button>
        ))}
    </div>
  );
}

export default ActionableEmptyState;
