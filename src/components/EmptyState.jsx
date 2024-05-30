import Link from 'next/link'
import React from 'react'
import { Button } from './Button'

function EmptyState({
  title,
  message,
  href,
  buttonText,
  onButtonClick,
  children,
}) {
  return (
    <div className="my-12 flex h-full w-full flex-col items-center justify-center text-gray-300">
      <h3
        className={`${''} text-primary-800 text-center text-2xl font-bold leading-8 md:text-[48px]`}
      >
        {title || 'Whoops-a-daisy!'}
      </h3>
      <p
        className={`my-6 mb-4 max-w-[380px] p-2 px-5 text-center text-sm text-gray-400/80 md:max-w-[480px] md:text-base`}
      >
        {message || 'There is nothing here yet. Please try again later.'}
      </p>
      {children ||
        (!onButtonClick ? (
          <Link href={href || '/'}>
            <Button className={'h-12 px-8'}>{buttonText || 'Go Home'}</Button>
          </Link>
        ) : (
          <Button className={'px-8 py-3'} onClick={onButtonClick}>
            {buttonText || 'Done'}
          </Button>
        ))}
    </div>
  )
}

export default EmptyState
