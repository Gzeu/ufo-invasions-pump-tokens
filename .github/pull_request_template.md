# UFO Invasions — Rewards Hardening & UX

## Context
- Modul: Rewards (claim single/batch, toasts, garduri rețea/wallet, MSW mocks, Beam)
- Scop: Stabilitate, UX, testabilitate end-to-end, pregătire producție
- Task-uri conexe: GPZ-79 (Backend Agent Core), GPZ-80 (UI/UX)

## Rezumat schimbări
- RewardsService (adapter API+Web3), E2E mock chain flag (REACT_APP_E2E_MOCK_CHAIN)
- Garduri wallet/chain (auto switch/add chain), mapping erori ethers
- NotificationProvider cu toasts unificate (info/success/error)
- RewardsContext: claiming per-item, Claim All, beam effect, pagination hook
- UI: RewardCard cu status, RewardsSection cu total + Claim All + Load More
- MSW API mocks (list, prepare-claim, claimed)
- Teste Jest/RTL (unit+integration) și Playwright e2e
- README și .env.example

## Cum se testează (local)
1) Dev cu MSW:
   ```
   npm start
   ```
2) Unit + Integration:
   ```
   npm test
   ```
3) E2E (mock chain, fără wallet):
   ```
   npm run e2e
   ```
4) Verificare UI:
   - Your Rewards listă vizibilă
   - Claim pe un item => toast "Transaction sent" apoi "Reward claimed successfully"
   - Claim All => toast de succes, listă actualizată
   - Beam effect vizibil la succes

## Test Matrix
- Unit: errors mapping, NotificationProvider
- Integration: RewardsContext + RewardsSection (listare, claim single, claim all, erori)
- E2E: flow listare + claim single + claim all (mock chain)
- Browsere: Chromium (Playwright). Safari/Firefox pot fi adăugate ulterior
- Rețele: dev cu MSW (fără RPC); prod va folosi chain real din .env

## Securitate
- Fără chei/secret în repo
- Garduri network/wallet + mapare erori
- Pregătit pentru EIP-712/Merkle (prepareClaim), fără a compromite fluxul default

## Performanță
- State per-item pentru claiming (evită re-render global)
- Pagination cursor-based
- Virtualizare listă recomandată la >100 itemi (out-of-scope în acest PR)

## Accesibilitate
- Notificări cu aria-live="polite" și role="status"
- Butoane cu state de busy și disabled clar

## Compatibilitate
- ABI compatibil cu claimReward(uint256)
- Batch folosește claimRewards(uint256[]) dacă există; altfel fallback secvențial

## Observabilitate
- Hook pentru evenimente (poate fi conectat la analytics):
  rewards_list_loaded, reward_claim_clicked, reward_claim_success, reward_claim_error

## Rollout plan
- Deploy frontend
- Verificare în staging: claim single/batch pe testnet
- Activare treptată în prod
- Monitorizare erori și timp de confirmare

## Rollback plan
- Revert PR
- Dezactivare buton Claim All via feature flag UI (dacă e necesar)

## Riscuri & mitrigări
- Schimbări ABI nealiniate -> fallback la single + error mapping
- Wallet absent -> mesaje prietenoase; E2E mock pentru QA
- Wrong network -> auto-switch + add chain fallback
- Gas insuficient -> mesaj dedicat

## Checklist
- [ ] Codul compilează și trece lint
- [ ] npm test trece
- [ ] npm run e2e trece
- [ ] Variabilele .env documentate și setate în CI/CD
- [ ] Fără secrets în repo
- [ ] Testat manual: claim single și claim all pe dev
- [ ] README actualizat

## Screenshots/GIF
<!-- Atașează aici câteva capturi cu lista, claim single, claim all, toasts și beam effect -->