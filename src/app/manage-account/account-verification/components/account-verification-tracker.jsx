import Image from "next/image";
import { now, getLocalTimeZone } from "@internationalized/date";
import {
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

import { cn, formatDate } from "@/lib/utils";
import useAccountProfile from "@/hooks/useProfileDetails";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import TimelineItem from "@/components/base/timeline-item";

function ProgressStageTracker() {
  const fullDate = new Date(now(getLocalTimeZone()).toString().split("T")[0]);
  const date = formatDate(fullDate).replaceAll("-", " ");
  const time = fullDate.toLocaleTimeString();
  const { KYCStageID } = useAccountProfile();

  const STAGES = [
    {
      ID: 1,
      name: "Account Details & Document Submission",
      infoText:
        "Documents as well as business information submission. This process usually takes up to 24 hours, try reloading the page or come back later for a status update.",
      Icon: ClipboardDocumentCheckIcon,
    },
    {
      ID: 2,
      name: "Account Screening Pending Approval",
      infoText:
        "Your account and your KYC data is being reviewed by the PayBoss support team. This process usually takes up to 24 hours, You will receive an email notification when your application has been reviewed",
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
    <Card className={"w-full gap-5 pb-5"}>
      <CardHeader
        infoText={
          "Your account is under review! We will notify you when your account is approved."
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
            "flex w-full select-none flex-col items-center gap-9 rounded-2xl dark:bg-primary-400/5 bg-primary-50 p-9"
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
            <p className="text-center text-[clamp(11px,8px+0.5vw,1rem)] max-w-md text-foreground-500">
              {STAGES[KYCStageID - 1]?.infoText}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProgressStageTracker;
