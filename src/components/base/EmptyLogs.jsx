import empty from '@/images/emptyLogs.svg'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const EmptyLogs = ({
  listName,
  title,
  subTitle,
  height,
  className,
  classNames,
  image,
}) => {
  const { base, heading, paragraph } = classNames || ''
  return (
    <div
      style={{ height: height }}
      className={cn(
        `flex w-full flex-col items-center justify-center gap-1`,
        className,
        base,
      )}
    >
      <p
        className={cn(
          'text-center text-base  leading-6 text-primary-900',
          heading,
        )}
      >
        {title} {listName}
      </p>
      <p
        className={cn(
          'mb-2  text-center text-sm leading-6 text-slate-500',
          paragraph,
        )}
      >
        {subTitle} {listName}
      </p>
      <Image src={image || empty} alt="empty list" className="w-[450px]" />
    </div>
  )
}
export default EmptyLogs
