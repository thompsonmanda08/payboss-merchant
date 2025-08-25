import { formatDistance } from 'date-fns';

import { TASK_ICON_BG_COLOR_MAP, TASK_TYPE } from '@/lib/constants';

export type ActivityLogItem = {
  id: string;
  workspace_id: string;
  amount: number;
  narration: string;
  transaction_type: string;
  sys_service: string;
  transaction_description: string;
  created_at: string;
  created_by?: string;
  isPrefunded?: boolean;
  isExpired?: boolean;
  status?: 'approved' | 'pending' | 'prefunded' | 'rejected' | 'success';
};

export type ActivityLogGroup = {
  title: string;
  data: ActivityLogItem[];
};

// Provide a fallback for sampleActivityLogs to avoid reference errors
const sampleActivityLogs: ActivityLogGroup[] = [];

const activityLogStore: { activityLogs: ActivityLogGroup[] } = {
  activityLogs:
    typeof (globalThis as any).sampleActivityLogs !== 'undefined'
      ? (globalThis as any).sampleActivityLogs
      : sampleActivityLogs,
};

const renderTaskType = (taskName: string) => {
  const taskType = TASK_TYPE[taskName];

  if (taskType) {
    const textColorClass = `text-${taskType.color} text-[12px] font-normal font-medium leading-[16px]`;

    const Icon = taskType.icon as React.ElementType;

    return (
      <div
        className={`h-8 w-20 px-2 py-1.5 ${
          TASK_ICON_BG_COLOR_MAP[taskType.label]
        } inline-flex items-center justify-center gap-2 rounded-[4px]`}
      >
        <span className={textColorClass}>
          <Icon className="h-5 w-5" />
        </span>
        <p className={textColorClass}>{taskType.label}</p>
      </div>
    );
  }

  return null;
};

const ActivityLog: React.FC = () => {
  const formattedActivityData: ActivityLogGroup[] = formatActivityData(
    activityLogStore.activityLogs,
  );

  return (
    <div className="flex flex-col py-4">
      {formattedActivityData.length > 0 ? (
        formattedActivityData.map((items, index) => (
          <div key={index}>
            <p className="text-lg text-[#161518]">{items.title}</p>

            {items.data.map((item, itemIndex) => (
              <div key={itemIndex} className="flex flex-col gap-y-4 py-2">
                <div className="flex items-center space-x-4">
                  {renderTaskType(item?.transaction_type)}

                  <div className="w-full">
                    <div className="flex w-full justify-between">
                      <p className="mb-[4px] text-[14px] font-medium leading-6">
                        {item?.transaction_description}
                      </p>
                      <p className="leading-4] text-[12px] font-normal text-[#898989]">
                        {formatDistance(new Date(item.created_at), new Date())}
                      </p>
                    </div>
                    {/* <div className="text-xs  text-[#656971]">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
            <hr className="my-4 h-px border-0 bg-[#ECEDF0]" />
          </div>
        ))
      ) : (
        <div>No activity logs recorded</div>
      )}
    </div>
  );
};

export function formatActivityData(
  activityLog: any,
  isNotReverse = true,
): ActivityLogGroup[] {
  const groupedData: { [x: string]: any } = {};

  activityLog?.forEach((activity: { title: string; data: any[] }) => {
    activity.data?.forEach((item: any) => {
      const created_at = new Date(item.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!groupedData[created_at]) {
        groupedData[created_at] = [];
      }

      groupedData?.[created_at].push(item);
    });
  });

  const result = Object.keys(groupedData).map(
    (date) =>
      ({
        title: String(date),
        data: isNotReverse
          ? groupedData[String(date)]
          : groupedData[date].reverse(),
      }) as ActivityLogGroup,
  );

  return result;
}

export default ActivityLog;
