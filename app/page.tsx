'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const mockEvents = [
  {
    id: '0x1234',
    name: 'Summer Music Festival 2025',
    date: 'Jul 15, 2025',
    venue: 'Central Park, NYC',
    basePrice: '0.1 ETH',
    available: 45,
    total: 100,
  },
  {
    id: '0x5678',
    name: 'Tech Conference 2025',
    date: 'Aug 22, 2025',
    venue: 'Convention Center, SF',
    basePrice: '0.05 ETH',
    available: 120,
    total: 200,
  },
]

export default function HomePage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="aspect-video bg-muted rounded-md mb-4" />
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.venue}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{event.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <Badge variant={event.available > 20 ? 'default' : 'destructive'}>
                      {event.available}/{event.total}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/event/${event.id}`} className="w-full">
                  <Button className="w-full">View Event</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
