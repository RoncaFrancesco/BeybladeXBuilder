# Beyblade X Team Builder v3.0.0

🎯 **Crea e gestisci team Beyblade X personalizzati con sistema avanzato di collezione e ottimizzazione acquisti intelligente**

**🌐 Live Demo:** [https://beybladexbuilder.vercel.app](https://beybladexbuilder.vercel.app)

---

## 🚀 Caratteristiche Principali

### 📦 **La Mia Collezione** (NUOVO!)
- **Gestione Completa Collezione**: Marca i prodotti che possiedi con un semplice click
- **Filtri Avanzati**: Filtra per tier (S+/S/A/B), formato, tipologia, stato posseduto
- **Ricerca Intelligente**: Cerca prodotti per nome con risultati in tempo reale
- **Azioni Bulk**: Seleziona e aggiungi/rimuovi più prodotti contemporaneamente
- **Statistiche Dettagliate**: Visualizza percentuale completamento, prodotti per tier/formato
- **Export JSON**: Salva la tua collezione e condividila con altri blader
- **Counter Visivo**: "Hai X prodotti su Y totali" sempre visibile

### 🛒 **Ottimizzatore Acquisti Intelligente** (NUOVO!)
- **Analisi Team vs Collezione**: Identifica automaticamente cosa possiedi e cosa manca
- **Algoritmo Greedy Avanzato**: Calcola la combinazione ottimale di prodotti da acquistare
- **Alternative Multiple**: Suggerimenti Budget (A/B tier) e Premium (S+/S tier)
- **Calcolo Risparmio**: Mostra quanto risparmi rispetto ad altre combinazioni
- **Dettaglio Forniture**: Indica esattamente quali pezzi fornisce ogni prodotto
- **Integrazione Personalizzati**: Include i tuoi prodotti custom nell'ottimizzazione

### 🏗️ **Team Builder Professionale**
- **Sistema 3on3**: Crea squadre competitive seguendo le regole WBO/B4
- **Sistema 1v1**: Crea singoli Beyblade per test e sfide
- **Controllo Duplicati Intelligente**: Previene uso multi-componenti in team
- **Nominazione Build**: Assegna nomi personalizzati ai tuoi team
- **Valutazione Automatica**: Calcola rating medio basato sui componenti
- **Tipologia Predominante**: Determina Attack/Defense/Stamina/Balance automaticamente

### ⭐ **Sistema di Rating Completo**
- **Rating Personalizzati**: Assegna voti 1-5 stelle a Blade, Ratchet, Bit
- **Note Dettagliate**: Aggiungi commenti e annotazioni per ogni pezzo
- **Import/Export JSON**: Condividi i tuoi rating con la community
- **Visualizzazione Contestuale**: Rating mostrati direttamente nei menu
- **Badge "TOP TIER"**: Indicazione automatica per componenti 5 stelle
- **Valutazione Media**: Calcolo automatico rating complessivo Beyblade

### 🗃️ **Database Modulare Avanzato** (NUOVO!)
- **Database Ufficiale JSON**: 31 prodotti certificati con schema validazione
- **Schema Validazione Robusto**: Prevenzione errori con report dettagliati
- **Storage Manager**: Supporto window.storage + localStorage fallback
- **Cache Intelligente**: Ottimizzazione performance con caricamento asincrono
- **Prodotti Personalizzati**: Sistema completo per aggiunte custom
- **Admin Mode**: Gestione avanzata database (Ctrl+Shift+A)

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

### 📚 **Libreria Build Salvata**
- **Archivio Personale**: Gestione completa di tutti i team creati
- **Salvataggio Automatico**: Persistenza dati con storage multiplo (window.storage → localStorage)
- **Caricamento Rapido**: Ripristino immediato dei team salvati
- **Gestione Semplice**: Elimina e riorganizza i build con pochi click
- **Metadata Completi**: Data creazione, modalità, statistiche, rating
- **Visualizzazione Organizzata**: Ordinati per data con filtri e ricerca

### 📱 **PWA (Progressive Web App)**
- **Installabile come App**: Funziona offline su tutti i dispositivi
- **Icone Custom**: Brand personalizzato con 7 formati icona
- **Ottimizzato Mobile**: Esperienza fluida su smartphone/tablet
- **Service Worker**: Caching intelligente per performance elevate
- **Manifest Completo**: Meta-tag ottimizzati per social sharing

### 🔧 **Tecnologie Avanzate**
- **React 18**: Framework moderno con hooks e performance ottimizzate
- **Vite 4.5.14**: Build system ultra veloce con HMR
- **Tailwind CSS**: Styling responsive e utility-first
- **Lucide Icons**: Icone moderne e accessibili
- **JSON Database**: Schema validato e facilmente aggiornabile
- **Storage Abstraction**: Supporto multipi ambienti storage

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

## 🎮 Guida Rapida

### 🏆 **1. Team Builder**
1. **Scegli Modalità**:
   - 🎯 **Beyblade Singolo**: Testa combo specifiche
   - 🏆 **Team 3on3**: Crea squadre competitive (regole WBO)
2. **Selezione Componenti**:
   - ✅ Icone colorate per tipologia (Attack/Defense/Stamina/Balance)
   - ⭐ Rating visualizzati direttamente nei menu
   - 🏆 Badge "TOP TIER" per componenti 5 stelle
   - 💭 Note personali integrate
3. **Controllo Automatico**: In modalità 3on3 previene duplicati
4. **Nominazione Build**: Assegna nomi personalizzati
5. **Ottimizzazione**: Usa "🛒 Ottimizza Acquisti" dopo aver creato un team completo

### 📦 **2. La Mia Collezione** (NUOVO!)
1. **Accesso**: Clicca "📦 La Mia Collezione" dal menu principale
2. **Gestione Prodotti**:
   - ✅ Click su checkbox per marcare prodotti posseduti
   - 🔍 Usa la ricerca per trovare prodotti specifici
   - 🎛️ Filtra per tier, formato, stato posseduto
3. **Azioni Bulk**:
   - 🔢 Seleziona multi prodotti contemporaneamente
   - ➕/➕ Aggiungi/rimuovi in blocco
4. **Statistiche**: Visualizza percentuale completamento e dettagli per categoria
5. **Export**: 💾 Salva la tua collezione in JSON

### 🛒 **3. Ottimizzatore Acquisti** (NUOVO!)
1. **Crea Team Completo**: 3 Beyblade con blade, ratchet, bit
2. **Avvia Ottimizzatore**: Clicca "🛒 Ottimizza Acquisti"
3. **Analisi Automatica**:
   - ✅ Visualizza cosa possiedi già
   - ❌ Identifica componenti mancanti
4. **Suggerimenti Intelligenti**:
   - 🎯 Prodotti ottimali con dettagli forniture
   - 💰 Costo totale e risparmio calcolato
   - 🔄 Alternative Budget/Premium
5. **Decisione**: Acquista i prodotti suggeriti per completare il team
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

## 📝 Changelog & Roadmap

### 🚀 **v3.0.0 - Advanced Collection & Shopping System (Novembre 2025)**
**RELEASE COMPLETA - LIVE SU VERCEL**

#### 🆕 **Funzionalità Principali:**
- 📦 **La Mia Collezione**: Sistema completo gestione prodotti posseduti
- 🛒 **Ottimizzatore Acquisti Intelligente**: Algoritmo avanzato ottimizzazione team
- 🗃️ **Database Modulare**: Sistema JSON facilmente aggiornabile
- 🔧 **Admin Mode**: Funzionalità avanzate (Ctrl+Shift+A)

#### 🔧 **Miglioramenti Tecnici:**
- Architettura Component-Based con 2 nuovi componenti principali
- Database Manager con sistema CRUD completo
- Storage manager con fallback multiplo
- Cache intelligente per performance

#### 🎨 **Miglioramenti UI/UX:**
- Menu principale con pulsanti uniformi
- Icone personalizzate per tipologie Beyblade
- Design responsive mobile-first

## 🌐 **Deploy Status**

### ✅ **Produzione Attiva:**
- **URL:** https://beybladexbuilder.vercel.app
- **Versione:** v3.0.0
- **Status:** Live e funzionante
- **Build Size:** JS: 246KB | CSS: 32KB
- **PWA:** Installabile su tutti i dispositivi

---

**🎉 Beyblade X Team Builder v3.0.0 - COMPLETAMENTE FUNZIONANTE!**

**Made with ❤️ per Beyblade X Community in Italy**
*© 2025 Francesco Ronca - Tutti i diritti riservati*
