'use client'
import { Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React from 'react'
import BusinessAccountDetails from './BusinessAccountDetails'
import DocumentAttachments from './DocumentAttachments'
import ProgressStageTracker from './ProgressStageTracker'
import { useGeneralConfigOptions, useSetupConfig } from '@/hooks/useQueryHooks'
import useConfigOptions from '@/hooks/useConfigOptions'
import useAccountProfile from '@/hooks/useProfileDetails'

function AccountVerification() {
  const { user, businessDetails, businessDocs, merchantID } =
    useAccountProfile()
  const { companyTypes, banks, currencies } = useConfigOptions()

  // ************* TABS RENDERER ************** //
  const TABS = [
    { name: 'Business Details', href: '#', index: 0 },
    { name: 'Attachments', href: '#', index: 1 },
    { name: 'Verification Status', href: '#', index: 2 },
  ]

  const KYC_COMPONENTS = [
    <BusinessAccountDetails
      key={'business-details'}
      user={user}
      businessDetails={businessDetails}
      companyTypes={companyTypes}
      banks={banks}
      currencies={currencies}
      navigateToPage={navigateToPage}
    />,
    <DocumentAttachments
      key={'documents'}
      businessDocs={businessDocs}
      navigateToPage={navigateToPage}
    />,
  ]

  const TRACKING_COMPONENTS = [
    <ProgressStageTracker key={'verification-status'} />,
  ]

  const RENDER_COMPONENTS = true ? KYC_COMPONENTS : TRACKING_COMPONENTS

  // ************* COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    ...RENDER_COMPONENTS,
    <ProgressStageTracker key={'verification-status'} />,
  ])

  function navigateToPage(index) {
    navigateTo(index)
  }

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
