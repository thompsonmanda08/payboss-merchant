import {
  AdjustmentsVerticalIcon,
  BanknotesIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  InboxStackIcon,
} from '@heroicons/react/24/solid'

const reportsBarChartData = {
  chart: {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: {
      label: 'Sales',
      data: [450, 200, 100, 220, 500, 100, 400, 230, 500],
    },
  },
  items: [
    {
      icon: {
        color: 'primary',
        component: <BanknotesIcon className="h-4 w-4" />,
      },
      label: 'Paid',
      progress: { content: '36K', percentage: 30 },
    },
    {
      icon: {
        color: 'primary',
        component: <AdjustmentsVerticalIcon className="h-4 w-4" />,
      },
      label: 'api',
      progress: { content: '2M', percentage: 90 },
    },
    {
      icon: {
        color: 'primary',
        component: <CurrencyDollarIcon className="h-4 w-4" />,
      },
      label: 'sales',
      progress: { content: '$435', percentage: 30 },
    },
    {
      icon: {
        color: 'primary',
        component: <InboxStackIcon className="h-4 w-4" />,
      },
      label: 'items',
      progress: { content: '43', percentage: 50 },
    },
  ],
}

export default reportsBarChartData
