import { cn } from "@/lib/utils";

import { Skeleton } from "../../../components/ui/skeleton";

function TotalStatsLoader({ length, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:justify-evenly",
        className,
      )}
    >
      {Array.from({ length: length || 4 }).map((_, index) => (
        <div key={index} className="flex flex-1 gap-2 ">
          <Skeleton className={"aspect-square w-12 bg-foreground-200"} />
          <div className="flex flex-col gap-1">
            <Skeleton className={"h-6 w-48 bg-foreground-200"} />
            <Skeleton className={"h-4 w-12 bg-foreground-200"} />
          </div>
          <Skeleton className={"h-7 w-14 bg-foreground-200"} />
        </div>
      ))}
    </div>
  );
}

export default TotalStatsLoader;
