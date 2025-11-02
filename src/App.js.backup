import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Check, ShoppingCart, Trash2, Package, Save, BookOpen, Upload, X, Star, Star as StarEmpty } from 'lucide-react';

// Icone tipologie Beyblade (design ufficiale)
const TypeIcons = {
  Attack: () => (
    <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#1e40af" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      {/* Triangoli rotanti attorno al centro */}
      <path d="M50 15 L40 30 L60 30 Z" fill="white"/>
      <path d="M85 50 L70 40 L70 60 Z" fill="white"/>
      <path d="M50 85 L60 70 L40 70 Z" fill="white"/>
      <path d="M15 50 L30 60 L30 40 Z" fill="white"/>
      {/* Linee dinamiche */}
      <path d="M50 30 Q65 40 70 50" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M70 50 Q65 65 50 70" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M50 70 Q35 65 30 50" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M30 50 Q35 35 50 30" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),

  Stamina: () => (
    <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#f97316" stroke="#ea580c" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      {/* Spirale centrifuga */}
      <path d="M50 30 Q70 30 75 50 Q70 70 50 70 Q30 70 25 50 Q30 30 50 30"
            stroke="white" strokeWidth="3" fill="none"/>
      <path d="M50 35 Q65 35 68 50 Q65 65 50 65 Q35 65 32 50 Q35 35 50 35"
            stroke="white" strokeWidth="2.5" fill="none"/>
      <circle cx="50" cy="50" r="8" fill="white"/>
    </svg>
  ),

  Defense: () => (
    <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#16a34a" stroke="#15803d" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      {/* Forma a scudo */}
      <path d="M50 15 L75 35 L75 55 L50 75 L25 55 L25 35 Z"
            fill="none" stroke="white" strokeWidth="3"/>
      <path d="M50 25 L68 40 L68 55 L50 68 L32 55 L32 40 Z"
            fill="none" stroke="white" strokeWidth="2.5"/>
      {/* Linee di protezione */}
      <line x1="50" y1="25" x2="50" y2="68" stroke="white" strokeWidth="2"/>
      <line x1="32" y1="40" x2="68" y2="40" stroke="white" strokeWidth="2"/>
    </svg>
  ),

  Balance: () => (
    <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#dc2626" stroke="#b91c1c" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      {/* Cerchi concentrici bilanciati */}
      <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="2"/>
      {/* Punti cardinali */}
      <circle cx="50" cy="22" r="4" fill="white"/>
      <circle cx="78" cy="50" r="4" fill="white"/>
      <circle cx="50" cy="78" r="4" fill="white"/>
      <circle cx="22" cy="50" r="4" fill="white"/>
      <circle cx="50" cy="50" r="6" fill="white"/>
    </svg>
  )
};

// Componente helper per mostrare l'icona
const TypeIcon = ({ type, size = 20 }) => {
  const IconComponent = TypeIcons[type];
  if (!IconComponent) return null;

  return (
    <span className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <IconComponent />
    </span>
  );
};

const BeybladeTeamBuilder = () => {
  const [mode, setMode] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customProducts, setCustomProducts] = useState([]);
  const [ratings, setRatings] = useState({ blade: {}, ratchet: {}, bit: {} });
  const [ratingTab, setRatingTab] = useState('blade');
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Form per aggiungere prodotto
  const [newProduct, setNewProduct] = useState({
    name: '',
    blade: '',
    ratchet: '',
    bit: '',
    price: '',
    tier: 'A'
  });
  
  const [team, setTeam] = useState([
    { blade: '', ratchet: '', bit: '' },
    { blade: '', ratchet: '', bit: '' },
    { blade: '', ratchet: '', bit: '' }
  ]);

  const beybladeData = {
    blades: [
      'Sword Dran', 'Dran Sword', 'Buster Dran', 'Dagger Dran',
      'Soar Phoenix',
      'Chain Scythe', 'Hells Scythe', 'Chain Fire', 'Reaper Fire T',
      'Wizard Rod', 'Wand Wizard', 'Wizard Arrow',
      'Shark Edge',
      'Knife Shinobi', 'Shadow Shinobi',
      'Knight Shield', 'Sting Unicorn', 'Tusk Mammoth', 'Beat Tyranno',
      'Tackle Goat', 'Gale Wyvern', 'Circle Ghost', 'Obsidian Shell',
      'Shelter Drake', 'Dark Perseus B', 'Fox Blush J'
    ].sort(),
    ratchets: [
      '0-80', '1-60', '1-80', '2-70', '3-60', '3-80', '4-60', '4-70', '4-80',
      '5-60', '5-70', '5-80', '6-80', '7-80', '9-60', '9-70'
    ],
    bits: [
      'A', 'B', 'D', 'DB', 'F', 'GB', 'GF', 'GP', 'GR', 'H', 'HN', 'HT',
      'K', 'LF', 'MN', 'N', 'P', 'Q', 'R', 'T', 'W'
    ].sort()
  };

  const products = [
    { name: 'Wizard Rod 5-70DB (UX Booster)', blade: 'Wizard Rod', ratchet: '5-70', bit: 'DB', price: '25-30€', tier: 'S+', format: 'UX Booster', setName: null },
    { name: 'Wand Wizard 5-70DB (UX Starter)', blade: 'Wand Wizard', ratchet: '5-70', bit: 'DB', price: '18-25€', tier: 'S+', format: 'UX Starter', setName: null },
    { name: 'Buster Dran 1-60A (UX Starter)', blade: 'Buster Dran', ratchet: '1-60', bit: 'A', price: '18-22€', tier: 'A', format: 'UX Starter', setName: null },
    { name: 'Shadow Shinobi 1-80MN (UX Starter)', blade: 'Shadow Shinobi', ratchet: '1-80', bit: 'MN', price: '18-22€', tier: 'A', format: 'UX Starter', setName: null },
    { name: 'Circle Ghost 0-80GB (in UX Dual Pack)', blade: 'Circle Ghost', ratchet: '0-80', bit: 'GB', price: '25-30€', tier: 'A', format: 'UX Dual Pack', setName: 'UX Dual Pack' },
    { name: 'Soar Phoenix 9-60GF (BX Starter)', blade: 'Soar Phoenix', ratchet: '9-60', bit: 'GF', price: '15-20€', tier: 'S', format: 'BX Starter', setName: null },
    { name: 'Soar Phoenix 5-80H (BX Booster)', blade: 'Soar Phoenix', ratchet: '5-80', bit: 'H', price: '15-18€', tier: 'A', format: 'BX Booster', setName: null },
    { name: 'Sword Dran 3-60F (BX Starter)', blade: 'Sword Dran', ratchet: '3-60', bit: 'F', price: '13-16€', tier: 'A', format: 'BX Starter', setName: null },
    { name: 'Sword Dran 3-80B (in BX Dual Pack)', blade: 'Sword Dran', ratchet: '3-80', bit: 'B', price: '20-25€', tier: 'A', format: 'BX Dual Pack', setName: 'Sword Dran Dual Pack' },
    { name: 'Dran Sword 3-80B (Random Booster)', blade: 'Dran Sword', ratchet: '3-80', bit: 'B', price: '15-20€', tier: 'S', format: 'Random Booster', setName: null },
    { name: 'Shark Edge 3-60LF (Random Booster)', blade: 'Shark Edge', ratchet: '3-60', bit: 'LF', price: '15-20€', tier: 'S', format: 'Random Booster', setName: null },
    { name: 'Shark Edge 4-80N (Random Booster)', blade: 'Shark Edge', ratchet: '4-80', bit: 'N', price: '15-20€', tier: 'A', format: 'Random Booster', setName: null },
    { name: 'Knight Shield 4-60LF (Random Booster)', blade: 'Knight Shield', ratchet: '4-60', bit: 'LF', price: '15-20€', tier: 'S', format: 'Random Booster', setName: null },
    { name: 'Wizard Arrow 3-60T (Random Booster)', blade: 'Wizard Arrow', ratchet: '3-60', bit: 'T', price: '15-20€', tier: 'A', format: 'Random Booster', setName: null },
    { name: 'Scythe Fire 4-60T (BX Starter)', blade: 'Chain Scythe', ratchet: '4-60', bit: 'T', price: '13-16€', tier: 'A', format: 'BX Starter', setName: null },
    { name: 'Scythe Fire 3-80B (BX Booster)', blade: 'Chain Scythe', ratchet: '3-80', bit: 'B', price: '15-18€', tier: 'A', format: 'BX Booster', setName: null },
    { name: 'Hells Scythe 3-80B (BX varie)', blade: 'Hells Scythe', ratchet: '3-80', bit: 'B', price: '15-20€', tier: 'S+', format: 'BX', setName: null },
    { name: 'Obsidian Shell 4-60D (BX Booster)', blade: 'Obsidian Shell', ratchet: '4-60', bit: 'D', price: '15-18€', tier: 'B', format: 'BX Booster', setName: null },
    { name: 'Shelter Drake 7-80GP (BX Starter)', blade: 'Shelter Drake', ratchet: '7-80', bit: 'GP', price: '18-22€', tier: 'B', format: 'BX Starter', setName: null },
    { name: 'Dagger Dran 4-70Q (BX Booster)', blade: 'Dagger Dran', ratchet: '4-70', bit: 'Q', price: '15-18€', tier: 'B', format: 'BX Booster', setName: null },
    { name: 'Chain Fire 5-60HT (in BX Dual Pack)', blade: 'Chain Fire', ratchet: '5-60', bit: 'HT', price: '25-30€', tier: 'B', format: 'BX Dual Pack', setName: 'Chain Fire Dual Pack' },
    { name: 'Dagger Dran 4-60R (in Xtreme Battle Set)', blade: 'Dagger Dran', ratchet: '4-60', bit: 'R', price: '30-35€', tier: 'A', format: 'Battle Set', setName: 'Xtreme Battle Set (include stadio)' },
    { name: 'Tusk Mammoth 3-60T (in Xtreme Battle Set)', blade: 'Tusk Mammoth', ratchet: '3-60', bit: 'T', price: '30-35€', tier: 'B', format: 'Battle Set', setName: 'Xtreme Battle Set (include stadio)' },
    { name: 'Beat Tyranno 4-70Q (in Dual Pack)', blade: 'Beat Tyranno', ratchet: '4-70', bit: 'Q', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Beat Tyranno + Knife Shinobi' },
    { name: 'Knife Shinobi 4-80HN (in Dual Pack)', blade: 'Knife Shinobi', ratchet: '4-80', bit: 'HN', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Beat Tyranno + Knife Shinobi' },
    { name: 'Tackle Goat 2-70N (in Dual Pack)', blade: 'Tackle Goat', ratchet: '2-70', bit: 'N', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Tackle Goat + Gale Wyvern' },
    { name: 'Gale Wyvern 3-60T (in Dual Pack)', blade: 'Gale Wyvern', ratchet: '3-60', bit: 'T', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Tackle Goat + Gale Wyvern' },
    { name: 'Dark Perseus B 6-80W (CX Starter)', blade: 'Dark Perseus B', ratchet: '6-80', bit: 'W', price: '25-30€', tier: 'A', format: 'CX Starter', setName: null },
    { name: 'Reaper Fire T 4-70K (CX Starter)', blade: 'Reaper Fire T', ratchet: '4-70', bit: 'K', price: '25-30€', tier: 'B', format: 'CX Starter', setName: null },
    { name: 'Fox Blush J 9-70GR (CX Random)', blade: 'Fox Blush J', ratchet: '9-70', bit: 'GR', price: '20-25€', tier: 'A', format: 'CX Random', setName: null },
    { name: 'Sting Unicorn 4-60P', blade: 'Sting Unicorn', ratchet: '4-60', bit: 'P', price: '15-20€', tier: 'A', format: 'Vari formati', setName: null }
  ];

  // Database tipologie Beyblade
  const beybladeTypes = {
    blades: {
      // Attack (Attacco) - 🔵
      'Soar Phoenix': 'Attack',
      'Dran Sword': 'Attack',
      'Shark Edge': 'Attack',
      'Knight Shield': 'Attack',
      'Dagger Dran': 'Attack',
      'Sting Unicorn': 'Attack',

      // Defense (Difesa) - 🟢
      'Wizard Rod': 'Defense',
      'Wand Wizard': 'Defense',
      'Wizard Arrow': 'Defense',
      'Obsidian Shell': 'Defense',
      'Shelter Drake': 'Defense',

      // Stamina (Resistenza) - 🟠
      'Chain Scythe': 'Stamina',
      'Hells Scythe': 'Stamina',
      'Chain Fire': 'Stamina',
      'Reaper Fire T': 'Stamina',

      // Balance (Bilanciato) - 🔴
      'Sword Dran': 'Balance',
      'Buster Dran': 'Balance',
      'Shadow Shinobi': 'Balance',
      'Knife Shinobi': 'Balance',
      'Circle Ghost': 'Balance',
      'Beat Tyranno': 'Balance',
      'Tackle Goat': 'Balance',
      'Gale Wyvern': 'Balance',
      'Dark Perseus B': 'Balance',
      'Fox Blush J': 'Balance',
      'Tusk Mammoth': 'Balance'
    },

    ratchets: {
      // Attack (bassi e leggeri) - 🔵
      '3-60': 'Attack',
      '4-60': 'Attack',
      '5-60': 'Attack',
      '9-60': 'Attack',
      '1-60': 'Attack',

      // Defense (alti e pesanti) - 🟢
      '5-80': 'Defense',
      '6-80': 'Defense',
      '7-80': 'Defense',
      '4-80': 'Defense',
      '3-80': 'Defense',
      '1-80': 'Defense',
      '0-80': 'Defense',

      // Stamina (medi) - 🟠
      '5-70': 'Stamina',
      '4-70': 'Stamina',
      '2-70': 'Stamina',
      '9-70': 'Stamina'
    },

    bits: {
      // Attack - 🔵
      'F': 'Attack',
      'LF': 'Attack',
      'GF': 'Attack',
      'A': 'Attack',
      'Q': 'Attack',
      'K': 'Attack',

      // Defense - 🟢
      'B': 'Defense',
      'DB': 'Defense',
      'GB': 'Defense',
      'D': 'Defense',
      'HN': 'Defense',

      // Stamina - 🟠
      'P': 'Stamina',
      'GP': 'Stamina',
      'T': 'Stamina',
      'HT': 'Stamina',
      'W': 'Stamina',
      'N': 'Stamina',
      'MN': 'Stamina',

      // Balance - 🔴
      'R': 'Balance',
      'GR': 'Balance',
      'H': 'Balance'
    }
  };

  // Carica i build salvati all'avvio
  useEffect(() => {
    loadSavedBuilds();
  }, []);

  // Funzioni per il database con storage fallback
  const loadSavedBuilds = async () => {
    try {
      setIsLoading(true);
      const builds = [];

      // Try window.storage first (Claude.ai environment), fallback to localStorage
      if (window.storage && typeof window.storage.list === 'function') {
        const keys = await window.storage.list();
        const beybladeKeys = keys.filter(k => k.key.startsWith('beyblade:'));

        for (const keyObj of beybladeKeys) {
          const result = await window.storage.get(keyObj.key);
          if (result && result.value) {
            builds.push(JSON.parse(result.value));
          }
        }
      } else {
        // Fallback to localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('beyblade:')) {
            const value = localStorage.getItem(key);
            if (value) {
              builds.push(JSON.parse(value));
            }
          }
        }
      }

      setSavedBuilds(builds.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.log('Nessun build salvato ancora');
      setSavedBuilds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBuild = async () => {
    if (!saveName.trim()) {
      showToast('⚠️ Inserisci un nome per il tuo build prima di salvare!', 'error');
      return;
    }

    const build = {
      id: `beyblade:${Date.now()}`,
      name: saveName.trim(),
      mode: mode,
      team: team,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('it-IT')
    };

    try {
      // Try window.storage first (Claude.ai environment), fallback to localStorage
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set(build.id, JSON.stringify(build));
      } else {
        localStorage.setItem(build.id, JSON.stringify(build));
      }

      await loadSavedBuilds();
      showToast(`✅ Build "${saveName.trim()}" salvato con successo!`, 'success');
      setSaveName('');
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      showToast('❌ Errore nel salvataggio del build', 'error');
    }
  };

  const deleteBuild = async (buildId) => {
    showConfirm(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questo build?',
      async () => {
        try {
          // Try window.storage first (Claude.ai environment), fallback to localStorage
          if (window.storage && typeof window.storage.delete === 'function') {
            await window.storage.delete(buildId);
          } else {
            localStorage.removeItem(buildId);
          }

          await loadSavedBuilds();
          showToast('✅ Build eliminato!', 'success');
        } catch (error) {
          console.error('Errore nell\'eliminazione:', error);
          showToast('❌ Errore nell\'eliminazione del build', 'error');
        }
      }
    );
  };

  const loadBuild = (build) => {
    setMode(build.mode);
    setTeam(build.team);
    setSaveName(build.name); // Carica anche il nome
    setShowLibrary(false);
  };

  // Funzioni per gestire i prodotti personalizzati
  const addCustomProduct = async () => {
    if (!newProduct.name || !newProduct.blade || !newProduct.ratchet || !newProduct.bit) {
      showToast('⚠️ Compila tutti i campi del prodotto prima di aggiungerlo!', 'error');
      return;
    }

    const product = {
      ...newProduct,
      format: 'Personalizzato',
      setName: null,
      provides: []
    };

    const updatedProducts = [...customProducts, product];
    setCustomProducts(updatedProducts);

    // Reset form
    setNewProduct({
      name: '',
      blade: '',
      ratchet: '',
      bit: '',
      price: '',
      tier: 'A'
    });

    // Salva nel storage
    try {
      // Try window.storage first (Claude.ai environment), fallback to localStorage
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set('customProducts', JSON.stringify(updatedProducts));
      } else {
        localStorage.setItem('customProducts', JSON.stringify(updatedProducts));
      }

      showToast('✅ Prodotto aggiunto con successo!', 'success');
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      showToast('❌ Errore nel salvataggio del prodotto', 'error');
    }
  };

  const removeCustomProduct = async (index) => {
    showConfirm(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questo prodotto personalizzato?',
      async () => {
        const updatedProducts = customProducts.filter((_, idx) => idx !== index);
        setCustomProducts(updatedProducts);

        // Aggiorna storage
        try {
          // Try window.storage first (Claude.ai environment), fallback to localStorage
          if (window.storage && typeof window.storage.set === 'function') {
            await window.storage.set('customProducts', JSON.stringify(updatedProducts));
          } else {
            localStorage.setItem('customProducts', JSON.stringify(updatedProducts));
          }

          showToast('✅ Prodotto eliminato!', 'success');
        } catch (error) {
          console.error('Errore nell\'eliminazione:', error);
          showToast('❌ Errore nell\'eliminazione del prodotto', 'error');
        }
      }
    );
  };

  // Carica i prodotti personalizzati all'avvio
  useEffect(() => {
    const loadCustomProducts = async () => {
      try {
        let savedProducts = null;

        // Try window.storage first (Claude.ai environment), fallback to localStorage
        if (window.storage && typeof window.storage.get === 'function') {
          const result = await window.storage.get('customProducts');
          if (result && result.value) {
            savedProducts = JSON.parse(result.value);
          }
        } else {
          const localData = localStorage.getItem('customProducts');
          if (localData) {
            savedProducts = JSON.parse(localData);
          }
        }

        if (savedProducts) {
          setCustomProducts(savedProducts);
        }
      } catch (error) {
        console.log('Nessun prodotto personalizzato salvato');
        setCustomProducts([]);
      }
    };

    loadCustomProducts();
  }, []);

  // Carica i rating all'avvio
  useEffect(() => {
    const loadRatings = async () => {
      try {
        let savedRatings = null;

        // Try window.storage first (Claude.ai environment), fallback to localStorage
        if (window.storage && typeof window.storage.get === 'function') {
          const result = await window.storage.get('beyblade-ratings');
          if (result && result.value) {
            savedRatings = JSON.parse(result.value);
          }
        } else {
          const localData = localStorage.getItem('beyblade-ratings');
          if (localData) {
            savedRatings = JSON.parse(localData);
          }
        }

        if (savedRatings) {
          setRatings(savedRatings);
        }
      } catch (error) {
        console.log('Nessun rating salvato');
        setRatings({ blade: {}, ratchet: {}, bit: {} });
      }
    };

    loadRatings();
  }, []);

  // Funzioni per gestire i rating
  const saveRating = async (type, item, rating, notes) => {
    try {
      const newRatings = {
        ...ratings,
        [type]: {
          ...ratings[type],
          [item]: { rating, notes: notes || '' }
        }
      };
      setRatings(newRatings);

      // Try window.storage first (Claude.ai environment), fallback to localStorage
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set('beyblade-ratings', JSON.stringify(newRatings));
      } else {
        localStorage.setItem('beyblade-ratings', JSON.stringify(newRatings));
      }

      showToast('✅ Rating salvato con successo!', 'success');
    } catch (error) {
      console.error('Errore nel salvataggio del rating:', error);
      showToast('❌ Errore nel salvataggio del rating', 'error');
    }
  };

  const exportRatings = () => {
    const dataStr = JSON.stringify(ratings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'beyblade-ratings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRatings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedRatings = JSON.parse(e.target.result);
          setRatings(importedRatings);

          // Try window.storage first (Claude.ai environment), fallback to localStorage
          if (window.storage && typeof window.storage.set === 'function') {
            await window.storage.set('beyblade-ratings', JSON.stringify(importedRatings));
          } else {
            localStorage.setItem('beyblade-ratings', JSON.stringify(importedRatings));
          }

          showToast('✅ Rating importati con successo!', 'success');
        } catch (error) {
          showToast('❌ Errore nell\'importazione dei rating', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Dati combinati che includono quelli personalizzati
  const combinedData = useMemo(() => {
    const customBlades = [...new Set(customProducts.map(p => p.blade).filter(Boolean))];
    const customRatchets = [...new Set(customProducts.map(p => p.ratchet).filter(Boolean))];
    const customBits = [...new Set(customProducts.map(p => p.bit).filter(Boolean))];

    return {
      blades: [...new Set([...beybladeData.blades, ...customBlades])].sort(),
      ratchets: [...new Set([...beybladeData.ratchets, ...customRatchets])].sort(),
      bits: [...new Set([...beybladeData.bits, ...customBits])].sort()
    };
  }, [customProducts]);

  const usedParts = useMemo(() => {
    const used = { blades: new Set(), ratchets: new Set(), bits: new Set() };
    team.forEach(bey => {
      if (bey.blade) used.blades.add(bey.blade);
      if (bey.ratchet) used.ratchets.add(bey.ratchet);
      if (bey.bit) used.bits.add(bey.bit);
    });
    return used;
  }, [team]);

  const handlePartChange = (index, part, value) => {
    const newTeam = [...team];
    newTeam[index][part] = value;
    setTeam(newTeam);
  };

  const isPartUsed = (part, value, currentIndex, partType) => {
    return team.some((bey, idx) => idx !== currentIndex && bey[partType] === value);
  };

  const resetTeam = () => {
    if (mode === 'single') {
      setTeam([{ blade: '', ratchet: '', bit: '' }]);
    } else {
      setTeam([
        { blade: '', ratchet: '', bit: '' },
        { blade: '', ratchet: '', bit: '' },
        { blade: '', ratchet: '', bit: '' }
      ]);
    }
  };

  const backToMenu = () => {
    setMode(null);
    setSaveName(''); // Reset nome
    setTeam([
      { blade: '', ratchet: '', bit: '' },
      { blade: '', ratchet: '', bit: '' },
      { blade: '', ratchet: '', bit: '' }
    ]);
  };

  const startMode = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'single') {
      setTeam([{ blade: '', ratchet: '', bit: '' }]);
    } else {
      setTeam([
        { blade: '', ratchet: '', bit: '' },
        { blade: '', ratchet: '', bit: '' },
        { blade: '', ratchet: '', bit: '' }
      ]);
    }
  };

  const isTeamComplete = team.every(bey => bey.blade && bey.ratchet && bey.bit);

  const calculateNeededProducts = () => {
    const needed = {
      blades: new Set(team.filter(b => b.blade).map(b => b.blade)),
      ratchets: new Set(team.filter(b => b.ratchet).map(b => b.ratchet)),
      bits: new Set(team.filter(b => b.bit).map(b => b.bit))
    };

    if (needed.blades.size === 0) return [];

    const selected = [];
    const covered = { blades: new Set(), ratchets: new Set(), bits: new Set() };

    while (
      covered.blades.size < needed.blades.size ||
      covered.ratchets.size < needed.ratchets.size ||
      covered.bits.size < needed.bits.size
    ) {
      let bestProduct = null;
      let bestScore = -1;

      for (const product of [...products, ...customProducts]) {
        let score = 0;
        const wouldCoverBlades = needed.blades.has(product.blade) && !covered.blades.has(product.blade);
        const wouldCoverRatchets = needed.ratchets.has(product.ratchet) && !covered.ratchets.has(product.ratchet);
        const wouldCoverBits = needed.bits.has(product.bit) && !covered.bits.has(product.bit);

        if (wouldCoverBlades) score += 100;
        if (wouldCoverRatchets) score += 10;
        if (wouldCoverBits) score += 1;

        const tierBonus = { 'S+': 0.3, 'S': 0.2, 'A': 0.1, 'B': 0 }[product.tier] || 0;
        score += tierBonus;

        if (score > bestScore && score > 0) {
          bestScore = score;
          bestProduct = product;
        }
      }

      if (!bestProduct) break;

      selected.push(bestProduct);
      if (needed.blades.has(bestProduct.blade)) covered.blades.add(bestProduct.blade);
      if (needed.ratchets.has(bestProduct.ratchet)) covered.ratchets.add(bestProduct.ratchet);
      if (needed.bits.has(bestProduct.bit)) covered.bits.add(bestProduct.bit);
    }

    return selected.map(product => {
      const provides = [];
      if (needed.blades.has(product.blade)) provides.push(`Blade: ${product.blade}`);
      if (needed.ratchets.has(product.ratchet)) provides.push(`Ratchet: ${product.ratchet}`);
      if (needed.bits.has(product.bit)) provides.push(`Bit: ${product.bit}`);
      return { ...product, provides };
    });
  };

  const getTierColor = (tier) => {
    const colors = {
      'S+': 'text-red-600 font-bold',
      'S': 'text-orange-600 font-bold',
      'A': 'text-yellow-600 font-semibold',
      'B': 'text-green-600'
    };
    return colors[tier] || 'text-gray-600';
  };

  // Componente StarRating
  const StarRating = ({ rating, onChange, size = 20 }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-colors hover:scale-110"
          >
            <Star
              size={size}
              className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
              fill={star <= rating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  // Funzione per ottenere il rating di un pezzo
  const getItemRating = (type, item) => {
    return ratings[type][item] || null;
  };

  // Funzione per visualizzare le stelle in formato testo
  const getStarsText = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Funzione per calcolare il rating medio di un Beyblade
  const calculateAverageRating = (bey) => {
    const ratings_list = [];

    if (bey.blade && ratings.blade[bey.blade]) {
      ratings_list.push(ratings.blade[bey.blade].rating);
    }
    if (bey.ratchet && ratings.ratchet[bey.ratchet]) {
      ratings_list.push(ratings.ratchet[bey.ratchet].rating);
    }
    if (bey.bit && ratings.bit[bey.bit]) {
      ratings_list.push(ratings.bit[bey.bit].rating);
    }

    if (ratings_list.length === 0) return 0;

    const sum = ratings_list.reduce((a, b) => a + b, 0);
    return sum / ratings_list.length;
  };

  // Ottiene la tipologia di un pezzo
  const getPartType = (partType, partName) => {
    if (beybladeTypes[partType + 's']?.[partName]) {
      return beybladeTypes[partType + 's'][partName];
    }

    const customProduct = customProducts.find(p => p[partType] === partName);
    if (customProduct?.types?.[partType]) {
      return customProduct.types[partType];
    }

    return 'Balance';
  };

  // Ottiene il colore CSS per la tipologia (aggiornato con colori ufficiali)
  const getTypeColor = (type) => {
    const colors = {
      'Attack': 'text-blue-600',      // Blu
      'Defense': 'text-green-600',    // Verde
      'Stamina': 'text-orange-600',   // Arancione
      'Balance': 'text-red-600'       // Rosso
    };
    return colors[type] || 'text-gray-600';
  };

  // Ottiene il colore di sfondo per badge
  const getTypeBgColor = (type) => {
    const colors = {
      'Attack': 'bg-blue-100 border-blue-300',
      'Defense': 'bg-green-100 border-green-300',
      'Stamina': 'bg-orange-100 border-orange-300',
      'Balance': 'bg-red-100 border-red-300'
    };
    return colors[type] || 'bg-gray-100 border-gray-300';
  };

  // Calcola la tipologia predominante del Beyblade
  const calculateBeybladeType = (bey) => {
    if (!bey.blade || !bey.ratchet || !bey.bit) return null;

    const types = [
      getPartType('blade', bey.blade),
      getPartType('ratchet', bey.ratchet),
      getPartType('bit', bey.bit)
    ];

    const typeCounts = {};
    types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    let maxCount = 0;
    let predominantType = 'Balance';

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        predominantType = type;
      }
    });

    if (maxCount === 1) {
      predominantType = 'Balance';
    }

    return predominantType;
  };

  // Funzioni per Toast e Confirm Dialog
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (title, message, onConfirm, onCancel = null) => {
    setConfirmDialog({
      title,
      message,
      onConfirm,
      onCancel: onCancel || (() => setConfirmDialog(null))
    });
  };

  // Componente RatingItem
  const RatingItem = ({ item, type, currentRating, onSave, getStarsText }) => {
    const [tempRating, setTempRating] = useState(currentRating?.rating || 0);
    const [tempNotes, setTempNotes] = useState(currentRating?.notes || '');

    return (
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">{item}</h3>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating:</label>
              <StarRating
                rating={tempRating}
                onChange={setTempRating}
                size={24}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note (opzionale):</label>
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Inserisci note o commenti su questo pezzo..."
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                rows="2"
              />
            </div>

            {currentRating && (
              <div className="text-sm text-gray-600 mb-2">
                <p>Rating attuale: {getStarsText(currentRating.rating)} ({currentRating.rating}/5)</p>
                {currentRating.notes && <p>Note: {currentRating.notes}</p>}
              </div>
            )}
          </div>

          <button
            onClick={() => onSave(type, item, tempRating, tempNotes)}
            className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            💾 Salva
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Libreria Build Salvati */}
        {showLibrary && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen size={28} />
                  📚 I Miei Build
                </h2>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Caricamento...</p>
                  </div>
                ) : savedBuilds.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600 text-lg">Nessun build salvato ancora</p>
                    <p className="text-gray-500 text-sm mt-2">Crea un Beyblade e salvalo per vederlo qui!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {savedBuilds.map((build) => (
                      <div key={build.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-300 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-indigo-900 mb-1">{build.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                                {build.mode === 'single' ? '🎯 Singolo' : '🏆 Team 3on3'}
                              </span>
                              <span className="text-gray-500">📅 {build.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => loadBuild(build)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Carica
                            </button>
                            <button
                              onClick={() => deleteBuild(build.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {build.team.map((bey, idx) => (
                            bey.blade && (
                              <div key={idx} className="bg-white rounded-lg p-3 border border-indigo-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">
                                      {build.mode === 'team' && `#${idx + 1}: `}
                                      <span className="text-indigo-700 flex items-center gap-1">
                                        {bey.blade}
                                        <TypeIcon type={getPartType('blade', bey.blade)} size={12} />
                                      </span>
                                      <span className="text-gray-600 flex items-center gap-1">
                                        {' '}{bey.ratchet}
                                        <TypeIcon type={getPartType('ratchet', bey.ratchet)} size={12} />
                                      </span>
                                      <span className="text-purple-600 flex items-center gap-1">
                                        {' '}{bey.bit}
                                        <TypeIcon type={getPartType('bit', bey.bit)} size={12} />
                                      </span>
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 ml-2">
                                    {/* Tipologia Predominante */}
                                    {calculateBeybladeType(bey) && (
                                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeBgColor(calculateBeybladeType(bey))} ${getTypeColor(calculateBeybladeType(bey))}`}>
                                        <TypeIcon type={calculateBeybladeType(bey)} size={10} />
                                        {calculateBeybladeType(bey)}
                                      </div>
                                    )}

                                    {/* Rating Medio */}
                                    {calculateAverageRating(bey) > 0 && (
                                      <div className="flex items-center gap-1">
                                        {[...Array(Math.round(calculateAverageRating(bey)))].map((_, i) => (
                                          <Star
                                            key={i}
                                            size={12}
                                            className="text-yellow-500"
                                            fill="currentColor"
                                          />
                                        ))}
                                        <span className="text-xs text-gray-600">
                                          ({calculateAverageRating(bey).toFixed(1)})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Dettaglio Rating per pezzo */}
                                {(ratings.blade[bey.blade] || ratings.ratchet[bey.ratchet] || ratings.bit[bey.bit]) && (
                                  <div className="mt-2 pt-2 border-t border-gray-200 grid grid-cols-3 gap-2 text-xs">
                                    {ratings.blade[bey.blade] && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-500">🗡️</span>
                                        {[...Array(ratings.blade[bey.blade].rating)].map((_, i) => (
                                          <Star key={i} size={8} className="text-yellow-500" fill="currentColor" />
                                        ))}
                                      </div>
                                    )}
                                    {ratings.ratchet[bey.ratchet] && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-500">⚙️</span>
                                        {[...Array(ratings.ratchet[bey.ratchet].rating)].map((_, i) => (
                                          <Star key={i} size={8} className="text-yellow-500" fill="currentColor" />
                                        ))}
                                      </div>
                                    )}
                                    {ratings.bit[bey.bit] && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-500">🎯</span>
                                        {[...Array(ratings.bit[bey.bit].rating)].map((_, i) => (
                                          <Star key={i} size={8} className="text-yellow-500" fill="currentColor" />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gestione Database */}
        {showDatabase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package size={28} />
                  🗃️ Gestione Database Prodotti
                </h2>
                <button
                  onClick={() => setShowDatabase(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Form Aggiungi Prodotto */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      ➕ Aggiungi Nuovo Prodotto
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">🗡️ Blade (Nome principale)</label>
                        <input
                          type="text"
                          value={newProduct.blade}
                          onChange={(e) => {
                            const bladeName = e.target.value;
                            setNewProduct({
                              ...newProduct,
                              blade: bladeName,
                              name: bladeName ? `${bladeName} (Prodotto Personalizzato)` : ''
                            });
                          }}
                          placeholder="es: Lightning Dragoon, Phoenix Nova, Storm Tiger..."
                          className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">💡 Il nome della blade diventerà automaticamente il nome del prodotto</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">📦 Nome Prodotto (Auto-generato)</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Viene generato automaticamente dal nome blade"
                          className="w-full p-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">🔄 Puoi modificare manualmente se necessario</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">⚙️ Ratchet</label>
                          <input
                            type="text"
                            value={newProduct.ratchet}
                            onChange={(e) => setNewProduct({...newProduct, ratchet: e.target.value})}
                            placeholder="es: 5-70, 3-80, 9-60..."
                            className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">🎯 Bit</label>
                          <input
                            type="text"
                            value={newProduct.bit}
                            onChange={(e) => setNewProduct({...newProduct, bit: e.target.value})}
                            placeholder="es: DB, GF, A, B..."
                            className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">💰 Prezzo</label>
                          <input
                            type="text"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="es: 25-30€"
                            className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">⭐ Tier</label>
                          <select
                            value={newProduct.tier}
                            onChange={(e) => setNewProduct({...newProduct, tier: e.target.value})}
                            className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="S+">S+</option>
                            <option value="S">S</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={addCustomProduct}
                        disabled={!newProduct.name || !newProduct.blade || !newProduct.ratchet || !newProduct.bit}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        ➕ Aggiungi Prodotto
                      </button>
                    </div>
                  </div>

                  {/* Lista Prodotti Personalizzati */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-300">
                    <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                      📋 Prodotti Personalizzati ({customProducts.length})
                    </h3>

                    {customProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto mb-3 text-gray-400" size={48} />
                        <p className="text-gray-600">Nessun prodotto personalizzato ancora</p>
                        <p className="text-gray-500 text-sm mt-2">Aggiungi nuovi prodotti per espandere il database!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {customProducts.map((product, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800">{product.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <span className={`font-bold ${getTierColor(product.tier)}`}>
                                    Tier {product.tier}
                                  </span>
                                  <span>•</span>
                                  <span>{product.price}</span>
                                </div>
                                <div className="text-sm text-gray-700 mt-2">
                                  <span className="text-indigo-700 font-semibold">{product.blade}</span>
                                  <span className="text-gray-600"> {product.ratchet}</span>
                                  <span className="text-purple-600"> {product.bit}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeCustomProduct(idx)}
                                className="ml-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                    <div className="text-sm">
                      <p className="font-bold text-yellow-800 mb-1">💡 INFORMAZIONI:</p>
                      <p className="text-yellow-700">
                        I prodotti personalizzati verranno salvati nel tuo browser e inclusi nel carrello quando cerchi i pezzi per i tuoi Beyblade.
                        Questi prodotti sono visibili solo a te su questo dispositivo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dialog Salvataggio */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Save size={24} />
                Salva Build
              </h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Nome del build (es: Team Competitivo #1)"
                className="w-full p-3 border-2 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && saveBuild()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={saveBuild}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                >
                  💾 Salva
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Database Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-yellow-500 to-amber-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Star size={28} />
                  ⭐ Rating Database Accessori
                </h2>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b bg-gray-50">
                {['blade', 'ratchet', 'bit'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRatingTab(tab)}
                    className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                      ratingTab === tab
                        ? 'bg-yellow-500 text-white border-b-2 border-yellow-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'blade' ? '🗡️ Blade' : tab === 'ratchet' ? '⚙️ Ratchet' : '🎯 Bit'}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Export/Import Controls */}
                <div className="flex gap-3 mb-6 justify-center">
                  <button
                    onClick={exportRatings}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Package size={18} />
                    Esporta Rating
                  </button>
                  <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-2">
                    <Upload size={18} />
                    Importa Rating
                    <input
                      type="file"
                      accept=".json"
                      onChange={importRatings}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Rating Content */}
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {combinedData[ratingTab + 's'].map((item) => {
                    const currentRating = getItemRating(ratingTab, item);

                    return (
                      <RatingItem
                        key={item}
                        item={item}
                        type={ratingTab}
                        currentRating={currentRating}
                        onSave={saveRating}
                        getStarsText={getStarsText}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Iniziale */}
        {mode === null && (
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                🎮 Beyblade X Builder
              </h1>
              <p className="text-xl text-gray-600">Scegli la modalità</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => startMode('single')}
                className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h2 className="text-3xl font-bold mb-3">Beyblade Singolo</h2>
                  <p className="text-blue-100 mb-4">
                    Crea 1 Beyblade personalizzato
                  </p>
                  <div className="bg-white/20 rounded-lg p-3 text-sm">
                    ✨ Perfetto per testare combo specifiche
                  </div>
                </div>
              </button>

              <button
                onClick={() => startMode('team')}
                className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-bold mb-3">Team 3on3</h2>
                  <p className="text-purple-100 mb-4">
                    Crea un team di 3 Beyblade
                  </p>
                  <div className="bg-white/20 rounded-lg p-3 text-sm">
                    🎯 Regole tornei - Nessun pezzo duplicato
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setShowLibrary(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <BookOpen size={24} />
                📚 I Miei Build ({savedBuilds.length})
              </button>
              <button
                onClick={() => setShowDatabase(true)}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <Package size={24} />
                🗃️ Gestione Database
              </button>
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <Star size={24} />
                ⭐ Rating Database
              </button>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
            </div>
          </div>
        )}

        {/* Builder */}
        {mode !== null && (
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                🎮 Beyblade X {mode === 'single' ? 'Builder' : 'Team Builder 3on3'}
              </h1>
              <p className="text-gray-600">
                {mode === 'single' 
                  ? 'Crea il tuo Beyblade personalizzato!' 
                  : 'Crea il tuo team seguendo le regole dei tornei - Nessun pezzo duplicato!'}
              </p>
            </div>

            {mode === 'team' && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                  <div className="text-sm">
                    <p className="font-bold text-yellow-800 mb-1">⚠️ REGOLA DEI TORNEI 3on3:</p>
                    <p className="text-yellow-700">I 3 Beyblade NON possono condividere gli stessi pezzi. Ogni Blade, Ratchet e Bit può essere usato UNA SOLA VOLTA nel team!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campo Nome Build */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-4 mb-6">
              <label className="block text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
                <Save size={18} />
                📝 Nome del Build
              </label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Dai un nome al tuo build (es: Team Competitivo #1, Attacco Veloce, ecc.)"
                className="w-full p-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              />
              <p className="text-xs text-gray-600 mt-2">
                💡 Dai un nome memorabile al tuo build per ritrovarlo facilmente!
              </p>
            </div>

            {/* Team Builder */}
            <div className={`grid ${mode === 'single' ? 'max-w-md mx-auto' : 'md:grid-cols-3'} gap-4 mb-6`}>
              {team.map((bey, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-300">
                  <h3 className="font-bold text-lg mb-3 text-indigo-900">
                    {mode === 'single' ? 'Il tuo Beyblade' : `Beyblade #${index + 1}`}
                  </h3>
                  
                  {/* Blade */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                        🗡️ Blade
                        {bey.blade && (
                          <TypeIcon type={getPartType('blade', bey.blade)} size={16} />
                        )}
                      </label>
                      {bey.blade && ratings.blade[bey.blade] && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < ratings.blade[bey.blade].rating ? 'text-yellow-500' : 'text-gray-300'}
                              fill={i < ratings.blade[bey.blade].rating ? 'currentColor' : 'none'}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            ({ratings.blade[bey.blade].rating}/5)
                          </span>
                        </div>
                      )}
                      {bey.blade && ratings.blade[bey.blade]?.rating === 5 && (
                        <span className="inline-block ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          🏆 TOP TIER
                        </span>
                      )}
                    </div>
                    <select
                      value={bey.blade}
                      onChange={(e) => handlePartChange(index, 'blade', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Seleziona Blade</option>
                      {combinedData.blades.map(blade => {
                        const used = mode === 'team' && isPartUsed('blade', blade, index, 'blade');
                        const isCustom = customProducts.some(p => p.blade === blade);
                        const rating = getItemRating('blade', blade);
                        const type = getPartType('blade', blade);
                        return (
                          <option key={blade} value={blade} disabled={used}>
                            {blade} {isCustom ? '🎨' : ''} {rating ? `${getStarsText(rating.rating)} (${rating.rating}/5)` : ''} {type && `(${type})`} {used ? '❌ (Già usata)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {bey.blade && ratings.blade[bey.blade]?.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        💭 {ratings.blade[bey.blade].notes}
                      </p>
                    )}
                    {bey.blade && (
                      <p className={`text-xs mt-1 font-medium ${getTypeColor(getPartType('blade', bey.blade))}`}>
                        Tipo: {getPartType('blade', bey.blade)}
                      </p>
                    )}
                    {mode === 'team' && bey.blade && isPartUsed('blade', bey.blade, index, 'blade') && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Questa Blade è già usata!</p>
                    )}
                  </div>

                  {/* Ratchet */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                        ⚙️ Ratchet
                        {bey.ratchet && (
                          <TypeIcon type={getPartType('ratchet', bey.ratchet)} size={16} />
                        )}
                      </label>
                      {bey.ratchet && ratings.ratchet[bey.ratchet] && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < ratings.ratchet[bey.ratchet].rating ? 'text-yellow-500' : 'text-gray-300'}
                              fill={i < ratings.ratchet[bey.ratchet].rating ? 'currentColor' : 'none'}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            ({ratings.ratchet[bey.ratchet].rating}/5)
                          </span>
                        </div>
                      )}
                      {bey.ratchet && ratings.ratchet[bey.ratchet]?.rating === 5 && (
                        <span className="inline-block ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          🏆 TOP TIER
                        </span>
                      )}
                    </div>
                    <select
                      value={bey.ratchet}
                      onChange={(e) => handlePartChange(index, 'ratchet', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Seleziona Ratchet</option>
                      {combinedData.ratchets.map(ratchet => {
                        const used = mode === 'team' && isPartUsed('ratchet', ratchet, index, 'ratchet');
                        const isCustom = customProducts.some(p => p.ratchet === ratchet);
                        const rating = getItemRating('ratchet', ratchet);
                        const type = getPartType('ratchet', ratchet);
                        return (
                          <option key={ratchet} value={ratchet} disabled={used}>
                            {ratchet} {isCustom ? '🎨' : ''} {rating ? `${getStarsText(rating.rating)} (${rating.rating}/5)` : ''} {type && `(${type})`} {used ? '❌ (Già usato)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {bey.ratchet && ratings.ratchet[bey.ratchet]?.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        💭 {ratings.ratchet[bey.ratchet].notes}
                      </p>
                    )}
                    {bey.ratchet && (
                      <p className={`text-xs mt-1 font-medium ${getTypeColor(getPartType('ratchet', bey.ratchet))}`}>
                        Tipo: {getPartType('ratchet', bey.ratchet)}
                      </p>
                    )}
                    {mode === 'team' && bey.ratchet && isPartUsed('ratchet', bey.ratchet, index, 'ratchet') && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Questo Ratchet è già usato!</p>
                    )}
                  </div>

                  {/* Bit */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                        🎯 Bit
                        {bey.bit && (
                          <TypeIcon type={getPartType('bit', bey.bit)} size={16} />
                        )}
                      </label>
                      {bey.bit && ratings.bit[bey.bit] && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < ratings.bit[bey.bit].rating ? 'text-yellow-500' : 'text-gray-300'}
                              fill={i < ratings.bit[bey.bit].rating ? 'currentColor' : 'none'}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            ({ratings.bit[bey.bit].rating}/5)
                          </span>
                        </div>
                      )}
                      {bey.bit && ratings.bit[bey.bit]?.rating === 5 && (
                        <span className="inline-block ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          🏆 TOP TIER
                        </span>
                      )}
                    </div>
                    <select
                      value={bey.bit}
                      onChange={(e) => handlePartChange(index, 'bit', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Seleziona Bit</option>
                      {combinedData.bits.map(bit => {
                        const used = mode === 'team' && isPartUsed('bit', bit, index, 'bit');
                        const isCustom = customProducts.some(p => p.bit === bit);
                        const rating = getItemRating('bit', bit);
                        const type = getPartType('bit', bit);
                        return (
                          <option key={bit} value={bit} disabled={used}>
                            {bit} {isCustom ? '🎨' : ''} {rating ? `${getStarsText(rating.rating)} (${rating.rating}/5)` : ''} {type && `(${type})`} {used ? '❌ (Già usato)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {bey.bit && ratings.bit[bey.bit]?.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        💭 {ratings.bit[bey.bit].notes}
                      </p>
                    )}
                    {bey.bit && (
                      <p className={`text-xs mt-1 font-medium ${getTypeColor(getPartType('bit', bey.bit))}`}>
                        Tipo: {getPartType('bit', bey.bit)}
                      </p>
                    )}
                    {mode === 'team' && bey.bit && isPartUsed('bit', bey.bit, index, 'bit') && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Questo Bit è già usato!</p>
                    )}
                  </div>

                  {/* Recap */}
                  {bey.blade && bey.ratchet && bey.bit && (
                    <div className="mt-3 p-3 bg-green-100 border border-green-400 rounded-lg">
                      <p className="text-xs font-bold text-green-800 flex items-center gap-1 mb-2">
                        <Check size={14} /> Beyblade Completato
                      </p>
                      <div className="space-y-1 text-xs">
                        {/* Blade */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 flex items-center gap-1">
                            🗡️ <strong>{bey.blade}</strong>
                            <TypeIcon type={getPartType('blade', bey.blade)} size={12} />
                          </span>
                          {ratings.blade[bey.blade] && (
                            <div className="flex items-center gap-1">
                              {[...Array(ratings.blade[bey.blade].rating)].map((_, i) => (
                                <Star key={i} size={10} className="text-yellow-500" fill="currentColor" />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Ratchet */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 flex items-center gap-1">
                            ⚙️ <strong>{bey.ratchet}</strong>
                            <TypeIcon type={getPartType('ratchet', bey.ratchet)} size={12} />
                          </span>
                          {ratings.ratchet[bey.ratchet] && (
                            <div className="flex items-center gap-1">
                              {[...Array(ratings.ratchet[bey.ratchet].rating)].map((_, i) => (
                                <Star key={i} size={10} className="text-yellow-500" fill="currentColor" />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bit */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 flex items-center gap-1">
                            🎯 <strong>{bey.bit}</strong>
                            <TypeIcon type={getPartType('bit', bey.bit)} size={12} />
                          </span>
                          {ratings.bit[bey.bit] && (
                            <div className="flex items-center gap-1">
                              {[...Array(ratings.bit[bey.bit].rating)].map((_, i) => (
                                <Star key={i} size={10} className="text-yellow-500" fill="currentColor" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tipologia Predominante */}
                      {calculateBeybladeType(bey) && (
                        <div className="mt-2 pt-2 border-t border-green-300 flex items-center justify-center gap-2">
                          <span className="text-xs text-green-700 font-semibold">Tipo:</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeBgColor(calculateBeybladeType(bey))} ${getTypeColor(calculateBeybladeType(bey))}`}>
                            <TypeIcon type={calculateBeybladeType(bey)} size={12} />
                            {calculateBeybladeType(bey)}
                          </div>
                        </div>
                      )}

                      {/* Rating Medio */}
                      {calculateAverageRating(bey) > 0 && (
                        <div className="mt-2 pt-2 border-t border-green-300">
                          <p className="text-xs text-green-700 font-semibold text-center">
                            ⭐ Rating Medio: {calculateAverageRating(bey).toFixed(1)}/5
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={backToMenu}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Menu
              </button>
              <button
                onClick={resetTeam}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={18} />
                Reset
              </button>
              {isTeamComplete && (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold ml-auto animate-pulse"
                >
                  <Save size={18} />
                  💾 Salva Build
                </button>
              )}
            </div>

            {/* Shopping List */}
            {isTeamComplete && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <ShoppingCart size={28} />
                  🛒 Prodotti da Acquistare {mode === 'team' && '(Combinazione Ottimale)'}
                </h2>
                
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Package className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div className="text-sm">
                      <p className="font-bold text-blue-800 mb-1">💡 {mode === 'single' ? 'Opzioni disponibili:' : 'Algoritmo Ottimizzato:'}</p>
                      <p className="text-blue-700">
                        {mode === 'single' 
                          ? 'Questi prodotti contengono i pezzi che hai selezionato. Puoi scegliere quello più conveniente!'
                          : 'Questo è il numero MINIMO di prodotti necessari per ottenere TUTTI i pezzi del tuo team. Comprando questi prodotti, potrai mixare i loro componenti per ricreare le 3 combo esatte!'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {calculateNeededProducts().map((product, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                          {product.setName && (
                            <p className="text-xs text-purple-600 font-semibold mt-1 bg-purple-50 inline-block px-2 py-1 rounded">
                              📦 Set: {product.setName}
                            </p>
                          )}
                          <div className="text-sm text-gray-600 mt-2">
                            <p className="font-semibold text-green-700 mb-1">✅ Ti fornisce:</p>
                            {product.provides.map((p, i) => {
                              let pieceType = '';
                              let pieceName = '';

                              if (p.startsWith('Blade: ')) {
                                pieceType = 'blade';
                                pieceName = p.replace('Blade: ', '');
                              } else if (p.startsWith('Ratchet: ')) {
                                pieceType = 'ratchet';
                                pieceName = p.replace('Ratchet: ', '');
                              } else if (p.startsWith('Bit: ')) {
                                pieceType = 'bit';
                                pieceName = p.replace('Bit: ', '');
                              }

                              const rating = pieceType ? getItemRating(pieceType, pieceName) : null;

                              return (
                                <div key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mt-1">
                                  <span>{p}</span>
                                  {rating && (
                                    <div className="text-xs text-yellow-600 mt-1">
                                      Rating: {getStarsText(rating.rating)} ({rating.rating}/5)
                                      {rating.notes && <p className="text-gray-500 text-xs">{rating.notes}</p>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {product.format === 'Personalizzato' && (
                            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-semibold mb-1">
                              🎨 Personalizzato
                            </span>
                          )}
                          <div className={`text-sm font-bold ${getTierColor(product.tier)}`}>
                            Tier {product.tier}
                          </div>
                          <p className="text-lg font-bold text-green-600">{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>📝 Nota:</strong> Ogni prodotto contiene 1 Blade + 1 Ratchet + 1 Bit. 
                    {mode === 'team' && ' Puoi smontarli e ricombinarli liberamente per creare le tue 3 combo personalizzate!'}
                  </p>
                </div>
              </div>
            )}

            {!isTeamComplete && (
              <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  {mode === 'single' 
                    ? 'Completa il tuo Beyblade per vedere i prodotti disponibili 🎯'
                    : 'Completa tutti e 3 i Beyblade per vedere i prodotti da acquistare 🎯'}
                </p>
              </div>
            )}
          </div>
        )}

        {mode !== null && (
          <div className="text-center text-white/80 text-sm">
            <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-white/60 text-xs px-4 pb-4">
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span>© 2025 Beyblade X Team Builder</span>
            <span>•</span>
            <span>Tutti i diritti riservati</span>
            <span>•</span>
            <span>Creato con ❤️ da Francesco Ronca</span>
            <button
              onClick={() => setShowInfo(true)}
              className="underline hover:text-white/80 transition-colors ml-1"
            >
              ℹ️
            </button>
          </p>
        </div>

        {/* Modal Informazioni */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  ℹ️ Informazioni su Beyblade X Team Builder
                </h2>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Intestazione */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    🎮 Beyblade X Team Builder
                  </h3>
                  <p className="text-gray-600">Versione 1.0.0</p>
                </div>

                {/* Sviluppo e Copyright */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-300">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">👨‍💻 Sviluppo e Copyright</h4>
                  <p className="text-gray-700 mb-2">
                    <strong>Creato con:</strong> ❤️ da Francesco Ronca
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Anno:</strong> 2025
                  </p>
                  <p className="text-gray-700">
                    <strong>Licenza:</strong> Tutti i diritti riservati
                  </p>
                </div>

                {/* Tecnologie */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                  <h4 className="font-bold text-green-900 mb-3 text-lg">⚙️ Tecnologie</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">React 18</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">Vite</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">Tailwind CSS</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">Lucide Icons</span>
                  </div>
                </div>

                {/* Disclaimer e Informazioni */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300">
                  <h4 className="font-bold text-yellow-900 mb-3 text-lg">⚠️ Disclaimer e Informazioni</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Beyblade X™</strong> è un marchio registrato di Takara Tomy.
                      Questa applicazione è un progetto <strong>non ufficiale</strong> creato da fan per fan.
                    </p>
                    <p>
                      I dati sui prodotti e i prezzi sono <strong>puramente indicativi</strong> e basati su informazioni disponibili al Novembre 2025.
                      I prezzi possono variare in base al rivenditore e alla disponibilità.
                    </p>
                    <p>
                      Le regole dei tornei si basano sulle linee guida <strong>WBO (World Beyblade Organization)</strong> e <strong>B4</strong>,
                      ma sono soggette a modifiche da parte degli organizzatori ufficiali.
                    </p>
                  </div>
                </div>

                {/* Ringraziamenti */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300">
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">🙏 Ringraziamenti</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      Un ringraziamento speciale a tutta la <strong>community Beyblade X</strong> per il supporto
                      e per condividere strategie e informazioni sui tornei.
                    </p>
                    <p>
                      Grazie a <strong>WBO</strong> per mantenere vive le regole competitive
                      e a tutti i <strong>Blader</strong> che rendono questo sport così avvincente!
                    </p>
                  </div>
                </div>

                {/* Footer Modale */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>© 2025 Francesco Ronca - Tutti i diritti riservati</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Beyblade X Team Builder non è affiliato con Takara Tomy
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        {toast && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-pulse ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
          }`}>
            {toast.type === 'success' && <Check size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {/* Confirm Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {confirmDialog.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {confirmDialog.message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDialog.onCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Conferma
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeybladeTeamBuilder;