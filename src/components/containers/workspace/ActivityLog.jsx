import React from 'react'
import { TASK_ICON_BG_COLOR_MAP, TASK_TYPE } from '@/lib/constants'
import { formatActivityData } from '@/lib/utils'
import { formatDistance } from 'date-fns'

// Sample log data
export const sampleActivityLogs = [
  {
    title: 'Wallet Prefund',
    data: [
      {
        type: 'Deposit',
        created_by: { user_name: 'John Doe' },
        createdAt: '2024-07-01T10:30:00Z',
        content:
          'Deposit made with ref No. 32168651.',
      },
      {
        type: 'Deposit',
        created_by: { user_name: 'Jane Smith' },
        createdAt: '2024-07-02T15:45:00Z',
        content: 'Client expressed interest in real estate investment trusts.',
      },
      {
        type: 'Deposit',
        created_by: { user_name: 'Emily Davis' },
        createdAt: '2024-07-01T10:30:00Z',
        content:
          "Scheduled a follow-up call to discuss client's financial goals.",
      },
      {
        type: 'Deposit',
        created_by: { user_name: 'Emily Davis' },
        createdAt: '2024-07-01T10:30:00Z',
        content:
          "Scheduled a follow-up call to discuss client's financial goals.",
      },
      {
        type: 'Deposit',
        created_by: { user_name: 'Emily Davis' },
        createdAt: '2024-07-01T10:30:00Z',
        content:
          "Scheduled a follow-up call to discuss client's financial goals.",
      },
    ],
  },
]

const activityLogStore = {
  activityLogs: sampleActivityLogs,
}

const renderTaskType = (taskName) => {
  const taskType = TASK_TYPE[taskName]

  if (taskType) {
    const textColorClass = `text-${taskType.color} text-[12px] font-normal font-medium leading-[16px]`
    return (
      <div
        className={`h-8 w-20 px-2 py-1.5 ${
          TASK_ICON_BG_COLOR_MAP[taskType.label]
        } inline-flex items-center justify-center gap-2 rounded-[4px]`}
      >
        <span className={textColorClass}>{taskType.icon}</span>
        <p className={textColorClass}>{taskType.label}</p>
      </div>
    )
  }
  return null
}

const ActivityLog = () => {
  const formattedActivityData = formatActivityData(
    activityLogStore.activityLogs,
  )

  return (
    <div className="flex flex-col py-4">
      {formattedActivityData.length > 0 ? (
        formattedActivityData.map((items, index) => (
          <div key={index}>
            <p className="text-lg text-[#161518]">{items.title}</p>

            {items.data.map((item, itemIndex) => (
              <div className="flex flex-col gap-y-4 py-2" key={itemIndex}>
                <div className="flex items-center space-x-4">
                  {renderTaskType(item?.type)}

                  <div className="w-full">
                    <div className="flex w-full justify-between">
                      <p className="mb-[4px] text-[14px] font-medium leading-6">
                        {item?.created_by.user_name}
                      </p>
                      <p className="leading-4] text-[12px] font-normal text-[#898989]">
                        {formatDistance(new Date(item.createdAt), new Date())}
                      </p>
                    </div>
                    <p className="text-[12px] text-[#656971]">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      ></p>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <hr className="my-4 h-px border-0 bg-[#ECEDF0]"></hr>
          </div>
        ))
      ) : (
        <div>No activity logs recorded</div>
      )}
    </div>
  )
}

export default ActivityLog
