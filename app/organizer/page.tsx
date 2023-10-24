'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useCreateEvent, useTransactionReceipt, useGetAllEvents, useEventTicketData } from '@/lib/hooks'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

const salesData = [
  { date: 'Jan', primary: 40, secondary: 10 },
  { date: 'Feb', primary: 65, secondary: 15 },
  { date: 'Mar', primary: 45, secondary: 20 },
  { date: 'Apr', primary: 80, secondary: 25 },
]

const revenueData = [
  { month: 'Jan', revenue: 4.5 },
  { month: 'Feb', revenue: 7.2 },
  { month: 'Mar', revenue: 5.8 },
  { month: 'Apr', revenue: 9.5 },
]

function EventManagementCard({ eventAddress }: { eventAddress: `0x${string}` }) {
  const { address } = useAccount()
  const { eventName, eventDate, basePrice, totalSupply, organizer } = useEventTicketData(eventAddress)

  // Only show if current user is the organizer
  if (organizer !== address) return null

  const date = eventDate ? new Date(Number(eventDate) * 1000) : null
  const dateStr = date ? date.toISOString().split('T')[0] : 'TBD'
  const sold = totalSupply ? Number(totalSupply) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{eventName || 'Event'}</CardTitle>
        <CardDescription className="font-mono text-xs truncate">{eventAddress}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{sold}</div>
            <div className="text-sm text-muted-foreground">Sold</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{dateStr}</div>
            <div className="text-sm text-muted-foreground">Date</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{basePrice ? formatEther(basePrice) : '0'} ETH</div>
            <div className="text-sm text-muted-foreground">Base Price</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{basePrice && sold ? formatEther(basePrice * BigInt(sold)) : '0'} ETH</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrganizerPage() {
  const { address } = useAccount()
  const { createEvent, hash, isPending } = useCreateEvent()
  const { isSuccess } = useTransactionReceipt(hash)
  const { data: events } = useGetAllEvents()
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    eventName: '',
    date: '',
    basePrice: '',
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
          <p className="text-muted-foreground">
            Create events and track performance
          </p>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="mb-8">
            <TabsTrigger value="create">Create Event</TabsTrigger>
            <TabsTrigger value="manage">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>
                  Deploy a new NFT ticketing contract with anti-scalping rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="col-span-2">
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
                  <div className="grid grid-cols-2 gap-4">
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
                  {isPending ? 'Creating Event...' : isSuccess ? 'Success! ✓' : 'Deploy Event Contract'}
                </Button>

                {mounted && isSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Event created successfully! Check "My Events" tab to see it.
                    </p>
                  </div>
                )}

                {mounted && !address && (
                  <p className="text-sm text-center text-muted-foreground">
                    Connect your wallet to create events
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="grid gap-4">
              {!mounted ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : !address ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Connect your wallet to view your events</p>
                </div>
              ) : events && events.length > 0 ? (
                (events as `0x${string}`[]).map((eventAddress) => (
                  <EventManagementCard key={eventAddress} eventAddress={eventAddress} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No events found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Primary vs Secondary Market</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="primary" fill="hsl(var(--primary))" />
                      <Bar dataKey="secondary" fill="hsl(var(--muted))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue in ETH</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
