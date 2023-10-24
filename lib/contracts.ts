export const CONTRACT_ADDRESSES = {
  84532: {
    identityRegistry: '0xE2dc511dC5294a411b9880e11e24786f3567366c',
    marketplace: '0xf67bD1645e3bf6130F40f6F5d6b51B7e185EeB43',
    factory: '0x761583016dFAcbBa1859B5123C5ccd745D7f59eD',
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
