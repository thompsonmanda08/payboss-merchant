import { Logo } from '@/components/base'
import { LoginForm } from '@/components/forms'
import Link from 'next/link'
import React from 'react'

function LoginPage() {
  return (
    <div className="mx-auto flex max-h-[100%-180px] w-full min-w-0 max-w-lg -translate-y-[130px] flex-col break-words rounded-2xl border-0  bg-clip-border shadow-none">
      <div className="mb-0 -translate-y-[100px] rounded-t-2xl border-b-0 p-6 pb-0">
        <h2
          className={
            'w-full text-center text-[clamp(18px,18px+1vw,48px)] font-bold text-transparent text-white'
          }
        >
          Welcome Back!
        </h2>
        <p className="mb-0 text-center text-slate-100">
          Enter your email and password to sign in
        </p>
      </div>
      {/********************* LOGIN FORM *********************/}
      <LoginForm />
      {/********************* LOGIN FORM *********************/}
      <div className="bg-transparent text-center">
        <p className="mx-auto  font-inter text-base font-medium leading-6 tracking-normal text-slate-500">
          Don't have an account?
          <Link
            href="/register"
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-bold text-transparent"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
