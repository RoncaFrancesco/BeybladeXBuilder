import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Check, ShoppingCart, Trash2, Package, Save, BookOpen, Upload, X, Info, Heart, Code, Shield, Settings, Plus, Edit3, Database } from 'lucide-react';

const BeybladeTeamBuilder = () => {
  const [mode, setMode] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [beybladeData, setBeybladeData] = useState({
    completeSets: [
      { id: 'wizard-rod-570-db', name: 'Wizard Rod 5-70DB', blade: 'Wizard Rod', ratchet: '5-70', bit: 'DB', price: '25-30€', tier: 'S+', format: 'UX Booster' },
      { id: 'wand-wizard-570-db', name: 'Wand Wizard 5-70DB', blade: 'Wand Wizard', ratchet: '5-70', bit: 'DB', price: '18-25€', tier: 'S+', format: 'UX Starter' },
      { id: 'buster-dran-160-a', name: 'Buster Dran 1-60A', blade: 'Buster Dran', ratchet: '1-60', bit: 'A', price: '18-22€', tier: 'A', format: 'UX Starter' },
      { id: 'shadow-shinobi-180-mn', name: 'Shadow Shinobi 1-80MN', blade: 'Shadow Shinobi', ratchet: '1-80', bit: 'MN', price: '18-22€', tier: 'A', format: 'UX Starter' },
      { id: 'circle-ghost-080-gb', name: 'Circle Ghost 0-80GB', blade: 'Circle Ghost', ratchet: '0-80', bit: 'GB', price: '25-30€', tier: 'A', format: 'UX Dual Pack', setName: 'UX Dual Pack' },
      { id: 'soar-phoenix-960-gf', name: 'Soar Phoenix 9-60GF', blade: 'Soar Phoenix', ratchet: '9-60', bit: 'GF', price: '15-20€', tier: 'S', format: 'BX Starter' },
      { id: 'soar-phoenix-580-h', name: 'Soar Phoenix 5-80H', blade: 'Soar Phoenix', ratchet: '5-80', bit: 'H', price: '15-18€', tier: 'A', format: 'BX Booster' },
      { id: 'sword-dran-360-f', name: 'Sword Dran 3-60F', blade: 'Sword Dran', ratchet: '3-60', bit: 'F', price: '13-16€', tier: 'A', format: 'BX Starter' },
      { id: 'sword-dran-380-b', name: 'Sword Dran 3-80B', blade: 'Sword Dran', ratchet: '3-80', bit: 'B', price: '20-25€', tier: 'A', format: 'BX Dual Pack', setName: 'Sword Dran Dual Pack' },
      { id: 'dran-sword-380-b', name: 'Dran Sword 3-80B', blade: 'Dran Sword', ratchet: '3-80', bit: 'B', price: '15-20€', tier: 'S', format: 'Random Booster' },
      { id: 'shark-edge-360-lf', name: 'Shark Edge 3-60LF', blade: 'Shark Edge', ratchet: '3-60', bit: 'LF', price: '15-20€', tier: 'S', format: 'Random Booster' },
      { id: 'shark-edge-480-n', name: 'Shark Edge 4-80N', blade: 'Shark Edge', ratchet: '4-80', bit: 'N', price: '15-20€', tier: 'A', format: 'Random Booster' },
      { id: 'knight-shield-360-lf', name: 'Knight Shield 3-60LF', blade: 'Knight Shield', ratchet: '3-60', bit: 'LF', price: '15-20€', tier: 'S', format: 'Random Booster' },
      { id: 'wizard-arrow-360-t', name: 'Wizard Arrow 3-60T', blade: 'Wizard Arrow', ratchet: '3-60', bit: 'T', price: '15-20€', tier: 'A', format: 'Random Booster' },
      { id: 'scythe-fire-360-t', name: 'Scythe Fire 3-60T', blade: 'Chain Scythe', ratchet: '3-60', bit: 'T', price: '13-16€', tier: 'A', format: 'BX Starter' },
      { id: 'scythe-fire-380-b', name: 'Scythe Fire 3-80B', blade: 'Chain Scythe', ratchet: '3-80', bit: 'B', price: '15-18€', tier: 'A', format: 'BX Booster' },
      { id: 'hells-scythe-380-b', name: 'Hells Scythe 3-80B', blade: 'Hells Scythe', ratchet: '3-80', bit: 'B', price: '15-20€', tier: 'S+', format: 'BX' },
      { id: 'obsidian-shell-460-d', name: 'Obsidian Shell 4-60D', blade: 'Obsidian Shell', ratchet: '4-60', bit: 'D', price: '15-18€', tier: 'B', format: 'BX Booster' },
      { id: 'shelter-drake-780-gp', name: 'Shelter Drake 7-80GP', blade: 'Shelter Drake', ratchet: '7-80', bit: 'GP', price: '18-22€', tier: 'B', format: 'BX Starter' },
      { id: 'dagger-dran-470-q', name: 'Dagger Dran 4-70Q', blade: 'Dagger Dran', ratchet: '4-70', bit: 'Q', price: '15-18€', tier: 'B', format: 'BX Booster' },
      { id: 'chain-fire-560-ht', name: 'Chain Fire 5-60HT', blade: 'Chain Fire', ratchet: '5-60', bit: 'HT', price: '25-30€', tier: 'B', format: 'BX Dual Pack', setName: 'Chain Fire Dual Pack' },
      { id: 'dagger-dran-460-r', name: 'Dagger Dran 4-60R', blade: 'Dagger Dran', ratchet: '4-60', bit: 'R', price: '30-35€', tier: 'A', format: 'Battle Set', setName: 'Xtreme Battle Set (include stadio)' },
      { id: 'tusk-mammoth-360-t', name: 'Tusk Mammoth 3-60T', blade: 'Tusk Mammoth', ratchet: '3-60', bit: 'T', price: '30-35€', tier: 'B', format: 'Battle Set', setName: 'Xtreme Battle Set (include stadio)' },
      { id: 'beat-tyranno-470-q', name: 'Beat Tyranno 4-70Q', blade: 'Beat Tyranno', ratchet: '4-70', bit: 'Q', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Beat Tyranno + Knife Shinobi' },
      { id: 'knife-shinobi-480-hn', name: 'Knife Shinobi 4-80HN', blade: 'Knife Shinobi', ratchet: '4-80', bit: 'HN', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Beat Tyranno + Knife Shinobi' },
      { id: 'tackle-goat-270-n', name: 'Tackle Goat 2-70N', blade: 'Tackle Goat', ratchet: '2-70', bit: 'N', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Tackle Goat + Gale Wyvern' },
      { id: 'gale-wyvern-360-t', name: 'Gale Wyvern 3-60T', blade: 'Gale Wyvern', ratchet: '3-60', bit: 'T', price: '20-25€', tier: 'B', format: 'Dual Pack', setName: 'Tackle Goat + Gale Wyvern' },
      { id: 'dark-perseus-b-680-w', name: 'Dark Perseus B 6-80W', blade: 'Dark Perseus B', ratchet: '6-80', bit: 'W', price: '25-30€', tier: 'A', format: 'CX Starter' },
      { id: 'reaper-fire-t-470-k', name: 'Reaper Fire T 4-70K', blade: 'Reaper Fire T', ratchet: '4-70', bit: 'K', price: '25-30€', tier: 'B', format: 'CX Starter' },
      { id: 'fox-blush-j-970-gr', name: 'Fox Blush J 9-70GR', blade: 'Fox Blush J', ratchet: '9-70', bit: 'GR', price: '20-25€', tier: 'A', format: 'CX Random' },
      { id: 'sting-unicorn-460-p', name: 'Sting Unicorn 4-60P', blade: 'Sting Unicorn', ratchet: '4-60', bit: 'P', price: '15-20€', tier: 'A', format: 'Vari formati' }
    ].sort((a, b) => a.name.localeCompare(b.name))
  });
  const [team, setTeam] = useState([
    { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' },
    { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' },
    { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' }
  ]);

  // Carica i build salvati e dati custom all'avvio
  useEffect(() => {
    loadSavedBuilds();
    loadCustomBeybladeData();
  }, []);

  // Funzioni per il database con localStorage
  const loadCustomBeybladeData = () => {
    try {
      const customData = localStorage.getItem('beybladeCustomData');
      if (customData) {
        const parsed = JSON.parse(customData);
        setBeybladeData(parsed);
        console.log('✅ Dati custom Beyblade caricati:', parsed);
      }
    } catch (error) {
      console.log('Nessun dato custom trovato, uso database di default');
    }
  };

  const saveCustomBeybladeData = (newData) => {
    try {
      localStorage.setItem('beybladeCustomData', JSON.stringify(newData));
      setBeybladeData(newData);
    } catch (error) {
      console.error('Errore nel salvataggio dati custom:', error);
    }
  };

  const loadSavedBuilds = () => {
    try {
      setIsLoading(true);
      const keys = Object.keys(localStorage).filter(k => k.startsWith('beyblade:'));
      const builds = keys.map(key => JSON.parse(localStorage.getItem(key)));
      setSavedBuilds(builds);
    } catch (error) {
      console.error('Errore nel caricamento dei build salvati:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBuild = (name, buildData) => {
    try {
      const key = `beyblade:${name}`;
      const buildWithMetadata = {
        ...buildData,
        savedAt: new Date().toISOString(),
        id: key
      };
      localStorage.setItem(key, JSON.stringify(buildWithMetadata));
      loadSavedBuilds(); // Ricarica la libreria
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio del build:', error);
      return false;
    }
  };

  const deleteBuild = (id) => {
    try {
      localStorage.removeItem(id);
      loadSavedBuilds(); // Ricarica la libreria
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione del build:', error);
      return false;
    }
  };

  const handleBeybladeSelect = (index, beybladeId) => {
    const newTeam = [...team];
    const selectedBeyblade = beybladeData.completeSets.find(b => b.id === beybladeId);

    if (selectedBeyblade) {
      newTeam[index] = {
        beybladeId: selectedBeyblade.id,
        blade: selectedBeyblade.blade,
        ratchet: selectedBeyblade.ratchet,
        bit: selectedBeyblade.bit,
        name: selectedBeyblade.name,
        price: selectedBeyblade.price
      };
    } else {
      newTeam[index] = { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' };
    }

    setTeam(newTeam);
  };

  const isBeybladeUsed = (beybladeId, currentIndex) => {
    return team.some((bey, idx) => idx !== currentIndex && bey.beybladeId === beybladeId);
  };

  const isPartUsed = (partType, value, currentIndex) => {
    return team.some((bey, idx) => idx !== currentIndex && bey[partType] === value);
  };

  const resetTeam = () => {
    if (mode === 'single') {
      setTeam([{ beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' }]);
    } else {
      setTeam([
        { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' },
        { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' },
        { beybladeId: '', blade: '', ratchet: '', bit: '', name: '', price: '' }
      ]);
    }
  };

  const backToMenu = () => {
    setMode(null);
    setSaveName('');
    resetTeam();
  };

  const startMode = (newMode) => {
    setMode(newMode);
    resetTeam();
  };

  const loadBuild = (build) => {
    setTeam(build.team);
    setSaveName(build.name.replace('beyblade:', ''));
    setMode(build.mode);
    setShowLibrary(false);
  };

  const handleSave = () => {
    if (!saveName.trim()) return;

    const buildData = {
      name: saveName,
      mode: mode,
      team: team,
      createdAt: new Date().toISOString()
    };

    if (saveBuild(saveName, buildData)) {
      setShowSaveDialog(false);
      setSaveName('');
    }
  };

  // Memoized calculations for performance
  const allParts = useMemo(() => {
    const parts = { blades: new Set(), ratchets: new Set(), bits: new Set() };
    beybladeData.completeSets.forEach(set => {
      parts.blades.add(set.blade);
      parts.ratchets.add(set.ratchet);
      parts.bits.add(set.bit);
    });
    return {
      blades: Array.from(parts.blades),
      ratchets: Array.from(parts.ratchets),
      bits: Array.from(parts.bits)
    };
  }, [beybladeData]);

  const usedParts = useMemo(() => {
    const used = { blades: new Set(), ratchets: new Set(), bits: new Set() };
    team.forEach(beyblade => {
      if (beyblade.blade) used.blades.add(beyblade.blade);
      if (beyblade.ratchet) used.ratchets.add(beyblade.ratchet);
      if (beyblade.bit) used.bits.add(beyblade.bit);
    });
    return used;
  }, [team]);

  // Shopping List Algorithm - ottimizzato per set completi
  const shoppingList = useMemo(() => {
    if (mode === 'single' || !team.every(b => b.beybladeId)) return [];

    const requiredBeyblades = team.filter(b => b.beybladeId);
    const products = beybladeData.completeSets;

    // Per i set, l'algoritmo è più semplice: prendiamo ogni Beyblade richiesto
    return requiredBeyblades.map(beyblade => ({
      name: beyblade.name,
      price: beyblade.price,
      quantity: 1,
      total: beyblade.price
    }));
  }, [mode, team, beybladeData]);

  const totalPrice = useMemo(() => {
    if (!shoppingList.length) return '0-0€';

    // Per semplicità, calcoliamo il prezzo medio
    const prices = shoppingList.map(item => {
      const match = item.total.match(/(\d+)-(\d+)€/);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        return { min, max };
      }
      const single = parseInt(item.total.match(/\d+/)?.[0] || '0');
      return { min: single, max: single };
    });

    const totalMin = prices.reduce((sum, p) => sum + p.min, 0);
    const totalMax = prices.reduce((sum, p) => sum + p.max, 0);

    return `${totalMin}-${totalMax}€`;
  }, [shoppingList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            🎮 Beyblade X Team Builder
          </h1>
          <p className="text-xl text-gray-300">
            Sistema di creazione team {mode === 'single' ? 'Singoli' : '3on3'} - Novembre 2025
          </p>
        </div>

        {/* Libreria Build Salvati */}
        {showLibrary && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen size={28} />
                  📚 I Miei Build ({savedBuilds.length})
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Caricamento build salvati...</p>
                  </div>
                ) : savedBuilds.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">Nessun build salvato</p>
                    <p className="text-gray-400">Crea e salva i tuoi primi Beyblade!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {savedBuilds.map(build => (
                      <div key={build.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-purple-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 capitalize">
                              {build.name.replace('beyblade:', '')}
                            </h3>
                            <p className="text-sm text-purple-600 font-medium">
                              {build.mode === 'single' ? '🎯 Singolo' : '⚔️ Team 3on3'}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (deleteBuild(build.id)) {
                                // Success feedback handled in function
                              }
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Elimina build"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="space-y-2 mb-4">
                          {build.team.map((beyblade, idx) => (
                            beyblade.beybladeId ? (
                              <div key={idx} className="text-sm bg-white rounded-lg p-2 border border-gray-200">
                                <div className="font-semibold text-gray-700">{beyblade.name}</div>
                                <div className="text-xs text-gray-500">
                                  {beyblade.blade} • {beyblade.ratchet} • {beyblade.bit}
                                </div>
                              </div>
                            ) : null
                          ))}
                        </div>

                        <button
                          onClick={() => loadBuild(build)}
                          className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Upload size={18} />
                          Carica Build
                        </button>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                          Salvato: {new Date(build.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Menu Iniziale */}
        {mode === null && (
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Regole Torneo WBO 3on3</p>
                    <p className="text-sm">Nessun Beyblade duplicato nel team</p>
                  </div>
                </div>
              </div>
            )}

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
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <span className="text-sm">Modalità Singolo</span>
                    <Check size={16} />
                  </div>
                </div>
              </button>

              <button
                onClick={() => startMode('team')}
                className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h2 className="text-3xl font-bold mb-3">Team 3on3</h2>
                  <p className="text-purple-100 mb-4">
                    Crea un team da torneo (3 Beyblade)
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <span className="text-sm">Modalità Torneo</span>
                    <Check size={16} />
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setShowAbout(true)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Info size={20} />
                Informazioni
              </button>

              <button
                onClick={() => setShowAdmin(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Settings size={20} />
                ⚙️ Gestione Database
              </button>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowLibrary(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <BookOpen size={20} />
                📚 I Miei Build ({savedBuilds.length})
              </button>
            </div>

            <div className="text-center text-gray-600 text-sm mt-4">
              <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
            </div>
          </div>
        )}

        {/* Team Builder */}
        {mode !== null && (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                🎮 Beyblade X {mode === 'single' ? 'Builder' : 'Team Builder 3on3'}
              </h1>
              <p className="text-gray-600">
                {mode === 'single'
                  ? 'Crea il tuo Beyblade personalizzato!'
                  : 'Crea il tuo team seguendo le regole dei tornei - Nessun Beyblade duplicato!'}
              </p>
            </div>

            {mode === 'team' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Regole Torneo WBO 3on3</p>
                    <p className="text-sm">Nessun Beyblade duplicato nel team</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 w-full max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 text-center">
                {mode === 'single' ? 'Scegli il tuo Beyblade' : 'Crea il tuo Team 3on3'}
              </h2>

              {mode === 'single' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 text-center">🌀 Seleziona un Beyblade Completo</h3>
                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-bold text-gray-700 mb-3">✨ Scegli il tuo Beyblade</label>
                    <select
                      value={team[0].beybladeId}
                      onChange={(e) => handleBeybladeSelect(0, e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium text-lg"
                    >
                      <option value="">Seleziona un Beyblade...</option>
                      {beybladeData.completeSets.map(beyblade => (
                        <option key={beyblade.id} value={beyblade.id}>
                          {beyblade.name} - {beyblade.price} ({beyblade.tier})
                        </option>
                      ))}
                    </select>
                    {team[0].beybladeId && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-center">
                          <div className="font-bold text-lg text-blue-600 mb-2">{team[0].name}</div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-gray-600">🗡️ Blade:</span>
                              <div className="text-gray-800">{team[0].blade}</div>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">⚙️ Ratchet:</span>
                              <div className="text-gray-800">{team[0].ratchet}</div>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">🎯 Bit:</span>
                              <div className="text-gray-800">{team[0].bit}</div>
                            </div>
                          </div>
                          <div className="mt-3 text-lg font-bold text-purple-600">💰 {team[0].price}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {mode === 'team' && (
                <div className="space-y-8">
                  {team.map((beyblade, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-xl font-bold text-blue-900 mb-6 text-center">🌀 Beyblade {index + 1}</h3>
                      <div className="max-w-md mx-auto">
                        <label className="block text-sm font-bold text-gray-700 mb-3">✨ Scegli il Beyblade {index + 1}</label>
                        <select
                          value={team[index].beybladeId}
                          onChange={(e) => handleBeybladeSelect(index, e.target.value)}
                          className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium ${team[index].beybladeId && isBeybladeUsed(team[index].beybladeId, index) ? 'border-red-400 focus:border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Seleziona un Beyblade...</option>
                          {beybladeData.completeSets.map(beyblade => (
                            <option key={beyblade.id} value={beyblade.id} disabled={isBeybladeUsed(beyblade.id, index)}>
                              {beyblade.name} - {beyblade.price} ({beyblade.tier})
                            </option>
                          ))}
                        </select>

                        {team[index].beybladeId && (
                          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="text-center">
                              <div className="font-bold text-lg text-blue-600 mb-2">{team[index].name}</div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-semibold text-gray-600">🗡️ Blade:</span>
                                  <div className="text-gray-800">{team[index].blade}</div>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-600">⚙️ Ratchet:</span>
                                  <div className="text-gray-800">{team[index].ratchet}</div>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-600">🎯 Bit:</span>
                                  <div className="text-gray-800">{team[index].bit}</div>
                                </div>
                              </div>
                              <div className="mt-3 text-lg font-bold text-purple-600">💰 {team[index].price}</div>
                            </div>
                          </div>
                        )}

                        {team[index].beybladeId && isBeybladeUsed(team[index].beybladeId, index) && (
                          <p className="text-red-600 text-xs mt-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Questo Beyblade è già in uso nel team (regole torneo)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={resetTeam}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!(mode === 'single' ? team[0].beybladeId : team.every(b => b.beybladeId))}
                >
                  Salva
                </button>
              </div>
            </div>

            {/* Shopping List */}
            {mode === 'team' && shoppingList.length > 0 && (
              <div className="mt-8 bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-6 text-center">
                  🛒 Shopping List - Prodotti da Acquistare
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {shoppingList.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg text-green-800">{item.name}</div>
                          <div className="text-sm text-gray-600">Prezzo: {item.price}</div>
                        </div>
                        <div className="text-xl font-bold text-green-600">{item.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    💰 Prezzo Totale: {totalPrice}
                  </div>
                  <p className="text-gray-600 mt-2">
                    Acquista {shoppingList.length} prodotto{shoppingList.length > 1 ? 'i' : ''} per creare il tuo team competitivo!
                  </p>
                </div>
              </div>
            )}

            {/* Back to Menu Button */}
            <div className="text-center mt-8">
              <button
                onClick={backToMenu}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
              >
                ← Torna al Menu
              </button>
            </div>

            <div className="text-center text-white/80 text-sm mb-20">
              <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
            </div>

            {/* Footer Fisso */}
            <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 py-3 px-4 z-40">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span>© 2025 Beyblade X Team Builder</span>
                  <span className="text-gray-600">•</span>
                  <span>Tutti i diritti riservati</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Creato con</span>
                  <span className="text-red-500">❤️</span>
                  <span className="font-semibold text-purple-400">Francesco Ronca</span>
                  <button
                    onClick={() => setShowAbout(true)}
                    className="ml-3 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Informazioni"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
            </footer>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">💾 Salva il tuo {mode === 'single' ? 'Beyblade' : 'Team'}</h3>
                <input
                  type="text"
                  placeholder="Nome del build..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowSaveDialog(false);
                      setSaveName('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Salva
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Dialog */}
        {showAbout && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Info size={28} />
                  Informazioni su Beyblade X Team Builder
                </h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Logo e titolo */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                      Beyblade X Team Builder
                    </h3>
                    <p className="text-gray-600">Versione 1.0.0</p>
                  </div>

                  {/* Crediti */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200">
                    <h4 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Code size={20} />
                      Sviluppo e Copyright
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-semibold">Creato con:</span>
                        <span className="ml-2 text-red-500">❤️</span> da
                        <span className="ml-2 font-bold text-purple-600">Francesco Ronca</span>
                      </p>
                      <p><span className="font-semibold">Anno:</span> 2025</p>
                      <p><span className="font-semibold">Licenza:</span> Tutti i diritti riservati</p>
                      <p><span className="font-semibold">Tecnologie:</span> React 18 • Vite • Tailwind CSS</p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200">
                    <h4 className="text-xl font-bold text-yellow-800 mb-3 flex items-center gap-2">
                      <Shield size={20} />
                      Disclaimer e Informazioni
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Beyblade X™</strong> è un marchio registrato di Takara Tomy.
                        Questa applicazione è un progetto non ufficiale creato da fan per fan.
                      </p>
                      <p>
                        I dati sui prodotti e i prezzi sono puramente indicativi e basati su
                        informazioni disponibili al Novembre 2025. I prezzi possono variare
                        in base al rivenditore e alla disponibilità.
                      </p>
                      <p>
                        Le regole dei tornei si basano sulle linee guida WBO (World Beyblade
                        Organization) e B4, ma sono soggette a modifiche da parte degli
                        organizzatori ufficiali.
                      </p>
                    </div>
                  </div>

                  {/* Ringraziamenti */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                    <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                      <Heart size={20} />
                      Ringraziamenti
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        Un ringraziamento speciale a tutta la community Beyblade X per il
                        supporto e per condividere strategie e informazioni sui tornei.
                      </p>
                      <p>
                        Grazie a WBO per mantenere vive le regole competitive e a tutti
                        i Blader che rendono questo sport così avvincente!
                      </p>
                    </div>
                  </div>

                  {/* Footer del dialog */}
                  <div className="text-center pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      © 2025 Francesco Ronca - Tutti i diritti riservati<br/>
                      Beyblade X Team Builder non è affiliato con Takara Tomy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeybladeTeamBuilder;