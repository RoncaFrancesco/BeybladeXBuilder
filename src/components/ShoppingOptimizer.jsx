import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingDown, CheckCircle, XCircle, AlertCircle, Package, DollarSign, Zap, Target, Calculator } from 'lucide-react';
import { useUnifiedDatabase } from '../hooks/useUnifiedDatabase.js';
import { getComponentType, getTypeColor, getTypeBgColor } from '../data/beybladeTypes.js';

/**
 * Componente ottimizzatore acquisti che usa il sistema unificato Database → Collezione → Ottimizzatore
 * Mostra prodotti suggeriti per completare un team Beyblade
 */
const ShoppingOptimizer = ({ team, onClose }) => {
  const { optimization, loading, optimizing, error } = useUnifiedDatabase(team);

  // Componente Icona per tipologie Beyblade
  const TypeIcons = {
    Attack: () => (
      <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
        <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#1e40af" strokeWidth="3"/>
        <circle cx="50" cy="50" r="20" fill="white"/>
        <path d="M50 15 L40 30 L60 30 Z" fill="white"/>
        <path d="M85 50 L70 40 L70 60 Z" fill="white"/>
        <path d="M50 85 L60 70 L40 70 Z" fill="white"/>
        <path d="M15 50 L30 60 L30 40 Z" fill="white"/>
      </svg>
    ),
    Stamina: () => (
      <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
        <circle cx="50" cy="50" r="45" fill="#f97316" stroke="#ea580c" strokeWidth="3"/>
        <circle cx="50" cy="50" r="20" fill="white"/>
        <path d="M50 30 Q70 30 75 50 Q70 70 50 70 Q30 70 25 50 Q30 30 50 30"
              stroke="white" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="50" r="8" fill="white"/>
      </svg>
    ),
    Defense: () => (
      <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
        <circle cx="50" cy="50" r="45" fill="#16a34a" stroke="#15803d" strokeWidth="3"/>
        <circle cx="50" cy="50" r="20" fill="white"/>
        <path d="M50 15 L75 35 L75 55 L50 75 L25 55 L25 35 Z"
              fill="none" stroke="white" strokeWidth="3"/>
      </svg>
    ),
    Balance: () => (
      <svg width="20" height="20" viewBox="0 0 100 100" className="inline-block">
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

  const TypeIcon = ({ type, size = 20 }) => {
    const IconComponent = TypeIcons[type];
    if (!IconComponent) return null;
    return <IconComponent />;
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

  // Helper per formato prezzo
  const formatPrice = (price) => {
    return price || 'Prezzo N/D';
  };

  if (loading || optimizing) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <Calculator className="animate-pulse mx-auto mb-4 text-blue-500" size={48} />
            <p className="text-gray-600">
              {optimizing ? 'Ottimizzando acquisti...' : 'Caricando dati...'}
            </p>
            {optimizing && (
              <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Errore nell'ottimizzazione</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!optimization) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <Calculator className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">Nessuna ottimizzazione disponibile</p>
            <p className="text-sm text-gray-500 mt-2">
              Assicurati che il team sia completo
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart size={28} />
            🛒 Ottimizzatore Acquisti Intelligente
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XCircle className="text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!optimization.needsPurchase ? (
            // TEAM COMPLETO
            <div className="text-center py-12">
              <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Team Completo! 🎉
              </h3>
              <p className="text-green-700 text-lg mb-2">
                Hai già tutti i componenti per creare questo team!
              </p>
              <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-xl p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-green-900 mb-3">Analisi Team:</h4>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Componenti richiesti:</span>
                    <span className="font-bold">{optimization.analysis.totalNeeded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Componenti posseduti:</span>
                    <span className="font-bold">{optimization.analysis.totalOwned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Completamento:</span>
                    <span className="font-bold text-green-600">
                      {optimization.analysis.completionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // SERVE ACQUISTI
            <div className="space-y-6">
              {/* TEAM ANALYSIS */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Target size={20} />
                  🎯 ANALISI TEAM
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Owned Components */}
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle size={16} />
                      ✅ HAI GIÀ:
                    </h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>• {optimization.analysis.owned.blades.length} Blades</div>
                      <div>• {optimization.analysis.owned.ratchets.length} Ratchets</div>
                      <div>• {optimization.analysis.owned.bits.length} Bits</div>
                    </div>
                  </div>

                  {/* Missing Components */}
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <XCircle size={16} />
                      ❌ TI MANCANO:
                    </h4>
                    <div className="text-sm text-red-700 space-y-1">
                      <div>• {optimization.analysis.missing.blades.length} Blades</div>
                      <div>• {optimization.analysis.missing.ratchets.length} Ratchets</div>
                      <div>• {optimization.analysis.missing.bits.length} Bits</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>Completamento Team</span>
                    <span>{optimization.analysis.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${optimization.analysis.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* OPTIMAL SOLUTION */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Zap size={20} />
                  ⚡ SOLUZIONE OTTIMALE
                </h3>

                <div className="mb-4 bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-semibold">Costo Totale Stimato:</span>
                    <span className="text-2xl font-bold text-green-600">
                      €{optimization.totalCost.toFixed(0)}
                    </span>
                  </div>
                  {optimization.savings && optimization.savings.percentage > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      💰 Risparmi fino al {optimization.savings.percentage}% rispetto ad altre soluzioni
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  {optimization.optimalSolution.map((product, index) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">{product.name}</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className={`px-2 py-1 rounded-full border ${getTierColor(product.tier)}`}>
                              Tier {product.tier}
                            </span>
                            <span className="text-gray-600">{product.format}</span>
                            <span className="font-medium text-gray-700">{formatPrice(product.price)}</span>
                            {product.source === 'custom' && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                🎨 Custom
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          €{product.priceAvg?.toFixed(0)}
                        </div>
                      </div>

                      {/* Components Provided */}
                      <div className="border-t pt-3">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Fornisce:</div>
                        <div className="flex flex-wrap gap-2">
                          {product.provides?.map(provide => (
                            <div
                              key={provide.name}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTypeBgColor(getComponentType(provide.type, provide.name))} ${getTypeColor(getComponentType(provide.type, provide.name))}`}
                            >
                              <TypeIcon type={getComponentType(provide.type, provide.name)} size={12} />
                              {provide.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Component Details */}
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        {product.blade?.name && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <TypeIcon type={getComponentType('blade', product.blade.name)} size={10} />
                            <span className="truncate">{product.blade.name}</span>
                          </div>
                        )}
                        {product.ratchet?.name && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <TypeIcon type={getComponentType('ratchet', product.ratchet.name)} size={10} />
                            <span className="truncate">{product.ratchet.name}</span>
                          </div>
                        )}
                        {product.bit?.name && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <TypeIcon type={getComponentType('bit', product.bit.name)} size={10} />
                            <span className="truncate">{product.bit.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALTERNATIVE */}
              {optimization.alternatives && optimization.alternatives.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <TrendingDown size={20} />
                    🔄 ALTERNATIVE
                  </h3>

                  <div className="space-y-3">
                    {optimization.alternatives.map((alt, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-orange-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{alt.name}</h4>
                            <p className="text-sm text-gray-600">{alt.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-600">€{alt.totalCost.toFixed(0)}</div>
                            {optimization.savings && (
                              <div className="text-xs text-orange-500">
                                +{optimization.savings.maxCost - alt.totalCost}€
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-600">
                          {alt.products.length} prodotti:
                          {alt.products.slice(0, 3).map(p => p.name).join(', ')}
                          {alt.products.length > 3 && `...`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATISTICS */}
              {optimization.candidatesCount && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Package size={16} />
                    Statistiche Analisi
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Prodotti analizzati</div>
                      <div className="font-bold">{optimization.candidatesCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Prodotti selezionati</div>
                      <div className="font-bold">{optimization.optimalSolution.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Componenti mancanti</div>
                      <div className="font-bold">{optimization.analysis.totalMissing}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Efficienza</div>
                      <div className="font-bold">
                        {optimization.analysis.totalMissing > 0
                          ? Math.round((optimization.analysis.totalMissing / optimization.optimalSolution.length) * 10) / 10
                          : 0} pezzi/prodotto
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingOptimizer;