# Beyblade X Team Builder

🎯 **Crea e gestisci team Beyblade X personalizzati con database prodotti ottimizzato e sistema di rating completo**

## 🚀 Caratteristiche

### 🏗️ Team Builder
- **Sistema 3on3**: Crea squadre competitive con 3 Beyblade X seguendo le regole dei tornei WBO/B4
- **Sistema 1v1**: Crea singoli Beyblade personalizzati per test e sfide
- **Controllo Duplicati**: In modalità team previene l'uso dello stesso pezzo più volte
- **Nominazione Build**: Assegna nomi personalizzati ai tuoi team per identificarli facilmente
- **Valutazione Automatica**: Calcola rating medio basato sui singoli componenti
- **Tipologia Predominante**: Determina automaticamente se il Beyblade è Attack, Defense, Stamina o Balance

### ⭐ Sistema di Rating Completo
- **Rating Personalizzati**: Assegna voti da 1 a 5 stelle a ogni componente (Blade, Ratchet, Bit)
- **Note Annotazioni**: Aggiungi commenti e note dettagliate per ogni pezzo
- **Import/Export Rating**: Salva e condividi i tuoi rating tramite file JSON
- **Visualizzazione Intelligente**: I rating vengono mostrati direttamente nei menu di selezione
- **Badge "TOP TIER"**: Indicazione automatica per i componenti con rating 5 stelle
- **Valutazione Media**: Calcolo automatico del rating complessivo di ogni Beyblade

### 📊 Database Management
- **Database Ufficiale**: 25+ Blades, 17 Ratchets e 22 Bits certificati
- **Prodotti Personalizzati**: Aggiungi le tue creazioni uniche con sistema completo
- **Sistema di Set**: Organizzazione prodotti per formati (Starter, Booster, Dual Pack, Battle Set)
- **Classificazione Tier**: S-tier, A-tier, B-tier con indicazioni visive
- **Prezzi Indicativi**: Range di prezzo per ogni prodotto
- **Validazione Automatica**: Controlli di integrità per i dati inseriti

### 🛒 Carrello Intelligente
- **Ottimizzazione Team**: Algoritmo che calcola il numero minimo di prodotti per ottenere tutti i pezzi
- **Combinazione Ottimale**: Suggerisce i prodotti più efficienti per creare team 3on3
- **Visualizzazione Forniture**: Indica esattamente quali pezzi fornisce ogni prodotto
- **Supporto Personalizzati**: Include anche i prodotti aggiunti manualmente nell'ottimizzazione

### 📚 Sistema di Salvataggio
- **Build Library**: Archivio personale di tutti i team creati
- **Salvataggio Automatico**: Persistenza dati su localStorage con fallback multiplo
- **Caricamento Rapido**: Ripristina immediatamente i team salvati
- **Gestione Semplice**: Elimina e riorganizza i build con few clicks
- **Metadata Completi**: Data di creazione, tipo di modalità, statistiche

### 📱 PWA (Progressive Web App)
- **Installabile come App**: Funziona offline su dispositivi mobili
- **Icone Custom**: Brand personalizzato con immagini originali (7 formati diversi)
- **Ottimizzato Mobile**: Esperienza utente fluida su smartphone/tablet
- **Service Worker**: Caching intelligente per performance elevate
- **Manifest Completo**: Meta-tag ottimizzati per social sharing

## 🛠️ Stack Tecnologico

- **React 18** - Framework frontend moderno con hooks
- **Vite 4.5.14** - Build system ultra veloce con JSX support
- **Tailwind CSS** - Styling responsive e utility-first
- **Lucide Icons** - Icone moderne e scalabili
- **LocalStorage** - Persistenza dati client-side con fallback multiplo
- **PWA** - Supporto applicazioni native con service worker

## 🎯 Tipologie Beyblade X

Il sistema classifica automaticamente ogni componente in 4 tipologie principali:

