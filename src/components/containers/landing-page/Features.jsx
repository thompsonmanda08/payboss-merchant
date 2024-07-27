'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/base/Container'
import Tab from '@/components/Tab'
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
                  <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
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
                      {/* <Image
                        className="h-14 w-14 object-cover"
                        src={revenue.Icon.element}
                        alt=""
                        width={56}
                        height={56}
                      /> */}
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
                  <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
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
const tabData = [
  { name: 'FOR COLLECTIONS / REVENUE', current: true },
  { name: 'FOR DISBURSEMENTS / EXPENDITURE', current: false },
]

export function Features() {
  const [currentTab, setCurrentTab] = useState(
    tabData.find((tab) => tab.current).name,
  )

  const handleTabChange = (tabName) => {
    setCurrentTab(tabName)
  }

  return (
    <section
      id="features"
      aria-label="Features payBoss is offering"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
        <Tab tabs={tabData} onTabChange={handleTabChange} />
        <div className="mx-auto mt-10 max-w-2xl md:text-center">
          {currentTab === 'FOR COLLECTIONS / REVENUE' && (
            <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
              Boost Your Collections
            </h2>
          )}
          {currentTab === 'FOR DISBURSEMENTS / EXPENDITURE' && (
            <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
              Streamline Your Spending
            </h2>
          )}
          <p className="mt-4 text-sm tracking-tight text-slate-700">
            Streamline your processes, save time, and grow your business with
            confidence.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {currentTab === 'FOR COLLECTIONS / REVENUE' && (
            <Collections key="collections" />
          )}
          {currentTab === 'FOR DISBURSEMENTS / EXPENDITURE' && (
            <Spending key="spending" />
          )}
        </AnimatePresence>
      </Container>
    </section>
  )
}

function QuoteIcon(props) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  )
}
