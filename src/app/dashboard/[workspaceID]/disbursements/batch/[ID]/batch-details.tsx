'use client';
import { usePathname, useRouter } from 'next/navigation';

import CustomTable from '@/components/tables/table';
import { SINGLE_TRANSACTIONS_VALIDATION_COLUMNS } from '@/lib/table-columns';
import { Pagination } from '@/types';

export default function BatchDetails({
  batch,
  pagination,
}: {
  batch: any;
  batchID?: string;
  pagination: Pagination;
}) {
  // const {
  //   data: batchResponse,
  //   // isSuccess,
  //   // isLoading,
  // } = useBatchDetails(batchID);
  const pathname = usePathname();
  const router = useRouter();

  // const batch = batchResponse?.data;

  // useEffect(() => {
  //   if (protocol) {
  //     setSelectedProtocol(protocol);
  //   }

  //   return () => {
  //     queryClient.invalidateQueries();
  //   };
  // }, [protocol]);

  return (
    <>
      <CustomTable
        removeWrapper
        columns={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
        rows={batch}
        limitPerRow={20}
        pagination={pagination}
        handlePageChange={(page) => {
          router.replace(`${pathname}?page=${page}&&limit=20`);
        }}
      />
    </>
  );
}
