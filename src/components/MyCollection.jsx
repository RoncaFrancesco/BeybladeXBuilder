import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Search, Filter, Check, X, Star, TrendingUp, Calendar, Download, Upload, Trash2 } from 'lucide-react';
import { CollectionManager, DatabaseUtils, OfficialDatabaseManager } from '../utils/databaseManager.js';

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
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    tier: '',
    format: '',
    source: '',
    owned: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');

  // Carica dati iniziali
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allProducts, collectionStats] = await Promise.all([
        DatabaseUtils.getAllProducts(),
        CollectionManager.getStats()
      ]);
      setProducts(allProducts);
      setStats(collectionStats);
    } catch (error) {
      console.error('Errore caricamento dati collezione:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra prodotti in base a ricerca e filtri
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Ricerca testuale
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.blade?.name.toLowerCase().includes(query) ||
        product.ratchet?.name.toLowerCase().includes(query) ||
        product.bit?.name.toLowerCase().includes(query)
      );
    }

    // Filtri
    if (filters.tier) {
      filtered = filtered.filter(p => p.tier === filters.tier);
    }
    if (filters.format) {
      filtered = filtered.filter(p => p.format === filters.format);
    }
    if (filters.source) {
      filtered = filtered.filter(p => p.source === filters.source);
    }
    if (filters.owned !== '') {
      const isOwned = filters.owned === 'true';
      filtered = filtered.filter(p => p.owned === isOwned);
    }

    return filtered;
  }, [products, searchQuery, filters]);

  // Toggle possesso prodotto
  const toggleProductOwnership = async (productId) => {
    try {
      if (products.find(p => p.id === productId)?.owned) {
        await CollectionManager.removeProduct(productId);
      } else {
        await CollectionManager.addProduct(productId);
      }
      await loadData(); // Reload data
    } catch (error) {
      console.error('Errore aggiornamento possesso prodotto:', error);
    }
  };

  // Toggle selezione per azioni bulk
  const toggleProductSelection = (productId) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  // Toggle selezione tutti
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  // Azione bulk
  const executeBulkAction = async () => {
    if (!bulkAction || selectedProducts.size === 0) return;

    try {
      if (bulkAction === 'add') {
        for (const productId of selectedProducts) {
          await CollectionManager.addProduct(productId);
        }
      } else if (bulkAction === 'remove') {
        for (const productId of selectedProducts) {
          await CollectionManager.removeProduct(productId);
        }
      }

      setSelectedProducts(new Set());
      setBulkAction('');
      await loadData();
    } catch (error) {
      console.error('Errore azione bulk:', error);
    }
  };

  // Export collezione
  const exportCollection = async () => {
    try {
      const ownedProducts = await CollectionManager.getOwnedProducts();
      const dataStr = JSON.stringify({
        collection: ownedProducts,
        stats,
        exportDate: new Date().toISOString()
      }, null, 2);

      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `beyblade-collection-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore export collezione:', error);
    }
  };

  // Get tier color
  const getTierColor = (tier) => {
    const colors = {
      'S+': 'text-red-600 font-bold bg-red-50 border-red-200',
      'S': 'text-orange-600 font-bold bg-orange-50 border-orange-200',
      'A': 'text-yellow-600 font-semibold bg-yellow-50 border-yellow-200',
      'B': 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[tier] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Opzioni filtri
  const uniqueTiers = useMemo(() => [...new Set(products.map(p => p.tier))].sort(), [products]);
  const uniqueFormats = useMemo(() => [...new Set(products.map(p => p.format))].sort(), [products]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento collezione...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-500">
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

        {/* Stats Bar */}
        {stats && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.owned}</div>
                <div className="text-sm text-gray-600">Prodotti Posseduti</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Prodotti Totali</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.percentage}%</div>
                <div className="text-sm text-gray-600">Completamento</div>
              </div>
              <div className="text-center">
                <button
                  onClick={exportCollection}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
                  title="Esporta collezione"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca per nome, blade, ratchet o bit..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'bg-green-500 text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              Filtri
              {(filters.tier || filters.format || filters.source || filters.owned !== '') && (
                <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <select
                  value={filters.tier}
                  onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tutti i Tier</option>
                  {uniqueTiers.map(tier => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>

                <select
                  value={filters.format}
                  onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tutti i Formati</option>
                  {uniqueFormats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>

                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tutte le Fonti</option>
                  <option value="official">Ufficiali</option>
                  <option value="custom">Personalizzati</option>
                </select>

                <select
                  value={filters.owned}
                  onChange={(e) => setFilters({ ...filters, owned: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tutti</option>
                  <option value="true">Posseduti</option>
                  <option value="false">Non Posseduti</option>
                </select>

                <button
                  onClick={() => setFilters({ tier: '', format: '', source: '', owned: '' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedProducts.size > 0 && (
          <div className="p-4 bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedProducts.size} prodotti selezionati
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Azioni bulk...</option>
                  <option value="add">Aggiungi alla collezione</option>
                  <option value="remove">Rimuovi dalla collezione</option>
                </select>
                <button
                  onClick={executeBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Esegui
                </button>
                <button
                  onClick={() => setSelectedProducts(new Set())}
                  className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Annulla selezione
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                Seleziona tutti ({filteredProducts.length} prodotti)
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProducts.filter(p => p.owned).length} posseduti su {filteredProducts.length} visualizzati
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">Nessun prodotto trovato</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery || filters.tier || filters.format || filters.source || filters.owned !== ''
                  ? 'Prova a modificare i filtri di ricerca'
                  : 'Il database potrebbe essere vuoto'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`relative border-2 rounded-xl p-4 transition-all duration-200 ${
                    product.owned
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Owned Badge */}
                  {product.owned && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Check size={12} />
                      POSSEDUTO
                    </div>
                  )}

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="pt-6">
                    <h3 className="font-bold text-lg mb-2 pr-16">{product.name}</h3>

                    {/* Components */}
                    <div className="space-y-1 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TypeIcon type={product.blade?.type} />
                        <span className="font-semibold">{product.blade?.name}</span>
                        {product.blade?.type && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.blade.type === 'Attack' ? 'bg-blue-100 text-blue-700' :
                            product.blade.type === 'Defense' ? 'bg-green-100 text-green-700' :
                            product.blade.type === 'Stamina' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.blade.type}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <TypeIcon type={product.ratchet?.type} />
                        <span>{product.ratchet?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TypeIcon type={product.bit?.type} />
                        <span>{product.bit?.name}</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className={`px-2 py-1 rounded-full border ${getTierColor(product.tier)}`}>
                        Tier {product.tier}
                      </span>
                      <span className="text-gray-500">{product.format}</span>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-green-600 mb-3">
                      {product.price}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleProductOwnership(product.id)}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                          product.owned
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {product.owned ? 'Rimuovi' : 'Aggiungi'}
                      </button>
                      {product.source === 'custom' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          Custom
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCollection;