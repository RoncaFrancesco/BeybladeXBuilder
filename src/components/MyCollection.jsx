import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Search, Filter, Check, X, Star, TrendingUp, Calendar, Download, Upload, Trash2, Plus, AlertCircle } from 'lucide-react';
import { CollectionManager, DatabaseUtils, OfficialDatabaseManager } from '../utils/databaseManager.js';
import { getComponentType, getTypeColor, getTypeBgColor } from '../data/beybladeTypes.js';

// Icone tipologie Beyblade (stesse da App.js per consistenza)
const TypeIcons = {
  Attack: () => (
    <svg width="16" height="16" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#1e40af" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      <path d="M50 15 L40 30 L60 30 Z" fill="white"/>
      <path d="M85 50 L70 40 L70 60 Z" fill="white"/>
      <path d="M50 85 L60 70 L40 70 Z" fill="white"/>
      <path d="M15 50 L30 60 L30 40 Z" fill="white"/>
    </svg>
  ),
  Stamina: () => (
    <svg width="16" height="16" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#f97316" stroke="#ea580c" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      <path d="M50 30 Q70 30 75 50 Q70 70 50 70 Q30 70 25 50 Q30 30 50 30"
            stroke="white" strokeWidth="3" fill="none"/>
      <circle cx="50" cy="50" r="8" fill="white"/>
    </svg>
  ),
  Defense: () => (
    <svg width="16" height="16" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#16a34a" stroke="#15803d" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      <path d="M50 15 L75 35 L75 55 L50 75 L25 55 L25 35 Z"
            fill="none" stroke="white" strokeWidth="3"/>
    </svg>
  ),
  Balance: () => (
    <svg width="16" height="16" viewBox="0 0 100 100" className="inline-block">
      <circle cx="50" cy="50" r="45" fill="#dc2626" stroke="#b91c1c" strokeWidth="3"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="50" cy="22" r="4" fill="white"/>
      <circle cx="78" cy="50" r="4" fill="white"/>
      <circle cx="50" cy="78" r="4" fill="white"/>
      <circle cx="22" cy="50" r="4" fill="white"/>
    </svg>
  )
};

const TypeIcon = ({ type, size = 16 }) => {
  const IconComponent = TypeIcons[type];
  if (!IconComponent) return null;
  return <IconComponent />;
};

