'use client'

import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            NFT Tickets
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">
              Events
            </Link>
            <Link href="/marketplace" className="hover:underline">
              Marketplace
            </Link>
            <Link href="/tickets" className="hover:underline">
              My Tickets
            </Link>
            <Link href="/organizer" className="hover:underline">
              Organizer
            </Link>
          </div>
        </div>
        <div>
          {isConnected ? (
            <Button onClick={() => disconnect()}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
          ) : (
            <Button onClick={() => connect({ connector: connectors[0] })}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
