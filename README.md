# NFT Event Ticketing Platform

Anti-scalping event ticketing platform on Base with smart contract-enforced price caps, transfer restrictions, and controlled secondary markets.

## Features

- **Price Caps**: Max resale price enforced (e.g., 1.5x original)
- **Transfer Limits**: Hold periods (24-48hrs) and max transfers per ticket
- **Identity Verification**: Whitelisted buyers only
- **Organizer Royalties**: 5-10% on secondary sales
- **QR Code Entry**: Blockchain-verified ticket redemption

## Tech Stack

**Contracts**: Solidity 0.8.28, Foundry, OpenZeppelin, Base Sepolia
**Frontend**: Next.js 15, React 19, Shadcn UI, Wagmi v2, Viem, Recharts

## Setup

```bash
# Install dependencies
bun install

# Contracts
cd contracts
forge test              # Run 33 tests
forge build             # Compile contracts

# Deploy
cp .env.example .env    # Add PRIVATE_KEY
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast

# Frontend
bun dev                 # http://localhost:3000
```

## Smart Contracts

- **IdentityRegistry**: Admin whitelist for verified buyers
- **EventTicket**: ERC-721 with anti-scalping rules
- **TicketMarketplace**: Controlled secondary market with price caps
- **EventFactory**: Deploy events with custom resale rules

## Architecture

```
contracts/src/          # Solidity contracts
contracts/test/         # 33 passing tests
app/                    # Next.js pages (events, marketplace, tickets, organizer)
components/             # UI components + wallet connection
lib/                    # Web3 config (Base + Base Sepolia)
```

## Usage

1. **Create Event**: Set price caps and anti-scalping rules
2. **Buy Ticket**: Primary purchase (verified buyers only)
3. **Resell**: List after hold period (price automatically capped)
4. **Enter Venue**: Show QR code, verify on-chain

## License

MIT
