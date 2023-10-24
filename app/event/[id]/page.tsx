'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams } from 'next/navigation'
import { useEventTicketData, useMintTicket, useIsVerified, useTransactionReceipt } from '@/lib/hooks'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useState, useEffect } from 'react'

export default function EventDetailPage() {
  const params = useParams()
  const address = params.id as `0x${string}`
  const { address: userAddress, isConnected } = useAccount()

  const { eventName, eventDate, basePrice, totalSupply, resaleConfig, isLoading } = useEventTicketData(address)
  const { data: isVerified } = useIsVerified(userAddress)
  const { mintTicket, hash, isPending } = useMintTicket(address)
  const { isSuccess: txSuccess } = useTransactionReceipt(hash)
  const [mounted, setMounted] = useState(false)

  const [seatInfo, setSeatInfo] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePurchase = () => {
    if (!basePrice || !seatInfo.trim()) return
    mintTicket(userAddress!, seatInfo, basePrice)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
      </div>
    )
  }

  const date = eventDate ? new Date(Number(eventDate) * 1000) : null
  const dateStr = date ? date.toISOString().split('T')[0] : 'TBD'
  const maxResalePrice = basePrice && resaleConfig ?
    (basePrice * resaleConfig[0]) / BigInt(100) : basePrice

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg mb-6" />
            <h1 className="text-4xl font-bold mb-4">{eventName || 'Event'}</h1>
            <div className="flex gap-4 mb-6">
              <Badge>NFT Ticket</Badge>
              <Badge variant="outline">On-Chain</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Contract</h2>
                <p className="text-sm text-muted-foreground font-mono">{address}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Anti-Scalping Protection</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Price cap: Max {maxResalePrice ? formatEther(maxResalePrice) : 'N/A'} ETH
                    ({resaleConfig ? Number(resaleConfig[0]) / 100 : 0}x base price)</li>
                  <li>Hold period: {resaleConfig ? Number(resaleConfig[1]) / 86400 : 0} days before resale</li>
                  <li>Max {resaleConfig ? Number(resaleConfig[2]) : 0} transfers per ticket</li>
                  <li>Organizer royalty: {resaleConfig ? Number(resaleConfig[3]) / 100 : 0}%</li>
                  <li>Verified buyers only</li>
                </ul>
              </div>
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
                  <span className="font-bold text-lg">
                    {basePrice ? `${formatEther(basePrice)} ETH` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply</span>
                  <Badge>{totalSupply ? Number(totalSupply) : 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-sm">{dateStr}</span>
                </div>

                {!mounted ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : isConnected ? (
                  isVerified ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="seatInfo">Seat Information</Label>
                        <Input
                          id="seatInfo"
                          placeholder="Section A, Row 5, Seat 12"
                          value={seatInfo}
                          onChange={(e) => setSeatInfo(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePurchase}
                        disabled={!seatInfo.trim() || isPending}
                      >
                        {isPending ? 'Purchasing...' : txSuccess ? 'Success!' : 'Buy Ticket'}
                      </Button>
                      {txSuccess && (
                        <p className="text-sm text-green-600 text-center">
                          Ticket purchased successfully!
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-destructive mb-2">
                        You must be verified to purchase tickets
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Contact the event organizer to get verified
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Connect wallet to purchase
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
