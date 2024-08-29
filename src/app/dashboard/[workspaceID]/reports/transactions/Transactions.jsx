'use client'
import { Card, CardHeader, Tabs } from '@/components/base'
import React, { useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import Search from '@/components/ui/Search'
import useTransactions from '@/hooks/useTransactions'
import CustomTable from '@/components/containers/tables/Table'

const transactionColumns = [
  { name: 'NAME', uid: 'batch_name' },
  { name: 'TOTAL RECORDS', uid: 'number_of_records' },
  { name: 'TOTAL AMOUNT', uid: 'total_amount' },
  { name: 'STATUS', uid: 'status' },
  { name: 'LINK', uid: 'link' },
]

const SERVICE_TYPES = [
  {
    name: 'Disbursements',
    index: 0,
  },
  {
    name: 'Income',
    index: 1,
  },
  {
    name: 'Expenses',
    index: 2,
  },
]

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('')

  const { directBulkTransactions } = useTransactions()
  // const [selectedKeys, setSelectedKeys] = React.useState(new Set(['']))

  const transactionRows = directBulkTransactions?.filter((item) => {
    return (
      item?.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.amount?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={transactionColumns}
      rows={transactionRows}
      // selectedKeys={selectedKeys}
      // setSelectedKeys={setSelectedKeys}
    />,
  ])

  return (
    <>
      {/************************************************************************/}
      <Card className={'mb-8 w-full'}>
        <CardHeader
          title={'Transactions History'}
          infoText={
            'Transactions logs to keep track of your workspace activity'
          }
        />

        <div className="mt-4 flex w-full items-center justify-between gap-8 ">
          <Search
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
          />
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
        </div>
      </Card>
      {/*  CURRENTLY ACTIVE TABLE */}
      {activeTab}
    </>
  )
}
