'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@nextui-org/switch'
import { Button } from '../ui/Button'
import Link from 'next/link'
import useAuthStore from '@/context/authStore'
import { authenticateUser } from '@/app/_actions/auth-actions'
import { useRouter } from 'next/navigation'

function LoginForm() {
  const { push } = useRouter()
  const { loginDetails, updateLoginDetails, setIsLoading, isLoading } =
    useAuthStore()

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)
    console.log(loginDetails)
    const { emailusername, password } = loginDetails
    if (emailusername && password) {
      const payload = await authenticateUser(loginDetails)
      console.log(payload)

      if (payload.success) push('/dashboard')
      if (!payload.success) setIsLoading(false)
    }
  }

  return (
    <div className="flex-auto p-6">
      <form role="form" onSubmit={handleLogin}>
        <div className="mb-4">
          <Input
            placeholder="Enter your email or username"
            aria-label="Email"
            name={'emailusername'}
            label="Email or Username"
            aria-describedby="email-addon"
            onChange={(e) => {
              updateLoginDetails({ emailusername: e.target.value })
            }}
          />
        </div>

        <div className="mb-4">
          <Input
            type="password"
            name="password"
            placeholder="Enter Password"
            aria-label="Password"
            label="Password"
            aria-describedby="password-addon"
            onChange={(e) => {
              updateLoginDetails({ password: e.target.value })
            }}
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
            type="submit"
            isLoading={isLoading}
            loadingText={'Signing In...'}
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
