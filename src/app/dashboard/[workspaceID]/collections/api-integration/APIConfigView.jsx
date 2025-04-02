"use client";
import React, { useEffect, useState } from "react";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Snippet,
  ModalFooter,
} from "@heroui/react";
import { syntaxHighlight } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import Tabs from "@/components/tabs";
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
  configData,
  isLoading,
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
        url: configData?.collectionAuthURL,
        authentication: configData?.authPayload,
        response: configData?.authResponse,
      }}
    />,

    <ActionResponses
      key={currentStep.title}
      config={{
        url: configData?.collectionURL,
        payload: configData?.collectionPayload,
        response: configData?.collectionResponse,
      }}
    />,
    <StatusResponses
      key={currentStep.title}
      config={{
        url: configData?.collectionStatusURL,
        response: configData?.collectionStatusResponse,
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
        isOpen={isOpen}
        onClose={handleClose}
        isDismissable={false}
        className="max-w-[768px]"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-4">
              <CardHeader
                title={currentStep.title}
                infoText={currentStep.infoText}
              />
              <Tabs
                tabs={TABS}
                currentTab={currentTabIndex}
                navigateTo={navigateTo}
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

export function API_Authentication({ config, titles }) {
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
                JSON.stringify(payload || authentication, undefined, 2)
              ),
            }}
          ></pre>
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
          ></pre>
        </Snippet>
      </div>
    </div>
  );
}

export function ActionResponses({ config, titles, method }) {
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
                  JSON.stringify(payload || collection, undefined, 2)
                ),
              }}
            ></pre>
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
          ></pre>
        </Snippet>
      </div>
    </div>
  );
}

export function StatusResponses({ config, titles }) {
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
          ></pre>
        </Snippet>
      </div>
    </div>
  );
}
