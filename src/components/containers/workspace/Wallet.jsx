import { Balance, Card, CardHeader } from '@/components/base'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

function Wallet() {
  return (
    <section role="wallet-section" className="">
      <Card className="container flex w-full flex-col items-start justify-center gap-8 md:flex-row">
        <div className="flex h-full w-full flex-1 flex-grow">
          <Balance title={'PayBoss Wallet'} amount={'K10, 500'} />
        </div>
        <ScrollArea>
          <div className="flex h-full flex-1 flex-grow flex-col items-start gap-8">
            <h3 className="heading">Wallet Transaction History</h3>
          </div>
        </ScrollArea>
      </Card>
    </section>
  )
}

export default Wallet