### 🔵 Attack (Attacco)
- **Blades**: Soar Phoenix, Dran Sword, Shark Edge, Knight Shield, Dagger Dran, Sting Unicorn
- **Ratchets**: 3-60, 4-60, 5-60, 9-60, 1-60 (bassi e leggeri)
- **Bits**: F, LF, GF, A, Q, K (orientati all'offesa)

### 🟢 Defense (Difesa)
- **Blades**: Wizard Rod, Wand Wizard, Wizard Arrow, Obsidian Shell, Shelter Drake
- **Ratchets**: 5-80, 6-80, 7-80, 4-80, 3-80, 1-80, 0-80 (alti e pesanti)
- **Bits**: B, DB, GB, D, HN (massimi e stabili)

### 🟠 Stamina (Resistenza)
- **Blades**: Chain Scythe, Hells Scythe, Chain Fire, Reaper Fire T
- **Ratchets**: 5-70, 4-70, 2-70, 9-70 (bilanciati)
- **Bits**: P, GP, T, HT, W, N, MN (durata prolungata)

### 🔴 Balance (Equilibrio)
- **Blades**: Sword Dran, Buster Dran, Shadow Shinobi, Knife Shinobi, Circle Ghost, Beat Tyranno, Tackle Goat, Gale Wyvern, Dark Perseus B, Fox Blush J, Tusk Mammoth
- **Bits**: R, GR, H (versatili)

## 📦 Installazione e Setup

### Prerequisiti
```bash
# Assicurati di avere Node.js installato
node --version  # >= 18.0.0
```

### Setup Locale
```bash
# Clona il repository
git clone https://github.com/RoncaFrancesco/beyblade-builder.git
cd beyblade-builder

# Installa le dipendenze
npm install

# Avvia il development server
npm run dev

# Apri http://localhost:5173
```

### Build per Produzione
```bash
# Crea build ottimizzato
npm run build

# Anteprima build
npm run preview
```

## 🎮 Come Usare

### 1. Team Builder
1. **Scegli Modalità**:
   - 🎯 **Beyblade Singolo**: Per testare combo specifiche
   - 🏆 **Team 3on3**: Per creare squadre competitive seguendo le regole WBO
2. **Seleziona Componenti**: Scegli blade, ratchet e bit dai dropdown con indicazioni visive:
   - ✅ Icone colorate per tipologia (Attack/Defense/Stamina/Balance)
   - ⭐ Rating personali visualizzati direttamente nel menu
   - 🏆 Badge "TOP TIER" per componenti con 5 stelle
   - 💭 Note personali per ogni componente
3. **Nominazione Build**: Assegna un nome personalizzato al tuo team
4. **Controllo Automatico**: In modalità 3on3 previene duplicati degli stessi pezzi
5. **Salva Team**: Aggiungi alla tua libreria personale per uso futuro

### 2. Sistema di Rating ⭐
1. **Apri Rating Database**: Dal menu principale seleziona "⭐ Rating Database"
2. **Scegli Categoria**: Naviga tra Blade, Ratchet, Bit con tab dedicati
3. **Assegna Rating**:
   - ⭐ Valutazione da 1 a 5 stelle
   - 📝 Note personali e commenti dettagliati
   - 💾 Salvataggio automatico con toast di conferma
4. **Import/Export**:
   - 📤 Esporta i tuoi rating in formato JSON
   - 📥 Importa rating da file condivisi
5. **Visualizzazione Intelligente**: I rating appaiono ovunque nell'app

### 3. Database Personalizzato
1. **Apri Gestione Database**: Dal menu principale seleziona "🗃️ Gestione Database"
2. **Aggiungi Prodotto**:
   - 🗡️ **Blade**: Nome principale (es: Lightning Dragoon)
   - 📦 **Nome Prodotto**: Auto-generato dal blade
   - ⚙️ **Ratchet**: Configurazione meccanica
   - 🎯 **Bit**: Tipo di performance
   - 💰 **Prezzo**: Range di prezzo indicativo
   - ⭐ **Tier**: Classificazione potenza (S+, S, A, B)
3. **Validazione Automatica**: Il sistema controlla integrità dati
4. **Integrazione Immediata**: I prodotti personalizzati appaiono in tutti i menu

### 4. Carrello Intelligente e Ottimizzazione 🛒
1. **Completa Team**: Assicurati che tutti i Beyblade siano completi
2. **Visualizzazione Prodotti**: L'app calcola automaticamente:
   - 🔢 **Numero minimo** di prodotti necessari
   - 🎯 **Combinazione ottimale** per ottenere tutti i pezzi
   - ✅ **Forniture dettagliate** di ogni prodotto
3. **Supporto Personalizzati**: Include anche i tuoi prodotti aggiunti manualmente
4. **Informazioni Complete**: Prezzi, tier, e set di appartenenza

### 5. Libreria Build 📚
1. **Accesso Rapido**: Dal menu principale "📚 I Miei Build"
2. **Visualizzazione Organizzata**:
   - 📅 Data di creazione
   - 🏷️ Tipo di modalità (Singolo/Team)
   - ⭐ Rating medi dei componenti
   - 🎯 Tipologie predominant
3. **Gestione Semplice**:
   - 🔄 Carica build esistenti
   - 🗑️ Elimina build non più necessari
   - 📊 Statistiche complete

### 6. Installazione come App PWA
1. **Apri in Browser**: Visita l'app su browser Chrome/Edge moderno
2. **Install Icon**: Cerca icona ➕ nella barra indirizzi
3. **Installa PWA**: Conferma installazione come app desktop/mobile
4. **Offline Mode**: L'app funziona anche senza connessione internet

## 📱 Compatibilità

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Android Mobile
- ✅ iOS Safari (limited PWA features)

## 🔧 Struttura Progetto

```
beyblade-builder/
├── src/
│   ├── App.js               # Componente principale (2021+ righe, JSX-based)
│   ├── main.jsx             # Entry point React
│   └── index.css            # Stili globali Tailwind
├── public/
│   ├── manifest.json        # PWA manifest completo
│   ├── sw.js               # Service worker per offline mode
│   ├── icon-*.png          # Icone app multi-dimensione (32px a 512px)
│   └── index.html          # HTML template ottimizzato SEO
├── dist/                   # Build production ottimizzato
├── README.md               # Documentazione completa
├── package.json            # Dipendenze e script
├── vite.config.js          # Configurazione Vite con JSX support
├── tailwind.config.js      # Configurazione Tailwind CSS
└── postcss.config.js       # PostCSS configuration
```

## 🎯 Funzionalità Principali

### Team Builder Avanzato
- **Sistema Dual Mode**: Singolo vs Team 3on3 con regole WBO
- **Controllo Duplicati Intelligente**: Previene uso multi-componenti in team
- **Valutazione Automatica**: Calcolo rating medio basato su componenti
- **Tipologia Predominante**: Determinazione automatica Attack/Defense/Stamina/Balance
- **Nominazione Build**: Sistema completo per identificazione team

### Sistema di Rating Completo ⭐
- **Database Rating Unificato**: Blade, Ratchet, Bit con valutazioni personali
- **Note Dettagliate**: Sistema annotazioni per ogni componente
- **Import/Export JSON**: Condivisione rating tra dispositivi/utenti
- **Visualizzazione Contestuale**: Rating mostrati in tutti i menu di selezione
- **Badge TOP TIER**: Identificazione automatica componenti 5 stelle
- **Calcolo Media**: Rating complessivo automatico per ogni Beyblade

### Database Management System
- **Database Ufficiale Completo**: 25+ Blades, 17 Ratchets, 22 Bits certificati
- **Prodotti Personalizzati**: Sistema completo con validazione
- **Classificazione Tier**: S+, S, A, B con indicazioni visive colorate
- **Set Organization**: Starter, Booster, Dual Pack, Battle Set
- **Prezzi Indicativi**: Range pricing per ogni prodotto
- **Integrazione Automatica**: Custom products appaiono ovunque

### Carrello Intelligente e Ottimizzazione 🛒
- **Algoritmo Ottimizzatore**: Calcolo minimo prodotti per team 3on3
- **Combinazione Intelligente**: Suggerimenti prodotti più efficienti
- **Visualizzazione Forniture**: Dettaglio esatto pezzi per prodotto
- **Supporto Personalizzati**: Inclusione prodotti custom nell'ottimizzazione
- **Informazioni Complete**: Prezzi, tier, set, rating integrati

### PWA Features Avanzate
- **Offline Complete**: Service worker per funzionamento senza connessione
- **Multi-Icon System**: 7 formati icona per tutti i dispositivi
- **SEO Optimized**: Meta-tag completi per social sharing
- **Responsive Perfetto**: Ottimizzazione mobile/tablet/desktop
- **Install Experience**: Workflow installazione nativa
- **Performance Caching**: Strategie caching avanzate

## 🤝 Contributi

Benvenuti contributi per migliorare l'app:

1. **Fork** del repository
2. **Branch** feature (`git checkout -b feature/NuovaFunzione`)
3. **Commit** delle modifiche (`git commit -m 'Add feature'`)
4. **Push** al branch (`git push origin feature/NuovaFunzione`)
5. **Pull Request** per revisione

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi file `LICENSE` per dettagli.

## 👨‍💻 Autore

**Francesco Ronca**
- GitHub: [@RoncaFrancesco](https://github.com/RoncaFrancesco)
- App dedicata alla community di Beyblade X Italia

## 🌐 Deploy

Il progetto è deployato su Vercel con CI/CD automatico:
- **Production**: https://beyblade-builder.vercel.app
- **Auto-deploy**: Automatico su push a branch `master`
- **Build Process**: Vite + React ottimizzato per production
- **CDN Integration**: Asset distribuiti globalmente via Vercel Edge Network

## 📝 Changelog

### v3.0.0 - Advanced Rating System (Novembre 2025)
- ⭐ **Sistema Rating Completo**: Database rating per tutti i componenti
- 📝 **Note Personali**: Sistema annotazioni dettagliate per ogni pezzo
- 📤 **Import/Export Rating**: Condivisione rating tramite JSON
- 🏆 **Badge TOP TIER**: Identificazione automatica componenti 5 stelle
- 🎯 **Visualizzazione Contestuale**: Rating integrati in tutti i menu
- 📊 **Calcolo Media Rating**: Valutazione automatica Beyblade completi
- 🎨 **UI/UX Migliorata**: Icone personalizzate per tipologie Beyblade
- 🔧 **Ottimizzazione Performance**: Rendering più veloce e responsive

### v2.5.0 - Enhanced Database & Cart System
- 🗃️ **Database Management Avanzato**: Sistema completo prodotti personalizzati
- 🛒 **Carrello Intelligente**: Algoritmo ottimizzazione acquisti team 3on3
- 📦 **Sistema Set**: Organizzazione prodotti per formati ufficiali
- 💰 **Prezzi Indicativi**: Range pricing per ogni prodotto
- ⭐ **Classificazione Tier**: S+, S, A, B con indicatori visivi
- 🔍 **Integrazione Automatica**: Custom products in tutti i menu

### v2.0.0 - Complete System Redesign
- 🏆 **Modalità Team 3on3**: Regole tornei WBO/B4 implementate
- 🚫 **Controllo Duplicati**: Prevenzione uso multi-componenti in team
- 📱 **PWA Complete**: Service worker, offline mode, installazione nativa
- 🎨 **UI/UX Moderna**: Design gradient, animazioni, micro-interazioni
- 💾 **Sistema Salvataggio**: Libreria build persistente con metadata
- 📊 **Tipologie Beyblade**: Classificazione automatica Attack/Defense/Stamina/Balance
- ⚡ **Performance Upgrade**: Migrazione a Vite + React 18

### v1.0.0 - Initial Release
- 🎯 Team builder base 3on3
- 📊 Database prodotti ufficiali
- 💾 Salvataggio team locali
- 🎨 Design responsive base

## 🎯 Roadmap Futura

### Prossime Feature (In Development)
- 🔥 **Battle Simulator**: Sistema simulazione combattimenti Beyblade
- 📈 **Statistics Dashboard**: Analisi avanzata performance team
- 🌍 **Multi-language Support**: Inglese, Giapponese, Spagnolo
- 🔄 **Cloud Sync**: Sincronizzazione dati cross-device
- 📱 **Mobile App Native**: Versione iOS/Android dedicata
- 🏆 **Tournament Mode**: Sistema gestione tornei completi

### Idee Community
- 🎓 **Tutorial System**: Guide interattive per nuovi giocatori
- 🤝 **Team Sharing**: Piattaforma condivisione team con community
- 📊 **Meta Analysis**: Aggiornamenti periodici sul meta competitivo
- 🎯 **Build Recommendations**: AI-powered suggerimenti team

---

**Made with ❤️ per Beyblade X Community in Italy**
*© 2025 Francesco Ronca - Tutti i diritti riservati*