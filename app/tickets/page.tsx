'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { QRCodeSVG } from 'qrcode.react'

const mockTickets = [
  {
    tokenId: '1',
    eventName: 'Summer Music Festival 2025',
    date: 'Jul 15, 2025',
    seatInfo: 'Section A, Row 5, Seat 12',
    redeemed: false,
    canResell: true,
  },
  {
    tokenId: '2',
    eventName: 'Tech Conference 2025',
    date: 'Aug 22, 2025',
    seatInfo: 'Section B, Row 3, Seat 8',
    redeemed: true,
    canResell: false,
  },
]

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your NFT tickets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTickets.map((ticket) => (
            <Card key={ticket.tokenId}>
              <CardHeader>
                <CardTitle>{ticket.eventName}</CardTitle>
                <CardDescription>{ticket.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seat</span>
                  <span>{ticket.seatInfo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={ticket.redeemed ? 'secondary' : 'default'}>
                    {ticket.redeemed ? 'Used' : 'Valid'}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1" variant="outline">
                        Show QR
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Entry QR Code</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center p-8">
                        <QRCodeSVG
                          value={`ticket:${ticket.tokenId}`}
                          size={256}
                          level="H"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Scan this code at the venue for entry
                      </p>
                    </DialogContent>
                  </Dialog>

                  {ticket.canResell && !ticket.redeemed && (
                    <Button className="flex-1">
                      List for Resale
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
