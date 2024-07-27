'use client'
import Link from 'next/link'
import { Card, EmptyState, Logo } from '@/components/base'
import React from 'react'
import SignUpForm from '@/components/forms/SignupForm'
import { useGeneralConfigOptions, useUserRoles } from '@/hooks/useQueryHooks'
import useConfigStore from '@/context/configStore'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'

export default function Register() {
  const {
    data: configs,
    isLoading,
    isError,
    isSuccess,
  } = useGeneralConfigOptions()
  const { data: userRoleResponse, isFetched } = useUserRoles()
  const setConfigOptions = useConfigStore((state) => state.setConfigOptions)
  const setUserRoles = useConfigStore((state) => state.setUserRoles)
  const router = useRouter()

  if (isSuccess) setConfigOptions(configs?.data)
  if (isFetched) setUserRoles(userRoleResponse?.data?.roles)

  return (
    <div className="relative -mt-[260px] flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none">
      <div className="mb-10 flex flex-col items-center rounded-t-2xl border-b-0 p-6 pb-0">
        <Logo isWhite containerClasses={'scale-[1.5] mb-4'} />
        <h2
          className={
            'w-full text-center text-[clamp(18px,18px+1vw,48px)] font-bold text-transparent text-white'
          }
        >
          Create an Account
        </h2>
        <p className="mb-0 text-center text-slate-100">
          Join the Payboss family and handle your payments easily!
        </p>
      </div>

      {/********************* REGISTER FORM *********************/}
      {isLoading ? (
        <Card className="flex aspect-square w-[300px] items-center justify-center self-center bg-white p-5 ">
          <Spinner size={48} />
        </Card>
      ) : isError ? (
        <Card className="flex  max-w-md items-center justify-center self-center bg-white p-5 ">
          <EmptyState
            title={'Error'}
            message={'Something went wrong. Try reloading the page!'}
            buttonText={'Reload'}
            onButtonClick={() => router.refresh()}
          />
        </Card>
      ) : (
        <SignUpForm />
      )}
      {/********************* REGISTER FORM *********************/}
      <div className="my-10 bg-transparent text-center">
        <p className="mx-auto  font-inter text-base font-medium leading-6 tracking-normal text-slate-500">
          Already have an account?
          <Link
            href="/login"
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-bold text-transparent"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
