import Image from 'next/image';

import { cn } from '@/lib/utils';

const EmptyLogs = ({
  listName,
  title,
  subTitle,
  height,
  className,
  classNames,
  image,
}: {
  listName?: string;
  title?: string;
  subTitle?: string;
  height?: string;
  className?: string;
  classNames?: {
    base?: string;
    heading?: string;
    paragraph?: string;
  };
  image?: string;
}) => {
  return (
    <div
      className={cn(
        `flex w-full flex-col items-center justify-center gap-1`,
        className,
        classNames?.base,
      )}
      style={{ height: height }}
    >
      <p
        className={cn(
          'text-center text-base  leading-6 dark:text-foreground-700 text-primary-900',
          classNames?.heading,
        )}
      >
        {title} {listName}
      </p>
      <p
        className={cn(
          'mb-2  text-center text-sm leading-6 text-foreground/50',
          classNames?.paragraph,
        )}
      >
        {subTitle} {listName}
      </p>
      <Image
        alt="empty list"
        className="w-[450px] aspect-video"
        height={450}
        src={image || '/images/emptyLogs.svg'}
        width={450}
      />
    </div>
  );
};

export default EmptyLogs;
