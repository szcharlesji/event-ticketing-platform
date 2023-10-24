'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useGetAllEvents, useEventTicketData, useBalanceOf } from '@/lib/hooks'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

function EventCard({ address }: { address: `0x${string}` }) {
  const { address: userAddress } = useAccount()
  const { eventName, eventDate, basePrice, totalSupply, isLoading } = useEventTicketData(address)
  const { data: balance } = useBalanceOf(address, userAddress)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="aspect-video bg-muted rounded-md mb-4 animate-pulse" />
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const date = eventDate ? new Date(Number(eventDate) * 1000) : null
  const available = totalSupply ? Number(totalSupply) - Number(balance || 0n) : 0
  const total = totalSupply ? Number(totalSupply) : 0

  return (
    <Card>
      <CardHeader>
        <div className="aspect-video bg-muted rounded-md mb-4" />
        <CardTitle>{eventName || 'Unnamed Event'}</CardTitle>
        <CardDescription className="truncate">{address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {date ? date.toLocaleDateString() : 'TBD'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">
              {basePrice ? `${formatEther(basePrice)} ETH` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tickets</span>
            <Badge variant={available > total / 2 ? 'default' : 'destructive'}>
              {total} total
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/event/${address}`} className="w-full">
          <Button className="w-full">View Event</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function HomePage() {
  const { data: events, isLoading } = useGetAllEvents()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-muted-foreground">
            Fair-priced tickets with anti-scalping protection
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4 animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(events as `0x${string}`[]).map((address) => (
              <EventCard key={address} address={address} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found. Create one to get started!</p>
            <Link href="/organizer">
              <Button className="mt-4">Create Event</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
