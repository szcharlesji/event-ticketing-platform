'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useInjectProvider } from '@refract-network/inject'

export function Navigation() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isInRefract, launchRefractPassport, parentProfile } = useInjectProvider()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Force re-render when Refract context changes
  useEffect(() => {
    // This effect will trigger re-renders when isInRefract or parentProfile changes
    if (mounted) {
      // Component will automatically re-render due to state/prop changes
    }
  }, [isInRefract, parentProfile, mounted])

  const handleWalletClick = () => {
    if (isInRefract) {
      launchRefractPassport()
    } else {
      connect({ connector: connectors[0] })
    }
  }

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
            <Link href="/organizer/create" className="hover:underline">
              Create Event
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            <Link href="/checkin" className="hover:underline">
              Check-In
            </Link>
          </div>
        </div>
        <div>
          {!mounted ? (
            <Button disabled>Connect Wallet</Button>
          ) : isInRefract && parentProfile ? (
            <Button onClick={handleWalletClick} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={parentProfile.photo_url || '/placeholder-avatar.png'}
                  alt={parentProfile.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span>{parentProfile.name}</span>
            </Button>
          ) : isConnected ? (
            <Button onClick={() => disconnect()}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
          ) : (
            <Button onClick={handleWalletClick}>
              {isInRefract ? 'Connect Passport' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
