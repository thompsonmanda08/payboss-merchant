"use client";
import React, { useState } from "react";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Link,
  Image,
} from "@heroui/react";
import { notify } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import CardHeader from "@/components/base/CardHeader";
import { SingleFileDropzone } from "@/components/base/FileDropZone";
import { Button } from "@/components/ui/button";
import { registerTerminals } from "@/app/_actions/workspace-actions";
import { uploadTerminalConfigFile } from "@/app/_actions/pocketbase-actions";
import { motion } from "framer-motion";
import ProgressStep from "@/components/progress-step";
import { useQueryClient } from "@tanstack/react-query";

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
      workspaceID={workspaceID}
      setTerminalUrl={setTerminalUrl}
      terminalUrl={terminalUrl}
      navigateForward={goForward}
      navigateBackwards={goBack}
      handleProceed={handleTerminalRegistration}
    />,
    <CompleteConfig
      key={"complete"}
      handleClose={handleClose}
      navigateForward={goForward}
      navigateBackwards={goBack}
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
      notify({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setIsLoading(false);
      return;
    }

    queryClient.invalidateQueries();
    notify({
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
        size={"2xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleClose}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-4">
            <CardHeader
              title={CONFIG_VIEWS[currentTabIndex].title}
              infoText={CONFIG_VIEWS[currentTabIndex].infoText}
            />
            {/* <Tabs
              tabs={CONFIG_VIEWS}
              currentTab={currentTabIndex}
              navigateTo={navigateTo}
            /> */}
          </ModalHeader>

          <ModalBody className="mb-6">
            <ProgressStep
              className="-mt-1"
              STEPS={CONFIG_VIEWS}
              currentTabIndex={currentTabIndex}
            />
            {isLoading ? (
              <div className="flex flex-1 items-center rounded-lg">
                <Loader
                  size={100}
                  loadingText={"Running Configurations..."}
                  classNames={{
                    wrapper: "bg-primary-100/20 rounded-xl h-full",
                  }}
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
      notify({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setIsLoading(false);
      return;
    }

    notify({
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
              href={"/terminal_config_template.xlsx"}
              download={"terminal_config_template.xlsx"}
              className="mx-1 text-sm font-semibold text-primary hover:underline hover:underline-offset-2"
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
            size="lg"
            className={"w-full"}
            isLoading={isLoading}
            isDisabled={isLoading}
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
        className="relative z-0 mx-auto flex w-full max-w-[412px] flex-col gap-4"
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
            className="mx-auto"
            src={`/images/illustrations/terminals.svg`}
            alt="Complete Application Illustration"
            unoptimized
            width={300}
            height={200}
          />
        </div>
        <Button onClick={handleClose} className={"mb-5 w-full"}>
          Done
        </Button>
      </motion.div>
    </>
  );
}
