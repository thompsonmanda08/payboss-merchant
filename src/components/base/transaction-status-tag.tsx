import { cn } from "@/lib/utils";

function TransactionStatusTag({ status, className }:{
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mx-auto cursor-pointer select-none rounded-md bg-gradient-to-tr p-1 px-2 text-xs font-medium text-white",
        className,
        {
          "from-gray-400 to-gray-600": "Scheduled" == status,
          "from-orange-400 to-orange-600": "Pending" == status,
          "from-blue-600 to-blue-500": "In Progress" == status,
          "from-green-500 to-green-700": "Completed" == status,
        },
      )}
    >
      {status}
    </span>
  );
}

export default TransactionStatusTag;
