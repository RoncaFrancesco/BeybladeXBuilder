# Beyblade X Team Builder

🎯 **Crea e gestisci team Beyblade X personalizzati con database prodotti ottimizzato**

## 🚀 Caratteristiche

### 🏗️ Team Builder
- **Sistema 3on3**: Crea squadre competitive con 3 Beyblade X
- **Valutazione Automatica**: Calcola statistiche e compatibilità del team
- **Sistema 1v1**: Test singoli Beyblade contro avversari
- **Export Team**: Salva e condividi le tue configurazioni

### 📊 Database Management
- **Database Predefinito**: Tutti i Beyblade X ufficiali disponibili
- **Prodotti Personalizzati**: Aggiungi le tue creazioni uniche
- **Sistema di Set**: Organizza prodotti per set e collezioni
- **Validazione Automatica**: Controlli di integrità per i dati inseriti

### 📱 PWA (Progressive Web App)
- **Installabile come App**: Funziona offline su dispositivi mobili
- **Icone Custom**: Brand personalizzato con immagini originali
- **Ottimizzato Mobile**: Esperienza utente fluida su smartphone/tablet
- **Service Worker**: Caching intelligente per performance elevate

## 🛠️ Stack Tecnologico

- **React 18** - Framework frontend moderno
- **Vite** - Build system ultra veloce
- **Tailwind CSS** - Styling responsive e utility-first
- **LocalStorage** - Persistenza dati client-side
- **PWA** - Supporto applicazioni native

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
1. **Seleziona Beyblade**: Scegli blade, ratchet e bit dai dropdown
2. **Crea Team 3on3**: Combina 3 Beyblade per il team competitivo
3. **Valuta Team**: Visualizza statistiche e punteggi automatici
4. **Salva Team**: Esporta le configurazioni per uso futuro

### 2. Database Personalizzato
1. **Aggiungi Prodotti**: Clicca su "Gestione Database"
2. **Inserisci Dati**: Compila nome, tipo e caratteristiche
3. **Valida Automatica**: Il sistema controlla integrità dati
4. **Usa nel Builder**: I prodotti personalizzati appaiono nei dropdown

### 3. Installazione come App
1. **Apri in Chrome**: Visita l'app su browser Chrome
2. **Install Icon**: Clicca icona ➕ nella barra indirizzi
3. **Installa PWA**: Conferma installazione come app desktop/mobile
4. **Offline Mode**: L'app funziona anche senza connessione

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
│   ├── App.jsx              # Componente principale
│   ├── main.jsx             # Entry point React
│   └── index.css            # Stili globali
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   ├── icon-*.png          # Icone app (molti formati)
│   └── index.html          # HTML template
├── README.md               # Questo file
├── package.json            # Dipendenze e script
└── vite.config.js          # Configurazione Vite
```

## 🎯 Funzionalità Principali

### Team Builder
- **Valutazione Automatica**: Algoritmo proprietario per punteggi team
- **Compatibilità**: Controlla sinergia tra componenti
- **Export**: Formato JSON standard per condivisione
- **Import**: Carica team da file o link

### Database System
- **Set Management**: Organizza prodotti per set ufficiali
- **Custom Products**: Supporto completo per creazioni personalizzate
- **Validation**: Controlli automatici per coerenza dati
- **Search**: Ricerca rapida con filtri avanzati

### PWA Features
- **Offline Caching**: Service worker intelligente
- **App Installation**: Esperienza native-like
- **Responsive Design**: Ottimizzato per tutti i dispositivi
- **Performance**: Loading veloce e navigazione fluida

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

Il progetto è deployato su Vercel:
- **Production**: https://beyblade-builder.vercel.app
- **Auto-deploy**: Automatico su push a branch `master`

## 📝 Changelog

### v2.0.0 - Complete System Redesign
- ✨ Database management personalizzato
- 🔧 Sistema di valutazione team migliorato
- 📱 PWA implementation completa
- 🎨 UI/UX ottimizzata per mobile
- 🚀 Performance upgrade con Vite

### v1.0.0 - Initial Release
- 🎯 Team builder base 3on3
- 📊 Database prodotti ufficiali
- 💾 Salvataggio team locali
- 🎨 Design responsive base

---

**Made with ❤️ for Beyblade X Community in Italy**