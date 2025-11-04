'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateEvent, useTransactionReceipt } from '@/lib/hooks'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const { address } = useAccount()
  const router = useRouter()
  const { createEvent, hash, isPending } = useCreateEvent()
  const { isSuccess } = useTransactionReceipt(hash)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    eventName: '',
    date: '',
    basePrice: '',
    totalSupply: '',
    maxPriceMultiplier: '150',
    minHoldPeriod: '86400',
    maxTransfers: '2',
    royaltyBps: '500',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = () => {
    if (!address) return

    const eventDate = Math.floor(new Date(formData.date).getTime() / 1000)

    createEvent({
      name: formData.name,
      symbol: formData.symbol,
      eventName: formData.eventName,
      eventDate: BigInt(eventDate),
      basePrice: parseEther(formData.basePrice),
      organizer: address,
      resaleConfig: {
        maxPriceMultiplier: BigInt(formData.maxPriceMultiplier),
        minHoldPeriod: BigInt(formData.minHoldPeriod),
        maxTransfers: BigInt(formData.maxTransfers),
        royaltyBps: BigInt(formData.royaltyBps),
      },
    })
  }

  if (isSuccess) {
    setTimeout(() => router.push('/'), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              Deploy a new NFT ticketing contract with anti-scalping rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Token Name</Label>
                <Input
                  placeholder="Summer Festival Ticket"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Token Symbol</Label>
                <Input
                  placeholder="SFT"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Event Name</Label>
                <Input
                  placeholder="Summer Music Festival 2025"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Base Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Anti-Scalping Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Max Resale Multiplier (%)</Label>
                  <Input
                    type="number"
                    value={formData.maxPriceMultiplier}
                    onChange={(e) => setFormData({ ...formData, maxPriceMultiplier: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">150 = 1.5x max resale</p>
                </div>
                <div>
                  <Label>Hold Period (seconds)</Label>
                  <Input
                    type="number"
                    value={formData.minHoldPeriod}
                    onChange={(e) => setFormData({ ...formData, minHoldPeriod: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">86400 = 1 day</p>
                </div>
                <div>
                  <Label>Max Transfers</Label>
                  <Input
                    type="number"
                    value={formData.maxTransfers}
                    onChange={(e) => setFormData({ ...formData, maxTransfers: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Royalty (basis points)</Label>
                  <Input
                    type="number"
                    value={formData.royaltyBps}
                    onChange={(e) => setFormData({ ...formData, royaltyBps: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">500 = 5%</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!mounted || !address || isPending || !formData.name || !formData.basePrice || !formData.date}
            >
              {isPending ? 'Creating...' : isSuccess ? 'Success! Redirecting...' : 'Create Event'}
            </Button>

            {mounted && isSuccess && (
              <p className="text-sm text-center text-green-600">
                Event created successfully! Redirecting to home page...
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
