# 🔐 Setup Synchronization Secrets

## Required GitHub Repository Secrets

Pentru ca workflow-ul de sincronizare să funcționeze, trebuie să adaugi următoarele secrete în GitHub repository settings:

### 📋 Navigation în GitHub
1. Mergi la repository: `https://github.com/Gzeu/ufo-invasions-pump-tokens`
2. Click pe **Settings** tab
3. În sidebar stânga, click pe **Secrets and variables** → **Actions**
4. Click pe **New repository secret** pentru fiecare secret de mai jos

---

## 🔗 Linear Integration Secrets

### `LINEAR_TOKEN`
**Descriere**: API token pentru accesul la Linear
**Cum îl obții**:
1. Mergi la [Linear Settings → API](https://linear.app/settings/api)
2. Click pe **Create new API key**
3. Nume: `UFO Invasions GitHub Sync`
4. Scope: Selectează toate permisiunile necesare
5. Copiază tokenul generat

**Format**: `lin_api_...` (începe cu lin_api_)

---

## 📄 Notion Integration Secrets

### `NOTION_TOKEN`
**Descriere**: Integration token pentru Notion API
**Cum îl obții**:
1. Mergi la [Notion Integrations](https://www.notion.so/my-integrations)
2. Click pe **+ New integration**
3. Nume: `UFO Invasions Sync`
4. Workspace: Selectează workspace-ul tău
5. Capabilities: Read, Update, Insert content
6. Click pe **Submit** și copiază **Internal Integration Token**
7. **IMPORTANT**: Adaugă integrarea la database-ul creat:
   - Mergi la [Task Tracker Database](https://www.notion.so/3974f1b1767e452488c2b6aa4c364084)
   - Click pe **•••** (more options) → **+ Add connections**
   - Selectează integrarea **UFO Invasions Sync**

**Format**: `secret_...` (începe cu secret_)

### `NOTION_DATABASE_ID`
**Descriere**: ID-ul database-ului Task Tracker din Notion
**Valor**: `142d8b53-a4dd-4f57-a172-d289c9142eb9`

*(ID-ul este deja extras din URL-ul database-ului creat)*

---

## 🔧 Development Secrets (Opționale pentru workflow, necesare pentru backend)

### Pentru dezvoltarea locală (în `.env`):
```bash
# Database
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

# Authentication
JWT_SECRET=your-jwt-secret-here

# Blockchain
USDT_CONTRACT_ADDRESS=0x... # (după deployment)
PANCAKESWAP_API_KEY=your-pancakeswap-key

# Social Media APIs
TWITTER_API_KEY=your-twitter-key
TELEGRAM_BOT_TOKEN=your-telegram-token

# External Services
COINGECKO_API_KEY=your-coingecko-key
```

---

## 🧪 Testing Sync Setup

### După adăugarea secretelor:

1. **Test Manual Sync**:
   - Mergi la **Actions** tab în GitHub
   - Click pe workflow **🔄 Sync Platforms**
   - Click pe **Run workflow** → **force_sync: true**
   - Verifică logs pentru erori

2. **Test Issue Sync**:
   - Creează un GitHub issue cu titlu: `GPZ-85: Test Sync Integration`
   - Verifică dacă se actualizează în Notion Task Tracker
   - Verifică logs în GitHub Actions

3. **Test PR Sync**:
   - Creează un branch: `git checkout -b feature/GPZ-85-test-sync`
   - Fă un commit: `git commit -m "GPZ-85: test sync integration"`
   - Creează PR cu reference la GPZ-85
   - Verifică update-urile în Linear și Notion

---

## 📊 Monitoring Sync Health

### Indicators de Success:
- ✅ GitHub Actions runs fără erori
- ✅ Notion tasks se actualizează automat
- ✅ Linear issues primesc comentarii cu link-uri GitHub
- ✅ Status-urile se sincronizează corect

### Troubleshooting:
- **Error 401**: Verifică tokenurile LINEAR_TOKEN / NOTION_TOKEN
- **Database not found**: Verifică NOTION_DATABASE_ID
- **Integration not authorized**: Adaugă integrarea la database Notion

---

## 🔄 Next Steps

1. **Immediate** (astăzi):
   - Adaugă secretele în GitHub
   - Testează sync-ul manual
   - Verifică primul issue/PR sync

2. **This Week**:
   - Monitorizează sync accuracy
   - Ajustează workflow-ul dacă necesar
   - Adaugă mai multe trigger-e

3. **Enhancement** (săptămâna viitoare):
   - Bidirectional sync (Notion → Linear)
   - Advanced status mapping
   - Slack notifications pentru events

---

*📝 Pentru întrebări sau probleme cu setup-ul, creează un issue cu tag `sync-support`*