import { CheckCircleIcon } from '@heroicons/react/24/outline';

import { cn } from '@/lib/utils';

function ProgressStep({
  STEPS,
  currentTabIndex,
  className,
  classNames,
}: {
  STEPS: any[];
  currentTabIndex: number;
  className?: string;
  classNames?: any;
}) {
  return (
    <div
      className={cn(
        "before:content[''] relative z-0 my-8 flex flex-row items-center justify-between gap-4 text-base before:absolute before:left-0 before:right-0  before:top-1/2 before:z-10 before:h-[2px] before:bg-foreground/10 ",
        className,
      )}
    >
      {/* CTA STEP */}
      {STEPS.map((step, index) => {
        return (
          <div
            key={index}
            className={cn(
              'z-10 flex cursor-pointer flex-row items-center justify-center gap-4 bg-card px-6 text-sm font-medium',
              classNames?.content,
            )}
            onClick={(e) => {
              e.stopPropagation();
              // NEEDS NAVIGATION VALIDATION
              // Only users completed on each step can navigate directly to the next
              // navigateTo(index);
            }}
          >
            <span
              className={cn(
                `bg-foreground/20 before:bg-foreground/10 before:content[''] relative grid aspect-square h-6 w-6 place-items-center rounded-full text-xs text-slate-50 before:absolute before:-inset-1.5 before:rounded-full`,
                {
                  'bg-primary before:bg-primary/20': currentTabIndex >= index,
                },
                classNames?.contentItem,
              )}
            >
              {currentTabIndex >= index + 1 ? (
                <CheckCircleIcon className="p-0.5" />
              ) : (
                `${index + 1}`
              )}
            </span>
            {step.step}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressStep;
