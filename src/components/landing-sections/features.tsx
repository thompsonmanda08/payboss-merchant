'use client';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
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
} from '@heroicons/react/24/solid';
import { Tab, Tabs } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

import useCustomTabsHook from '@/hooks/use-custom-tabs';
import {
  staggerContainerItemVariants,
  containerVariants,
} from '@/lib/constants';

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
];

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
        role: 'Control Business PayoutFeatures',
        element: CreditCardIcon,
      },
    },
  ],
];

const TABS = [
  {
    name: 'COLLECTIONS',
    title: 'Boost Your Collection Features',
    description:
      'Streamline your collections, save time, and grow your business with confidence.',
    index: 0,
    Icon: ArrowLeftEndOnRectangleIcon,
  },
  {
    name: 'DISBURSEMENTS',
    title: 'Streamline Your Payout Features',
    description: 'Easily make bulk disbursements to your customers.',
    index: 1,
    Icon: ArrowLeftStartOnRectangleIcon,
  },
];

export function Features() {
  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CollectionFeatures key="collections" />,
    <PayoutFeatures key="spending" />,
  ]);

  return (
    <section
      aria-label="Features payBoss is offering"
      className="bg-background py-20 sm:py-32"
      id="features"
    >
      <div className="container flex flex-col justify-center">
        <Tabs
          aria-label="Options"
          className="max-w-max mx-auto"
          color="primary"
          items={TABS}
          radius="sm"
          selectedKey={String(currentTabIndex)}
          size="lg"
          variant="bordered"
          onSelectionChange={(key) => navigateTo(Number(key))}
        >
          {(item) => (
            <Tab
              key={String(item.index)}
              title={
                <div className="flex items-center space-x-2">
                  <item.Icon className="w-6 h-6 aspect-square" />
                  <span>{item?.name}</span>
                </div>
              }
            />
          )}
        </Tabs>
        <div className="mx-auto mt-6 md:text-center">
          <h2 className="font-display text-[clamp(1.5rem,1rem+3vw,3rem)] font-bold text-foreground/90 text-nowrap">
            {TABS[currentTabIndex]?.title}
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/70">
            {TABS[currentTabIndex]?.description}
          </p>
        </div>
        <AnimatePresence mode="wait">{activeTab}</AnimatePresence>
      </div>
    </section>
  );
}

function CollectionFeatures() {
  return (
    <motion.ul
      animate="show"
      className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
      exit="hidden"
      initial="hidden"
      role="list"
      variants={containerVariants}
    >
      {collections.map((column, columnIndex) => (
        <li key={columnIndex}>
          <motion.ul className="flex flex-col gap-y-6 sm:gap-y-8" role="list">
            {column.map((revenue, revenueIndex) => (
              <motion.li
                key={revenueIndex}
                variants={staggerContainerItemVariants}
              >
                <figure className="relative rounded-2xl bg-card dark:bg-gradient-to-br dark:from-secondary/5 dark:to-primary/5 p-6 shadow-xl dark:shadow-background/10 shadow-slate-500/5">
                  <revenue.Icon.element className="absolute left-6 top-6 w-[100px] dark:opacity-5 fill-slate-100" />
                  <blockquote className="relative">
                    <p className="text-lg tracking-tight text-foreground/70 dark:text-foreground">
                      {revenue.content}
                    </p>
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                    <div>
                      <div className="font-display text-base text-foreground/90">
                        {revenue.Icon.name}
                      </div>
                      <div className="mt-1 text-sm text-foreground/50">
                        {revenue.Icon.role}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-full bg-slate-900 dark:bg-accent p-3">
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
  );
}

function PayoutFeatures() {
  return (
    <motion.ul
      animate="show"
      className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
      exit="hidden"
      initial="hidden"
      role="list"
      variants={containerVariants}
    >
      {spending.map((column, columnIndex) => (
        <li key={columnIndex}>
          <motion.ul className="flex flex-col gap-y-6 sm:gap-y-8" role="list">
            {column.map((expense, expenseIndex) => (
              <motion.li
                key={expenseIndex}
                variants={staggerContainerItemVariants}
              >
                <figure className="relative rounded-2xl bg-card dark:bg-gradient-to-br dark:from-secondary/5 dark:to-primary/5 p-6 shadow-xl dark:shadow-background/10 shadow-slate-500/5">
                  <expense.Icon.element className="absolute left-6 top-6 w-[100px] dark:opacity-5 fill-slate-100" />
                  <blockquote className="relative">
                    <p className="text-lg tracking-tight text-foreground/90">
                      {expense.content}
                    </p>
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                    <div>
                      <div className="font-display text-base text-foreground/90">
                        {expense.Icon.name}
                      </div>
                      <div className="mt-1 text-sm text-foreground/50">
                        {expense.Icon.role}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-full bg-slate-900 dark:bg-accent p-3">
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
  );
}
