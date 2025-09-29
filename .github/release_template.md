<!--
  Folosește acest fișier când deschizi un nou Release pe GitHub.
  Completează câmpurile de mai jos și atașează eventual capturi/GIF-uri.
-->

# Release v{{version}}

## :tada: Ce aduce nou această versiune

<!--
Descriere scurtă a scopului și celor mai importante funcționalități/îmbunătățiri.
-->

## :sparkles: Features

- **RewardsService**: adapter unificat API + Web3 (claim single/batch, E2E mock chain)  
- **NotificationProvider** + toasts unificate (info/success/error)  
- **BeamEffect**: animație la succesul claim-ului  
- RewardsContext upgradat: claiming per-item, "Claim All", pagination cursor-based  

## :bug: Bug fixes

- Mapare erori ethers.js pentru coduri comune (4001, insufficient funds, network mismatch, reverted)  
- Fallback batch → secvențial dacă smart-contract nu expune `claimRewards`  

## :memo: Documentation

- README actualizat cu setup, testare, deploy  
- `.env.example` complet  
- PR template + QA checklist  

## :arrow_up: Migration

- Niciun pas special; dacă ai `.env` existent, adaugă variabilele noi:
  - `REACT_APP_TX_CONFIRMATIONS`
  - `REACT_APP_E2E_MOCK_CHAIN`

## :hammer: Upgrade Steps

1. În fișierul `.env` completează:  
   ```
   REACT_APP_TX_CONFIRMATIONS=2
   REACT_APP_E2E_MOCK_CHAIN=0
   ```
2. Rebuild frontend:  
   ```
   npm run build
   ```
3. Redeploy pe hostingul ales (Netlify/Vercel/S3/etc).

## :white_check_mark: QA Checklist

- [ ] Dev server cu MSW → `npm start` → lista de Rewards vizibilă  
- [ ] Claim single → toast "awaiting confirmation…", apoi "Reward claimed successfully"  
- [ ] Claim All → listă actualizată, beam effect vizibil  
- [ ] `npm test` trece fără erori  
- [ ] `npm run e2e` (mock chain) trece  

## :camera: Screenshots / GIF

<!-- Atașează aici câteva capturi/GIF cu interacțiunea. -->