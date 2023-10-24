'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

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

export default function OrganizerPage() {
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
                  Deploy a new ticketing contract with custom anti-scalping rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Name</Label>
                    <Input placeholder="Summer Music Festival" />
                  </div>
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input placeholder="Central Park, NYC" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Price (ETH)</Label>
                    <Input type="number" step="0.01" placeholder="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Supply</Label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Resale Multiplier</Label>
                    <Input type="number" placeholder="150" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Event description..." />
                </div>
                <Button className="w-full">Deploy Event Contract</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Summer Music Festival 2025</CardTitle>
                  <CardDescription>Jul 15, 2025 • Central Park, NYC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">45</div>
                      <div className="text-sm text-muted-foreground">Sold</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">55</div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">4.5 ETH</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">0.2 ETH</div>
                      <div className="text-sm text-muted-foreground">Royalties</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
