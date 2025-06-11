"use client";

import { Button } from "@/components/ui/button";
import { Modal, useDisclosure } from "@heroui/react";
import React from "react";
import CardHeader from "@/components/base/card-header";
import useKYCInfo from "@/hooks/useKYCInfo";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

function TermsAndAgreement() {
  const { signedContractDoc } = useKYCInfo();

  const contractDocument = {
    name: "Signed Contract Document",
    type: "SIGNED_CONTRACT",
    url: signedContractDoc || "#",
  };

  const { isOpen, onOpen, onClose } = useDisclosure(false);

  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        title="Contract & Agreement"
        infoText="Please read and agree to the terms and conditions."
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
      />

      <p className="mt-2 mb-4 text-sm text-gray-500">
        <span className="font-bold">Note: </span>
        Please ensure the document aligns with the submitted details.
      </p>

      {contractDocument?.url && (
        <Button
          className="relative flex h-40 w-80 cursor-pointer flex-col gap-y-2 rounded-[10px] border dark:hover:bg-primary/30 border-primary-100 dark:bg-primary/10 dark:border-primary-600/20 bg-foreground-100 p-4 transition-all duration-300 ease-in-out"
          variant="light"
          onClick={onOpen}
        >
          <Link href={contractDocument?.url} target="_blank">
            <ArrowTopRightOnSquareIcon className="absolute right-2 top-2 z-50 h-5 w-5 text-foreground/20 hover:text-primary" />
          </Link>
          <div className="h-[65%]">
            <Image
              unoptimized
              alt="file"
              className="h-full w-full object-cover"
              height={100}
              src={"/images/attachment.png"}
              width={80}
            />
          </div>
          <span className="text-[13px] text-foreground/90">
            {contractDocument?.name}
          </span>
        </Button>
      )}

      {contractDocument?.url && (
        <Modal
          removeCallToAction
          cancelText="Close"
          infoText="Ensure the document aligns with the submitted details"
          isDismissible={true}
          show={isOpen}
          title={contractDocument?.name}
          width={1200}
          onClose={onClose}
        ></Modal>
      )}
    </div>
  );
}

export default TermsAndAgreement;
