'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/base/Container'

import {
  BanknotesIcon,
  NewspaperIcon,
  ArrowsRightLeftIcon,
  PhoneArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ClipboardDocumentIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  CalculatorIcon,
  TicketIcon,
} from '@heroicons/react/24/solid'

import {
  staggerContainerItemVariants,
  staggerContainerVariants,
} from '@/lib/constants'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { Tabs } from '@/components/base'

const collections = [
  [
    {
      content:
        'Seamlessly connect with your existing systems and automate your financial workflows with our robust API.',
      Icon: {
        name: 'API Integration',
        role: 'Connect Seamlessly',
        element: AdjustmentsVerticalIcon,
      },
    },
    {
      content:
        'Create, send, and manage professional invoices with ease. Stay on top of your income and ensure timely payments.',
      Icon: {
        name: 'Invoicing',
        role: 'Effortless Billing',
        element: NewspaperIcon,
      },
    },
  ],
  [
    {
      content:
        'Customize and deploy payment forms that cater to your business needs. Easy payments process for your customers.',
      Icon: {
        name: 'Payment Forms',
        role: 'Simplify Transactions',
        element: ClipboardDocumentIcon,
      },
    },
    {
      content:
        'Sell your products and services online or via WhatsApp. Increase your sales with flexible store options.',
      Icon: {
        name: 'Store',
        role: 'Expand Sales Channels',
        element: BuildingStorefrontIcon,
      },
    },
  ],
  [
    {
      content:
        'Manage recurring payments and subscriptions effortlessly. Keep track of your subscribers and their payments.',
      Icon: {
        name: 'Subscriptions',
        role: 'Automate Recurring Payments',
        element: CreditCardIcon,
      },
    },
    {
      content:
        'Enable quick and secure in-store payments with our USSD feature. A convenient and cashless payment option.',
      Icon: {
        name: 'USSD',
        role: 'Quick Cashless Payments',
        element: CalculatorIcon,
      },
    },
  ],
]

const spending = [
  [
    {
      content:
        'Pay your bills on time and avoid late fees. Manage all your bill payments from a single dashboard.',
      Icon: {
        name: 'Bill Payment',
        role: 'Pay Bills Easily',
        element: BanknotesIcon,
      },
    },
    {
      content:
        'Purchase bulk data for your business needs at competitive rates. Ensure your team stays connected and productive.',
      Icon: {
        name: 'Bulk Data',
        role: 'Connect Your Team',
        element: ReceiptPercentIcon,
      },
    },
  ],
  [
    {
      content:
        'Top up airtime for multiple employees in one go. Save time and reduce the hassle of individual top-ups.',
      Icon: {
        name: 'Bulk Airtime',
        role: 'Top Up Effortlessly',
        element: PhoneArrowDownLeftIcon,
      },
    },
    {
      content:
        'Make bulk payments to vendors, suppliers, or employees and enjoy streamlined payments automation.',
      Icon: {
        name: 'Bulk Direct Payment',
        role: 'Pay Multiple Vendors',
        element: ArrowsRightLeftIcon,
      },
    },
  ],
  [
    {
      content:
        'Distribute bulk vouchers to your customers or employees efficiently. Enhanced reward programs.',
      Icon: {
        name: 'Bulk Vouchers Payment',
        role: 'Distribute Rewards Efficiently',
        element: TicketIcon,
      },
    },
    {
      content:
        'Issue virtual or physical expense cards for your team. Control and track business spending with ease.',
      Icon: {
        name: 'Expense Cards',
        role: 'Control Business Spending',
        element: CreditCardIcon,
      },
    },
  ],
]

function Collections() {
  return (
    <motion.ul
      role="list"
      className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {collections.map((column, columnIndex) => (
        <li key={columnIndex}>
          <motion.ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
            {column.map((revenue, revenueIndex) => (
              <motion.li
                key={revenueIndex}
                variants={staggerContainerItemVariants}
              >
                <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                  <revenue.Icon.element className="absolute left-6 top-6 w-[100px] fill-slate-100" />
                  <blockquote className="relative">
                    <p className="text-lg tracking-tight text-slate-900">
                      {revenue.content}
                    </p>
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                    <div>
                      <div className="font-display text-base text-slate-900">
                        {revenue.Icon.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {revenue.Icon.role}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-full bg-slate-800 p-3">
                      <revenue.Icon.element className="h-6 w-6 text-white" />
                    </div>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </li>
      ))}
    </motion.ul>
  )
}

function Spending() {
  return (
    <motion.ul
      role="list"
      className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {spending.map((column, columnIndex) => (
        <li key={columnIndex}>
          <motion.ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
            {column.map((expense, expenseIndex) => (
              <motion.li
                key={expenseIndex}
                variants={staggerContainerItemVariants}
              >
                <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                  <expense.Icon.element className="absolute left-6 top-6 w-[100px] fill-slate-100" />
                  <blockquote className="relative">
                    <p className="text-lg tracking-tight text-slate-900">
                      {expense.content}
                    </p>
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                    <div>
                      <div className="font-display text-base text-slate-900">
                        {expense.Icon.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {expense.Icon.role}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-full bg-slate-800 p-3">
                      <expense.Icon.element className="h-6 w-6 text-white" />
                    </div>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </li>
      ))}
    </motion.ul>
  )
}

const TABS = [
  { name: 'FOR COLLECTIONS / REVENUE', index: 0 },
  { name: 'FOR DISBURSEMENTS / EXPENDITURE', index: 1 },
]

export function Features() {
  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <Collections key="collections" />,
    <Spending key="spending" />,
  ])

  return (
    <section
      id="features"
      aria-label="Features payBoss is offering"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
        <Tabs
          className={'mx-auto max-w-max'}
          classNames={{
            nav: 'items-center justify-center',
          }}
          tabs={TABS}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
        <div className="mx-auto mt-10 max-w-2xl md:text-center">
          {TABS[currentTabIndex]?.name === TABS[0]?.name && (
            <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
              Boost Your Collections
            </h2>
          )}
          {TABS[currentTabIndex]?.name === TABS[1]?.name && (
            <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
              Streamline Your Spending
            </h2>
          )}
          <p className="mt-4 text-sm tracking-tight text-slate-700">
            Streamline your processes, save time, and grow your business with
            confidence.
          </p>
        </div>
        <AnimatePresence mode="wait">{activeTab}</AnimatePresence>
      </Container>
    </section>
  )
}
