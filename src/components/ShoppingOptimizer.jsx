import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingCart, TrendingDown, CheckCircle, XCircle, AlertCircle, Package, DollarSign, Zap, Target, Calculator } from 'lucide-react';
import { CollectionManager, DatabaseUtils } from '../utils/databaseManager.js';
import { getComponentType, getTypeColor, getTypeBgColor } from '../data/beybladeTypes.js';

/**
 * Algoritmo di ottimizzazione avanzato per acquisti Beyblade X
 * Analizza la collezione utente e suggerisce i prodotti migliori da acquistare
 */

class OptimizationEngine {
  constructor() {
    this.tierWeights = { 'S+': 1000, 'S': 800, 'A': 600, 'B': 400 };
    this.coverageWeights = { blade: 100, ratchet: 10, bit: 1 };
  }

  /**
   * Analizza i componenti necessari per un team
   */
  analyzeTeamNeeds(team) {
    const needed = {
      blades: new Set(),
      ratchets: new Set(),
      bits: new Set()
    };

    const componentMap = {
      blades: new Map(),
      ratchets: new Map(),
      bits: new Map()
    };

    team.forEach((beyblade, index) => {
      if (beyblade.blade) {
        needed.blades.add(beyblade.blade);
        componentMap.blades.set(beyblade.blade, { beybladeIndex: index, partType: 'blade' });
      }
      if (beyblade.ratchet) {
        needed.ratchets.add(beyblade.ratchet);
        componentMap.ratchets.set(beyblade.ratchet, { beybladeIndex: index, partType: 'ratchet' });
      }
      if (beyblade.bit) {
        needed.bits.add(beyblade.bit);
        componentMap.bits.set(beyblade.bit, { beybladeIndex: index, partType: 'bit' });
      }
    });

    return { needed, componentMap };
  }

  /**
   * Verifica quali componenti l'utente possiede già
   */
  async checkOwnedComponents(needed, availableProducts) {
    const owned = {
      blades: new Set(),
      ratchets: new Set(),
      bits: new Set()
    };

    const ownedProducts = await CollectionManager.getOwnedProducts();

    ownedProducts.forEach(product => {
      if (product.blade?.name && needed.blades.has(product.blade.name)) {
        owned.blades.add(product.blade.name);
      }
      if (product.ratchet?.name && needed.ratchets.has(product.ratchet.name)) {
        owned.ratchets.add(product.ratchet.name);
      }
      if (product.bit?.name && needed.bits.has(product.bit.name)) {
        owned.bits.add(product.bit.name);
      }
    });

    return owned;
  }

  /**
   * Calcola quali componenti mancano
   */
  calculateMissingComponents(needed, owned) {
    const missing = {
      blades: [...needed.blades].filter(b => !owned.blades.has(b)),
      ratchets: [...needed.ratchets].filter(r => !owned.ratchets.has(r)),
      bits: [...needed.bits].filter(b => !owned.bits.has(b))
    };

    const totalNeeded = needed.blades.size + needed.ratchets.size + needed.bits.size;
    const totalOwned = owned.blades.size + owned.ratchets.size + owned.bits.size;
    const totalMissing = missing.blades.length + missing.ratchets.length + missing.bits.length;

    return { missing, totalNeeded, totalOwned, totalMissing };
  }

  /**
   * Calcola il punteggio di utilità di un prodotto per i componenti mancanti
   */
  calculateProductScore(product, missingComponents) {
    let score = 0;
    const provides = [];

    // Controlla quali componenti mancanti fornisce il prodotto
    if (product.blade?.name && missingComponents.blades.includes(product.blade.name)) {
      score += this.coverageWeights.blade;
      provides.push({ type: 'blade', name: product.blade.name });
    }
    if (product.ratchet?.name && missingComponents.ratchets.includes(product.ratchet.name)) {
      score += this.coverageWeights.ratchet;
      provides.push({ type: 'ratchet', name: product.ratchet.name });
    }
    if (product.bit?.name && missingComponents.bits.includes(product.bit.name)) {
      score += this.coverageWeights.bit;
      provides.push({ type: 'bit', name: product.bit.name });
    }

    // Bonus per tier
    const tierBonus = this.tierWeights[product.tier] || 0;
    score += tierBonus;

    return { score, provides };
  }

