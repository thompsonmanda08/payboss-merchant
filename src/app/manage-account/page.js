import LoadingPage from '@/app/loading'
import { Workspaces } from '@/components/containers'
import React, { Suspense } from 'react'

async function AllWorkspacesPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
            Workspaces
          </h2>
          <p className=" text-sm text-slate-600">
            Workspaces provide a structured way to group and manage services,
            users, and transactions effectively.
          </p>
        </div>

        <Workspaces />
      </div>
    </Suspense>
  )
}

export default AllWorkspacesPage
