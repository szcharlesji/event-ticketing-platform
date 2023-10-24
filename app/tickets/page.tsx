'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QRCodeSVG } from 'qrcode.react'
import { useAccount } from 'wagmi'
import { useGetAllEvents, useBalanceOf, useTokenOfOwnerByIndex, useTicketData, useEventTicketData, useApproveMarketplace, useListTicket } from '@/lib/hooks'
import { formatEther, parseEther } from 'viem'
import { useState } from 'react'

function TicketCard({ ticketAddress, tokenId }: { ticketAddress: `0x${string}`; tokenId: bigint }) {
  const { eventName } = useEventTicketData(ticketAddress)
  const { data: ticketData } = useTicketData(ticketAddress, tokenId)
  const { approveMarketplace, isPending: isApproving } = useApproveMarketplace(ticketAddress)
  const { listTicket, isPending: isListing } = useListTicket()

  const [listPrice, setListPrice] = useState('')
  const [showListDialog, setShowListDialog] = useState(false)

  if (!ticketData) return null

  const [originalPrice, purchaseTime, transferCount, seatInfo, redeemed] = ticketData as readonly [
    bigint,
    bigint,
    number,
    string,
    boolean
  ]

  const handleList = async () => {
    try {
      await approveMarketplace()
      await listTicket(ticketAddress, tokenId, parseEther(listPrice))
      setShowListDialog(false)
    } catch (error) {
      console.error('Error listing ticket:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{eventName || 'Event'}</CardTitle>
        <CardDescription className="font-mono text-xs truncate">{ticketAddress}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Token ID</span>
          <span>#{tokenId.toString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Seat</span>
          <span className="text-xs">{seatInfo}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={redeemed ? 'secondary' : 'default'}>
            {redeemed ? 'Used' : 'Valid'}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1" variant="outline" size="sm">
                Show QR
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Entry QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center p-8">
                <QRCodeSVG
                  value={`${ticketAddress}:${tokenId}`}
                  size={256}
                  level="H"
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Scan this code at the venue for entry
              </p>
            </DialogContent>
          </Dialog>

          {!redeemed && (
            <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1" size="sm">List for Sale</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>List Ticket for Resale</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Price (ETH)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      placeholder="0.1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Original: {formatEther(originalPrice)} ETH
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleList}
                    disabled={!listPrice || isApproving || isListing}
                  >
                    {isApproving ? 'Approving...' : isListing ? 'Listing...' : 'List Ticket'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function TicketsPage() {
  const { address } = useAccount()
  const { data: events } = useGetAllEvents()

  const userTickets: Array<{ address: `0x${string}`; tokenId: bigint }> = []

  if (events && address) {
    for (const eventAddress of events as `0x${string}`[]) {
      const { data: balance } = useBalanceOf(eventAddress, address)
      if (balance) {
        for (let i = BigInt(0); i < balance; i++) {
          const { data: tokenId } = useTokenOfOwnerByIndex(eventAddress, address, i)
          if (tokenId !== undefined) {
            userTickets.push({ address: eventAddress, tokenId })
          }
        }
      }
    }
  }

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

        {!address ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Connect your wallet to view your tickets</p>
          </div>
        ) : userTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTickets.map((ticket) => (
              <TicketCard
                key={`${ticket.address}-${ticket.tokenId}`}
                ticketAddress={ticket.address}
                tokenId={ticket.tokenId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You don't have any tickets yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
