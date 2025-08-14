import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import CardHeader from '@/components/base/card-header';
import { Button } from '@/components/ui/button';

const DocumentsViewer = ({
  documents,
  contractDocument,
}: {
  documents: any[];
  contractDocument: any;
}) => {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (documents?.length) {
      setSelectedDoc(documents[0]);
    }
  }, []);

  return (
    <>
      <CardHeader
        className={'py-0'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        infoText={
          'Documents that prove your company registrations and compliance with regulatory bodies.'
        }
        title="Business Documentation"
      />

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
          {documents?.map((document, index) => (
            <Button
              key={index}
              className="relative flex h-40 w-full cursor-pointer flex-col gap-y-2 rounded-[10px] border dark:hover:bg-primary/30 border-primary-100 dark:bg-primary/10 dark:border-primary-600/20 bg-foreground-100 p-4 transition-all duration-300 ease-in-out"
              variant="light"
              onClick={() => {
                setSelectedDoc(document);
                setIsOpen(true);
              }}
            >
              <Link href={document?.url} target="_blank">
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
                {document?.name}
              </span>
            </Button>
          ))}

          {contractDocument && (
            <Button
              className="relative flex h-40 w-full cursor-pointer flex-col gap-y-2 rounded-[10px] border dark:hover:bg-primary/30 border-primary-100 dark:bg-primary/10 dark:border-primary-600/20 bg-foreground-100 p-4 transition-all duration-300 ease-in-out"
              variant="light"
              onClick={() => {
                setSelectedDoc(contractDocument);
                setIsOpen(true);
              }}
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
                  src={'/images/attachment.png'}
                  width={80}
                />
              </div>
              <span className="text-[13px] text-foreground/90">
                {contractDocument?.name}
              </span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentsViewer;
