import Image from "next/image";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Link2Icon } from "lucide-react";

const DocumentDisplayButton = ({
  documentName,
  documentUrl,
  onOpenModal,
  onDelete,
  allowDelete = false,
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
        <div className="absolute right-2 top-2 z-50 flex flex-col gap-y-1 items-center">
          <Link
            href={documentUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${documentName} in a new tab`}
          >
            <Link2Icon className="h-5 w-5 text-foreground/20 hover:text-primary" />
          </Link>

          {onDelete && allowDelete && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-full p-1 text-danger transition-colors hover:bg-danger/20"
              aria-label={`Delete ${documentName}`}
            >
              <TrashIcon className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
      <div className="h-18 md:h-full -ml-2 py-1 ">
        <Image
          unoptimized
          alt={`${documentName} preview`} // More descriptive alt text
          className="h-full w-full md:max-w-[100px] max-w-[60px] aspect-square md:aspect-auto object-contain"
          height={100}
          src={imageUrl}
          width={100}
        />
      </div>
      <div className="flex flex-col gap-y-1 justify-start items-start w-max">
        <span className="text-xs sm:text-[13px] text-foreground/90 truncate">
          {" "}
          {/* Added truncate for long names */}
          {documentName}
        </span>
        <span className="text-[9px] sm:text-xs md:text-[12px] text-primary/50">
          2MB Max
        </span>
      </div>
    </Button>
  );
};

export default DocumentDisplayButton;
