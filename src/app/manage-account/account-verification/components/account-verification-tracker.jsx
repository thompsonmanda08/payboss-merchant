import Image from "next/image";
import { now, getLocalTimeZone } from "@internationalized/date";
import {
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

import { cn, formatDate } from "@/lib/utils";

import CardHeader from "@/components/base/card-header";
import TimelineItem from "@/components/base/timeline-item";
import { Button } from "@/components/ui/button";
import useKYCInfo from "@/hooks/useKYCInfo";

function ProgressStageTracker({ onCompletionNavigateTo }) {
  const fullDate = new Date(now(getLocalTimeZone()).toString().split("T")[0]);
  const date = formatDate(fullDate).replaceAll("-", " ");
  const time = fullDate.toLocaleTimeString();
  const { KYCStageID, allowUserToSubmitKYC } = useKYCInfo();

  const STAGES = [
    {
      ID: 1,
      name: "Account Details & Document Submission",
      infoText:
        "Documents as well as business information submission. Try reloading the page or come back later for a status update.",
      Icon: ClipboardDocumentCheckIcon,
    },
    {
      ID: 2,
      name: "Account Screening Pending Approval",
      infoText:
        "Your account and your KYC data is being reviewed by the PayBoss support team. You will receive an email notification when your application has been reviewed",
      Icon: ShieldExclamationIcon,
    },

    {
      ID: 3,
      name: "Account Approved",
      infoText:
        "Congratulations! Your account has been approved, enjoy the PayBoss services to the fullest",
    },
  ];

  return (
    <div className="w-full flex flex-1 flex-col gap-4">
      <CardHeader
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
        infoText={
          "Your account is under review! You will be notified you when your account is approved."
        }
        title="Account Verification Status"
      />
      <div className="flex w-full items-center lg:px-10">
        <div className="flex w-full flex-col gap-4">
          {STAGES.map((stage, index) => {
            return (
              <TimelineItem
                key={index + 1}
                Icon={stage.Icon}
                isCompleted={KYCStageID > stage?.ID || KYCStageID == 4}
                isLastItem={index == STAGES.length - 1}
                isPending={KYCStageID === stage?.ID}
                stage={stage}
              />
            );
          })}
        </div>
        <div
          className={cn(
            "flex w-full select-none flex-col items-center gap-9 rounded-2xl dark:bg-primary-400/5 bg-primary-50 p-9",
          )}
        >
          <Image
            alt="Account Approval Process"
            className="aspect-square object-contain"
            height={200}
            src={"/images/illustrations/approval.svg"}
            width={200}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-[clamp(16px,11px+0.5vw,1.5rem)] font-bold">
              {STAGES[KYCStageID - 1]?.name}
            </h3>
            <p className="text-center text-xs lg:text-sm max-w-md text-foreground-500 mb-4">
              {STAGES[KYCStageID - 1]?.infoText}
            </p>
            {allowUserToSubmitKYC && (
              <Button size={"lg"} onPress={onCompletionNavigateTo}>
                Proceed to Account Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressStageTracker;
