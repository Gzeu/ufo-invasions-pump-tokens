# UFO Invasions: Missions & Rewards

## Cerințe
- Node.js 18+
- NPM/Yarn
- Wallet (Metamask) pentru interacțiuni reale (nu e necesar în e2e)
- Contract UFOInvasionsNFT + adresă în .env

## Setup
1) Install:
   ```bash
   npm install
   ```
2) Config:
   ```bash
   cp .env.example .env
   ```
   Setează REACT_APP_CONTRACT_ADDRESS, REACT_APP_CHAIN_ID, REACT_APP_RPC_URL, REACT_APP_EXPLORER_URL
3) Dev (MSW activ pentru /api/rewards):
   ```bash
   npm start
   ```

## Structură
- `src/context/RewardsContext.jsx` — state, claim single/batch, beam effect
- `src/lib/rewardsService.js` — adapter API + Web3; suport E2E mock chain
- `src/context/NotificationContext.jsx` — notificări unificate
- `src/components/RewardsSection.jsx`, `RewardCard.jsx` — UI
- `src/mocks/*` — MSW handlers pentru API
- `src/lib/chain.js` — garduri chain/wallet
- `src/lib/errors.js` — mapare erori

## Testare

### Unit & Integration (Jest + RTL)
```bash
npm test
```

### E2E (Playwright)
- Rulează:
  ```bash
  npm run e2e
  ```
- Rulează cu UI:
  ```bash
  npm run e2e:ui
  ```

## Mock Chain (E2E)
- `REACT_APP_E2E_MOCK_CHAIN=1` simulează tranzacțiile on-chain (fără wallet/RPC)
- `claimOnChainSingle/Batch` returnează fake tx-uri deterministe

## Deploy (rezumat)
1) Deploy contract pe chain dorit; setează adresa în .env
2) Build frontend:
   ```bash
   npm run build
   ```
3) Deploy conținutul build/ la provider (S3/CloudFront, Vercel, Netlify, etc.)

## Troubleshooting
- **Wallet not detected**: instalează Metamask
- **Wrong network**: aplicația cere switch; dacă eșuează, adaugă chain-ul
- **Insufficient funds**: alimentează wallet-ul cu gas token

## Features

### RewardsService
- API + Web3 adapter unificat
- E2E mock chain pentru testare fără wallet
- Suport batch/sequential claim cu fallback
- Preparare claim cu proof/signature (opțional)

### NotificationProvider
- Toasts unificate (info/success/error)
- Auto-dismiss configurabil
- Action buttons pentru View Tx
- Aria-live pentru accesibilitate

### RewardsContext
- Claiming per-item (evită re-render global)
- Claim All cu batch/sequential fallback
- Pagination cursor-based
- BeamEffect la succes

### UI Components
- Status badges (Claimable/Claimed/Expired)
- Load More pentru paginație
- Cosmic dark theme consistent
- Responsive design

### Chain Guards
- Auto wallet detection
- Network switch/add cu confirmări
- Error mapping pentru coduri comune
- Explorer links configurabile

### Test Suite
- Jest + RTL pentru unit/integration
- MSW pentru API mocking
- Playwright pentru e2e cu mock chain
- Test matrix: errors, notifications, rewards flow