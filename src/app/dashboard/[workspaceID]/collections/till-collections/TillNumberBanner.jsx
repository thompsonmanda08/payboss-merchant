'use client'
import React from 'react'
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/react'
import Loader from '@/components/ui/Loader'
import CardHeader from '@/components/base/CardHeader'
import { DefaultCover } from '@/lib/constants'
import Image from 'next/image'

// Create Document Component
export const TillBanner = ({ configData }) => (
  <div className="relative flex h-full min-h-[600px] flex-1 ">
    <div className="flex flex-1 flex-col gap-4 bg-red-100 p-4">
      <h2></h2>
      
    </div>
    <div>
      <Image
        className="relative -bottom-6 ml-auto h-full w-full max-w-lg flex-1 rounded-l-[180px] object-cover object-right"
        src={DefaultCover}
        alt="banner"
        width={1024}
        height={300}
      />
      <Image
        className="absolute -bottom-6 right-0 z-20 h-full w-full flex-1 scale-x-[-1] object-contain object-left"
        src={'/images/like-a-boss.png'}
        alt="banner"
        width={1024}
        height={300}
      />
    </div>
  </div>
)

export default function TillNumberBanner({
  isOpen,
  onClose,
  configData,
  isLoading,
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
                title={'Till Number'}
                infoText={
                  'Print this till number banner to display at the till'
                }
              />
            </ModalHeader>

            <ModalBody className="mb-4 bg-red-50 !pr-0">
              {isLoading ? <Loader /> : <TillBanner configData={configData} />}
            </ModalBody>
            {/* <ModalFooter>
              <p className="mx-auto max-w-[600px] text-center text-sm font-medium italic text-primary/80">
                Note: API Keys provide access to your account through 3rd party
                application and allows for the collection of payments through
                PayBoss.
              </p>
            </ModalFooter> */}
          </>
        </ModalContent>
      </Modal>
    </>
  )
}
