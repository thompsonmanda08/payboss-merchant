'use client';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@heroui/react';
import { useEffect, useState } from 'react';

import CardHeader from '@/components/base/card-header';
import Tabs from '@/components/elements/tabs';
import Loader from '@/components/ui/loader';
import useCustomTabsHook from '@/hooks/use-custom-tabs';

import {
  ActionResponses,
  API_Authentication,
  StatusResponses,
} from '../collections/api-integration/api-config-view';

export const API_CONFIG_VIEWS = [
  {
    name: 'Authentication',
    infoText: 'Credentials for applications to access the API',
    step: 'authentication',
    index: 0,
  },
  {
    name: 'Bill Payment',
    infoText: 'Payment Collection JSON request and response payloads',
    step: 'bill-payment',
    index: 1,
  },
  {
    name: 'Status Callback',
    infoText: 'Payment Collection JSON response for a status callback',
    step: 'status-callback',
    index: 2,
  },
  {
    name: 'Service Providers',
    infoText: 'A list a of service providers integrated on PayBoss',
    step: 'service-provider',
    index: 3,
  },
  {
    name: 'Service Provider Details',
    infoText: 'Details of service providers integrated on PayBoss',
    step: 'service-provider-details',
    index: 4,
  },
];

const BILLS_API_KEY_DATA = {
  authURL:
    'https://payboss-uat-backend.bgsgroup.co.zm/api/v2/transaction/bills/auth',

  authPayload: {
    username: 'your username',
    apikey: 'your api key',
  },

  authResponse: {
    tokenType: 'Bearer',
    token: 'your token',
    expiresIn: 180,
  },

  paymentURL:
    'https://payboss-uat-backend.bgsgroup.co.zm/api/v2/transaction/bills',
  paymentPayLoad: {
    contact_number: 'required string',
    amount: 'required string',
    narration: 'required string',
    transactionID: 'required string',
    service_provider: 'required string',
    voucher_type: 'required string',
    destination: 'required string',
  },
  paymentResponse: {
    status: 'success | failed | pending',
    message: 'status description',
    transactionID: 'your transaction ID',
  },

  paymentStatusURL:
    'https://payboss-uat-backend.bgsgroup.co.zm/api/v2/transaction/bills/status/{transactionId}',
  paymentStatusResponse: {
    status: 'successful | failed | pending',
    message: 'status description',
    transactionID: 'your transaction ID',
    bill_ref: 'bill ref | null',
    bill_status_description: 'bill transaction status description',
  },

  serviceProviderURL:
    'https://payboss-uat-backend.bgsgroup.co.zm/api/v2/transaction/bills/serviceproviders',

  serviceProviderResponse: {
    serviceproviders: [
      {
        ID: 'string',
        service_provider: 'string',
        key: 'string',
      },
    ],
  },

  providerDetailsURL:
    'https://payboss-uat-backend.bgsgroup.co.zm/api/v2/transaction/bills/serviceprovider/{key || ID}',

  providerDetailsResponse: {
    ID: 'string',
    service_provider: 'string',
    key: 'string',
    vouchertype: [
      {
        ID: 'string',
        type: 'string',
        key: 'string',
      },
    ],
  },
};

export default function BillPaymentAPIConfigModal({
  isOpen,
  onClose,
  isLoading,
}) {
  const [currentStep, setCurrentStep] = useState(API_CONFIG_VIEWS[0]);
  const configData = BILLS_API_KEY_DATA;

  const { activeTab, currentTabIndex, navigateTo, navigateForward } =
    useCustomTabsHook([
      <API_Authentication
        key={currentStep.name}
        config={{
          url: configData?.authURL,
          authentication: configData?.authPayload,
          response: configData?.authResponse,
        }}
      />,

      <ActionResponses
        key={currentStep.name}
        config={{
          url: configData?.paymentURL,
          payload: configData?.paymentPayLoad,
          response: configData?.paymentResponse,
        }}
        titles={{
          url: 'Payment URL',
          payload: 'Payment Payload Body',
          response: 'Payment Response Body',
        }}
      />,
      <StatusResponses
        key={currentStep.name}
        config={{
          url: configData?.paymentStatusURL,
          response: configData?.paymentStatusResponse,
        }}
      />,

      <ActionResponses
        key={currentStep.name}
        config={{
          url: configData?.serviceProviderURL,
          response: configData?.serviceProviderResponse,
        }}
        method={'GET'}
        titles={{
          url: 'Service Providers URL',
          payload: 'Service Providers Payload Body',
          response: 'Service Providers Response Body',
        }}
      />,

      <ActionResponses
        key={currentStep.name}
        config={{
          url: configData?.providerDetailsURL,
          response: configData?.providerDetailsResponse,
        }}
        method={'GET'}
        titles={{
          url: 'Provider Details URL',
          payload: 'Providers Details Payload Body',
          response: 'Providers Details Response Body',
        }}
      />,
    ]);

  function handleClose() {
    onClose();
  }

  useEffect(() => {}, [currentTabIndex]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        size={'4xl'}
        onClose={handleClose}
        isDismissable={false}
        // className="max-w-[768px]"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-4">
              <CardHeader
                infoText={currentStep.infoText}
                title={currentStep.name}
              />
              <Tabs
                currentTab={currentTabIndex}
                navigateTo={navigateTo}
                tabs={API_CONFIG_VIEWS}
              />
            </ModalHeader>

            <ModalBody className="mb-4">
              {isLoading ? <Loader /> : activeTab}
            </ModalBody>
            <ModalFooter>
              <p className="mx-auto max-w-[600px] text-center text-sm font-medium italic text-primary/80">
                Note: API Keys provide access to your account through 3rd party
                application and allows for the collection of payments through
                PayBoss.
              </p>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
