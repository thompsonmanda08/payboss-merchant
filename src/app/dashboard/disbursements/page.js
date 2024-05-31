'use client'
import LoadingPage from '@/app/loading'
import { FileDropZone } from '@/components/base'
import React, { Suspense } from 'react'

function Disbursements() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <h1 className="text-2xl font-bold">Disbursements</h1>
      <FileDropZone
        onDrop={(files) => console.log(files)}
        onChange={(files) => console.log(files)}
        acceptedFileTypes={['text/csv', 'application/xls']}
      />
    </Suspense>
  )
}

export default Disbursements
