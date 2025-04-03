"use client";
import { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Chip, Spinner, Tooltip, useDisclosure } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { cn, formatDate, notify } from "@/lib/utils";
import PromptModal from "@/components/base/prompt-modal";
import CustomTable from "@/components/tables/table";
import { useTillNumber } from "@/hooks/useQueryHooks";
import { generateWorkspaceTillNumber } from "@/app/_actions/workspace-actions";
import { QUERY_KEYS } from "@/lib/constants";
import { getTillCollectionsLatestTransactions } from "@/app/_actions/transaction-actions";
import LoadingPage from "@/app/loading";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import SoftBoxIcon from "@/components/base/soft-box-icon";
import { TILL_TRANSACTION_COLUMNS } from "@/lib/table-columns";

import TillNumberBanner from "./till-number-banner";

export default function TillPaymentCollections({ workspaceID }) {
  const queryClient = useQueryClient();
  const { data: tillNumberResponse, isFetching } = useTillNumber(workspaceID);

  const { onOpen, onClose } = useDisclosure();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openViewConfig, setOpenViewConfig] = useState(false);

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, "YYYY-MM-DD");
  const end_date = formatDate(new Date(), "YYYY-MM-DD");

  // HANDLE FETCH TILL_NUMBER COLLECTION LATEST TRANSACTION DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.TILL_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getTillCollectionsLatestTransactions(workspaceID, dateRange),
  });

  const TILL_NUMBER = useMemo(() => {
    if (!tillNumberResponse?.success) return [];

    return tillNumberResponse?.data?.til || tillNumberResponse?.data?.till;
  }, [tillNumberResponse]);

  async function handleUserAction() {
    setIsLoading(true);

    const response = await generateWorkspaceTillNumber(workspaceID);

    if (!response?.success) {
      notify({
        color: "danger",
        title: "Failed to generate Till Number!",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries();

    notify({
      color: "success",
      title: "Success",
      description: "Till Number has been generated!",
    });
    setIsLoading(false);
    setIsNew(false);

    return;
  }

  useEffect(() => {
    // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
    if (!mutation.data) {
      mutation.mutateAsync({ start_date, end_date });
    }
  }, []);

  const LATEST_TRANSACTIONS = mutation.data?.data?.data || [];

  return isFetching ? (
    <LoadingPage />
  ) : (
    <>
      <TillNumberBanner
        isLoading={isFetching}
        isOpen={openViewConfig}
        tillNumber={TILL_NUMBER}
        onClose={() => {
          setOpenViewConfig(false);
          onClose();
        }}
      />
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-8 flex justify-between">
            <CardHeader
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
              infoText={
                "Use the till number to collect payments to your workspace wallet."
              }
              title={"Till Number Collections"}
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
              <TableColumn width={"70%"}>TILL NUMBER</TableColumn>
              <TableColumn width={"30%"}>SHORT CODE</TableColumn>
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
                <TableRow name="1">
                  <TableCell>
                    <Button
                      isDisabled
                      className={cn(
                        "flex h-auto w-full justify-start gap-4  bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100"
                      )}
                      startContent={
                        <SoftBoxIcon className={"h-12 w-12"}>
                          <QrCodeIcon />
                        </SoftBoxIcon>
                      }
                    >
                      <h3 className="mb-1 text-[clamp(2rem,1vw,2.5rem)] font-black uppercase text-primary-600">
                        {TILL_NUMBER || "TILL NUMBER"}
                      </h3>
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      className={cn(
                        "m-0 flex flex-row items-center justify-center rounded-md text-[clamp(1.25rem,1vw,2rem)]",
                        {
                          "-mb-3 mt-1": !TILL_NUMBER,
                        }
                      )}
                      color="primary"
                    >
                      <span>*</span> 484 <span>*</span>
                      <span className="text-[clamp(1rem,1vw,1.5rem)] font-bold">{` ${
                        TILL_NUMBER || "TILL NUMBER"
                      } * `}</span>
                      [
                      <span className="text-[clamp(1rem,1vw,1.5rem)] font-bold">
                        {" "}
                        AMOUNT{" "}
                      </span>
                      ] #
                    </Chip>{" "}
                    {!TILL_NUMBER && (
                      <>
                        <br />
                        <span className="flex font-medium text-foreground/70">
                          You currenly do not have a Till Number, generate on
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
                            onClick={() => setOpenViewConfig(true)}
                          >
                            <ComputerDesktopIcon className={`h-6 w-6`} />
                          </span>
                        </Tooltip>

                        {/* BANNER DOWNLOAD */}
                        <Tooltip
                          color="primary"
                          content="Download Till Banner "
                        >
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

        <Card>
          <div className="flex w-full items-center justify-between">
            <CardHeader
              className={"mb-4"}
              infoText={
                "Transactions made to your workspace wallet in the last 30days."
              }
              title={"Recent Transactions"}
            />
          </div>
          <CustomTable
            columns={TILL_TRANSACTION_COLUMNS}
            rows={LATEST_TRANSACTIONS || []}
            rowsPerPage={6}
            isLoading={mutation.isPending}
            // removeWrapper
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
          />
        </Card>
      </div>
      {/* MODALS */}
      <PromptModal
        confirmText={"Generate"}
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isNew}
        title={"Generate New Till Number "}
        onClose={() => {
          onClose();
          setIsNew(false);
        }}
        onConfirm={handleUserAction}
        onOpen={onOpen}
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
