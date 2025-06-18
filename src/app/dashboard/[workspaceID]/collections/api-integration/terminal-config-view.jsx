"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Link,
  Image,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import { addToast } from "@heroui/react";
import Loader from "@/components/ui/loader";
import CardHeader from "@/components/base/card-header";
import { SingleFileDropzone } from "@/components/base/file-dropzone";
import { Button } from "@/components/ui/button";
import { registerTerminals } from "@/app/_actions/workspace-actions";
import { uploadTerminalConfigFile } from "@/app/_actions/pocketbase-actions";
import ProgressStep from "@/components/progress-step";

export const CONFIG_VIEWS = [
  {
    title: "Terminal Configuration",
    name: "Upload",
    infoText: "Upload a file with your terminal configurations",
    step: "Upload Config File",
    index: 0,
  },
  {
    title: "Complete Config",
    infoText: "Upload a file with your terminal configurations",
    step: "Complete",
    index: 1,
  },
];

export default function TerminalConfigViewModal({
  isOpen,
  onClose,
  onOpenChange,
  workspaceID,
}) {
  const queryClient = useQueryClient();
  const [terminalUrl, setTerminalUrl] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    activeTab,
    currentTabIndex,
    navigateTo,
    navigateForward,
    navigateBackwards,
  } = useCustomTabsHook([
    <UploadTerminalConfigs
      key={"upload"}
      handleProceed={handleTerminalRegistration}
      navigateBackwards={goBack}
      navigateForward={goForward}
      setTerminalUrl={setTerminalUrl}
      terminalUrl={terminalUrl}
      workspaceID={workspaceID}
    />,
    <CompleteConfig
      key={"complete"}
      handleClose={handleClose}
      navigateBackwards={goBack}
      navigateForward={goForward}
    />,
  ]);

  function goForward() {
    navigateForward();
  }
  function goBack() {
    navigateBackwards();
  }

  function handleClose() {
    onClose();
  }

  async function handleTerminalRegistration() {
    setIsLoading(true);

    let response = await registerTerminals(workspaceID, terminalUrl);

    if (!response?.success) {
      addToast({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries();
    addToast({
      color: "success",
      title: "Success",
      description: "Config file uploaded!",
    });
    navigateForward();
    setIsLoading(false);
  }

  return (
    <>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        size={"2xl"}
        onClose={handleClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-4">
            <CardHeader
              infoText={CONFIG_VIEWS[currentTabIndex].infoText}
              title={CONFIG_VIEWS[currentTabIndex].title}
            />
            {/* <Tabs
              tabs={CONFIG_VIEWS}
              currentTab={currentTabIndex}
              navigateTo={navigateTo}
            /> */}
          </ModalHeader>

          <ModalBody className="mb-6">
            <ProgressStep
              STEPS={CONFIG_VIEWS}
              className="-mt-1"
              currentTabIndex={currentTabIndex}
            />
            {isLoading ? (
              <div className="flex flex-1 items-center rounded-lg">
                <Loader
                  classNames={{
                    wrapper: "bg-primary-100/20 rounded-xl h-full",
                  }}
                  loadingText={"Running Configurations..."}
                  size={100}
                />
              </div>
            ) : (
              activeTab
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const UploadTerminalConfigs = ({
  terminalUrl,
  setTerminalUrl,
  navigateForward,
  navigateBackwards,
  workspaceID,
  handleProceed,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleFileUpload(file) {
    setIsLoading(true);

    let response = await uploadTerminalConfigFile(file);

    if (!response?.success) {
      addToast({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    addToast({
      color: "success",
      title: "Success",
      description: "Config file uploaded!",
    });
    setTerminalUrl(response?.data?.file_url);
    setIsLoading(false);

    return response?.data;
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-5">
        <div className="flex flex-col px-5">
          <SingleFileDropzone
            isLoading={isLoading}
            otherAcceptedFiles={{
              "application/vnd.ms-excel": [],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [],
            }}
            onChange={async (file) => await handleFileUpload(file)}
          />

          <p className="mt-2 text-sm font-medium text-gray-500">
            Having trouble with the file upload? Download
            <Link
              className="mx-1 text-sm font-semibold text-primary hover:underline hover:underline-offset-2"
              download={"terminal_config_template.xlsx"}
              href={"/terminal_config_template.xlsx"}
            >
              Terminal Configuration
            </Link>
            template here
          </p>
        </div>
        <div>
          <ul className="list-disc rounded-lg bg-primary-50 p-2 px-10 text-sm text-slate-600">
            <li>
              Upload the completed .xlsx or .csv file format with the correct
              config for each terminal.
            </li>
            <li>
              If you have terminals active, then you will be required to to
              provide a terminal ID in order to facilitate a collection.
            </li>
            <li className="text-danger">
              Once terminals are configured, you will <strong>ONLY</strong> be
              able to <strong>DEACTIVATE</strong> this feature by contacting the
              support team.
            </li>
          </ul>
        </div>

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          {/* <Button
            className={"bg-primary/10 font-medium text-primary"}
            color={"primary"}
            variant="light"
            isDisabled={isLoading}
          >
            Cancel
          </Button> */}
          <Button
            className={"w-full"}
            isDisabled={isLoading}
            isLoading={isLoading}
            size="lg"
            onClick={handleProceed}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export function CompleteConfig({ handleClose }) {
  return (
    <>
      <motion.div
        className="relative z-0 mx-auto flex w-full max-w-[412px] flex-col gap-4"
        whileInView={{
          opacity: [0, 1],
          scaleX: [0.8, 1],
          transition: {
            type: "spring",
            stiffness: 300,
            ease: "easeInOut",
            duration: 0.25,
          },
        }}
      >
        <span className="mx-auto max-w-max rounded-full border border-primary/20 p-1 px-4 font-semibold text-primary">
          Terminal Configuration Complete!
        </span>
        <span className="max-w-md text-center text-sm font-medium leading-6 text-primary">
          Your terminal configuration has been uploaded and configured
          successfully!
        </span>
        <div className="relative mx-auto flex max-w-sm object-contain">
          <Image
            unoptimized
            alt="Complete Application Illustration"
            className="mx-auto"
            height={200}
            src={`/images/illustrations/terminals.svg`}
            width={300}
          />
        </div>
        <Button className={"mb-5 w-full"} onClick={handleClose}>
          Done
        </Button>
      </motion.div>
    </>
  );
}
