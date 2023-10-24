'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useRedeemTicket, useTicketData } from '@/lib/hooks'
import { useState, useEffect } from 'react'

export default function CheckinPage() {
  const [qrValue, setQrValue] = useState('')
  const [ticketAddress, setTicketAddress] = useState<`0x${string}` | undefined>()
  const [tokenId, setTokenId] = useState<bigint | undefined>()
  const [mounted, setMounted] = useState(false)

  const { data: ticketData } = useTicketData(ticketAddress, tokenId)
  const { redeemTicket, isPending } = useRedeemTicket(ticketAddress)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleScan = () => {
    // Parse QR code format: "ticketAddress:tokenId"
    const [address, id] = qrValue.split(':')
    if (address && id) {
      setTicketAddress(address as `0x${string}`)
      setTokenId(BigInt(id))
    }
  }

  const handleRedeem = () => {
    if (tokenId !== undefined) {
      redeemTicket(tokenId)
    }
  }

  const ticketInfo = ticketData
    ? (ticketData as readonly [bigint, bigint, number, string, boolean])
    : null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Venue Check-In</h1>
          <p className="text-muted-foreground">
            Scan QR codes to verify and redeem tickets
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>
                Enter the QR code value from the ticket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>QR Code Value</Label>
                <Input
                  placeholder="0x123...:42"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: ticketAddress:tokenId
                </p>
              </div>
              <Button onClick={handleScan} className="w-full">
                Verify Ticket
              </Button>
            </CardContent>
          </Card>

          {mounted && ticketInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contract</p>
                    <p className="font-mono text-xs truncate">{ticketAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Token ID</p>
                    <p className="font-medium">#{tokenId?.toString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seat</p>
                    <p className="font-medium">{ticketInfo[3]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={ticketInfo[4] ? 'destructive' : 'default'}>
                      {ticketInfo[4] ? 'Already Used' : 'Valid'}
                    </Badge>
                  </div>
                </div>

                {!ticketInfo[4] ? (
                  <Button
                    onClick={handleRedeem}
                    disabled={isPending}
                    className="w-full"
                    size="lg"
                  >
                    {isPending ? 'Redeeming...' : 'Check In & Redeem'}
                  </Button>
                ) : (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                    <p className="text-destructive font-medium">
                      This ticket has already been used
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
