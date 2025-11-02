import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Check, ShoppingCart, Trash2, Package, Save, BookOpen, Upload, X, Star, Star as StarEmpty, Archive, Calculator, FileSpreadsheet, Download, BarChart3, Menu } from 'lucide-react';

// Import dei nuovi sistemi
import { DatabaseUtils, OfficialDatabaseManager, CollectionManager } from './utils/databaseManager.js';
import MyCollection from './components/MyCollection.jsx';
import ShoppingOptimizer from './components/ShoppingOptimizer.jsx';
import StatisticsDashboard from './components/StatisticsDashboard.jsx';

// Mobile components e hooks
import { useMobileDetection } from './hooks/useMobileDetection';
import { usePerformanceOptimization } from './hooks/usePerformanceOptimization';
import MobileMenu from './components/MobileMenu.jsx';
import { useOwnedComponents } from './hooks/useUnifiedDatabase.js';
import { beybladeTypes, getComponentType, getTypeColor, getTypeBgColor } from './data/beybladeTypes.js';
import Papa from 'papaparse';
import { validateDatabase, productsToCsvRows, generateCsvTemplate } from './data/databaseSchema.js';

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
  // Stati UI
  const [mode, setMode] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAdminMode, setShowAdminMode] = useState(false);

  // Mobile states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentMobileView, setCurrentMobileView] = useState('menu');

  // Stati dati
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customProducts, setCustomProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [ratings, setRatings] = useState({ blade: {}, ratchet: {}, bit: {} });
  const [ratingTab, setRatingTab] = useState('blade');

  // Hook per componenti posseduti (sistema unificato)
  const { ownedComponents, checkOwnership, loading: ownedLoading } = useOwnedComponents();

  // Mobile hooks
  const { isMobile, isTablet, screenSize, orientation } = useMobileDetection();
  const { isLowPerformance, debounce } = usePerformanceOptimization();
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [adminModeEnabled, setAdminModeEnabled] = useState(false);

  // CSV Import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importPreview, setImportPreview] = useState({
    data: [],
    errors: [],
    warnings: [],
    isValid: false,
    validating: false,
    stats: { totalRows: 0, validRows: 0 }
  });
  const [importingCSV, setImportingCSV] = useState(false);

  // Form per aggiungere prodotto
  const [newProduct, setNewProduct] = useState({
    name: '',
    blade: '',
    ratchet: '',
    bit: '',
    price: '',
    tier: 'A'
  });

  // Team configuration
  const [team, setTeam] = useState([
    { blade: '', ratchet: '', bit: '' },
    { blade: '', ratchet: '', bit: '' },
    { blade: '', ratchet: '', bit: '' }
  ]);

  // Stati per sistema CSV
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importedData, setImportedData] = useState(null);
  const [importValidation, setImportValidation] = useState(null);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Caricamento dati iniziali
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Carica tutti i dati in parallelo
      const [products, saved, custom, ratingsData] = await Promise.all([
        DatabaseUtils.getAllProducts(),
        loadSavedBuilds(),
        loadCustomProducts(),
        loadRatings()
      ]);

      setAllProducts(products);
      setSavedBuilds(saved);
      setCustomProducts(custom);
      setRatings(ratingsData);

    } catch (error) {
      console.error('Errore caricamento dati iniziali:', error);
      showToast('❌ Errore nel caricamento dei dati', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Carica i build salvati
  const loadSavedBuilds = async () => {
    try {
      const builds = [];

      // Try window.storage first, fallback to localStorage
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

      return builds.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.log('Nessun build salvato ancora');
      return [];
    }
  };

  // Carica prodotti personalizzati
  const loadCustomProducts = async () => {
    try {
      if (window.storage && typeof window.storage.get === 'function') {
        const result = await window.storage.get('customProducts');
        return result?.value ? JSON.parse(result.value) : [];
      } else {
        const localData = localStorage.getItem('customProducts');
        return localData ? JSON.parse(localData) : [];
      }
    } catch (error) {
      console.log('Nessun prodotto personalizzato salvato');
      return [];
    }
  };

  // Carica i rating
  const loadRatings = async () => {
    try {
      if (window.storage && typeof window.storage.get === 'function') {
        const result = await window.storage.get('beyblade-ratings');
        return result?.value ? JSON.parse(result.value) : { blade: {}, ratchet: {}, bit: {} };
      } else {
        const localData = localStorage.getItem('beyblade-ratings');
        return localData ? JSON.parse(localData) : { blade: {}, ratchet: {}, bit: {} };
      }
    } catch (error) {
      console.log('Nessun rating salvato');
      return { blade: {}, ratchet: {}, bit: {} };
    }
  };

  // Dati combinati per i dropdown
  const combinedData = useMemo(() => {
    const customBlades = [...new Set(customProducts.map(p => p.blade).filter(Boolean))];
    const customRatchets = [...new Set(customProducts.map(p => p.ratchet).filter(Boolean))];
    const customBits = [...new Set(customProducts.map(p => p.bit).filter(Boolean))];

    // Estrai componenti dai prodotti ufficiali
    const officialComponents = allProducts
      .filter(p => p.source === 'official')
      .reduce((acc, product) => {
        if (product.blade?.name) acc.blades.add(product.blade.name);
        if (product.ratchet?.name) acc.ratchets.add(product.ratchet.name);
        if (product.bit?.name) acc.bits.add(product.bit.name);
        return acc;
      }, { blades: new Set(), ratchets: new Set(), bits: new Set() });

    return {
      blades: [...new Set([...officialComponents.blades, ...customBlades])].sort(),
      ratchets: [...new Set([...officialComponents.ratchets, ...customRatchets])].sort(),
      bits: [...new Set([...officialComponents.bits, ...customBits])].sort()
    };
  }, [allProducts, customProducts]);

  // Il database beybladeTypes è ora importato da './data/beybladeTypes.js'

  // Funzioni per salvataggio build
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
      // Try window.storage first, fallback to localStorage
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set(build.id, JSON.stringify(build));
      } else {
        localStorage.setItem(build.id, JSON.stringify(build));
      }

      const updatedBuilds = await loadSavedBuilds();
      setSavedBuilds(updatedBuilds);
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
          // Try window.storage first, fallback to localStorage
          if (window.storage && typeof window.storage.delete === 'function') {
            await window.storage.delete(buildId);
          } else {
            localStorage.removeItem(buildId);
          }

          const updatedBuilds = await loadSavedBuilds();
          setSavedBuilds(updatedBuilds);
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
    setSaveName(build.name);
    setShowLibrary(false);
  };

  // Funzioni per gestione prodotti personalizzati
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

  // Funzione Export Collection (solo Excel)
  const exportCollection = async () => {
    try {
      const { CollectionManager } = await import('./utils/databaseManager.js');
      const data = await CollectionManager.exportCollection();

      if (data.length === 0) {
        showToast('⚠️ Nessun prodotto da esportare', 'warning');
        return;
      }

      const ownedCount = data.filter(row => row['POSSEDUTO?'] === 'YES').length;
      const totalCount = data.length;

      // Importa XLSX dinamicamente
      const XLSX = await import('xlsx');

      // Crea workbook
      const wb = XLSX.utils.book_new();

      // Converti dati in worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Imposta larghezza colonne perfette per database completo con rating
      const colWidths = [
        { wch: 8 },   // #
        { wch: 40 },  // NOME PRODOTTO
        { wch: 20 },  // BLADE
        { wch: 20 },  // RATCHET
        { wch: 12 },  // BIT
        { wch: 8 },   // TIER
        { wch: 12 },  // PREZZO
        { wch: 20 },  // FORMATO
        { wch: 12 },  // POSSEDUTO?
        { wch: 12 },  // RATING BLADE
        { wch: 30 },  // NOTE BLADE
        { wch: 14 },  // RATING RATCHET
        { wch: 30 },  // NOTE RATCHET
        { wch: 10 },  // RATING BIT
        { wch: 30 }   // NOTE BIT
      ];
      ws['!cols'] = colWidths;

      // Aggiungi worksheet al workbook
      XLSX.utils.book_append_sheet(wb, ws, "Collezione Beyblade");

      // Scrivi file
      XLSX.writeFile(wb, `beyblade-collection-${new Date().toISOString().split('T')[0]}.xlsx`);

      showToast(`📊 Export Excel completato! ${totalCount} prodotti totali (${ownedCount} posseduti)`, 'success');
    } catch (error) {
      console.error('Errore esportazione collezione Excel:', error);
      showToast('❌ Errore esportazione collezione Excel', 'error');
    }
  };

  const importCollection = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Importa XLSX dinamicamente
      const XLSX = await import('xlsx');

      // Leggi il file Excel
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        showToast('⚠️ Il file Excel è vuoto', 'warning');
        return;
      }

      showToast('🔄 Analisi file Excel in corso...', 'info');

      // Calcola statistiche prima dell'importazione
      const markedProducts = data.filter(row =>
        row['POSSEDUTO?'] === 'YES' || row.owned === 'YES'
      ).length;

      const { CollectionManager } = await import('./utils/databaseManager.js');

      // Ottieni statistiche della collezione attuale
      const currentStats = await CollectionManager.getStats();
      const currentCount = currentStats.owned;

      // Esegui l'importazione
      await CollectionManager.importCollection(data);

      // Ottieni nuove statistiche
      const newStats = await CollectionManager.getStats();
      const newCount = newStats.owned;
      const addedCount = newCount - currentCount;

      // Feedback dettagliato con statistiche rating
      const totalRatings = data.filter(row =>
        row['RATING BLADE'] || row['RATING RATCHET'] || row['RATING BIT']
      ).length;

      let message = `✅ Import completato! `;

      if (addedCount > 0) {
        message += `${addedCount} nuovi prodotti aggiunti. `;
      } else {
        message += `Nessun nuovo prodotto aggiunto. `;
      }

      message += `${totalRatings} rating importati. Totale: ${newCount} prodotti.`;

      showToast(message, addedCount > 0 ? 'success' : 'info');
    } catch (error) {
      console.error('Errore importazione collezione Excel:', error);
      showToast('❌ Errore importazione collezione Excel', 'error');
    }

    // Reset input file
    event.target.value = '';
  };

  // Funzioni per gestione rating
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

      // Try window.storage first, fallback to localStorage
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

          // Try window.storage first, fallback to localStorage
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

  // Funzioni team builder
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
    setSaveName('');
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

  // Admin mode handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+Shift+A (or Cmd+Shift+A on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminModeEnabled(!adminModeEnabled);
        showToast(adminModeEnabled ? 'Modalità Admin disattivata' : '🔧 Modalità Admin attivata', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [adminModeEnabled]);

  // Funzioni di utilità
  const getTierColor = (tier) => {
    const colors = {
      'S+': 'text-red-600 font-bold',
      'S': 'text-orange-600 font-bold',
      'A': 'text-yellow-600 font-semibold',
      'B': 'text-green-600'
    };
    return colors[tier] || 'text-gray-600';
  };

  const showConfirm = (title, message, onConfirm, onCancel = null) => {
    setConfirmDialog({
      title,
      message,
      onConfirm,
      onCancel: onCancel || (() => setConfirmDialog(null))
    });
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

  // Wrapper per getComponentType che gestisce anche prodotti personalizzati
  const getPartType = (partType, partName) => {
    // Prima prova con il database ufficiale
    const officialType = getComponentType(partType, partName);
    if (officialType !== 'Balance' || partType === undefined || partName === undefined) {
      return officialType;
    }

    // Controlla se è un prodotto personalizzato
    const customProduct = customProducts.find(p => p[partType] === partName);
    if (customProduct?.types?.[partType]) {
      return customProduct.types[partType];
    }

    return 'Balance';
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

  /**
   * Funzioni CSV per gestione database
   */
  const handleExportCSV = async () => {
    try {
      showToast('📤 Preparando export CSV...', 'info');

      // Carica database attuale
      const db = await OfficialDatabaseManager.load();

      // Converti in formato CSV
      const csvRows = productsToCsvRows(db.products);

      // Genera CSV con Papa Parse
      const csv = Papa.unparse(csvRows, {
        header: true,
        columns: [
          'id', 'name',
          'blade_name', 'blade_type',
          'ratchet_name', 'ratchet_type',
          'bit_name', 'bit_type',
          'price', 'tier', 'format',
          'set_name', 'release_date', 'status'
        ]
      });

      // Download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `beyblade-database-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`✅ Database esportato! ${db.products.length} prodotti scaricati`, 'success');
    } catch (error) {
      console.error('Errore export CSV:', error);
      showToast('❌ Errore durante l\'export CSV', 'error');
    }
  };

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      showToast('📥 Leggendo file CSV...', 'info');

      // Leggi file
      const text = await file.text();

      // Parse CSV
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: async (results) => {
          try {
            if (results.errors.length > 0) {
              showToast(`❌ Errore lettura CSV: ${results.errors[0].message}`, 'error');
              return;
            }

            // Converti righe CSV in formato database
            const products = results.data
              .map((row, index) => {
                // Usa la funzione dal databaseSchema
                const beybladeTypes = {
                  blades: {
                    'Soar Phoenix': 'Attack',
                    'Dran Sword': 'Attack',
                    'Shark Edge': 'Attack',
                    'Knight Shield': 'Attack',
                    'Dagger Dran': 'Attack',
                    'Sting Unicorn': 'Attack',
                    'Wizard Rod': 'Defense',
                    'Wand Wizard': 'Defense',
                    'Wizard Arrow': 'Defense',
                    'Obsidian Shell': 'Defense',
                    'Shelter Drake': 'Defense',
                    'Chain Scythe': 'Stamina',
                    'Hells Scythe': 'Stamina',
                    'Chain Fire': 'Stamina',
                    'Reaper Fire T': 'Stamina',
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
                    '3-60': 'Attack', '4-60': 'Attack', '5-60': 'Attack',
                    '9-60': 'Attack', '1-60': 'Attack',
                    '5-80': 'Defense', '6-80': 'Defense', '7-80': 'Defense',
                    '4-80': 'Defense', '3-80': 'Defense', '1-80': 'Defense',
                    '0-80': 'Defense',
                    '5-70': 'Stamina', '4-70': 'Stamina', '2-70': 'Stamina',
                    '9-70': 'Stamina'
                  },
                  bits: {
                    'F': 'Attack', 'LF': 'Attack', 'GF': 'Attack',
                    'A': 'Attack', 'Q': 'Attack', 'K': 'Attack',
                    'B': 'Defense', 'DB': 'Defense', 'GB': 'Defense',
                    'D': 'Defense', 'HN': 'Defense',
                    'P': 'Stamina', 'GP': 'Stamina', 'T': 'Stamina',
                    'HT': 'Stamina', 'W': 'Stamina', 'N': 'Stamina',
                    'MN': 'Stamina',
                    'R': 'Balance', 'GR': 'Balance', 'H': 'Balance'
                  }
                };

                // Skip empty rows
                if (!row || Object.keys(row).length === 0) {
                  return null;
                }

                // Validate required fields
                if (!row.id || !row.name || !row.blade_name) {
                  return null;
                }

                // Clean and validate tier
                const tiers = ['S+', 'S', 'A', 'B'];
                let tier = row.tier?.trim();
                if (tier && !tiers.includes(tier)) {
                  tier = 'A';
                }

                // Clean and validate type fields
                const normalizeType = (type) => {
                  if (!type) return 'Balance';
                  const cleaned = type.trim();
                  return ['Attack', 'Defense', 'Stamina', 'Balance'].includes(cleaned) ? cleaned : 'Balance';
                };

                // Clean price
                const cleanPrice = (price) => {
                  if (!price) return '0-0€';
                  const cleaned = price.trim();
                  return /^\d+-\d+€/.test(cleaned) ? cleaned : '0-0€';
                };

                // Clean release date
                const cleanReleaseDate = (date) => {
                  if (!date) return '2025-01';
                  const cleaned = date.trim();
                  return /^\d{4}-\d{2}$/.test(cleaned) ? cleaned : '2025-01';
                };

                // Clean status
                const cleanStatus = (status) => {
                  if (!status) return 'active';
                  const cleaned = status.trim();
                  return ['active', 'discontinued', 'upcoming'].includes(cleaned) ? cleaned : 'active';
                };

                return {
                  id: row.id.trim(),
                  name: row.name.trim(),
                  blade: {
                    name: row.blade_name.trim(),
                    type: beybladeTypes.blades[row.blade_name.trim()] || normalizeType(row.blade_type)
                  },
                  ratchet: {
                    name: row.ratchet_name.trim(),
                    type: beybladeTypes.ratchets[row.ratchet_name.trim()] || normalizeType(row.ratchet_type)
                  },
                  bit: {
                    name: row.bit_name.trim(),
                    type: beybladeTypes.bits[row.bit_name.trim()] || normalizeType(row.bit_type)
                  },
                  price: cleanPrice(row.price),
                  tier: tier || 'A',
                  format: row.format?.trim() || 'UX Booster',
                  setName: row.set_name?.trim() || null,
                  releaseDate: cleanReleaseDate(row.release_date),
                  status: cleanStatus(row.status)
                };
              })
              .filter(Boolean); // Rimuovi righe null

            if (products.length === 0) {
              showToast('❌ Nessun prodotto valido trovato nel CSV', 'error');
              return;
            }

            // Crea database temporaneo
            const tempDatabase = {
              metadata: {
                version: '1.0.0',
                lastUpdate: new Date().toISOString().split('T')[0],
                totalProducts: products.length,
                description: 'Database importato da CSV',
                formats: [...new Set(products.map(p => p.format))],
                tiers: ['S+', 'S', 'A', 'B']
              },
              products
            };

            // Valida database
            const validation = validateDatabase(tempDatabase);

            // Mostra anteprima
            setImportedData(tempDatabase);
            setImportValidation(validation);
            setShowImportPreview(true);

          } catch (error) {
            showToast(`❌ Errore conversione CSV: ${error.message}`, 'error');
          }
        },
        error: (error) => {
          showToast(`❌ Errore lettura CSV: ${error.message}`, 'error');
        }
      });

      // Reset input file
      event.target.value = '';

    } catch (error) {
      console.error('Errore import CSV:', error);
      showToast('❌ Errore durante l\'import CSV', 'error');
    }
  };

  const confirmImport = async () => {
    if (!importedData || !importValidation) return;

    // Se ci sono errori critici, blocca
    if (!importValidation.valid) {
      showToast('❌ Impossibile importare: il database contiene errori critici', 'error');
      return;
    }

    try {
      showToast('💾 Salvando database...', 'info');

      // Salva database
      await OfficialDatabaseManager.update(importedData);

      // Invalida cache e ricarica dati
      if (window.UnifiedDB) {
        window.UnifiedDB.invalidateCache();
      }

      // Ricarica dati
      await loadInitialData();

      // Chiudi anteprima
      setShowImportPreview(false);
      setImportedData(null);
      setImportValidation(null);

      showToast(`✅ Database aggiornato! ${importedData.products.length} prodotti importati`, 'success');

    } catch (error) {
      console.error('Errore salvataggio database:', error);
      showToast('❌ Errore durante il salvataggio', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    try {
      const template = generateCsvTemplate();

      const csv = Papa.unparse(template, { header: true });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'beyblade-template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('✅ Template CSV scaricato!', 'success');
    } catch (error) {
      console.error('Errore download template:', error);
      showToast('❌ Errore durante il download del template', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* MyCollection Modal */}
        {showCollection && (
          <MyCollection onClose={() => setShowCollection(false)} />
        )}

        {/* ShoppingOptimizer Modal */}
        {showOptimizer && (
          <ShoppingOptimizer
            team={team}
            onClose={() => setShowOptimizer(false)}
          />
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <MobileMenu
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            currentView={currentMobileView}
            setCurrentView={(view) => {
              setCurrentMobileView(view);
              // Chiudi sempre il menu mobile quando si naviga
              setShowMobileMenu(false);

              if (view === 'library') setShowLibrary(true);
              else if (view === 'collection') setShowCollection(true);
              else if (view === 'statistics') setShowStatistics(true);
              else if (view === 'database') setShowDatabase(true);
              else if (view === 'rating') setShowRatingModal(true);
              else if (view === 'menu') {
                setMode(null);
              }
            }}
            savedBuildsCount={savedBuilds.length}
          />
        )}

        {/* StatisticsDashboard Modal */}
        {showStatistics && (
          <StatisticsDashboard
            setCurrentView={(view) => {
              setShowStatistics(false);
              if (view === 'collection') setShowCollection(true);
            }}
          />
        )}

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

                {/* Sezione Export/Import Collezione */}
                <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-300">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <Archive size={24} />
                    📦 Gestione Collezione
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        <Download size={18} />
                        Export Database Excel
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Esporta TUTTI i prodotti del database in un file Excel perfettamente formattato. Colonne già larghe e pronte per la modifica.
                      </p>
                      <div className="text-xs text-green-600 mb-3 bg-green-50 p-3 rounded">
                        ✅ <strong>Database Completo (16 colonne):</strong><br/>
                        • Colonne 1-9: Dati prodotti + possesso<br/>
                        • Colonne 10-15: Rating (1-5) e note (Blade/Ratchet/Bit)<br/>
                        • Sistema: Inserisci numero → Conversione automatica in stelle ⭐<br/>
                        • Semplice: Solo numeri da 1 a 5, niente formati complessi
                      </div>
                      <button
                        onClick={exportCollection}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                        title="Esporta database in Excel perfettamente formattato"
                      >
                        <Download size={16} />
                        Export Database Completo (.xlsx)
                      </button>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        <Upload size={18} />
                        Import Collezione (Excel)
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Importa un file Excel modificato. Verranno importati sia i prodotti posseduti che i rating dei componenti.
                      </p>
                      <div className="text-xs text-blue-600 mb-3 bg-blue-50 p-3 rounded">
                        📝 <strong>Come Inserire Rating in Excel:</strong><br/>
                        1. Export Excel → Modifica le colonne rating<br/>
                        2. Nelle colonne "RATING BLADE/RATCHET/BIT" inserisci:<br/>
                        &nbsp;&nbsp;• 5 = ⭐⭐⭐⭐⭐ (Eccellente)<br/>
                        &nbsp;&nbsp;• 4 = ⭐⭐⭐⭐ (Molto buono)<br/>
                        &nbsp;&nbsp;• 3 = ⭐⭐⭐ (Buono)<br/>
                        &nbsp;&nbsp;• 2 = ⭐⭐ (Discreto)<br/>
                        &nbsp;&nbsp;• 1 = ⭐ (Scarso)<br/>
                        &nbsp;&nbsp;• Lascia vuoto = Nessun rating<br/>
                        3. Import qui: sistema converte automaticamente in stelle<br/>
                        ✅ Solo numeri da 1 a 5, niente formati complessi
                      </div>
                      <label className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-semibold">
                        <Upload size={16} />
                        Import Excel (.xlsx)
                        <input
                          type="file"
                          accept=".xlsx"
                          onChange={importCollection}
                          className="hidden"
                        />
                      </label>
                    </div>
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

            <div className="mt-8 max-w-6xl mx-auto">
              {/* Mobile Menu Button */}
              {isMobile && (
                <div className="fixed top-4 right-4 z-30">
                  <button
                    onClick={() => setShowMobileMenu(true)}
                    className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors active:scale-95"
                    aria-label="Apri menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Desktop Menu - Solo per schermi grandi */}
              {!isMobile && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <button
                  onClick={() => setShowLibrary(true)}
                  className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col items-center justify-center gap-2"
                >
                  <BookOpen size={28} />
                  <span className="text-center">📚 I Miei Build</span>
                  <span className="text-sm opacity-90">({savedBuilds.length})</span>
                </button>
                <button
                  onClick={() => setShowDatabase(true)}
                  className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col items-center justify-center gap-2"
                >
                  <Package size={28} />
                  <span className="text-center">🗃️ Gestione</span>
                  <span className="text-sm opacity-90">Database</span>
                </button>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col items-center justify-center gap-2"
                >
                  <Star size={28} />
                  <span className="text-center">⭐ Rating</span>
                  <span className="text-sm opacity-90">Database</span>
                </button>
                <button
                  onClick={() => setShowCollection(true)}
                  className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col items-center justify-center gap-2"
                >
                  <Archive size={28} />
                  <span className="text-center">📦 La Mia</span>
                  <span className="text-sm opacity-90">Collezione</span>
                </button>
                <button
                  onClick={() => setShowStatistics(true)}
                  className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col items-center justify-center gap-2"
                >
                  <BarChart3 size={28} />
                  <span className="text-center">📊</span>
                  <span className="text-sm opacity-90">Statistiche</span>
                </button>
                {adminModeEnabled && (
                  <button
                    onClick={() => setShowAdminMode(true)}
                    className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col items-center justify-center gap-2 animate-pulse lg:col-span-4"
                  >
                    <Calculator size={28} />
                    <span className="text-center">🔧 Admin Mode</span>
                    <span className="text-sm opacity-90">Gestione Avanzata</span>
                  </button>
                )}
              </div>
              )} {/* Fine desktop menu */}
            </div>

              {/* Pulsanti CSV in Admin Mode */}
              {adminModeEnabled && (
                <div className="mt-4 space-y-2">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-4">
                    <h4 className="font-bold text-orange-900 mb-3 text-center flex items-center gap-2">
                      <FileSpreadsheet size={20} />
                      📊 Gestione Database CSV
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Export CSV */}
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md text-sm"
                        title="Scarica database in formato CSV"
                      >
                        <Download size={16} />
                        📥 Esporta CSV
                      </button>

                      {/* Import CSV */}
                      <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-semibold shadow-md text-sm">
                        <Upload size={16} />
                        📤 Importa CSV
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleImportCSV}
                          className="hidden"
                        />
                      </label>

                      {/* Template CSV */}
                      <button
                        onClick={handleDownloadTemplate}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md text-sm"
                        title="Scarica template CSV con esempi"
                      >
                        <FileSpreadsheet size={16} />
                        📋 Template
                      </button>
                    </div>

                    {/* Info Box */}
                    <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800 leading-relaxed text-center">
                        💡 <strong>Exporta il database corrente</strong> → Modifica con Excel → Importa le modifiche
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pulsanti CSV in Admin Mode */}
              {adminModeEnabled && (
                <div className="mt-4 space-y-2">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-4">
                    <h4 className="font-bold text-orange-900 mb-3 text-center flex items-center gap-2">
                      <FileSpreadsheet size={20} />
                      📊 Gestione Database CSV
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Export CSV */}
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md text-sm"
                        title="Esporta database in formato CSV"
                      >
                        <Download size={16} />
                        📤 Export CSV
                      </button>

                      {/* Import CSV */}
                      <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-semibold shadow-md text-sm">
                        <Upload size={16} />
                        📥 Import CSV
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleImportCSV}
                          className="hidden"
                        />
                      </label>

                      {/* Template CSV */}
                      <button
                        onClick={handleDownloadTemplate}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md text-sm"
                        title="Scarica template CSV con esempi"
                      >
                        <FileSpreadsheet size={16} />
                        📋 Template
                      </button>
                    </div>

                    {/* Info Box */}
                    <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800 leading-relaxed text-center">
                        💡 <strong>Exporta il database corrente</strong> → Modifica con Excel → Importa le modifiche
                      </p>
                    </div>
                  </div>
                </div>
              )}

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
              {adminModeEnabled && (
                <p className="text-red-600 font-bold mt-2">🔧 Modalità Admin attivata</p>
              )}
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
                        const isOwned = ownedComponents?.blades?.has(blade);
                        return (
                          <option key={blade} value={blade} disabled={used}>
                            {blade} {isCustom ? '🎨' : ''} {rating ? `${getStarsText(rating.rating)} (${rating.rating}/5)` : ''} {type && `(${type})`} {isOwned ? '✅' : ''} {used ? '❌ (Già usata)' : ''}
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
                        const isOwned = ownedComponents?.ratchets?.has(ratchet);
                        return (
                          <option key={ratchet} value={ratchet} disabled={used}>
                            {ratchet} {isCustom ? '🎨' : ''} {rating ? `${getStarsText(rating.rating)} (${rating.rating}/5)` : ''} {type && `(${type})`} {isOwned ? '✅' : ''} {used ? '❌ (Già usato)' : ''}
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
                        const isOwned = ownedComponents?.bits?.has(bit);
                        return (
                          <option key={bit} value={bit} disabled={used}>
                            {bit} {isCustom ? '🎨' : ''} {rating ? `${getStarsText(rating.rating)} (${rating.rating}/5)` : ''} {type && `(${type})`} {isOwned ? '✅' : ''} {used ? '❌ (Già usato)' : ''}
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
                <>
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
                  >
                    <Save size={18} />
                    💾 Salva Build
                  </button>
                  <button
                    onClick={() => setShowOptimizer(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold"
                  >
                    <Calculator size={18} />
                    🛒 Ottimizza Acquisti
                  </button>
                </>
              )}
            </div>

            {!isTeamComplete && (
              <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  {mode === 'single'
                    ? 'Completa il tuo Beyblade per vedere le opzioni disponibili 🎯'
                    : 'Completa tutti e 3 i Beyblade per vedere le opzioni disponibili 🎯'}
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
                  <p className="text-gray-600">Versione 3.0.0 - Advanced Collection & Shopping System</p>
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
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">JSON Database</span>
                  </div>
                </div>

                {/* Nuove Funzionalità */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300">
                  <h4 className="font-bold text-yellow-900 mb-3 text-lg">🆕 Nuove Funzionalità v3.0.0</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>📦 La Mia Collezione:</strong> Gestione completa dei prodotti posseduti con filtri avanzati e statistiche dettagliate.
                    </p>
                    <p>
                      <strong>🛒 Ottimizzatore Acquisti:</strong> Algoritmo intelligente che analizza la tua collezione e suggerisce i prodotti migliori da acquistare.
                    </p>
                    <p>
                      <strong>🗃️ Database Modulare:</strong> Sistema database separato e facilmente aggiornabile con validazione schema.
                    </p>
                    <p>
                      <strong>⚡ Performance Ottimizzate:</strong> Caching intelligente e caricamento asincrono dei dati.
                    </p>
                  </div>
                </div>

                {/* Disclaimer e Informazioni */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-300">
                  <h4 className="font-bold text-red-900 mb-3 text-lg">⚠️ Disclaimer e Informazioni</h4>
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
            {toast.type === 'info' && <AlertCircle size={20} />}
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

        {/* Import Preview Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b bg-gradient-to-r from-green-500 to-emerald-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Package size={28} />
                    📋 Anteprima Importazione CSV
                  </h3>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="text-white" size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {importPreview.validating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Package className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
                      <p className="text-gray-600">Validazione file CSV...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Validation Results */}
                    <div className={`rounded-xl p-4 border-2 ${
                      importPreview.isValid
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        {importPreview.isValid ? (
                          <>
                            <CheckCircle className="text-green-600" size={20} />
                            <span className="text-green-900">Validazione Completata ✅</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="text-red-600" size={20} />
                            <span className="text-red-900">Errori di Validazione ❌</span>
                          </>
                        )}
                      </h4>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="text-sm text-gray-500">Prodotti Rilevati</div>
                          <div className="text-2xl font-bold text-gray-800">{importPreview.stats.totalRows}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="text-sm text-gray-500">Prodotti Validi</div>
                          <div className="text-2xl font-bold text-green-600">{importPreview.stats.validRows}</div>
                        </div>
                      </div>

                      {importPreview.errors.length > 0 && (
                        <div className="bg-red-100 rounded-lg p-3 max-h-40 overflow-y-auto">
                          <h5 className="font-semibold text-red-800 mb-2">Errori trovati:</h5>
                          <div className="space-y-1">
                            {importPreview.errors.slice(0, 10).map((error, index) => (
                              <div key={index} className="text-sm text-red-700">• {error}</div>
                            ))}
                            {importPreview.errors.length > 10 && (
                              <div className="text-sm text-red-600 italic">
                                ... e altri {importPreview.errors.length - 10} errori
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {importPreview.warnings.length > 0 && (
                        <div className="bg-yellow-100 rounded-lg p-3 max-h-40 overflow-y-auto">
                          <h5 className="font-semibold text-yellow-800 mb-2">Avvertimenti:</h5>
                          <div className="space-y-1">
                            {importPreview.warnings.slice(0, 5).map((warning, index) => (
                              <div key={index} className="text-sm text-yellow-700">• {warning}</div>
                            ))}
                            {importPreview.warnings.length > 5 && (
                              <div className="text-sm text-yellow-600 italic">
                                ... e altri {importPreview.warnings.length - 5} avvertimenti
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Data Preview */}
                    {importPreview.data.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye size={18} />
                          Anteprima Dati (primi 5 prodotti)
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {importPreview.data.slice(0, 5).map((product, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{product.name}</div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {product.blade?.name} ({product.blade?.type}) •
                                    {product.ratchet?.name} ({product.ratchet?.type}) •
                                    {product.bit?.name} ({product.bit?.type})
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-gray-700">{product.price}</div>
                                  <div className={`text-sm px-2 py-1 rounded-full border ${getTierColor(product.tier)}`}>
                                    Tier {product.tier}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {importPreview.data.length > 5 && (
                            <div className="text-center text-sm text-gray-500 py-2">
                              ... e altri {importPreview.data.length - 5} prodotti
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Import Actions */}
                    <div className="flex justify-between items-center bg-blue-50 rounded-xl p-4">
                      <div>
                        <h5 className="font-bold text-blue-900">Conferma Importazione</h5>
                        <p className="text-sm text-blue-700">
                          {importPreview.isValid
                            ? `Stai per importare ${importPreview.stats.validRows} prodotti validi nel database.`
                            : 'Correggi gli errori nel file CSV prima di procedere.'
                          }
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowImportModal(false)}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Annulla
                        </button>
                        <button
                          onClick={confirmImportCSV}
                          disabled={!importPreview.isValid || importingCSV}
                          className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                            importPreview.isValid && !importingCSV
                              ? 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-500'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                          }`}
                        >
                          {importingCSV ? (
                            <>
                              <Package className="inline-block animate-spin mr-2" size={18} />
                              Importazione...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="inline-block mr-2" size={18} />
                              Conferma Importazione
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeybladeTeamBuilder;