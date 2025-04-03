"use client";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/react";
import Image from "next/image";

import Loader from "@/components/ui/loader";
import CardHeader from "@/components/base/card-header";
import { DefaultCover } from "@/lib/constants";
import Logo from "@/components/base/payboss-logo";
import BackgroundSVG from "@/components/base/background-svg";

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
        <h2 className="text-[clamp(2rem,12vw,4rem)] font-bold">*484#</h2>
        <span className="text-[clamp(4rem,3vw,6rem)] font-black text-primary">
          {till}
        </span>
        <span className="text-[clamp(2rem,2vw,4rem)] font-bold">
          {" *AMOUNT# "}
        </span>
      </div>
      <div className="font-semi-bold font-display flex items-center justify-center italic">
        Powered by <Logo aria-label="Home" className="" href="#" />
      </div>
    </div>
    <div className="hidden lg:block">
      <Image
        alt="banner"
        className="relative -bottom-12 ml-auto h-full w-full max-w-lg flex-1 rounded-l-[180px] object-cover object-right"
        height={300}
        src={DefaultCover}
        width={1024}
      />
      <Image
        alt="lady-boss"
        className="absolute -bottom-6 right-12 z-20 h-full w-full flex-1 object-contain object-right"
        height={300}
        src={"/images/like-a-boss.png"}
        width={1024}
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
        className="max-w-[968px]"
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-4">
              <CardHeader
                infoText={
                  "Print this till number banner to display at the till"
                }
                title={"Till Number"}
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
