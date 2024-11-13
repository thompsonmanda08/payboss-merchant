import Progress from '@/components/ui/progress'
import React from 'react'

export default function data() {
  return {
    columns: [
      { name: 'BATCH NAME', uid: 'batch_name' },
      { name: 'DATE', uid: 'date' },
      { name: 'TOTAL RECORDS', uid: 'amount' },
      { name: 'TOTAL PROCCESSED', uid: 'amount' },
      { name: 'AMOUNT', uid: 'amount' },
      { name: 'STATUS', uid: 'status' },
    ],

    rows: [
      {
        ID: '1',
        key: '1',
        batch_name: ['UI XD Version'],
        date: <div className="flex py-1">10 Jun, 2024</div>,
        amount: <span className="text-sm font-medium">K14,000</span>,
        status: (
          <div className="w-32">
            <Progress value={60} color="primary from-primary to-black/50" />
          </div>
        ),
      },
      {
        ID: '2',
        key: '2',
        batch_name: ['Add Progress Track'],
        date: <div className="flex py-1">20 Jan,2024</div>,
        amount: <span className="text-sm font-medium">K3,000</span>,
        status: (
          <div className="w-32">
            <Progress value={10} color="red-500 from-red-500 to-white/50" />
          </div>
        ),
      },
      {
        ID: '3',
        key: '3',
        batch_name: ['Fix Platform Errors'],
        date: <div className="flex py-1">12 Sep, 2023</div>,
        amount: <span className="text-sm font-medium">Not set</span>,
        status: (
          <div className="w-32">
            <Progress
              value={100}
              color="green-600 from-green-600 to-green-500"
            />
          </div>
        ),
      },
      {
        ID: '4',
        key: '4',
        batch_name: ['Launch our Mobile App'],
        date: <div className="flex py-1">15 Dec, 2023</div>,
        amount: <span className="text-sm font-medium">K20,500</span>,
        status: (
          <div className="w-32">
            <Progress
              value={100}
              color="green-600 from-green-600 to-green-500"
            />
          </div>
        ),
      },
      {
        ID: '5',
        key: '5',
        batch_name: ['Add the New Pricing Page'],
        date: <div className="flex py-1">05 Aug, 2023</div>,
        amount: <span className="text-sm font-medium">K500</span>,
        status: (
          <div className="w-32">
            <Progress value={25} color="red-500 from-red-500 to-white/50" />
          </div>
        ),
      },
      {
        ID: '6',
        key: '6',
        batch_name: ['Redesign New Online Shop'],
        date: <div className="flex py-1">11 Nov, 2024</div>,
        amount: <span className="text-sm font-medium">K2,000</span>,
        status: (
          <div className="w-32">
            <Progress value={40} color="primary from-primary to-black/50" />
          </div>
        ),
      },
    ],
  }
}
