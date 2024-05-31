'use client'
import LoadingPage from '@/app/loading'
import { Card, FileDropZone } from '@/components/base'
import { Button } from '@/components/ui/Button'
import React, { Suspense } from 'react'

export default function Payments() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col">
        <Card className={''}>
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-bold">Payments</h1>
              <p className="text-gary-500 text-xs md:text-sm">Make payments </p>
            </div>
            <Button>Create Payment</Button>
          </div>
        </Card>
        {/* <FileDropZone
          onChange={(file) => {
            console.log('ON CHANGE SHOW FILE NAME:', file.name)
          }}
        /> */}
      </div>
    </Suspense>
  )
}