const MyCollection = ({ onClose }) => {
  // STATO COMPONENTE NUOVO
  const [ownedProducts, setOwnedProducts] = useState([]);     // Solo prodotti posseduti
  const [allProducts, setAllProducts] = useState([]);         // Database completo (per ricerca)
  const [searchQuery, setSearchQuery] = useState('');         // Query ricerca
  const [searchResults, setSearchResults] = useState([]);     // Risultati ricerca
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    tier: '',
    format: '',
    sortBy: 'date'
  });

  // Caricamento dati iniziali
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Carica database completo per ricerca
        const allProds = await DatabaseUtils.getAllProducts();
        setAllProducts(allProds);

        // Carica SOLO prodotti posseduti per visualizzazione
        const owned = await CollectionManager.getOwnedProducts();
        setOwnedProducts(owned);

      } catch (error) {
        console.error('Errore caricamento collezione:', error);
        showToast('❌ Errore nel caricamento della collezione', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // LOGICA RICERCA (Mostra solo se searchQuery non vuoto)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allProducts.filter(product =>
      !ownedProducts.find(p => p.id === product.id) && // Escludi già posseduti
      (
        product.name.toLowerCase().includes(query) ||
        product.blade?.name.toLowerCase().includes(query) ||
        product.ratchet?.name.toLowerCase().includes(query) ||
        product.bit?.name.toLowerCase().includes(query)
      )
    );

    setSearchResults(results.slice(0, 10)); // Max 10 risultati
  }, [searchQuery, allProducts, ownedProducts]);

  // Calcola statistiche
  const stats = useMemo(() => {
    const totalProducts = ownedProducts.length;

    // Conta pezzi unici
    const uniquePieces = new Set([
      ...ownedProducts.map(p => p.blade?.name),
      ...ownedProducts.map(p => p.ratchet?.name),
      ...ownedProducts.map(p => p.bit?.name)
    ].filter(Boolean));

    return {
      totalProducts,
      totalPieces: uniquePieces.size,
      byTier: ownedProducts.reduce((acc, p) => {
        acc[p.tier] = (acc[p.tier] || 0) + 1;
        return acc;
      }, {}),
      byFormat: ownedProducts.reduce((acc, p) => {
        acc[p.format] = (acc[p.format] || 0) + 1;
        return acc;
      }, {})
    };
  }, [ownedProducts]);

  // Prodotti filtrati per visualizzazione
  const filteredOwnedProducts = useMemo(() => {
    let filtered = [...ownedProducts];

    // Filtra per tier
    if (filters.tier) {
      filtered = filtered.filter(p => p.tier === filters.tier);
    }

    // Filtra per formato
    if (filters.format) {
      filtered = filtered.filter(p => p.format === filters.format);
    }

    // Ordinamento
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'tier':
        const tierOrder = { 'S+': 1, 'S': 2, 'A': 3, 'B': 4 };
        filtered.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
        break;
      case 'price':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price?.match(/\d+/)?.[0] || 0);
          const priceB = parseInt(b.price?.match(/\d+/)?.[0] || 0);
          return priceA - priceB;
        });
        break;
      case 'date':
      default:
        filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        break;
    }

    return filtered;
  }, [ownedProducts, filters]);

  // Opzioni uniche per filtri
  const uniqueTiers = useMemo(() =>
    [...new Set(ownedProducts.map(p => p.tier))].sort((a, b) => {
      const order = { 'S+': 1, 'S': 2, 'A': 3, 'B': 4 };
      return order[a] - order[b];
    }),
    [ownedProducts]
  );

  const uniqueFormats = useMemo(() =>
    [...new Set(ownedProducts.map(p => p.format))].sort(),
    [ownedProducts]
  );

  // FUNZIONI CRUD
  const addToCollection = async (product) => {
    try {
      await CollectionManager.addProduct(product.id);

      // Aggiunge timestamp per ordinamento
      const productWithTimestamp = { ...product, timestamp: Date.now() };
      setOwnedProducts([...ownedProducts, productWithTimestamp]);

      setSearchQuery(''); // Pulisci ricerca
      showToast(`✅ ${product.name} aggiunto alla collezione!`, 'success');
    } catch (error) {
      console.error('Errore aggiunta prodotto:', error);
      showToast('❌ Errore aggiunta prodotto', 'error');
    }
  };

  const removeFromCollection = async (productId) => {
    try {
      await CollectionManager.removeProduct(productId);
      setOwnedProducts(ownedProducts.filter(p => p.id !== productId));
      showToast('✅ Prodotto rimosso dalla collezione', 'success');
    } catch (error) {
      console.error('Errore rimozione prodotto:', error);
      showToast('❌ Errore rimozione prodotto', 'error');
    }
  };

  const exportCollection = async () => {
    try {
      const collection = await CollectionManager.exportCollection();
      const dataStr = JSON.stringify(collection, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `beyblade-collection-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('📦 Collezione esportata con successo!', 'success');
    } catch (error) {
      console.error('Errore esportazione:', error);
      showToast('❌ Errore esportazione collezione', 'error');
    }
  };

  const importCollection = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      await CollectionManager.importCollection(importedData);

      // Ricarica i dati
      const owned = await CollectionManager.getOwnedProducts();
      setOwnedProducts(owned);

      showToast('📦 Collezione importata con successo!', 'success');
    } catch (error) {
      console.error('Errore importazione:', error);
      showToast('❌ Errore importazione collezione', 'error');
    }

    // Reset input file
    event.target.value = '';
  };

  // Toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper per colore tier
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-teal-500 to-cyan-500">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={28} />
            📦 La Mia Collezione
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento collezione...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* STATISTICHE */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-300">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Package size={20} />
                    <span className="font-bold">{stats.totalProducts}</span>
                  </div>
                  <div className="text-sm text-teal-600">Prodotti Posseduti</div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-300">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Star size={20} />
                    <span className="font-bold">{stats.totalPieces}</span>
                  </div>
                  <div className="text-sm text-blue-600">Pezzi Unici</div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300">
                  <div className="text-sm text-purple-600">Tier più alto</div>
                  <div className="font-bold text-purple-700">
                    {stats.byTier['S+'] > 0 ? 'S+' : stats.byTier['S'] > 0 ? 'S' : stats.byTier['A'] > 0 ? 'A' : 'B'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={exportCollection}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    title="Esporta collezione"
                  >
                    <Download size={16} />
                    Export
                  </button>

                  <label className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-1">
                    <Upload size={16} />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importCollection}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Cerca prodotto da aggiungere alla collezione..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
                />
              </div>

              {/* RISULTATI RICERCA (solo se searchQuery non vuoto) */}
              {searchQuery.trim().length >= 2 && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  {searchResults.length > 0 ? (
                    <div>
                      <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                        <Search size={18} />
                        📋 {searchResults.length} prodotti trovati:
                      </h3>
                      <div className="space-y-2">
                        {searchResults.map(product => (
                          <div key={product.id} className="bg-white rounded-lg p-3 border border-yellow-200 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-800">{product.name}</div>
                              <div className="text-sm text-gray-600">
                                {product.blade?.name} • {product.ratchet?.name} • {product.bit?.name}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getTierColor(product.tier)}`}>
                                  Tier {product.tier}
                                </span>
                                <span className="text-xs text-gray-500">{product.format}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => addToCollection(product)}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center gap-1"
                            >
                              <Plus size={16} />
                              Aggiungi
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="mx-auto mb-2 text-yellow-600" size={32} />
                      <p className="text-yellow-800 font-semibold">
                        ❌ Nessun prodotto trovato per "{searchQuery}"
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Prova con nomi diversi o controlla l'ortografia
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* FILTRI (solo se ci sono prodotti posseduti) */}
              {ownedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filters.tier}
                    onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Tutti i Tier</option>
                    {uniqueTiers.map(tier => (
                      <option key={tier} value={tier}>Tier {tier}</option>
                    ))}
                  </select>

                  <select
                    value={filters.format}
                    onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Tutti i Formati</option>
                    {uniqueFormats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="date">Ordinamento: Recente</option>
                    <option value="name">Ordinamento: Nome</option>
                    <option value="tier">Ordinamento: Tier</option>
                    <option value="price">Ordinamento: Prezzo</option>
                  </select>
                </div>
              )}

              {/* LISTA PRODOTTI POSSEDUTI */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Package size={20} />
                  📋 I MIEI PRODOTTI POSSEDUTI:
                </h3>

                {filteredOwnedProducts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Package className="mx-auto mb-4 text-gray-400" size={48} />
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">
                      Collezione Vuota
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Usa la ricerca sopra per aggiungere prodotti alla tua collezione
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-blue-800 text-sm">
                        💡 <strong>Suggerimento:</strong> Digita il nome di un prodotto (es: "Wizard Rod")
                        e clicca su "Aggiungi" per iniziare a costruire la tua collezione!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredOwnedProducts.map(product => (
                      <div key={product.id} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-300 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-teal-900 mb-2">{product.name}</h4>
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`px-2 py-1 rounded-full border ${getTierColor(product.tier)}`}>
                                Tier {product.tier}
                              </span>
                              <span className="text-gray-600">{product.format}</span>
                              {product.price && (
                                <span className="text-gray-700 font-medium">{product.price}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCollection(product.id)}
                            className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Rimuovi dalla collezione"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Components */}
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            {product.blade?.name && (
                              <>
                                <TypeIcon type={getComponentType('blade', product.blade.name)} />
                                <span className="font-semibold">{product.blade.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBgColor(getComponentType('blade', product.blade.name))} ${getTypeColor(getComponentType('blade', product.blade.name))}`}>
                                  {getComponentType('blade', product.blade.name)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {product.ratchet?.name && (
                              <>
                                <TypeIcon type={getComponentType('ratchet', product.ratchet.name)} />
                                <span>{product.ratchet.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBgColor(getComponentType('ratchet', product.ratchet.name))} ${getTypeColor(getComponentType('ratchet', product.ratchet.name))}`}>
                                  {getComponentType('ratchet', product.ratchet.name)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {product.bit?.name && (
                              <>
                                <TypeIcon type={getComponentType('bit', product.bit.name)} />
                                <span>{product.bit.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBgColor(getComponentType('bit', product.bit.name))} ${getTypeColor(getComponentType('bit', product.bit.name))}`}>
                                  {getComponentType('bit', product.bit.name)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Metadata */}
                        {product.addedDate && (
                          <div className="text-xs text-gray-500 border-t pt-2">
                            Aggiunto il: {new Date(product.addedDate).toLocaleDateString('it-IT')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Toast Notifications */}
        {toast && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-medium flex items-center gap-2`}>
            {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCollection;