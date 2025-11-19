# ReputeSol

On-chain reputation system for Solana that aggregates Gitcoin Passport and Solana on-chain metrics into a unified reputation score.

## Deployment Information

### Devnet Deployment
- **Program ID**: `3jSgCkDsvWqaffHHy3wKJ6jYqXo2zxhVbg81gUbMhwgL`
- **Network**: Solana Devnet
- **Explorer**: https://explorer.solana.com/address/3jSgCkDsvWqaffHHy3wKJ6jYqXo2zxhVbg81gUbMhwgL?cluster=devnet
- **Authority Wallet**: `GWdzG4dfvjentgRnTX3rVNZBNQA7b67wTxMqvLi5WBaR`


## Project Structure

```
ReputeSol/
├── reputesol-program/       # Anchor Solana program
│   ├── programs/
│   │   └── reputesol-program/
│   │       └── src/
│   │           ├── lib.rs              # Main program entry
│   │           ├── state.rs            # UserAccount struct
│   │           ├── constants.rs        # Authority & weights
│   │           ├── errors.rs           # Custom errors
│   │           └── instructions/       # Program instructions
│   └── tests/                # Comprehensive test suite
└── app/                      # Next.js frontend + backend
    ├── app/
    │   ├── api/              # API routes
    │   ├── dashboard/        # User dashboard
    │   └── page.tsx          # Landing page
    └── lib/
        ├── datasources/      # Gitcoin & Solana data sources
        └── services/         # Score aggregation logic
```

## Architecture

### On-Chain Program
- **PDA Structure**: `[b"user", owner.key()]`
- **Account**: UserAccount stores owner, scores, total_score, last_updated, bump
- **Instructions**:
  - `initialize_user()` - Create user reputation account
  - `update_score(gitcoin_score, solana_score)` - Update scores (authority only)

### Scoring System
- **Gitcoin Weight**: 50%
- **Solana Weight**: 50%
- **Formula**: `total_score = (gitcoin_score * 50) + (solana_score * 50)`
- **Range**: 0-10,000 (scaled by 100)

### Data Sources
1. **Gitcoin Passport API**
   - Fetches passport score
   - Scorer ID: 11856

2. **Solana On-Chain**
   - Account age
   - Transaction history
   - Token holdings

## Setup & Development

### Prerequisites
```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Node.js & npm
node --version  # v18+
```

### Installation

1. **Clone and setup Solana program**
```bash
cd reputesol-program
npm install
anchor build
```

2. **Setup frontend/backend**
```bash
cd app
npm install
```

3. **Configure environment**
```bash
# app/.env.local
GITCOIN_API_KEY=your_api_key
GITCOIN_SCORER_ID=11856
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=3jSgCkDsvWqaffHHy3wKJ6jYqXo2zxhVbg81gUbMhwgL
```

### Running Locally

1. **Start frontend**
```bash
cd app
npm run dev
# Frontend runs on http://localhost:3000
```

2. **Test Solana program**
```bash
cd reputesol-program
anchor test --skip-build --skip-deploy
```

## Testing

### Devnet Testing
```bash
# Configure for devnet
solana config set --url devnet

# Airdrop SOL for testing
solana airdrop 2 <WALLET_ADDRESS>

# Run tests
anchor test --skip-build --skip-deploy
```

### Test Coverage
- User initialization
- Duplicate initialization prevention
- Score updates with valid data
- Multiple score updates
- Edge cases (zeros, max values)
- Authorization checks
- Input validation (reject scores > 100)
- Weighted scoring formula verification

## Security Features

- **Authority-based access control**: Only authorized wallet can update scores
- **Input validation**: Scores must be 0-100
- **PDA constraints**: User accounts tied to owner public key
- **No keypairs in git**: Protected via .gitignore

## API Endpoints

### POST `/api/score/update`
Updates user reputation score on-chain
```json
{
  "wallet": "user_wallet_address"
}
```

### GET `/api/score/:wallet`
Fetches current reputation score
```json
{
  "totalScore": 6750,
  "gitcoinScore": 75,
  "solanaScore": 60,
  "lastUpdated": 1234567890
}
```

## Frontend Features

- Wallet adapter integration (Phantom, Solflare)
- Real-time score display
- Minimalist black & white UI
- Dashboard with score breakdown
- Connect wallet and fetch scores

## License

MIT

## Contributing

This is an MVP. Contributions welcome!
