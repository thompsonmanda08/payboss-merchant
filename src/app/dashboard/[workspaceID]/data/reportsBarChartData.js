import { formatCurrency } from '@/lib/utils'
import {
  AdjustmentsVerticalIcon,
  BanknotesIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  InboxStackIcon,
} from '@heroicons/react/24/solid'

const reportsBarChartData = {
  chart: {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: {
      label: 'Transactions',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  items: [
    {
      icon: {
        color: 'primary',
        component: <CurrencyDollarIcon className="h-4 w-4" />,
      },
      label: 'Overall',
      progress: { content: formatCurrency('0'), percentage: 10 },
    },
    
    {
      label: 'Income',
      icon: {
        color: 'success',
        component: <BanknotesIcon className="h-4 w-4" />,
      },
      progress: { content: '0', percentage: 10 },
    },
    {
      label: 'Payments',
      icon: {
        color: 'secondary',
        component: <AdjustmentsVerticalIcon className="h-4 w-4" />,
      },
      progress: { content: '0', percentage: 10 },
    },
    {
      label: 'Expenses',
      icon: {
        color: 'danger',
        component: <AdjustmentsVerticalIcon className="h-4 w-4" />,
      },
      progress: { content: '0', percentage: 10 },
    },
  ],
}

export default reportsBarChartData
