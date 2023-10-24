import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { identityRegistryAbi, eventTicketAbi, ticketMarketplaceAbi, eventFactoryAbi } from './abis'
import { getContractAddress } from './contracts'

// ============================================================================
// Identity Registry Hooks
// ============================================================================

export function useIsVerified(address?: `0x${string}`) {
  const { chain } = useAccount()
  return useReadContract({
    address: getContractAddress(chain?.id || 84532, 'identityRegistry') as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
  })
}

export function useVerifyAddress() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    verifyAddress: (address: `0x${string}`) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'identityRegistry') as `0x${string}`,
        abi: identityRegistryAbi,
        functionName: 'verifyAddress',
        args: [address],
      }),
    hash,
    ...rest,
  }
}

export function useVerifyAddressBatch() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    verifyAddressBatch: (addresses: `0x${string}`[]) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'identityRegistry') as `0x${string}`,
        abi: identityRegistryAbi,
        functionName: 'verifyAddressBatch',
        args: [addresses],
      }),
    hash,
    ...rest,
  }
}

export function useUnverifyAddress() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    unverifyAddress: (address: `0x${string}`) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'identityRegistry') as `0x${string}`,
        abi: identityRegistryAbi,
        functionName: 'unverifyAddress',
        args: [address],
      }),
    hash,
    ...rest,
  }
}

// ============================================================================
// Event Factory Hooks
// ============================================================================

export function useGetAllEvents() {
  const { chain } = useAccount()
  return useReadContract({
    address: getContractAddress(chain?.id || 84532, 'factory') as `0x${string}`,
    abi: eventFactoryAbi,
    functionName: 'getAllEvents',
  })
}

export function useGetEventCount() {
  const { chain } = useAccount()
  return useReadContract({
    address: getContractAddress(chain?.id || 84532, 'factory') as `0x${string}`,
    abi: eventFactoryAbi,
    functionName: 'getEventCount',
  })
}

export function useCreateEvent() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    createEvent: (params: {
      name: string
      symbol: string
      eventName: string
      eventDate: bigint
      basePrice: bigint
      organizer: `0x${string}`
      resaleConfig: {
        maxPriceMultiplier: bigint
        minHoldPeriod: bigint
        maxTransfers: bigint
        royaltyBps: bigint
      }
    }) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'factory') as `0x${string}`,
        abi: eventFactoryAbi,
        functionName: 'createEvent',
        args: [
          params.name,
          params.symbol,
          params.eventName,
          params.eventDate,
          params.basePrice,
          params.organizer,
          params.resaleConfig,
        ],
      }),
    hash,
    ...rest,
  }
}

// ============================================================================
// Event Ticket Hooks
// ============================================================================

export function useEventTicketData(ticketAddress?: `0x${string}`) {
  const eventName = useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'eventName',
  })

  const eventDate = useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'eventDate',
  })

  const basePrice = useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'basePrice',
  })

  const totalSupply = useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'totalSupply',
  })

  const organizer = useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'organizer',
  })

  const resaleConfig = useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'resaleConfig',
  })

  return {
    eventName: eventName.data as string | undefined,
    eventDate: eventDate.data as bigint | undefined,
    basePrice: basePrice.data as bigint | undefined,
    totalSupply: totalSupply.data as bigint | undefined,
    organizer: organizer.data as `0x${string}` | undefined,
    resaleConfig: resaleConfig.data as
      | readonly [bigint, bigint, bigint, bigint]
      | undefined,
    isLoading:
      eventName.isLoading ||
      eventDate.isLoading ||
      basePrice.isLoading ||
      totalSupply.isLoading,
  }
}

export function useTicketData(ticketAddress?: `0x${string}`, tokenId?: bigint) {
  return useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'tickets',
    args: tokenId !== undefined ? [tokenId] : undefined,
  })
}

export function useBalanceOf(ticketAddress?: `0x${string}`, owner?: `0x${string}`) {
  return useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'balanceOf',
    args: owner && ticketAddress ? [owner] : undefined,
  })
}

export function useTokenOfOwnerByIndex(
  ticketAddress?: `0x${string}`,
  owner?: `0x${string}`,
  index?: bigint
) {
  return useReadContract({
    address: ticketAddress,
    abi: eventTicketAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: owner && index !== undefined ? [owner, index] : undefined,
  })
}

export function useMintTicket(ticketAddress?: `0x${string}`) {
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    mintTicket: (to: `0x${string}`, seatInfo: string, value: bigint) =>
      writeContract({
        address: ticketAddress!,
        abi: eventTicketAbi,
        functionName: 'mintTicket',
        args: [to, seatInfo],
        value,
      }),
    hash,
    ...rest,
  }
}

export function useRedeemTicket(ticketAddress?: `0x${string}`) {
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    redeemTicket: (tokenId: bigint) =>
      writeContract({
        address: ticketAddress!,
        abi: eventTicketAbi,
        functionName: 'redeemTicket',
        args: [tokenId],
      }),
    hash,
    ...rest,
  }
}

export function useWithdraw(ticketAddress?: `0x${string}`) {
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    withdraw: () =>
      writeContract({
        address: ticketAddress!,
        abi: eventTicketAbi,
        functionName: 'withdraw',
      }),
    hash,
    ...rest,
  }
}

export function useApproveMarketplace(ticketAddress?: `0x${string}`) {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    approveMarketplace: () =>
      writeContract({
        address: ticketAddress!,
        abi: eventTicketAbi,
        functionName: 'setApprovalForAll',
        args: [getContractAddress(chain?.id || 84532, 'marketplace') as `0x${string}`, true],
      }),
    hash,
    ...rest,
  }
}

// ============================================================================
// Marketplace Hooks
// ============================================================================

export function useMarketplaceListing(nftContract?: `0x${string}`, tokenId?: bigint) {
  const { chain } = useAccount()
  return useReadContract({
    address: getContractAddress(chain?.id || 84532, 'marketplace') as `0x${string}`,
    abi: ticketMarketplaceAbi,
    functionName: 'listings',
    args: nftContract && tokenId !== undefined ? [nftContract, tokenId] : undefined,
  })
}

export function useListTicket() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    listTicket: (nftContract: `0x${string}`, tokenId: bigint, price: bigint) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'marketplace') as `0x${string}`,
        abi: ticketMarketplaceAbi,
        functionName: 'listTicket',
        args: [nftContract, tokenId, price],
      }),
    hash,
    ...rest,
  }
}

export function useBuyTicket() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    buyTicket: (nftContract: `0x${string}`, tokenId: bigint, value: bigint) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'marketplace') as `0x${string}`,
        abi: ticketMarketplaceAbi,
        functionName: 'buyTicket',
        args: [nftContract, tokenId],
        value,
      }),
    hash,
    ...rest,
  }
}

export function useCancelListing() {
  const { chain } = useAccount()
  const { writeContract, data: hash, ...rest } = useWriteContract()

  return {
    cancelListing: (nftContract: `0x${string}`, tokenId: bigint) =>
      writeContract({
        address: getContractAddress(chain?.id || 84532, 'marketplace') as `0x${string}`,
        abi: ticketMarketplaceAbi,
        functionName: 'cancelListing',
        args: [nftContract, tokenId],
      }),
    hash,
    ...rest,
  }
}

// ============================================================================
// Transaction Receipt Hook
// ============================================================================

export function useTransactionReceipt(hash?: `0x${string}`) {
  return useWaitForTransactionReceipt({
    hash,
  })
}
