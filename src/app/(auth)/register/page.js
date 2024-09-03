'use client'
import Link from 'next/link'
import { Card, EmptyState, Logo } from '@/components/base'
import React from 'react'
import SignUpForm from '@/components/forms/SignupForm'

import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'
import useConfigOptions from '@/hooks/useConfigOptions'
import useAuthStore from '@/context/authStore'
import { Button } from '@/components/ui/Button'

export default function Register() {
  const { isLoading, isError } = useConfigOptions()
  const accountCreated = useAuthStore((state) => state.accountCreated)
  const router = useRouter()

  return (
    <div className="relative -mt-[260px] flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none xl:-mt-[300px]">
      {!accountCreated && (
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
      )}

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
      ) : accountCreated ? (
        <AccountCreatedSuccess />
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

export function AccountCreatedSuccess() {
  return (
    <>
      <Card className="m-auto mt-24 flex max-w-[600px] flex-col items-center justify-center lg:mt-40">
        <div className="mx-auto mb-4 flex">
          <Logo />
        </div>
        <h2
          className={
            'w-full bg-gradient-to-tr from-primary via-primary/80 to-primary-light bg-clip-text text-center text-[clamp(18px,18px+0.5vw,36px)] font-bold text-transparent'
          }
        >
          Account Created Successfully!
        </h2>
        <p className="py-4 pb-6 text-center text-sm leading-6 tracking-tight text-neutral-600 md:text-base ">
          <strong>Your account was created successfully!</strong> You will need
          to login and upload a few verification documents to verify your
          account. Approval takes up to{' '}
          <span className="font-bold">24 hours</span>, however you have limited
          access to your account until approval is completed.
        </p>

        <div className="grid w-full ">
          <Button as={Link} href={'/login'} className={'w-full flex-1'}>
            Login
          </Button>
        </div>
      </Card>
    </>
  )
}
