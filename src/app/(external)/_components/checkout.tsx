'use client';

import {
  CheckBadgeIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tab,
  Tabs,
  Table,
  TableHeader,
  TableColumn,
  TableCell,
  TableBody,
  TableRow,
} from '@heroui/react';
import React from 'react';

import Logo from '@/components/base/payboss-logo';
import { formatCurrency } from '@/lib/utils';

import CardPaymentForm from './card-payment-form';
import MobileMoneyForm from './mobile-money-form';

export default function Checkout({ checkoutData }: { checkoutData: any }) {
  const [selectedMethod, setSelectedMethod] = React.useState('mobile');

  return (
    <div className="container px-0 sm:px-4 md:px-8 lg:px-12 max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <Card className="border-0 border-primary-50/50 w-full lg:max-w-lg p-4 overflow-hidden">
          <CardHeader className="flex-col items-start">
            <h4 className="text-large font-bold">Payment Method</h4>
            <small className="text-default-500 text-xs">
              Choose how you would like to pay
            </small>
          </CardHeader>
          <CardBody className="p-0">
            <Tabs
              aria-label="payment-methods"
              className="lg:max-w-lg w-full"
              classNames={{
                tabList: 'w-full p-0.5 ',
              }}
              color="primary"
              radius="sm"
              selectedKey={selectedMethod}
              size="lg"
              variant="bordered"
              onSelectionChange={(index) => {
                setSelectedMethod(String(index));
              }}
            >
              <Tab
                key="mobile"
                className="gap-2 flex flex-col"
                title={
                  <div className="flex items-center space-x-2">
                    <DevicePhoneMobileIcon className="h-5 w-5" />
                    <span>Mobile</span>
                  </div>
                }
              >
                <MobileMoneyForm checkoutData={checkoutData} />
              </Tab>

              <Tab
                key="card"
                className="gap-2  flex flex-col"
                title={
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Card</span>
                  </div>
                }
              >
                <CardPaymentForm checkoutData={checkoutData} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        <Card className="border-0 border-primary-50/50 overflow-hidden p-4 w-full lg:max-w-md max-h-fit">
          <CardHeader className="flex-col items-start">
            <h4 className="text-large font-bold">Payment Summary</h4>
            <small className="text-default-500 text-xs">
              Review your payment details
            </small>
          </CardHeader>
          <CardBody className="space-y-6">
            <Table
              hideHeader
              isStriped
              removeWrapper
              aria-label="checkout-summary"
              className=" -mt-4 overflow-visible"
              classNames={{
                wrapper: 'overflow-visible',
              }}
              radius="sm"
            >
              <TableHeader>
                <TableColumn>KEY</TableColumn>
                <TableColumn>VALUE</TableColumn>
              </TableHeader>
              <TableBody>
                {checkoutData?.logo && (
                  <TableRow key="merchant-logo">
                    <TableCell className="text-right font-bold" colSpan={2}>
                      <Logo
                        className={'ml-auto -mr-3'}
                        src={checkoutData?.logo}
                      />
                    </TableCell>
                  </TableRow>
                )}
                <TableRow key="merchant-display-name">
                  <TableCell className="">Payment To:</TableCell>
                  <TableCell className="text-right font-bold">
                    {checkoutData?.display_name || 'BGS PayBoss'}
                  </TableCell>
                </TableRow>
                {checkoutData?.physical_address && (
                  <TableRow key="physical-address">
                    <TableCell className="">Physical Address:</TableCell>
                    <TableCell className="text-right font-bold">
                      {checkoutData?.physical_address || '87A Kabulonga Rd.'}
                    </TableCell>
                  </TableRow>
                )}
                {checkoutData?.city && (
                  <TableRow key="city-country">
                    <TableCell>City,Country</TableCell>
                    <TableCell className="text-right font-bold">
                      {checkoutData?.city || 'Lusaka, ZM'}
                    </TableCell>
                  </TableRow>
                )}

                <TableRow
                  key="total-amount"
                  className="h-12  text-white !rounded-lg"
                >
                  <TableCell className="font-bold text-primary rounded-l-md bg-primary/10 overflow-clip">
                    Total Amount
                  </TableCell>
                  <TableCell className="text-right text-primary rounded-r-md bg-primary/10 font-bold">
                    {formatCurrency(checkoutData?.amount || '00')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="bg-primary/5 rounded-lg p-4 space-y-3">
              <h3 className="font-medium ">Payment Methods</h3>
              <div className="flex items-center space-x-2 text-sm text-foreground/80">
                <DevicePhoneMobileIcon className="h-4 w-4 text-foreground/60" />
                <span>Mobile Money (MTN, Airtel)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/80">
                <CreditCardIcon className="h-4 w-4 text-foreground/60" />
                <span>Visa, Mastercard, American Express</span>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start space-y-4 bg-primary/5 p-6 rounded-lg">
            <div className="flex items-center text-sm text-foreground/80">
              <CheckBadgeIcon className="h-4 w-4 mr-2 text-emerald-600" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center text-sm text-foreground/80">
              <ShieldCheckIcon className="h-4 w-4 mr-2 text-emerald-600" />
              <span>Encrypted transaction</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              By proceeding with this payment, you agree to our terms and
              conditions and privacy policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
