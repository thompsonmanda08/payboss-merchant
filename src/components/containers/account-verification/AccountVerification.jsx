'use client'
import { Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React from 'react'
import BusinessAccountDetails from './BusinessAccountDetails'
import DocumentAttachments from './DocumentAttachments'
import ProgressStageTracker from './ProgressStageTracker'
import { useGeneralConfigOptions, useSetupConfig } from '@/hooks/useQueryHooks'

const TABS = [
  { name: 'Business Details', href: '#', index: 0 },
  { name: 'Attachments', href: '#', index: 1 },
  { name: 'Verification Status', href: '#', index: 2 },
]

function AccountVerification() {
  const { data: response, isLoading, isSuccess } = useSetupConfig()
  const { data: config } = useGeneralConfigOptions()
  const { userDetails } = response?.data || []
  const { companyTypes, banks, currencies } = config?.data || []

  // console.log(response?.data)
  // console.log(companyTypes)

  // ***** COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <BusinessAccountDetails
      key={'business-details'}
      user={userDetails}
      companyTypes={companyTypes}
      banks={banks}
      currencies={currencies}
    />,
    <DocumentAttachments key={'documents'} />,
    <ProgressStageTracker key={'verification-status'} />,
  ])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <section
        role="account-verification-header"
        className="flex w-full flex-col"
      >
        <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
          Account Verification
        </h2>
        <p className=" text-sm text-slate-600">
          Initiate your KYC, business details, and document verification process
          from this section
        </p>

        <div className="flex items-center justify-between gap-8">
          <Tabs
            className={'my-4'}
            tabs={TABS}
            navigateTo={navigateTo}
            currentTab={currentTabIndex}
          />
        </div>
        <div className="mb-4"></div>
      </section>

      <section
        role="profile-content"
        className="grid w-full place-items-center gap-4 "
      >
        {activeTab}
      </section>
    </div>
  )
}

export default AccountVerification