  /**
   * Ottimizza la selezione prodotti usando algoritmo greedy
   */
  optimizeProductSelection(missingComponents, availableProducts, maxProducts = 10) {
    const candidates = availableProducts.map(product => {
      const { score, provides } = this.calculateProductScore(product, missingComponents);
      return {
        ...product,
        utilityScore: score,
        provides,
        efficiency: provides.length > 0 ? score / provides.length : 0
      };
    }).filter(p => p.utilityScore > 0);

    // Ordina per punteggio di utilità (decrescente)
    candidates.sort((a, b) => {
      if (a.utilityScore !== b.utilityScore) {
        return b.utilityScore - a.utilityScore;
      }
      // Se punteggio uguale, preferisci più componenti forniti
      if (b.provides.length !== a.provides.length) {
        return b.provides.length - a.provides.length;
      }
      // Se ancora uguale, preferisci prezzo più basso
      const priceA = this.parsePriceRange(a.price);
      const priceB = this.parsePriceRange(b.price);
      return priceA - priceB;
    });

    // Algoritmo greedy per selezionare prodotti
    const selected = [];
    const covered = {
      blades: new Set(),
      ratchets: new Set(),
      bits: new Set()
    };

    for (const product of candidates) {
      if (selected.length >= maxProducts) break;

      // Controlla se il prodotto fornisce componenti mancanti
      const providesNewComponents = product.provides.some(provide => {
        switch (provide.type) {
          case 'blade': return !covered.blades.has(provide.name);
          case 'ratchet': return !covered.ratchets.has(provide.name);
          case 'bit': return !covered.bits.has(provide.name);
          default: return false;
        }
      });

      if (providesNewComponents) {
        selected.push(product);
        product.provides.forEach(provide => {
          switch (provide.type) {
            case 'blade': covered.blades.add(provide.name); break;
            case 'ratchet': covered.ratchets.add(provide.name); break;
            case 'bit': covered.bits.add(provide.name); break;
          }
        });
      }
    }

    return selected;
  }

  /**
   * Calcola alternative con diverso rapporto qualità/prezzo
   */
  calculateAlternatives(missingComponents, availableProducts, optimalSolution) {
    const alternatives = [];

    // Alternativa Budget (solo tier B e A)
    const budgetProducts = availableProducts.filter(p => ['A', 'B'].includes(p.tier));
    const budgetSolution = this.optimizeProductSelection(missingComponents, budgetProducts, 15);

    if (budgetSolution.length > 0 && budgetSolution !== optimalSolution) {
      alternatives.push({
        name: 'Soluzione Budget',
        description: 'Prodotti più economici (Tier A-B)',
        products: budgetSolution,
        estimatedCost: this.calculateTotalCost(budgetSolution),
        productsCount: budgetSolution.length
      });
    }

    // Alternativa Premium (solo tier S+ e S)
    const premiumProducts = availableProducts.filter(p => ['S+', 'S'].includes(p.tier));
    const premiumSolution = this.optimizeProductSelection(missingComponents, premiumProducts, 10);

    if (premiumSolution.length > 0 && premiumSolution !== optimalSolution) {
      alternatives.push({
        name: 'Soluzione Premium',
        description: 'Solo prodotti di alta qualità (Tier S+ - S)',
        products: premiumSolution,
        estimatedCost: this.calculateTotalCost(premiumSolution),
        productsCount: premiumSolution.length
      });
    }

    return alternatives;
  }

