import { Balance, Card, CardHeader } from '@/components/base'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

function Wallet() {
  return (
    <section role="wallet-section" className="">
      <Card className="container flex w-full flex-col items-start justify-center gap-8 md:flex-row">
        <div className="flex flex-1 flex-col gap-5">
          <Balance title={'PayBoss Wallet'} amount={'K10, 500'} />

          <CardHeader title="Pre-fund your wallet" />
        </div>
        <ScrollArea className="flex h-full w-full flex-grow flex-col items-start gap-8 bg-red-500">
          <CardHeader title="Wallet Transaction History" />
          <div className="h-96">
            <h3 className="heading">Wallet Transaction History</h3>
          </div>
        </ScrollArea>
      </Card>
    </section>
  )
}

export default Wallet
