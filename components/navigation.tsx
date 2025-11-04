'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import { useInjectProvider } from '@refract-network/inject'

export function Navigation() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isInRefract, launchRefractPassport, parentProfile } = useInjectProvider()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const navLinks = [
    { href: '/', label: 'Events' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/tickets', label: 'My Tickets' },
    { href: '/organizer/create', label: 'Create Event' },
    { href: '/admin', label: 'Admin' },
    { href: '/checkin', label: 'Check-In' },
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            NFT Tickets
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Wallet Button */}
          {!mounted ? (
            <Button disabled className="hidden sm:inline-flex">Connect Wallet</Button>
          ) : isInRefract && parentProfile ? (
            <Button onClick={handleWalletClick} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={parentProfile.photo_url || '/placeholder-avatar.png'}
                  alt={parentProfile.name}
                  width={24}
                  height={24}
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
            <Button onClick={handleWalletClick} className="text-sm sm:text-base">
              {isInRefract ? 'Connect Passport' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
