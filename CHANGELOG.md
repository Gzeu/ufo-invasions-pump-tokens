# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- Release template în `.github/release_template.md`
- CHANGELOG.md pentru versiuni viitoare

### Changed
- N/A

### Fixed
- N/A

## [0.2.0] - 2025-10-01
### Added
- `src/lib/rewardsService.js`: adapter unificat API + Web3, E2E mock-chain flag  
- `src/lib/chain.js`: wallet & network guards (wallet_switchEthereumChain, wallet_addEthereumChain)  
- `src/lib/errors.js`: mapare erori frecvente ethers.js  
- `src/context/NotificationContext.jsx`: notificări toasts (info, success, error, aria-live)  
- `src/components/BeamEffect.jsx`: animație "beam" la succesul claim-ului  
- `src/context/RewardsContext.jsx`: 
  - claiming per-item cu Set<id>  
  - Claim All cu batch/sequential fallback  
  - pagination cursor-based  
  - integrare NotificationContext + BeamEffect  
- `src/components/RewardCard.jsx` & `RewardsSection.jsx`: 
  - UI cosmic dark theme  
  - status badges (Claimable, Claimed, Expired)  
  - butoane disable/claim per-item și global  
- MSW mocks (`src/mocks/handlersRewards.js`, `browser.js`, `server.js`) pentru API dev/test  
- Test suite:
  - Jest + React Testing Library pentru RewardsContext & errors mapping & NotificationContext  
  - Playwright e2e (`tests/e2e/rewards.spec.ts`) cu mock-chain  
- Documentație:
  - `README.md` actualizat cu setup, testare, e2e, deploy  
  - `.env.example` cu noile variabile de mediu  
  - `.github/pull_request_template.md` cu QA checklist  

### Changed
- Frontend scaffold: integrare NotificationProvider în `App.jsx`  
- `src/index.jsx`: pornire MSW doar în dev  

### Fixed
- Error handling pentru user-rejected (code 4001), insufficient funds, network mismatch, EVM reverted  

### Deprecated
- Niciuna

### Removed
- Niciuna

## [0.1.0] - 2025-09-28
- Prima versiune MVP cu MissionsContext și RewardsContext basic