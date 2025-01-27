"use client";
import React from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";
import Loader from "@/components/ui/loader";
import CardHeader from "@/components/base/CardHeader";
import { DefaultCover } from "@/lib/constants";
import Image from "next/image";
import Logo from "@/components/base/Logo";
import BackgroundSVG from "@/components/base/BackgroundSVG";

// Create Document Component
export const TillBanner = ({ till }) => (
  <div className="relative flex h-full min-h-[600px] flex-1">
    <BackgroundSVG />
    <div className="flex flex-1 flex-col justify-between gap-4 p-4">
      {/* <Logo /> */}
      <p className="max-w-max text-center text-[clamp(2rem,2vw,4rem)] font-black leading-3 opacity-0">
        Pay like a Boss with PayBoss
      </p>
      <div className="font-display flex flex-col items-center justify-center gap-0">
        <h2 className="text-[clamp(2rem,12vw,4rem)] font-bold">*848#</h2>
        <span className="text-[clamp(4rem,3vw,6rem)] font-black text-primary">
          {till}
        </span>
        <span className="text-[clamp(2rem,2vw,4rem)] font-bold">
          {" *AMOUNT# "}
        </span>
      </div>
      <div className="font-semi-bold font-display flex items-center justify-center italic">
        Powered by <Logo href="#" aria-label="Home" className="" />
      </div>
    </div>
    <div className="hidden lg:block">
      <Image
        className="relative -bottom-12 ml-auto h-full w-full max-w-lg flex-1 rounded-l-[180px] object-cover object-right"
        src={DefaultCover}
        alt="banner"
        width={1024}
        height={300}
      />
      <Image
        className="absolute -bottom-6 right-12 z-20 h-full w-full flex-1 object-contain object-right"
        src={"/images/like-a-boss.png"}
        alt="lady-boss"
        width={1024}
        height={300}
      />
    </div>
  </div>
);

export default function TillNumberBanner({
  isOpen,
  onClose,
  configData,
  isLoading,
  tillNumber,
}) {
  return (
    <>
      <Modal
        // size={'lg'}
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[968px]"
        isDismissable={false}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-4">
              <CardHeader
                title={"Till Number"}
                infoText={
                  "Print this till number banner to display at the till"
                }
              />
            </ModalHeader>

            <ModalBody className="mb-4 !pr-0">
              {isLoading ? <Loader /> : <TillBanner till={tillNumber} />}
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
