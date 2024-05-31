import React from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '../ui/Button'
import Link from 'next/link'

function LoginForm() {
  return (
    <div className="flex-auto p-6">
      <form role="form">
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            aria-label="Email"
            label="Email"
            aria-describedby="email-addon"
          />
        </div>

        <div className="mb-4">
          <Input
            type="password"
            placeholder="Password"
            aria-label="Password"
            label="Password"
            aria-describedby="password-addon"
          />
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="mb-0.5 flex min-h-6 items-center justify-start gap-2">
            <Switch />
            <label
              className="cursor-pointer select-none text-sm font-normal"
              for="rememberMe"
            >
              Remember me
            </label>
          </div>
          <Link
            href={'#'}
            className="px-2 text-sm font-medium  transition-all duration-300 ease-in-out hover:text-primary"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="">
          <Button
            type="button"
            href={'/dashboard'}
            className={'my-4 mt-6 w-full px-6'}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
