import { LoginForm } from '@/components/forms'
import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/base'

function LoginPage() {
  return (
    <div className="relative mt-32 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none">
      <div className="mb-0 rounded-t-2xl border-b-0 bg-transparent p-6 pb-0">
        <Link href={'/'} className="mb-4 flex w-full justify-start">
          <Logo />
        </Link>
        <h3 className="relative z-10 bg-gradient-to-tr from-primary via-primary/80 to-primary-light bg-clip-text text-2xl font-bold text-transparent lg:text-4xl">
          Welcome back
        </h3>
        <p className="mb-0">Enter your email and password to sign in</p>
      </div>
      {/********************* LOGIN FORM *********************/}
      <LoginForm />
      {/********************* LOGIN FORM *********************/}
      <div className="border-t-solid rounded-b-2xl border-t-0 bg-transparent p-6 px-1 pt-0 text-center lg:px-2">
        <p className="mx-auto mb-6 text-sm leading-normal">
          Don't have an account?
          <Link
            href="/register"
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-semibold text-transparent"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
