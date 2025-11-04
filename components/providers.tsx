'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'
import { useState } from 'react'
import { InjectProvider } from "@refract-network/inject";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <InjectProvider
      appId={"cookie-shark"}
      parentOrigin={
        process.env.NEXT_PUBLIC_PARENT_APP_ORIGIN || "http://localhost:3000"
      }
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </InjectProvider>
  )
}
