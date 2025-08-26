'use client';
import Card from '@/components/base/custom-card';
import { cn } from '@/lib/utils';

function SimpleStats({
  title,
  figure,
  smallFigure,
  isGood,
  isBad,
  Icon,
  classNames,
}: {
  title: string;
  figure: string;
  smallFigure?: string;
  isGood?: boolean;
  isBad?: boolean;
  Icon?: React.ElementType;
  classNames?: {
    heading?: string;
    smallFigureClasses?: string;
    figureClasses?: string;
  };
}) {
  const { heading, smallFigureClasses, figureClasses } = classNames || {};

  return (
    <Card
      className={
        'flex-1 flex-row items-center justify-between shadow-none border-border rounded-2xl'
      }
    >
      <div className="flex flex-col gap-3">
        <h2
          className={cn(
            'text-nowrap text-xs font-semibold text-foreground/50 md:text-sm capitalize',
            heading,
          )}
        >
          {title}
        </h2>
        <div
          className={cn(
            'text-nowrap text-lg font-bold text-foreground/80 md:text-xl lg:text-2xl',
            figureClasses,
          )}
        >
          {figure}
          {smallFigure && (
            <span
              className={cn(
                'ml-2 text-xs font-semibold text-foreground/50 sm:text-sm',
                smallFigureClasses,
                {
                  'text-green-500': isGood,
                  'text-rose-600': isBad,
                },
              )}
            >
              {smallFigure}
            </span>
          )}
        </div>
      </div>

      {Icon && (
        <div className="grid aspect-square h-14 w-14 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white">
          <Icon className="h-6 w-6" />
        </div>
      )}
    </Card>
  );
}

export default SimpleStats;
