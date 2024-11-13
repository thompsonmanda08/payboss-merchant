'use client'
import { notify } from '@/lib/utils'
import React, { useState } from 'react'
import { Button } from '../ui/Button'
import Card from '../base/Card'
import CardHeader from '../base/CardHeader'
import { Input } from '../ui/InputField'
import Logo from '../base/Logo'

function SupportForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const mobileNumber = formData.get('MobileNumber')?.toString().trim()
    const fullName = formData.get('FullName')?.toString().trim()
    const email = formData.get('Email')?.toString().trim()
    const message = formData.get('Message')?.toString().trim()

    try {
      // const response = { ok: false };
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true })
        }, 3000)
      })

      if (response?.ok == true) {
        e.currentTarget?.reset()
        notify('success', 'Message was sent Successfully!')
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {' '}
      <Card className=" mx-auto max-w-lg">
        {/* <div className="mb-4 flex w-full flex-col justify-between md:flex-row md:items-center">
          <CardHeader
            title={'PayBoss Support'}
            infoText={
              "We're here to assist you! Our team is dedicated to providing prompt and excellent customer support. Your satisfaction is our priority."
            }
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: 'text-[15px] xl:text-base',
            }}
          />
        </div> */}

        <form
          onSubmit={handleOnSubmit}
          className="mx-auto flex w-full max-w-md flex-col gap-4"
        >
          <Input
            label="Full Name"
            placeholder="Jonas Banda"
            name="FullName"
            required
          />
          <Input
            label="Business Name"
            placeholder="BGS LTD"
            name="BusinessName"
            required
          />

          <Input
            label="Mobile Number"
            placeholder="0977889910"
            name="MobileNumber"
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="bgsgroup@mail.com"
            name="Email"
            required
          />
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-slate-500 "
            >
              Message
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="Message"
                id="message"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6"
                defaultValue={''}
              />
            </div>
          </div>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            loadingText={'Sending...'}
            type="submit"
          >
            Send
          </Button>
        </form>
      </Card>
    </>
  )
}

export default SupportForm
