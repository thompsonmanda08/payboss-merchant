'use client';

import { addToast } from '@heroui/react';
import Link from 'next/link';
import React from 'react';

import { uploadPaymentBatchFile } from '@/app/_actions/pocketbase-actions';
import {
  ACCEPTABLE_FILE_TYPES,
  SingleFileDropzone,
} from '@/components/base/file-dropzone';
import { Button } from '@/components/ui/button';
import usePaymentsStore from '@/context/payment-store';

const UploadCSVFile = ({
  navigateForward,
  handleCancel,
  protocol,
}: {
  navigateForward: () => void;
  handleCancel: () => void;
  protocol: string;
}) => {
  const { paymentAction, updatePaymentFields } = usePaymentsStore();
  const [isLoading, setIsLoading] = React.useState(false);

  function handleProceed() {
    if (paymentAction?.url !== '') {
      navigateForward();

      return;
    }

    addToast({
      title: 'Error',
      color: 'danger',
      description: 'A valid file is required!',
    });
  }

  async function handleFileUpload(file: File, recordID?: string) {
    setIsLoading(true);

    const response = await uploadPaymentBatchFile(file, recordID);

    if (response?.success) {
      addToast({
        color: 'success',
        title: 'File Added!',
        description: 'File uploaded successfully!',
      });
      updatePaymentFields({
        file,
        url: response?.data?.file_url,
        recordID: response?.data?.file_record_id,
      });
      setIsLoading(false);

      return response?.data;
    }

    addToast({
      title: 'Error',
      color: 'danger',
      description: 'Failed to upload file.',
    });
    setIsLoading(false);

    return {};
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-5">
        <div className="flex flex-col">
          <SingleFileDropzone
            file={paymentAction?.file}
            isLoading={isLoading}
            isUploaded={paymentAction?.file != undefined}
            dropzoneOptions={{
              accept: ACCEPTABLE_FILE_TYPES.excel,
            }}
            onChange={async (file) =>
              await handleFileUpload(file as File, paymentAction?.recordID)
            }
          />

          <p className="mt-2 text-xs font-medium text-gray-500 lg:text-[13px]">
            Having trouble with the validation and file uploads? Download
            {protocol == 'direct' ? (
              <Link
                className="ml-1 font-bold text-primary hover:underline hover:underline-offset-2"
                download={'batch_record_template.xlsx'}
                href={'/batch_record_template.xlsx'}
              >
                Direct Transfer{' '}
              </Link>
            ) : (
              <Link
                className="ml-1 font-bold text-primary"
                download={'batch_record_template_voucher.xlsx'}
                href={'/batch_record_template_voucher.xlsx'}
              >
                Voucher Transfer{' '}
              </Link>
            )}
            template here
          </p>
        </div>
        <div>
          <ul className="list-disc rounded-lg bg-primary-50 p-2 px-10 text-sm text-slate-600">
            <li>
              Download the provided template to ensure your XLSX file is in the
              correct format.
            </li>
            <li>
              Upload the completed XLSX file with the correct data format.
            </li>
            <li>Enter a batch name to label the batch process.</li>
            <li>
              Review and validate the uploaded file; address any errors found
              during validation.
            </li>
            <li>
              If you have the necessary permissions, approve the batch process
              to proceed.
            </li>
          </ul>
        </div>

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          <Button
            color={'danger'}
            isDisabled={isLoading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={handleProceed}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default UploadCSVFile;
