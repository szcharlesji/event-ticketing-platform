'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useVerifyAddress, useVerifyAddressBatch, useUnverifyAddress, useIsVerified } from '@/lib/hooks'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [singleAddress, setSingleAddress] = useState('')
  const [batchAddresses, setBatchAddresses] = useState('')
  const [checkAddress, setCheckAddress] = useState('')
  const [mounted, setMounted] = useState(false)

  const { verifyAddress, isPending: isVerifying } = useVerifyAddress()
  const { verifyAddressBatch, isPending: isBatchVerifying } = useVerifyAddressBatch()
  const { unverifyAddress, isPending: isUnverifying } = useUnverifyAddress()
  const { data: isVerified } = useIsVerified(checkAddress as `0x${string}`)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleVerifySingle = () => {
    if (!singleAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Invalid address format')
      return
    }
    verifyAddress(singleAddress as `0x${string}`)
  }

  const handleVerifyBatch = () => {
    const addresses = batchAddresses
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.match(/^0x[a-fA-F0-9]{40}$/))

    if (addresses.length === 0) {
      alert('No valid addresses found')
      return
    }

    verifyAddressBatch(addresses as `0x${string}`[])
  }

  const handleUnverify = () => {
    if (!singleAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Invalid address format')
      return
    }
    unverifyAddress(singleAddress as `0x${string}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage identity verification for ticket buyers
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Verify Single Address</CardTitle>
              <CardDescription>
                Add or remove verification for a single Ethereum address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ethereum Address</Label>
                <Input
                  placeholder="0x..."
                  value={singleAddress}
                  onChange={(e) => setSingleAddress(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleVerifySingle}
                  disabled={!singleAddress || isVerifying}
                  className="flex-1"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Address'}
                </Button>
                <Button
                  onClick={handleUnverify}
                  disabled={!singleAddress || isUnverifying}
                  variant="destructive"
                  className="flex-1"
                >
                  {isUnverifying ? 'Unverifying...' : 'Unverify Address'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Batch Verify</CardTitle>
              <CardDescription>
                Verify multiple addresses at once (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Addresses (one per line)</Label>
                <Textarea
                  placeholder={'0x123...\n0x456...\n0x789...'}
                  rows={8}
                  value={batchAddresses}
                  onChange={(e) => setBatchAddresses(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {batchAddresses.split('\n').filter((a) => a.trim().match(/^0x[a-fA-F0-9]{40}$/)).length} valid addresses
                </p>
              </div>
              <Button
                onClick={handleVerifyBatch}
                disabled={!batchAddresses || isBatchVerifying}
                className="w-full"
              >
                {isBatchVerifying ? 'Verifying...' : 'Verify All Addresses'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check Verification Status</CardTitle>
              <CardDescription>
                Verify if an address is whitelisted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Address to Check</Label>
                <Input
                  placeholder="0x..."
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                />
              </div>
              {mounted && checkAddress.match(/^0x[a-fA-F0-9]{40}$/) && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">{checkAddress}</span>
                  <Badge variant={isVerified ? 'default' : 'destructive'}>
                    {isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
