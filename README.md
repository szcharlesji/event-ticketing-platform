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

### For Event Organizers

1. **Connect Wallet** with admin/organizer account
2. **Go to Admin Panel** (`/admin`)
3. **Verify Addresses**: Add buyer addresses to whitelist (single or batch)
4. **Create Event** (`/organizer/create`):
   - Set event details (name, date, base price)
   - Configure anti-scalping rules (max resale price, hold period, max transfers)
   - Deploy event contract (costs ~$0.003 on Base Sepolia)
5. **Manage Event**: View sales, withdraw earnings

### For Buyers

1. **Connect Wallet** (must be verified by organizer)
2. **Browse Events** on home page
3. **View Event Details**: See anti-scalping rules and availability
4. **Purchase Ticket**: Enter seat info and buy (verification required)
5. **View My Tickets** (`/tickets`): See all owned NFTs with QR codes
6. **List for Resale** (after hold period): Price automatically capped
7. **Show QR Code** at venue for entry

### For Venue Staff

1. **Go to Check-In** (`/checkin`)
2. **Scan QR Code** from buyer's ticket
3. **Verify Ticket**: See seat info and redemption status
4. **Redeem**: Mark ticket as used (prevents re-entry)

### Deployed Contracts (Base Sepolia)

```
IdentityRegistry: 0xE2dc511dC5294a411b9880e11e24786f3567366c
TicketMarketplace: 0xf67bD1645e3bf6130F40f6F5d6b51B7e185EeB43
EventFactory: 0x761583016dFAcbBa1859B5123C5ccd745D7f59eD
```

View on [BaseScan](https://sepolia.basescan.org)

## License

MIT
