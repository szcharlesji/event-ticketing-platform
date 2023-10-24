'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useParams } from 'next/navigation'

export default function EventDetailPage() {
  const params = useParams()

  const event = {
    name: 'Summer Music Festival 2025',
    date: 'July 15, 2025',
    venue: 'Central Park, NYC',
    description: 'Join us for an amazing day of music featuring top artists from around the world.',
    basePrice: '0.1 ETH',
    maxResalePrice: '0.15 ETH',
    available: 45,
    total: 100,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg mb-6" />
            <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
            <div className="flex gap-4 mb-6">
              <Badge>Music Festival</Badge>
              <Badge variant="outline">All Ages</Badge>
            </div>
            <div className="prose max-w-none">
              <h2>About</h2>
              <p>{event.description}</p>
              <h2>Anti-Scalping Protection</h2>
              <ul>
                <li>Price cap: Max {event.maxResalePrice} (1.5x base price)</li>
                <li>Hold period: 24 hours before resale allowed</li>
                <li>Max 2 transfers per ticket</li>
                <li>Verified buyers only</li>
              </ul>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Purchase Ticket</CardTitle>
                <CardDescription>Secure your spot at this event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-lg">{event.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <Badge>{event.available}/{event.total}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span>{event.venue}</span>
                </div>
                <Button className="w-full" size="lg">
                  Buy Ticket
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Connect wallet to purchase
                </p>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Secondary Market</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  2 tickets available for resale
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">0.12 ETH</span>
                    <Button size="sm" variant="outline">Buy</Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">0.14 ETH</span>
                    <Button size="sm" variant="outline">Buy</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
