'use client'

import {
  CloudArrowUpIcon,
  DocumentArrowUpIcon,
  PencilSquareIcon,
  PercentBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { twMerge } from 'tailwind-merge'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'
import { PencilIcon } from '@heroicons/react/20/solid'

const variants = {
  base: cn(
    'relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
  ),
  image:
    'border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md',
  active: 'border-2',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
  reject: 'border border-red-700 bg-red-700 bg-opacity-10',
}

const ERROR_MESSAGES = {
  fileTooLarge(maxSize) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`
  },
  fileInvalidType() {
    return 'Invalid file type.'
  },
  tooManyFiles(maxFiles) {
    return `You can only add ${maxFiles} file(s).`
  },
  fileNotSupported() {
    return 'The file is not supported.'
  },
}

const SingleFileDropzone = React.forwardRef(
  (
    {
      dropzoneOptions,
      width,
      height,
      value,
      className,
      disabled,
      onChange,
      otherAcceptedFiles,
      isMultipleFiles = false,
      isLandscape,
    },
    ref,
  ) => {
    const imageUrl = React.useMemo(() => {
      if (typeof value === 'string') {
        // in case a url is passed in, use it to display the image
        return value
      } else if (value) {
        // in case a file is passed in, create a base64 url to display the image
        return URL.createObjectURL(value)
      }
      return null
    }, [value])

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: {
        // 'image/png': [],
        'text/csv': [],
        'text/*': [],
        // 'application/*': [],
        'application/vnd.ms-excel': [],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
        ...otherAcceptedFiles,
      },
      multiple: isMultipleFiles,
      disabled,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
          void onChange?.(file)
        }
      },
      ...dropzoneOptions,
    })

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          imageUrl && variants.image,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [
        isFocused,
        imageUrl,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ],
    )

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0]
        if (errors[0]?.code === 'file-too-large') {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0)
        } else if (errors[0]?.code === 'file-invalid-type') {
          return ERROR_MESSAGES.fileInvalidType()
        } else if (errors[0]?.code === 'too-many-files') {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0)
        } else {
          return ERROR_MESSAGES.fileNotSupported()
        }
      }
      return undefined
    }, [fileRejections, dropzoneOptions])

    return (
      <div>
        <div
          {...getRootProps({
            className: dropZoneClassName,
            style: {
              width,
              height,
            },
          })}
        >
          {/* Main File Input */}
          <input ref={ref} {...getInputProps()} />

          {imageUrl ? (
            // Image Preview
            <img
              className="h-full w-full rounded-md object-cover"
              src={imageUrl}
              alt={acceptedFiles[0]?.name}
            />
          ) : acceptedFiles[0] ? (
            // File Preview
            <div
              className={cn(
                'bg-red-60 relative flex flex-col items-center gap-4 py-2',
                {
                  'w-full flex-row items-center justify-between ': isLandscape,
                },
              )}
            >
              <DocumentArrowUpIcon
                className={cn('absolute -z-0 h-24 w-24  text-gray-200', {
                  'm-0 h-8 w-8': isLandscape,
                })}
              />
              <div
                className={cn(
                  'relative z-10 flex flex-col items-center gap-4',
                  {
                    'bg-red-10 w-full gap-0': isLandscape,
                  },
                )}
              >
                {!isLandscape && (
                  // ONLY SHOWS ON THE UPRIGHT COMPONENT
                  <p className="py-2 font-medium">
                    Your file is ready to upload
                  </p>
                )}
                <span className="font-bold text-primary">
                  {acceptedFiles[0]?.name}
                </span>
                {/* // ONLY SHOWS ON THE UPRIGHT COMPONENT */}
                {!isLandscape && <Button disabled={disabled}>Change</Button>}
                {isLandscape && (
                  <XMarkIcon className="absolute -right-0 aspect-square w-5 rounded-md bg-red-100 p-0.5 text-red-500 hover:text-red-500" />
                )}
              </div>
            </div>
          ) : (
            // Upload Icon
            <div
              className={cn(
                'flex flex-col items-center justify-center text-xs text-gray-400',
                {
                  'w-full flex-row items-center justify-between ': isLandscape,
                },
              )}
            >
              <div
                className={cn('flex flex-col items-center', {
                  'flex-row gap-2 font-medium': isLandscape,
                })}
              >
                <CloudArrowUpIcon
                  className={cn('mb-2 h-12 w-12', { 'm-0 w-8': isLandscape })}
                />
                <div className="text-gray-400">Drag & Drop to Upload</div>
              </div>
              {!isLandscape && (
                // ONLY SHOWS ON THE UPRIGHT COMPONENT
                <div className={cn('mt-3', { 'm-0': isLandscape })}>
                  <Button disabled={disabled}>Upload</Button>
                </div>
              )}
            </div>
          )}

          {/* Remove Image Icon */}
          {imageUrl && !disabled && (
            <div
              className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
              onClick={(e) => {
                e.stopPropagation()
                void onChange?.(undefined)
              }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                <XMarkIcon
                  className="text-gray-500 dark:text-gray-400"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Text */}
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      </div>
    )
  },
)
SingleFileDropzone.displayName = 'SingleFileDropzone'

function formatFileSize(bytes) {
  if (!bytes) {
    return '0 Bytes'
  }
  bytes = Number(bytes)
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export { SingleFileDropzone }
