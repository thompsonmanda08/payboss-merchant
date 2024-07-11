import Link from 'next/link'
import { Logo } from '@/components/base'
import React from 'react'
import SignUpForm from '@/components/forms/SignupForm'

export default function Register() {
  return (
    <div className="relative mt-32 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none">
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
      <SignUpForm />
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
