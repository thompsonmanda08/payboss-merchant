'use client'
import Link from 'next/link'
import { EmptyState, Logo, Spinner } from '@/components/base'
import React from 'react'
import SignUpForm from '@/components/forms/SignupForm'
import { useGeneralConfigOptions } from '@/hooks/useQueryHooks'
import useConfigStore from '@/context/configStore'
import { useRouter } from 'next/navigation'

export default function Register() {
  const {
    data: configs,
    isLoading,
    isError,
    isSuccess,
  } = useGeneralConfigOptions()
  const setConfigOptions = useConfigStore((state) => state.setConfigOptions)
  const router = useRouter()

  if (isSuccess) {
    // SET CONFIGS & OPTIONS
    setConfigOptions(configs?.data)
  }

  console.log('AUTH CONFIGS:==> ', configs)

  return (
    <div className="relative mt-24 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none">
      <div className="mx-auto mb-8 w-full max-w-sm">
        <Link href={'/'} className="mb-4 flex w-full justify-start">
          <Logo />
        </Link>
        <h3 className="relative z-10 bg-gradient-to-tr from-primary via-primary/80 to-primary-light bg-clip-text text-2xl font-bold text-transparent lg:text-4xl">
          Create an Account
        </h3>
        <p className="mb-0 text-sm font-medium text-neutral-600">
          Join the Payboss family and handle your payments easily!
        </p>
      </div>
      {/********************* REGISTER FORM *********************/}
      {isLoading ? (
        <div className="flex aspect-square min-w-24 items-center justify-center ">
          <Spinner size={48} />
        </div>
      ) : isError ? (
        <EmptyState
          title={'Error'}
          message={'Something went wrong. Try reloading the page!'}
          buttonText={'Reload'}
          onButtonClick={() => router.refresh()}
        />
      ) : (
        <SignUpForm />
      )}
      {/********************* REGISTER FORM *********************/}
      <div className="border-t-solid rounded-b-2xl border-t-0 bg-transparent p-6 px-1 pt-0 text-center lg:px-2">
        <p className="mx-auto my-6 text-sm font-medium leading-normal text-neutral-600">
          Already have an account?
          <Link
            href="/login"
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-semibold text-transparent"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
