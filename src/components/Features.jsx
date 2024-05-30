'use client'
import { useState } from 'react';
import Image from 'next/image'
import { Container } from '@/components/Container'
import Tab from '@/components/Tab'
import api from '@/images/avatars/avatar-3.png'



function QuoteIcon(props) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  )
}

function Collections(){
  const collections = [
    [
      {
        content:
          'Seamlessly connect PayBoss with your existing systems and automate your financial workflows with our robust API integration.',
        author: {
          name: 'API Integration',
          role: 'Connect Seamlessly',
          image: api,
        },
      },
      {
        content:
          'Create, send, and manage professional invoices with ease. Stay on top of your receivables and ensure timely payments.',
        author: {
          name: 'Invoicing',
          role: 'Effortless Billing',
          image: api,
        },
      },
    ],
    [
      {
        content:
          'Customize and deploy payment forms that cater to your business needs. Simplify the payment process for your customers.',
        author: {
          name: 'Payment Forms',
          role: 'Simplify Transactions',
          image: api,
        },
      },
      {
        content:
          'Sell your products and services online or via WhatsApp. Reach more customers and increase your sales with flexible store options.',
        author: {
          name: 'Store',
          role: 'Expand Sales Channels',
          image: api,
        },
      },
    ],
    [
      {
        content:
          'Manage recurring payments and subscriptions effortlessly. Keep track of your subscribers and their payments in one place.',
        author: {
          name: 'Subscriptions',
          role: 'Automate Recurring Payments',
          image: api,
        },
      },
      {
        content:
          'Enable quick and secure in-store payments with our USSD feature. Provide your customers with a convenient and cashless payment option.',
        author: {
          name: 'USSD',
          role: 'Quick Cashless Payments',
          image: api,
        },
      },
    ],
  ]
  return(
    <ul
    role="list"
    className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
  >
    {collections.map((column, columnIndex) => (
      <li key={columnIndex}>
        <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
          {column.map((testimonial, testimonialIndex) => (
            <li key={testimonialIndex}>
              <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
                <blockquote className="relative">
                  <p className="text-lg tracking-tight text-slate-900">
                    {testimonial.content}
                  </p>
                </blockquote>
                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div>
                    <div className="font-display text-base text-slate-900">
                      {testimonial.author.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {testimonial.author.role}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-50">
                    <Image
                      className="h-14 w-14 object-cover"
                      src={testimonial.author.image}
                      alt=""
                      width={56}
                      height={56}
                    />
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
  )
}


function Spending(){
  const spending = [
    [
      {
        content:
          'Pay your bills on time and avoid late fees. Manage all your bill payments from a single dashboard.',
        author: {
          name: 'Bill Payment',
          role: 'Pay Bills Easily',
          image: api,
        },
      },
      {
        content:
          'Purchase bulk data for your business needs at competitive rates. Ensure your team stays connected and productive.',
        author: {
          name: 'Bulk Data',
          role: 'Connect Your Team',
          image: api,
        },
      },
    ],
    [
      {
        content:
          'Top up airtime for multiple employees in one go. Save time and reduce the hassle of individual top-ups.',
        author: {
          name: 'Bulk Airtime',
          role: 'Top Up Effortlessly',
          image: api,
        },
      },
      {
        content:
          'Make bulk payments to vendors, suppliers, or employees with ease. Enjoy the convenience of managing multiple payments simultaneously.',
        author: {
          name: 'Bulk Direct Payment',
          role: 'Pay Multiple Vendors',
          image: api,
        },
      },
    ],
    [
      {
        content:
          'Distribute bulk vouchers to your customers or employees efficiently. Enhance your promotional and reward programs.',
        author: {
          name: 'Bulk Vouchers Payment',
          role: 'Distribute Rewards Efficiently',
          image: api,
        },
      },
      {
        content:
          'Issue virtual or physical expense cards for your team. Control and track business spending with ease.',
        author: {
          name: 'Expense Cards',
          role: 'Control Business Spending',
          image: api,
        },
      },
    ],
  ]
  return(
    <ul
    role="list"
    className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
  >
    {spending.map((column, columnIndex) => (
      <li key={columnIndex}>
        <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
          {column.map((testimonial, testimonialIndex) => (
            <li key={testimonialIndex}>
              <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
                <blockquote className="relative">
                  <p className="text-lg tracking-tight text-slate-900">
                    {testimonial.content}
                  </p>
                </blockquote>
                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div>
                    <div className="font-display text-base text-slate-900">
                      {testimonial.author.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {testimonial.author.role}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-50">
                    <Image
                      className="h-14 w-14 object-cover"
                      src={testimonial.author.image}
                      alt=""
                      width={56}
                      height={56}
                    />
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
  )
}
const tabData = [
  { name: 'FOR COLLECTIONS / REVENUE', current: true },
  { name: 'FOR DISBURSEMENTS / EXPENDITURE', current: false },
];

export function Features() {
  const [currentTab, setCurrentTab] = useState(tabData.find(tab => tab.current).name);

  const handleTabChange = (tabName) => {
    setCurrentTab(tabName);
  };

  return (
    <section
      id="features"
      aria-label="Features payBoss is offering"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
      <Tab tabs={tabData} onTabChange={handleTabChange} />
        <div className="mt-10 mx-auto max-w-2xl md:text-center">
        {currentTab === 'FOR COLLECTIONS / REVENUE' &&  
        <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
           Boost Your Collections
        </h2>}
        {currentTab === 'FOR DISBURSEMENTS / EXPENDITURE' &&  
        <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
           Streamline Your Spending
        </h2>}
          <p className="mt-4 text-sm tracking-tight text-slate-700">
          Streamline your processes, save time, and grow your business with confidence.
          </p>
        </div>
        {currentTab === 'FOR COLLECTIONS / REVENUE' &&  <Collections/> }
        {currentTab === 'FOR DISBURSEMENTS / EXPENDITURE' &&  <Spending/> }
      </Container>
    </section>
  )
}
