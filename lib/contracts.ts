export const CONTRACT_ADDRESSES = {
  84532: {
    identityRegistry: '0x0000000000000000000000000000000000000000',
    marketplace: '0x0000000000000000000000000000000000000000',
    factory: '0x0000000000000000000000000000000000000000',
  },
  8453: {
    identityRegistry: '0x0000000000000000000000000000000000000000',
    marketplace: '0x0000000000000000000000000000000000000000',
    factory: '0x0000000000000000000000000000000000000000',
  },
} as const

export function getContractAddress(chainId: number, contract: keyof typeof CONTRACT_ADDRESSES[84532]) {
  if (chainId === 84532 || chainId === 8453) {
    return CONTRACT_ADDRESSES[chainId][contract]
  }
  throw new Error(`Unsupported chain ID: ${chainId}`)
}
