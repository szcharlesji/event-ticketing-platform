'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetAllEvents, useEventTicketData, useMarketplaceListing, useTicketData, useBuyTicket } from '@/lib/hooks'
import { formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

function ListingCard({
  ticketAddress,
  tokenId
}: {
  ticketAddress: `0x${string}`
  tokenId: bigint
}) {
  const { eventName } = useEventTicketData(ticketAddress)
  const { data: listing } = useMarketplaceListing(ticketAddress, tokenId)
  const { data: ticketData } = useTicketData(ticketAddress, tokenId)
  const { buyTicket, isPending } = useBuyTicket()
  const { address } = useAccount()

  if (!listing || !listing[2]) return null // listing[2] is 'active'

  const [seller, price, active] = listing as readonly [string, bigint, boolean]
  const ticketInfo = ticketData as readonly [bigint, bigint, number, string, boolean] | undefined
  const seatInfo = ticketInfo ? ticketInfo[3] : 'N/A'
  const originalPrice = ticketInfo ? ticketInfo[0] : BigInt(0)

  const handleBuy = () => {
    buyTicket(ticketAddress, tokenId, price)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{eventName || 'Event'}</CardTitle>
        <CardDescription>{seatInfo}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price</span>
          <span className="font-bold text-lg">{formatEther(price)} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Original</span>
          <span>{formatEther(originalPrice)} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Seller</span>
          <Badge variant="outline" className="font-mono text-xs">
            {seller.slice(0, 6)}...{seller.slice(-4)}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Token ID</span>
          <span>#{tokenId.toString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleBuy}
          disabled={!address || isPending || seller === address}
        >
          {isPending ? 'Buying...' : seller === address ? 'Your Listing' : 'Buy Ticket'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function MarketplacePage() {
  const { data: events } = useGetAllEvents()
  const [mounted, setMounted] = useState(false)
  const [allListings, setAllListings] = useState<Array<{ ticketAddress: `0x${string}`; tokenId: bigint }>>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Collect all potential listings from all events
  useEffect(() => {
    if (!events || !mounted) return

    const listings: Array<{ ticketAddress: `0x${string}`; tokenId: bigint }> = []

    // Iterate through all events to find potential listings
    for (const eventAddress of events as `0x${string}`[]) {
      // We'll check the first 100 token IDs for each event (reasonable limit for MVP)
      for (let i = 0; i < 100; i++) {
        listings.push({ ticketAddress: eventAddress, tokenId: BigInt(i) })
      }
    }

    setAllListings(listings)
  }, [events, mounted])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Secondary Marketplace</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Buy tickets from verified sellers with price protection
          </p>
        </div>

        {!mounted ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : allListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allListings.map(({ ticketAddress, tokenId }) => (
              <ListingCard
                key={`${ticketAddress}-${tokenId}`}
                ticketAddress={ticketAddress}
                tokenId={tokenId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings available</p>
          </div>
        )}
      </main>
    </div>
  )
}
