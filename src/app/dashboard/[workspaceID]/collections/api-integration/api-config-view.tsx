"use client";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Snippet,
  ModalFooter,
} from "@heroui/react";

import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { syntaxHighlight } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import Tabs from "@/components/elements/tabs";
import CardHeader from "@/components/base/card-header";

export const API_CONFIG_VIEWS = [
  {
    title: "API Authentication",
    infoText: "Credentials for applications to access the API",
    step: "authentication",
  },
  {
    title: "Payment Collections",
    infoText: "Payment Collection JSON request and response payloads",
    step: "collections",
  },
  {
    title: "Transaction Status",
    infoText: "Payment Collection JSON response for a status callback",
    step: "status",
  },
];

export default function APIConfigViewModal({
  isOpen,
  onClose,
  isLoading,
  API_CONFIG,
}: {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  API_CONFIG: any;
}) {
  const [currentStep, setCurrentStep] = useState(API_CONFIG_VIEWS[0]);

  const TABS = [
    {
      name: "Authentication",
      index: 0,
    },
    {
      name: "Collections",
      index: 1,
    },
    {
      name: "Status Callback",
      index: 2,
    },
  ];

  const {
    activeTab,
    currentTabIndex,
    navigateTo,
    navigateForward,
    navigateBackwards,
  } = useCustomTabsHook([
    <API_Authentication
      key={currentStep.title}
      config={{
        url: API_CONFIG?.collectionAuthURL,
        authentication: API_CONFIG?.authPayload,
        response: API_CONFIG?.authResponse,
      }}
    />,

    <ActionResponses
      key={currentStep.title}
      config={{
        url: API_CONFIG?.collectionURL,
        payload: API_CONFIG?.collectionPayload,
        response: API_CONFIG?.collectionResponse,
      }}
    />,
    <StatusResponses
      key={currentStep.title}
      config={{
        url: API_CONFIG?.collectionStatusURL,
        response: API_CONFIG?.collectionStatusResponse,
      }}
    />,
  ]);

  function goForward() {
    navigateForward();
  }
  function handleClose() {
    onClose();
  }

  useEffect(() => {
    // if (protocol) {
    //   setSelectedProtocol(protocol)
    // }
    // return () => {
    //   queryClient.invalidateQueries()
    // }
  }, [currentTabIndex]);

  return (
    <>
      <Modal
        // size={'lg'}
        className="max-w-[768px]"
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-4">
              <CardHeader
                infoText={currentStep.infoText}
                title={currentStep.title}
              />
              <Tabs
                currentTab={currentTabIndex}
                navigateTo={navigateTo}
                tabs={TABS}
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

export function API_Authentication({
  config,
  titles,
}: {
  config: any;
  titles?: any;
}) {
  const { payload, authentication, response, url } = config;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="max-w-full">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.url || "Authentication URL"}
        </h4>
        <Snippet hideSymbol className="w-full flex-1">
          <p className="text-wrap">POST ~ {url}</p>
        </Snippet>
      </div>
      <div className="flex w-full flex-col gap-2">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.payload || "Authentication Payload"}
        </h4>
        <Snippet hideSymbol>
          <pre
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(
                JSON.stringify(payload || authentication, undefined, 2),
              ),
            }}
          />
        </Snippet>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.response || "Authentication Response"}
        </h4>
        <Snippet hideSymbol>
          <pre
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(JSON.stringify(response, undefined, 2)),
            }}
          />
        </Snippet>
      </div>
    </div>
  );
}

export function ActionResponses({
  config,
  titles,
  method,
}: {
  config: any;
  titles?: any;
  method?: string;
}) {
  const { collection, response, url, payload } = config;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="max-w-full">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.url || "Collection URL"}
        </h4>
        <Snippet hideSymbol className="w-full flex-1">
          <p className="text-wrap">
            {method || "POST"} ~ {url}
          </p>
        </Snippet>
      </div>
      {method !== "GET" && (
        <div className="flex flex-col gap-2">
          <h4 className="text-base font-bold text-slate-600">
            {titles?.payload || "Collection Payload"}
          </h4>
          <Snippet hideSymbol className="w-full">
            <pre
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(
                  JSON.stringify(payload || collection, undefined, 2),
                ),
              }}
            />
          </Snippet>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.response || "Collection Response"}
        </h4>
        <Snippet hideSymbol className="w-full">
          <pre
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(JSON.stringify(response, undefined, 2)),
            }}
          />
        </Snippet>
      </div>
    </div>
  );
}

export function StatusResponses({
  config,
  titles,
}: {
  config: any;
  titles?: any;
}) {
  const { response, url } = config;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="max-w-full">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.url || "Status Callback URL"}
        </h4>
        <Snippet hideSymbol className="w-full flex-1">
          <p className="text-wrap">GET ~ {url}</p>
        </Snippet>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-base font-bold text-slate-600">
          {titles?.response || "Transaction Status Response"}
        </h4>
        <Snippet hideSymbol className="w-full">
          <pre
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(JSON.stringify(response, undefined, 2)),
            }}
          />
        </Snippet>
      </div>
    </div>
  );
}
