'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockListings = [
  {
    id: '1',
    eventName: 'Summer Music Festival 2025',
    price: '0.12 ETH',
    originalPrice: '0.1 ETH',
    seatInfo: 'Section A, Row 5, Seat 12',
    seller: '0x1234...5678',
  },
  {
    id: '2',
    eventName: 'Tech Conference 2025',
    price: '0.07 ETH',
    originalPrice: '0.05 ETH',
    seatInfo: 'Section B, Row 3, Seat 8',
    seller: '0x8765...4321',
  },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Secondary Marketplace</h1>
          <p className="text-muted-foreground">
            Buy tickets from verified sellers with price protection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <CardTitle>{listing.eventName}</CardTitle>
                <CardDescription>{listing.seatInfo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-lg">{listing.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original</span>
                  <span>{listing.originalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seller</span>
                  <Badge variant="outline">{listing.seller}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Buy Ticket</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
