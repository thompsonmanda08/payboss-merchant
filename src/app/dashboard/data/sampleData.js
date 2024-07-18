import { formatDate } from '@/lib/utils'

export const SAMPLE_BATCHES = [
  {
    batchName: 'Payment For airtime',
    type: 'Airtime Disbursement',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '12,500',
    status: 'Scheduled',
  },

  {
    batchName: 'Data Bundle purchase for field workers',
    type: 'Data Purchase',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '144,500',
    status: 'Pending',
  },

  {
    batchName: 'Casual workers wages',
    type: 'Direct Transfer',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '3,500',
    status: 'In Progress',
  },
  {
    batchName: 'Payment For airtime',
    type: 'Airtime Disbursement',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '12,500',
    status: 'Completed',
  },
  {
    batchName: 'Data Bundle purchase for field workers',
    type: 'Data Purchase',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '144,500',
    status: 'Pending',
  },
  {
    batchName: 'Casual workers wages',
    type: 'Direct Transfer',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '3,500',
    status: 'In Progress',
  },
]
