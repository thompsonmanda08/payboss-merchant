'use client';

import { ExternalLink as ArrowTopRightOnSquareIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import CardHeader from '@/components/base/card-header';
import EmptyLogs from '@/components/base/empty-logs';
import IframeWithFallback from '@/components/base/IframeWithFallback';
import Modal from '@/components/modals/custom-modal';
import { Button } from '@/components/ui/button';
import useKYCInfo from '@/hooks/use-kyc-info';

function TermsAndAgreement({
  isAdminOrOwner,
  onCompletionNavigateTo,
}: {
  isAdminOrOwner: boolean;
  onCompletionNavigateTo?: (targetSectionId?: string) => void;
}) {
  const { signedContractDoc } = useKYCInfo();

  const contractDocument = {
    name: 'Signed Contract Document',
    type: 'SIGNED_CONTRACT',
    url: signedContractDoc || null,
  };

  const [isOpenModal, setIsOpenModal] = useState(false);

  return isAdminOrOwner ? (
    <>
      <div className="w-full lg:px-8 mx-auto p-2">
        <CardHeader
          className={'py-0 mb-6'}
          classNames={{
            infoClasses: 'mb-0',
            innerWrapper: 'gap-0',
          }}
          infoText="Please read and agree to the terms and conditions."
          title="Contract & Agreement"
        />

        <p className="mt-2 mb-4 text-sm text-gray-500">
          <span className="font-bold">Note: </span>
          Please ensure the document aligns with the submitted details.
        </p>

        <Button
          className="relative flex h-40 w-80 cursor-pointer flex-col gap-y-2 rounded-[10px] border dark:hover:bg-primary/30 border-primary-100 dark:bg-primary/10 dark:border-primary-600/20 bg-foreground-100 p-4 transition-all duration-300 ease-in-out"
          variant="light"
          onClick={() => setIsOpenModal(true)}
        >
          <Link href={contractDocument?.url || '#'} target="_blank">
            <ArrowTopRightOnSquareIcon className="absolute right-2 top-2 z-50 h-5 w-5 text-foreground/20 hover:text-primary" />
          </Link>
          <div className="h-[65%]">
            <Image
              unoptimized
              alt="file"
              className="h-full w-full object-cover"
              height={100}
              src={'/images/attachment.png'}
              width={80}
            />
          </div>
          <span className="text-[13px] text-foreground/90">
            {contractDocument?.name}
          </span>
        </Button>
      </div>
      {/* <div className="mt-4 flex w-full justify-end items-start gap-4">
        <Button
          className={'justify-end ml-auto'}
          onPress={() => onCompletionNavigateTo?.('summary')}
        >
          Next Section
        </Button>
      </div> */}

      <Modal
        removeCallToAction
        cancelText="Close"
        infoText="Ensure the document aligns with the submitted details"
        isDismissible={true}
        show={isOpenModal}
        title={contractDocument?.name}
        width={1200}
        onClose={() => {
          setIsOpenModal(false);
        }}
      >
        <IframeWithFallback
          src={contractDocument?.url}
          title={contractDocument?.name}
        />
      </Modal>
    </>
  ) : (
    <div className="flex aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg  text-sm font-semibold text-slate-600">
      <EmptyLogs
        className={'my-auto'}
        subTitle={
          'Only the admin or account owner can access/submit company documentation.'
        }
        title={'Oops! Looks like your are not an Admin'}
      />
    </div>
  );
}

export default TermsAndAgreement;
