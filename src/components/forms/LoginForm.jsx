'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@nextui-org/switch'
import { Button } from '../ui/Button'
import Link from 'next/link'
import useAuthStore from '@/context/authStore'
import { authenticateUser } from '@/app/_actions/auth-actions'
import { useRouter } from 'next/navigation'
import { Card, StatusMessage } from '../base'
import { useNetwork } from '@/hooks/useNetwork'
import { setupUserPreferences } from '@/app/_actions/config-actions'

function LoginForm() {
  const { push } = useRouter()
  const {
    loginDetails,
    updateLoginDetails,
    updateErrorStatus,
    setIsLoading,
    error,
    isLoading,
  } = useAuthStore()

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)
    const { emailusername, password } = loginDetails
    if (emailusername && password) {
      const response = await authenticateUser(loginDetails)

      console.log(response)
      if (response.success) {
        
        await setupUserPreferences()
        push('/workspaces')
      }

      if (!response.success) {
        updateErrorStatus({
          status: response.status,
          message: response.message,
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm flex-auto p-6 ">
      <form role="form" onSubmit={handleLogin} className="flex flex-col gap-4">
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
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center justify-start gap-1">
            <Switch size="sm" />
            <label
              className="cursor-pointer select-none text-sm font-normal"
              htmlFor="rememberMe"
            >
              Remember me
            </label>
          </div>
          <Link
            href={'#'}
            className="px-2 pb-0.5 text-sm font-medium  transition-all duration-300 ease-in-out hover:text-primary"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="">
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText={'Signing In...'}
            className={'mt-6 w-full'}
          >
            Sign in
          </Button>
        </div>
      </form>
      {error && error.status && (
        <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}
    </Card>
  )
}

export default LoginForm
