'use client';
import {
  Plus as PlusIcon,
  QrCode as QrCodeIcon,
  Download as ArrowDownTrayIcon,
  Monitor as ComputerDesktopIcon,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Tooltip,
  useDisclosure,
  addToast,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { generateWorkspaceTillNumber } from '@/app/_actions/workspace-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import SoftBoxIcon from '@/components/base/soft-box-icon';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { useTillNumber } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { cn } from '@/lib/utils';

import TillNumberBanner from './till-number-banner';

export default function CreateNewTillNumber({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const queryClient = useQueryClient();
  const { data: tillConfig, isFetching } = useTillNumber(workspaceID);

  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const TILL_NUMBER = useMemo(() => {
    if (!tillConfig?.success) return [];

    return tillConfig?.data?.till;
  }, [tillConfig]);

  async function generateTillNumber() {
    setIsLoading(true);
    const response = await generateWorkspaceTillNumber(workspaceID);

    if (response?.success) {
      addToast({
        color: 'success',
        title: 'Success',
        description: 'Till Number has been generated!',
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACE_TILL_NUMBER, workspaceID],
      });
    } else {
      addToast({
        color: 'danger',
        title: 'Failed to generate Till Number!',
        description: response?.message,
      });
    }

    setIsLoading(false);
    setIsNew(false);
  }

  return (
    <>
      <Card className="">
        <div className="mb-8 flex justify-between">
          <CardHeader
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: '!text-sm xl:text-base',
            }}
            infoText={
              'Use the till number to collect payments to your workspace wallet.'
            }
            title={'Till Number Collections'}
          />
          <Button
            endContent={<PlusIcon className="h-5 w-5" />}
            isDisabled={Boolean(TILL_NUMBER)}
            onClick={() => setIsNew(true)}
          >
            Generate Till Number
          </Button>
        </div>

        <Table removeWrapper aria-label="TILL_NUMBER KEY TABLE">
          <TableHeader>
            <TableColumn width={'70%'}>TILL NUMBER</TableColumn>
            <TableColumn width={'30%'}>SHORT CODE</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                <span className="flex gap-4 text-sm font-bold capitalize text-foreground/70">
                  You have no till number generated
                </span>
              </div>
            }
            isLoading={isFetching}
            loadingContent={
              <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                  <Spinner size="sm" /> Loading till number...
                </span>
              </div>
            }
          >
            {
              <TableRow>
                <TableCell>
                  <Button
                    isDisabled
                    className={
                      'flex h-auto w-full justify-start gap-4  bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100'
                    }
                    startContent={
                      <SoftBoxIcon className={'h-12 w-12'}>
                        <QrCodeIcon />
                      </SoftBoxIcon>
                    }
                  >
                    <h3 className="mb-1 text-[clamp(2rem,1vw,2.5rem)] font-black uppercase text-primary-600">
                      {TILL_NUMBER || 'TILL NUMBER'}
                    </h3>
                  </Button>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    className={cn(
                      'm-0 flex flex-row items-center justify-center rounded-md text-[clamp(1.25rem,1vw,2rem)]',
                      { '-mb-3 mt-1': !TILL_NUMBER },
                    )}
                    color="primary"
                  >
                    <span>*</span> 848 <span>*</span>
                    <span className="text-[clamp(1rem,1vw,1.5rem)] font-bold">{` ${
                      TILL_NUMBER || 'TILL NUMBER'
                    } * `}</span>
                    [
                    <span className="text-[clamp(1rem,1vw,1.5rem)] font-bold">
                      {' '}
                      AMOUNT{' '}
                    </span>
                    ] #
                  </Chip>{' '}
                  {!TILL_NUMBER && (
                    <>
                      <br />
                      <span className="flex font-medium text-foreground/70">
                        You currently do not have a Till Number, generate on
                        here ☝🏾
                      </span>
                    </>
                  )}
                </TableCell>

                <TableCell>
                  <>
                    <div className="flex items-center gap-4">
                      {/* BANNER DISPLAY */}
                      <Tooltip color="secondary" content="View Till Banner">
                        <span
                          className="cursor-pointer rounded-md bg-secondary/10 p-2 text-secondary transition-all duration-300 ease-in-out hover:bg-secondary hover:text-white"
                          role="button"
                          tabIndex={0}
                          onClick={() => onOpen()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              onOpen();
                            }
                          }}
                        >
                          <ComputerDesktopIcon className={`h-6 w-6`} />
                        </span>
                      </Tooltip>

                      {/* BANNER DOWNLOAD */}
                      <Tooltip color="primary" content="Download Till Banner ">
                        <span className="cursor-pointer rounded-md bg-primary p-2 text-white transition-all duration-300 ease-in-out hover:bg-primary/80">
                          <ArrowDownTrayIcon
                            className="h-6 w-6"
                            // onClick={() => copyToClipboard(apiKey?.name)}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Card>
      {/* MODALS */}

      <TillNumberBanner
        isLoading={isFetching}
        isOpen={isOpen}
        tillNumber={TILL_NUMBER}
        onClose={() => {
          onClose();
        }}
      />

      <PromptModal
        confirmText={'Generate'}
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isNew}
        title={'Generate New Till Number '}
        onClose={() => {
          onClose();
          setIsNew(false);
        }}
        onConfirm={generateTillNumber}
        // onOpen={onOpen}
      >
        <p className="-mt-4 text-sm leading-6 text-foreground/70">
          <strong>Are you sure you want to generate a new Till number?</strong>
          <br />
          This till number will allow you collect funds to your workspace wallet
          from 3rd party applications and interfaces.
        </p>
      </PromptModal>
    </>
  );
}
