'use client'

import Card from './Card'

function CardLoader() {
  return (
    <Card className={'rounded-2xl backdrop-blur-md'}>
      <div className="flex w-full animate-pulse flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between gap-2">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-[150px] rounded-lg bg-slate-200"></div>
              <div className="h-6 min-w-[300px] rounded-lg bg-slate-200"></div>
            </div>
            <div className="h-6 min-w-[100px] rounded-lg bg-slate-200"></div>
          </div>

          <div className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {/*  */}
            <div className="items-center gap-4 pt-6 sm:flex">
              <div className="h-6 min-w-[100px] flex-[0.5] rounded-lg bg-slate-200"></div>
              <div className="mt-1 flex h-6 min-w-[100px] flex-auto justify-between gap-x-6 rounded-lg bg-slate-200 sm:mt-0"></div>
            </div>
            {/*  */}
            <div className="items-center gap-4 pt-6 sm:flex">
              <div className="h-6 min-w-[100px] flex-[0.5] rounded-lg bg-slate-200"></div>
              <div className=" mt-1 flex h-6 min-w-[100px] flex-1 justify-between gap-x-6 rounded-lg bg-slate-200 sm:mt-0"></div>
            </div>
            {/*  */}
            <div className="items-center gap-4 pt-6 sm:flex">
              <div className="h-6 flex-[0.5] rounded-lg bg-slate-200"></div>
              <div className="mt-1 flex h-6 min-w-[100px] flex-1 justify-between gap-x-6 rounded-lg bg-slate-200 sm:mt-0"></div>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CardLoader
