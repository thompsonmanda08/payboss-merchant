import { CheckBadgeIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

import SoftBoxIcon from "./soft-box-icon";

function TimelineItem({ stage, isLastItem, isCompleted, isPending, Icon }) {
  return (
    <div
      className={cn("flex cursor-pointer p-2 py-4", {
        "before:bg-primary/20": isCompleted,
        "bg-gradient-to-r from-transparent via-primary-50 to-primary-50 dark:to-primary-400/5":
          isPending,
      })}
    >
      <SoftBoxIcon
        className={
          "relative before:absolute before:top-[115%] before:z-0 before:h-[36px] before:w-1 before:bg-foreground-500/10 before:content-['']"
        }
        classNames={{
          "border border-slate-300 from-transparent to-transparent text-slate-400":
            !isCompleted,
          "before:hidden": isLastItem,
        }}
      >
        {Icon ? <Icon /> : <CheckBadgeIcon />}
      </SoftBoxIcon>

      <div className="ml-4 flex flex-col">
        <h4 className="text-xs font-semibold uppercase text-slate-400">
          KYC Stage {stage?.ID}
        </h4>
        <p className="font-medium text-slate-600 text-xs sm:text-sm">
          {stage?.name}
        </p>
      </div>
    </div>
  );
}

export default TimelineItem;
