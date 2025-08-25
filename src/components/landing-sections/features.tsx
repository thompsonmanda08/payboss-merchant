'use client';

import { motion, AnimatePresence } from 'framer-motion';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Tab,
  Tabs,
} from '@heroui/react';

import useCustomTabsHook from '@/hooks/use-custom-tabs';
import {
  containerVariants,
  staggerContainerItemVariants,
} from '@/lib/constants';
import {
  ArrowRightFromLineIcon,
  Calculator,
  ClipboardIcon,
  CreditCard,
  LucideBanknoteArrowDown,
  Newspaper,
  PhoneCall,
  Receipt,
  ReceiptIcon,
  SendIcon,
  SlidersVerticalIcon,
  Store,
  Ticket,
} from 'lucide-react';

const collections = [
  [
    {
      content:
        'Seamlessly connect with your existing systems and automate your financial workflows with our robust API.',
      Icon: {
        name: 'API Integration',
        role: 'Connect Seamlessly',
        element: SlidersVerticalIcon,
      },
    },
    {
      content:
        'Create, send, and manage professional invoices with ease. Stay on top of your income and ensure timely payments.',
      Icon: {
        name: 'Invoicing',
        role: 'Effortless Billing',
        element: Newspaper,
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
        element: ClipboardIcon,
      },
    },
    {
      content:
        'Sell your products and services online or via WhatsApp. Increase your sales with flexible store options.',
      Icon: {
        name: 'Store',
        role: 'Expand Sales Channels',
        element: Store,
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
        element: CreditCard,
      },
    },
    {
      content:
        'Enable quick and secure in-store payments with our USSD feature. A convenient and cashless payment option.',
      Icon: {
        name: 'USSD',
        role: 'Quick Cashless Payments',
        element: Calculator,
      },
    },
  ],
];

const disbursements = [
  [
    {
      content:
        'Pay your bills on time and avoid late fees. Manage all your bill payments from a single dashboard.',
      Icon: {
        name: 'Bill Payment',
        role: 'Pay Bills Easily',
        element: LucideBanknoteArrowDown,
      },
    },
    {
      content:
        'Purchase bulk data for your business needs at competitive rates. Ensure your team stays connected and productive.',
      Icon: {
        name: 'Bulk Data',
        role: 'Connect Your Team',
        element: Receipt,
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
        element: PhoneCall,
      },
    },
    {
      content:
        'Make bulk payments to vendors, suppliers, or employees and enjoy streamlined payments automation.',
      Icon: {
        name: 'Bulk Direct Payment',
        role: 'Pay Multiple Vendors',
        element: ArrowRightFromLineIcon,
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
        element: Ticket,
      },
    },
    {
      content:
        'Issue virtual or physical expense cards for your team. Control and track business disbursements with ease.',
      Icon: {
        name: 'Expense Cards',
        role: 'Control Business PayoutFeatures',
        element: CreditCard,
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
    Icon: ReceiptIcon,
  },
  {
    name: 'DISBURSEMENTS',
    title: 'Streamline Your Payout Features',
    description: 'Easily make bulk disbursements to your customers.',
    index: 1,
    Icon: SendIcon,
  },
];

export function Features() {
  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <FeatureGrid
      key="collections"
      features={collections}
      colorScheme="primary"
    />,

    <FeatureGrid
      key="disbursements"
      features={disbursements}
      colorScheme="secondary"
    />,
  ]);

  return (
    <section
      aria-label="Features payBoss is offering"
      className="bg-background  flex flex-col items-center justify-center w-screen"
      id="features"
    >
      <div className="container flex flex-col items-center pt-20 lg:px-8">
        <Tabs
          aria-label="Feature options"
          className="mx-auto items-center"
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
                <div className="flex items-center gap-2">
                  <item.Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm md:text-base">
                    {item?.name}
                  </span>
                </div>
              }
            />
          )}
        </Tabs>
        <div className="mx-auto mt-6 text-center sm:mt-8">
          <h2 className="font-display text-2xl font-bold text-foreground/90 sm:text-3xl md:text-4xl lg:text-5xl">
            {TABS[currentTabIndex]?.title}
          </h2>
          <p className="mt-3 text-sm text-foreground/70 sm:mt-4 sm:text-base md:text-lg">
            {TABS[currentTabIndex]?.description}
          </p>
        </div>
        <AnimatePresence mode="wait">
          <div>{activeTab}</div>
        </AnimatePresence>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: {
    content: string;
    Icon: {
      name: string;
      role: string;
      element: React.ComponentType<{ className?: string }>;
    };
  };
  colorScheme: 'primary' | 'secondary';
}

function FeatureCard({ feature, colorScheme }: FeatureCardProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex gap-3">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            colorScheme === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
          }`}
        >
          <feature.Icon.element
            className={`h-6 w-6 ${
              colorScheme === 'primary' ? 'text-primary' : 'text-secondary'
            }`}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-md font-semibold">{feature.Icon.name}</p>
          <p className="text-small text-default-500">{feature.Icon.role}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-foreground/70 leading-relaxed">{feature.content}</p>
      </CardBody>
      <Divider />
      <CardFooter className="justify-center">
        <div
          className={`flex items-center gap-2 text-sm ${
            colorScheme === 'primary' ? 'text-primary' : 'text-secondary'
          }`}
        >
          <feature.Icon.element className="h-4 w-4" />
          <span>Learn more</span>
        </div>
      </CardFooter>
    </Card>
  );
}

interface FeatureGridProps {
  features: Array<
    Array<{
      content: string;
      Icon: {
        name: string;
        role: string;
        element: React.ComponentType<{ className?: string }>;
      };
    }>
  >;
  colorScheme: 'primary' | 'secondary';
}

function FeatureGrid({ features, colorScheme }: FeatureGridProps) {
  return (
    <motion.ul
      animate="show"
      className="container mx-auto w-full gap-6 my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      exit="hidden"
      initial="hidden"
      role="list"
      variants={containerVariants}
    >
      {features.map((column, columnIndex) => (
        <li key={columnIndex}>
          <motion.ul
            className="flex flex-col gap-4 sm:gap-6 md:gap-8"
            role="list"
          >
            {column.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                variants={staggerContainerItemVariants}
              >
                <FeatureCard feature={feature} colorScheme={colorScheme} />
              </motion.li>
            ))}
          </motion.ul>
        </li>
      ))}
    </motion.ul>
  );
}
