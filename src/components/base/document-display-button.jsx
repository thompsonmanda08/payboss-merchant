import Image from "next/image";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const DocumentDisplayButton = ({
  documentName,
  documentUrl,
  onOpenModal,
  onDelete,
  imageUrl = "/images/attachment.png",
  buttonKey,
}) => {
  return (
    <Button
      key={buttonKey}
      className="relative flex max-h-[70px] h-full w-full cursor-pointer gap-x-2 justify-start rounded-[10px] border dark:hover:bg-primary/30 border-primary-100 dark:bg-primary/10 dark:border-primary-600/20 mb-2 bg-foreground-100 px-4 transition-all duration-300 ease-in-out"
      variant="light"
      onPress={onOpenModal}
    >
      {documentUrl && (
        <>
          <Link
            href={documentUrl || "#"}
            target="_blank"
            rel="noopener noreferrer" // Best practice for security when using target="_blank"
            onClick={(e) => e.stopPropagation()} // Prevent modal from opening when direct link is clicked
            aria-label={`Open ${documentName} in a new tab`}
          >
            <ArrowTopRightOnSquareIcon className="absolute right-2 top-2 z-50 h-5 w-5 text-foreground/20 hover:text-primary" />
          </Link>

          {onDelete && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute bottom-2 right-2 z-50 rounded-full p-1 text-danger transition-colors hover:bg-danger/20"
              aria-label={`Delete ${documentName}`}
            >
              <TrashIcon className="h-4 w-4" />
            </span>
          )}
        </>
      )}
      <div className="h-[65%]">
        <Image
          unoptimized
          alt={`${documentName} preview`} // More descriptive alt text
          className="h-full w-full object-cover"
          height={100}
          src={imageUrl}
          width={100}
        />
      </div>
      <div className="flex flex-col gap-y-1 justify-start items-start w-max">
        <span className="text-[13px] text-foreground/90 truncate">
          {" "}
          {/* Added truncate for long names */}
          {documentName}
        </span>
        <span className="text-[12px] text-primary/50">2MB Max</span>
      </div>
    </Button>
  );
};

export default DocumentDisplayButton;
