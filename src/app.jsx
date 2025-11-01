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
  });
  const [team, setTeam] = useState([
    { blade: '', ratchet: '', bit: '' },
    { blade: '', ratchet: '', bit: '' },
    { blade: '', ratchet: '', bit: '' }
  ]);

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
      setSavedBuilds(builds.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.log('Nessun build salvato ancora');
      setSavedBuilds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBuild = () => {
    if (!saveName.trim()) {
      alert('⚠️ Inserisci un nome per il tuo build prima di salvare!');
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
      localStorage.setItem(build.id, JSON.stringify(build));
      loadSavedBuilds();
      alert(`✅ Build "${saveName.trim()}" salvato con successo!`);
      setSaveName('');
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('❌ Errore nel salvataggio del build');
    }
  };

  const deleteBuild = (buildId) => {
    if (confirm('Sei sicuro di voler eliminare questo build?')) {
      try {
        localStorage.removeItem(buildId);
        loadSavedBuilds();
        alert('✅ Build eliminato!');
      } catch (error) {
        console.error('Errore nell\'eliminazione:', error);
        alert('❌ Errore nell\'eliminazione del build');
      }
    }
  };

  const loadBuild = (build) => {
    setMode(build.mode);
    setTeam(build.team);
    setSaveName(build.name); // Carica anche il nome
    setShowLibrary(false);
  };

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

      for (const product of products) {
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
                                <p className="font-semibold text-gray-800">
                                  {build.mode === 'team' && `#${idx + 1}: `}
                                  <span className="text-indigo-700">{bey.blade}</span>
                                  <span className="text-gray-600"> {bey.ratchet}</span>
                                  <span className="text-purple-600"> {bey.bit}</span>
                                </p>
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

        {/* Dialog About */}
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

        {/* Admin Panel */}
        {showAdmin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Database size={28} />
                  🛠️ Gestione Database Beyblade
                </h2>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Blades Management */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🗡️</span> Blades
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nome Blade..."
                          className="flex-1 p-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.target.value.trim();
                              if (value && !beybladeData.blades.includes(value)) {
                                const newData = {
                                  ...beybladeData,
                                  blades: [...beybladeData.blades, value].sort()
                                };
                                saveCustomBeybladeData(newData);
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Nome Blade..."]');
                            const value = input?.value.trim();
                            if (value && !beybladeData.blades.includes(value)) {
                              const newData = {
                                ...beybladeData,
                                blades: [...beybladeData.blades, value].sort()
                              };
                              saveCustomBeybladeData(newData);
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {beybladeData.blades.map((blade, index) => (
                          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200">
                            <span className="text-sm font-medium text-gray-800">{blade}</span>
                            <button
                              onClick={() => {
                                const newData = {
                                  ...beybladeData,
                                  blades: beybladeData.blades.filter(b => b !== blade)
                                };
                                saveCustomBeybladeData(newData);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ratchets Management */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">⚙️</span> Ratchets
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Es: 3-60"
                          className="flex-1 p-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.target.value.trim();
                              if (value && !beybladeData.ratchets.includes(value)) {
                                const newData = {
                                  ...beybladeData,
                                  ratchets: [...beybladeData.ratchets, value].sort()
                                };
                                saveCustomBeybladeData(newData);
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Es: 3-60"]');
                            const value = input?.value.trim();
                            if (value && !beybladeData.ratchets.includes(value)) {
                              const newData = {
                                ...beybladeData,
                                ratchets: [...beybladeData.ratchets, value].sort()
                              };
                              saveCustomBeybladeData(newData);
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {beybladeData.ratchets.map((ratchet, index) => (
                          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                            <span className="text-sm font-medium text-gray-800">{ratchet}</span>
                            <button
                              onClick={() => {
                                const newData = {
                                  ...beybladeData,
                                  ratchets: beybladeData.ratchets.filter(r => r !== ratchet)
                                };
                                saveCustomBeybladeData(newData);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bits Management */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                    <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span> Bits
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Es: N, DB, etc."
                          className="flex-1 p-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          maxLength={3}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.target.value.trim().toUpperCase();
                              if (value && !beybladeData.bits.includes(value)) {
                                const newData = {
                                  ...beybladeData,
                                  bits: [...beybladeData.bits, value].sort()
                                };
                                saveCustomBeybladeData(newData);
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Es: N, DB, etc."]');
                            const value = input?.value.trim().toUpperCase();
                            if (value && !beybladeData.bits.includes(value)) {
                              const newData = {
                                ...beybladeData,
                                bits: [...beybladeData.bits, value].sort()
                              };
                              saveCustomBeybladeData(newData);
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {beybladeData.bits.map((bit, index) => (
                          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200">
                            <span className="text-sm font-medium text-gray-800">{bit}</span>
                            <button
                              onClick={() => {
                                const newData = {
                                  ...beybladeData,
                                  bits: beybladeData.bits.filter(b => b !== bit)
                                };
                                saveCustomBeybladeData(newData);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset to Default */}
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-300">
                  <h4 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                    <Shield size={20} />
                    Reset Database
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Attenzione: questa operazione ripristinerà il database ai valori originali, cancellando tutte le modifiche personalizzate.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('⚠️ Sei sicuro di voler resettare il database ai valori di default? Tutte le modifiche personalizzate saranno perse!')) {
                        // Rimuovi i dati custom dal localStorage
                        localStorage.removeItem('beybladeCustomData');

                        // Reset al database di default
                        const defaultData = {
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

                        setBeybladeData(defaultData);
                        alert('✅ Database resettato ai valori di default!');
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    🔄 Reset ai Valori Default
                  </button>
                </div>

                {/* Batch Operations */}
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
                  <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <Edit3 size={20} />
                    Operazioni Batch
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Importa da testo (uno per riga):</p>
                      <textarea
                        placeholder="Blade 1&#10;Blade 2&#10;Blade 3"
                        className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        rows={3}
                        id="batchImport"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            const textarea = document.getElementById('batchImport');
                            const lines = textarea.value.split('\n')
                              .map(line => line.trim())
                              .filter(line => line.length > 0);

                            const uniqueNewBlades = lines.filter(line =>
                              !beybladeData.blades.includes(line)
                            );

                            if (uniqueNewBlades.length > 0) {
                              const newData = {
                                ...beybladeData,
                                blades: [...beybladeData.blades, ...uniqueNewBlades].sort()
                              };
                              saveCustomBeybladeData(newData);
                              textarea.value = '';
                              alert(`✅ Aggiunti ${uniqueNewBlades.length} nuovi Blades!`);
                            } else {
                              alert('ℹ️ Nessun nuovo Blade da aggiungere');
                            }
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          Importa Blades
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-700 mb-2">Backup e Ripristino:</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(beybladeData, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'beyblade-database-backup.json';
                            link.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          💾 Backup Database
                        </button>
                        <input
                          type="file"
                          accept=".json"
                          id="restoreFile"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const data = JSON.parse(event.target.result);
                                  setBeybladeData(data);
                                  alert('✅ Database ripristinato con successo!');
                                } catch (error) {
                                  alert('❌ Errore nel file di backup!');
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                        <button
                          onClick={() => document.getElementById('restoreFile').click()}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          📂 Ripristina Backup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-300">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">📊 Statistiche Database</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">{beybladeData.blades.length}</div>
                      <div className="text-sm text-gray-600">Blades Totali</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-green-600">{beybladeData.ratchets.length}</div>
                      <div className="text-sm text-gray-600">Ratchets Totali</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600">{beybladeData.bits.length}</div>
                      <div className="text-sm text-gray-600">Bits Totali</div>
                    </div>
                  </div>
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

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowLibrary(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <BookOpen size={24} />
                📚 I Miei Build ({savedBuilds.length})
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🗡️ Blade</label>
                    <select
                      value={bey.blade}
                      onChange={(e) => handlePartChange(index, 'blade', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Seleziona Blade</option>
                      {beybladeData.blades.map(blade => {
                        const used = mode === 'team' && isPartUsed('blade', blade, index, 'blade');
                        return (
                          <option key={blade} value={blade} disabled={used}>
                            {blade} {used ? '❌ (Già usata)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {mode === 'team' && bey.blade && isPartUsed('blade', bey.blade, index, 'blade') && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Questa Blade è già usata!</p>
                    )}
                  </div>

                  {/* Ratchet */}
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">⚙️ Ratchet</label>
                    <select
                      value={bey.ratchet}
                      onChange={(e) => handlePartChange(index, 'ratchet', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Seleziona Ratchet</option>
                      {beybladeData.ratchets.map(ratchet => {
                        const used = mode === 'team' && isPartUsed('ratchet', ratchet, index, 'ratchet');
                        return (
                          <option key={ratchet} value={ratchet} disabled={used}>
                            {ratchet} {used ? '❌ (Già usato)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {mode === 'team' && bey.ratchet && isPartUsed('ratchet', bey.ratchet, index, 'ratchet') && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Questo Ratchet è già usato!</p>
                    )}
                  </div>

                  {/* Bit */}
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🎯 Bit</label>
                    <select
                      value={bey.bit}
                      onChange={(e) => handlePartChange(index, 'bit', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Seleziona Bit</option>
                      {beybladeData.bits.map(bit => {
                        const used = mode === 'team' && isPartUsed('bit', bit, index, 'bit');
                        return (
                          <option key={bit} value={bit} disabled={used}>
                            {bit} {used ? '❌ (Già usato)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {mode === 'team' && bey.bit && isPartUsed('bit', bey.bit, index, 'bit') && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Questo Bit è già usato!</p>
                    )}
                  </div>

                  {/* Recap */}
                  {bey.blade && bey.ratchet && bey.bit && (
                    <div className="mt-3 p-2 bg-green-100 border border-green-400 rounded-lg">
                      <p className="text-xs font-bold text-green-800 flex items-center gap-1">
                        <Check size={14} /> {bey.blade} {bey.ratchet} {bey.bit}
                      </p>
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
              {isTeamComplete && saveName.trim() && (
                <button
                  onClick={saveBuild}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold ml-auto animate-pulse"
                >
                  <Save size={18} />
                  💾 Salva "{saveName.trim()}"
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
                            {product.provides.map((p, i) => (
                              <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mt-1">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <span className={`text-sm font-bold ${getTierColor(product.tier)}`}>
                            Tier {product.tier}
                          </span>
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
          <div className="text-center text-white/80 text-sm mb-20">
            <p>Database aggiornato a Novembre 2025 | Regole tornei WBO e B4</p>
          </div>
        )}

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
    </div>
  );
};

export default BeybladeTeamBuilder;