  /**
   * Estrae il prezzo medio da un range (es: "25-30€" -> 27.5)
   */
  parsePriceRange(priceRange) {
    const matches = priceRange.match(/(\d+)-(\d+)€/);
    if (matches) {
      const min = parseInt(matches[1]);
      const max = parseInt(matches[2]);
      return (min + max) / 2;
    }
    return 0;
  }

  /**
   * Calcola il costo totale stimato
   */
  calculateTotalCost(products) {
    return products.reduce((total, product) => {
      return total + this.parsePriceRange(product.price);
    }, 0);
  }

  /**
   * Calcola il risparmio rispetto alla soluzione più costosa
   */
  calculateSavings(optimalCost, alternatives) {
    if (alternatives.length === 0) return { amount: 0, percentage: 0 };

    const maxCost = Math.max(optimalCost, ...alternatives.map(a => a.estimatedCost));
    const savings = maxCost - optimalCost;
    const percentage = maxCost > 0 ? Math.round((savings / maxCost) * 100) : 0;

    return { amount: savings, percentage, maxCost };
  }
}

const ShoppingOptimizer = ({ team, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [engine] = useState(() => new OptimizationEngine());

  const runOptimization = useCallback(async () => {
    if (!team || !team.every(b => b.blade && b.ratchet && b.bit)) {
      return;
    }

    setLoading(true);
    try {
      // STEP 1: Analizza i componenti necessari
      const { needed, componentMap } = engine.analyzeTeamNeeds(team);

      // STEP 2: Carica prodotti disponibili
      const availableProducts = await DatabaseUtils.getAllProducts();

      // STEP 3: Verifica cosa hai già nella collezione
      const owned = await engine.checkOwnedComponents(needed, availableProducts);

      // STEP 4: Calcola cosa manca
      const { missing, totalNeeded, totalOwned, totalMissing } = engine.calculateMissingComponents(needed, owned);

      // STEP 5: Se mancano componenti, calcola ottimizzazione
      let optimalSolution = [];
      let alternatives = [];
      let savings = { amount: 0, percentage: 0 };

      if (totalMissing > 0) {
        optimalSolution = engine.optimizeProductSelection(missing, availableProducts);
        alternatives = engine.calculateAlternatives(missing, availableProducts, optimalSolution);

        const optimalCost = engine.calculateTotalCost(optimalSolution);
        savings = engine.calculateSavings(optimalCost, alternatives);
      }

      setAnalysis({
        needed,
        owned,
        missing,
        totalNeeded,
        totalOwned,
        totalMissing,
        optimalSolution,
        alternatives,
        savings,
        componentMap
      });
    } catch (error) {
      console.error('Errore ottimizzazione:', error);
    } finally {
      setLoading(false);
    }
  }, [team, engine]);

  // Esegui ottimizzazione quando cambia il team
  React.useEffect(() => {
    runOptimization();
  }, [runOptimization]);

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

  if (!team || !team.every(b => b.blade && b.ratchet && b.bit)) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Team Incompleto</h3>
            <p className="text-gray-600">Completa tutti i Beyblade del team per vedere l'ottimizzazione degli acquisti.</p>
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <Calculator className="animate-pulse mx-auto mb-4 text-blue-500" size={48} />
            <p className="text-gray-600">Calcolando ottimizzazione acquisti...</p>
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
          {analysis && (
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
                    <div className="space-y-1 text-sm">
                      {analysis.owned.blades.size > 0 && (
                        <div>• Blade: {Array.from(analysis.owned.blades).join(', ')}</div>
                      )}
                      {analysis.owned.ratchets.size > 0 && (
                        <div>• Ratchet: {Array.from(analysis.owned.ratchets).join(', ')}</div>
                      )}
                      {analysis.owned.bits.size > 0 && (
                        <div>• Bit: {Array.from(analysis.owned.bits).join(', ')}</div>
                      )}
                      {analysis.totalOwned === 0 && (
                        <div className="text-gray-500 italic">Nessun componente</div>
                      )}
                    </div>
                  </div>

                  {/* Missing Components */}
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <XCircle size={16} />
                      ❌ TI MANCANO:
                    </h4>
                    <div className="space-y-1 text-sm">
                      {analysis.missing.blades.length > 0 && (
                        <div>• Blade: {analysis.missing.blades.join(', ')}</div>
                      )}
                      {analysis.missing.ratchets.length > 0 && (
                        <div>• Ratchet: {analysis.missing.ratchets.join(', ')}</div>
                      )}
                      {analysis.missing.bits.length > 0 && (
                        <div>• Bit: {analysis.missing.bits.join(', ')}</div>
                      )}
                      {analysis.totalMissing === 0 && (
                        <div className="text-green-600 font-semibold">Hai tutti i componenti! 🎉</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">{analysis.totalNeeded}</div>
                    <div className="text-xs text-gray-600">Componenti Totali</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-green-600">{analysis.totalOwned}</div>
                    <div className="text-xs text-gray-600">Già Posseduti</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">{analysis.totalMissing}</div>
                    <div className="text-xs text-gray-600">Da Acquistare</div>
                  </div>
                </div>
              </div>

              {/* OPTIMAL SOLUTION */}
              {analysis.totalMissing > 0 && analysis.optimalSolution.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <Zap size={20} />
                    🛒 PRODOTTI CONSIGLIATI (Spesa minima)
                  </h3>

                  <div className="space-y-3">
                    {analysis.optimalSolution.map((product, index) => (
                      <div key={product.id} className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
                            {product.setName && (
                              <p className="text-xs text-purple-600 font-semibold mt-1 bg-purple-50 inline-block px-2 py-1 rounded">
                                📦 Set: {product.setName}
                              </p>
                            )}

                            {/* What it provides */}
                            <div className="mt-2">
                              <p className="font-semibold text-green-700 mb-1">✅ Ti fornisce:</p>
                              <div className="flex flex-wrap gap-2">
                                {product.provides?.map((provide, i) => (
                                  <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {provide.type}: {provide.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <div className={`text-sm font-bold ${getTierColor(product.tier)}`}>
                              Tier {product.tier}
                            </div>
                            <p className="text-lg font-bold text-green-600">{product.price}</p>
                            {product.source === 'custom' && (
                              <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-semibold mt-1">
                                🎨 Personalizzato
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Summary */}
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 items-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          💰 TOTALE SPESA: ~{engine.calculateTotalCost(analysis.optimalSolution).toFixed(0)}€
                        </p>
                        {analysis.savings.percentage > 0 && (
                          <p className="text-sm text-green-700 font-semibold mt-1">
                            💾 RISPARMI: ~{analysis.savings.amount.toFixed(0)}€ ({analysis.savings.percentage}%)
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {analysis.optimalSolution.length} prodotti per {analysis.totalMissing} componenti mancanti
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ALTERNATIVES */}
              {analysis.alternatives.length > 0 && (
                <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <TrendingDown size={20} />
                      ⚠️ ALTERNATIVE PIÙ COSTOSE
                    </h3>
                    <button
                      onClick={() => setShowAlternatives(!showAlternatives)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showAlternatives ? 'Nascondi' : 'Mostra'}
                    </button>
                  </div>

                  {showAlternatives && (
                    <div className="space-y-4">
                      {analysis.alternatives.map((alternative, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{alternative.name}</h4>
                            <span className="text-sm font-bold text-red-600">
                              ~{alternative.estimatedCost.toFixed(0)}€
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alternative.description}</p>
                          <div className="text-xs text-gray-500">
                            {alternative.productsCount} prodotti
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Already Complete */}
              {analysis.totalMissing === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Team Completo! 🎉</h3>
                  <p className="text-gray-600">
                    Hai già tutti i componenti necessari per creare il tuo team.
                    Nessun acquisto richiesto!
                  </p>
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