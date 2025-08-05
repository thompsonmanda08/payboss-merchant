"use client";

import { ArrowRightIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { cn } from "@/lib/utils";
import SoftBoxIcon from "@/components/base/soft-box-icon";
import { Button } from "@/components/ui/button";

function WorkspaceItem({
  name,
  description,
  href,
  isVisible,
  onClick,
}: {
  name: string;
  description?: string;
  href: string;
  isVisible?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      as={Link}
      className={cn(
        "flex h-auto w-full justify-start gap-4 border-[1px] dark:border-primary/5 border-primary-100 bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100 dark:bg-primary-400/5 dark:hover:border-primary-300 dark:hover:bg-primary-300/5",
        {
          "opacity-50 hover:opacity-90": !isVisible,
        },
      )}
      endContent={
        <ArrowRightIcon className="ml-auto mr-4 h-6 w-6 self-center text-primary-600" />
      }
      href={href}
      startContent={
        <SoftBoxIcon className={"w-18 h-20"}>
          <BriefcaseIcon />
        </SoftBoxIcon>
      }
      onPress={onClick}
    >
      <div className="flex flex-col items-start gap-2">
        <h3 className="heading-4 mb-1 capitalize text-primary !font-bold">
          {name}
        </h3>
        {description && (
          <div className="flex max-w-[260px] justify-between gap-2">
            <p className=" truncate text-sm font-medium text-foreground-500">
              {description}
            </p>
          </div>
        )}
      </div>
    </Button>
  );
}

export default WorkspaceItem;
