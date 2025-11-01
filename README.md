# 🎮 Beyblade X Team Builder

App per creare e gestire team di Beyblade X seguendo le regole dei tornei WBO e B4.

## Funzionalità
- ✅ Creazione Beyblade singoli o team 3on3
- ✅ Verifica regole tornei (no pezzi duplicati)
- ✅ Calcolo prodotti da acquistare
- ✅ Salvataggio build persistente
- ✅ Libreria build personale

## Tecnologie
- React 18
- Vite
- Tailwind CSS
- Lucide React Icons
- LocalStorage per persistenza dati

## Installazione

\`\`\`bash
npm install
npm run dev
\`\`\`

## Deploy
Automatico su Vercel tramite GitHub
```

---

## 🎨 **Struttura Visuale dell'App**
```
┌─────────────────────────────────────────┐
│         🎮 MENU PRINCIPALE              │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   🎯 SINGLE  │  │  🏆 TEAM 3on3│   │
│  │   Beyblade   │  │   Builder     │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│        📚 I MIEI BUILD (X)              │
└─────────────────────────────────────────┘
              ↓
    ┌─────────┬─────────┐
    ↓         ↓         ↓
┌─────────┐ ┌──────────────┐ ┌──────────────┐
│ BUILDER │ │   LIBRERIA   │ │ DIALOG SALVA │
│         │ │              │ │              │
│ • Blade │ │ Lista build  │ │ Nome build   │
│ • Ratchet│ │ salvati con  │ │ [_________]  │
│ • Bit   │ │ opzioni:     │ │              │
│         │ │  - Carica    │ │ [Annulla]    │
│ 💾 Salva│ │  - Elimina   │ │ [💾 Salva]   │
│         │ │              │ │              │
│ 🛒 Shop │ └──────────────┘ └──────────────┘
│ List    │
└─────────┘
```

---

## 🔄 **Flusso dell'App**
```
START
  │
  ↓
MENU ──────────────┐
  │                │
  ↓                ↓
SINGLE         TEAM 3on3
  │                │
  ↓                ↓
BUILDER ←──────────┘
  │
  ├─→ Compila Blade/Ratchet/Bit
  │
  ├─→ Verifica pezzi duplicati (solo TEAM)
  │
  ├─→ Team completo?
  │     │
  │     ↓ SI
  │   MOSTRA:
  │   • 🛒 Shopping List ottimizzata
  │   • 💾 Pulsante Salva
  │     │
  │     ↓ Clicca Salva
  │   DIALOG SALVA
  │     │
  │     ↓ Conferma
  │   SALVA in localStorage
  │
  ├─→ 📚 Libreria
  │     │
  │     ├─→ Carica build → Torna a BUILDER
  │     └─→ Elimina build → Aggiorna lista
  │
  └─→ ← Menu → Torna a MENU