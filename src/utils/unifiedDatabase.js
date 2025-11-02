import { DatabaseUtils, OfficialDatabaseManager, CollectionManager } from './databaseManager.js';

/**
 * Sistema unificato che collega Database → Collezione → Ottimizzatore
 * Centralizza TUTTA la logica per evitare duplicazioni e garantire consistenza
 */
class UnifiedDatabaseSystem {
  constructor() {
    this.cache = {
      products: null,              // Tutti i prodotti (ufficiali + custom)
      ownedProducts: null,         // Prodotti posseduti
      availableComponents: null,   // Componenti disponibili per assemblaggio
      lastUpdate: null
    };

    this.cacheTimeout = 5 * 60 * 1000; // 5 minuti
  }

  /**
   * METODO 1: Ottieni TUTTI i prodotti disponibili per l'acquisto
   * Include: ufficiali + custom, esclude: discontinued
   */
  async getAllAvailableProducts() {
    // Check cache
    if (this.cache.products && (Date.now() - this.cache.lastUpdate < this.cacheTimeout)) {
      return this.cache.products;
    }

    try {
      // Carica da database ufficiale
      const officialDb = await OfficialDatabaseManager.load();

      // Carica prodotti personalizzati
      const customProducts = await this.loadCustomProducts();

      // Merge e filtra solo 'active' e 'upcoming'
      const allProducts = [
        ...officialDb.products
          .filter(p => p.status !== 'discontinued')
          .map(p => ({
            ...p,
            source: 'official',
            status: p.status || 'active'
          })),
        ...customProducts.map(p => ({
          ...p,
          source: 'custom',
          status: p.status || 'active'
          }))
      ];

      // Ordina per tier e poi per nome
      const tierOrder = { 'S+': 1, 'S': 2, 'A': 3, 'B': 4 };
      allProducts.sort((a, b) => {
        const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
        if (tierDiff !== 0) return tierDiff;
        return a.name.localeCompare(b.name);
      });

      this.cache.products = allProducts;
      this.cache.lastUpdate = Date.now();

      return allProducts;
    } catch (error) {
      console.error('Errore caricamento prodotti disponibili:', error);
      return [];
    }
  }

  /**
   * METODO 2: Ottieni componenti POSSEDUTI dall'utente
   * Estrae TUTTI i pezzi dai prodotti nella collezione
   */
  async getOwnedComponents() {
    // Check cache
    if (this.cache.availableComponents && (Date.now() - this.cache.lastUpdate < this.cacheTimeout)) {
      return this.cache.availableComponents;
    }

    try {
      const ownedProducts = await CollectionManager.getOwnedProducts();

      const components = {
        blades: new Set(),
        ratchets: new Set(),
        bits: new Set(),
        products: ownedProducts // Mantieni riferimento ai prodotti
      };

      ownedProducts.forEach(product => {
        if (product.blade?.name) components.blades.add(product.blade.name);
        if (product.ratchet?.name) components.ratchets.add(product.ratchet.name);
        if (product.bit?.name) components.bits.add(product.bit.name);
      });

      this.cache.availableComponents = components;
      this.cache.ownedProducts = ownedProducts;

      return components;
    } catch (error) {
      console.error('Errore caricamento componenti posseduti:', error);
      return {
        blades: new Set(),
        ratchets: new Set(),
        bits: new Set(),
        products: []
      };
    }
  }

  /**
   * METODO 3: Verifica se hai un componente specifico
   */
  async hasComponent(componentType, componentName) {
    const owned = await this.getOwnedComponents();

    switch(componentType) {
      case 'blade':
        return owned.blades.has(componentName);
      case 'ratchet':
        return owned.ratchets.has(componentName);
      case 'bit':
        return owned.bits.has(componentName);
      default:
        return false;
    }
  }

  /**
   * METODO 4: Ottieni componenti MANCANTI per un team
   * Confronta team richiesto con collezione posseduta
   */
  async getMissingComponentsForTeam(team) {
    const owned = await this.getOwnedComponents();

    const needed = {
      blades: new Set(),
      ratchets: new Set(),
      bits: new Set()
    };

    // Estrai cosa serve dal team
    team.forEach(beyblade => {
      if (beyblade.blade) needed.blades.add(beyblade.blade);
      if (beyblade.ratchet) needed.ratchets.add(beyblade.ratchet);
      if (beyblade.bit) needed.bits.add(beyblade.bit);
    });

    // Calcola cosa MANCA
    const missing = {
      blades: [...needed.blades].filter(b => !owned.blades.has(b)),
      ratchets: [...needed.ratchets].filter(r => !owned.ratchets.has(r)),
      bits: [...needed.bits].filter(b => !owned.bits.has(b))
    };

    const totalNeeded = needed.blades.size + needed.ratchets.size + needed.bits.size;
    const totalOwned = owned.blades.size + owned.ratchets.size + owned.bits.size;
    const totalMissing = missing.blades.length + missing.ratchets.length + missing.bits.length;
    const isComplete = totalMissing === 0;

    return {
      needed,
      owned,
      missing,
      totalNeeded,
      totalOwned,
      totalMissing,
      isComplete,
      completionPercentage: totalNeeded > 0 ? Math.round(((totalNeeded - totalMissing) / totalNeeded) * 100) : 100
    };
  }

  /**
   * METODO 5: Trova prodotti che forniscono componenti mancanti
   */
  async findProductsForMissingComponents(missingComponents) {
    const allProducts = await this.getAllAvailableProducts();

    const candidateProducts = allProducts.filter(product => {
      // Controlla se il prodotto fornisce ALMENO UN componente mancante
      const providesBlade = missingComponents.blades.includes(product.blade?.name);
      const providesRatchet = missingComponents.ratchets.includes(product.ratchet?.name);
      const providesBit = missingComponents.bits.includes(product.bit?.name);

      return providesBlade || providesRatchet || providesBit;
    });

    // Aggiungi metadati su cosa fornisce
    return candidateProducts.map(product => {
      const provides = [];

      if (missingComponents.blades.includes(product.blade?.name)) {
        provides.push({ type: 'blade', name: product.blade.name });
      }
      if (missingComponents.ratchets.includes(product.ratchet?.name)) {
        provides.push({ type: 'ratchet', name: product.ratchet.name });
      }
      if (missingComponents.bits.includes(product.bit?.name)) {
        provides.push({ type: 'bit', name: product.bit.name });
      }

      return {
        ...product,
        provides,
        coverageScore: provides.length // Quanti pezzi mancanti copre
      };
    });
  }

  /**
   * METODO 6: Ottimizza acquisti per spendere MENO
   * Algoritmo greedy che minimizza numero prodotti + costo
   */
  async optimizePurchase(team) {
    try {
      // STEP 1: Calcola cosa manca
      const analysis = await this.getMissingComponentsForTeam(team);

      if (analysis.isComplete) {
        return {
          needsPurchase: false,
          message: '✅ Hai già tutti i componenti per creare questo team!',
          analysis,
          optimalSolution: [],
          totalCost: 0,
          alternatives: [],
          savings: { amount: 0, percentage: 0 }
        };
      }

      // STEP 2: Trova prodotti candidati
      const candidates = await this.findProductsForMissingComponents(analysis.missing);

      if (candidates.length === 0) {
        return {
          needsPurchase: true,
          message: '❌ Nessun prodotto disponibile fornisce i componenti mancanti',
          analysis,
          optimalSolution: [],
          totalCost: 0,
          alternatives: [],
          savings: { amount: 0, percentage: 0 }
        };
      }

      // STEP 3: Ordina per efficienza (più pezzi forniti + tier alto + prezzo basso)
      const rankedCandidates = candidates.map(product => {
        const tierWeight = { 'S+': 1000, 'S': 800, 'A': 600, 'B': 400 }[product.tier] || 0;
        const priceAvg = this.parsePrice(product.price);

        // Score = (pezzi forniti * coverageWeight) + tierWeight - (prezzo / 10)
        const score = (product.coverageScore * 100) + tierWeight - (priceAvg / 10);

        return {
          ...product,
          score,
          priceAvg
        };
      }).sort((a, b) => b.score - a.score);

      // STEP 4: Algoritmo greedy - seleziona prodotti ottimali
      const selectedProducts = this.greedySelect(analysis.missing, rankedCandidates);

      // STEP 5: Calcola costo totale
      const totalCost = selectedProducts.reduce((sum, p) => sum + p.priceAvg, 0);

      // STEP 6: Trova alternative (Budget vs Premium)
      const alternatives = this.calculateAlternatives(
        analysis.missing,
        rankedCandidates,
        selectedProducts
      );

      // STEP 7: Calcola risparmio
      const savings = this.calculateSavings(totalCost, alternatives);

      return {
        needsPurchase: true,
        analysis,
        optimalSolution: selectedProducts,
        totalCost,
        alternatives,
        savings,
        candidatesCount: candidates.length
      };

    } catch (error) {
      console.error('Errore ottimizzazione acquisti:', error);
      return {
        needsPurchase: false,
        message: '❌ Errore durante l\'ottimizzazione',
        error: error.message
      };
    }
  }

  /**
   * Helper: Algoritmo greedy per selezione prodotti
   */
  greedySelect(missing, candidates) {
    const selected = [];
    const covered = { blades: new Set(), ratchets: new Set(), bits: new Set() };

    for (const product of candidates) {
      // Se abbiamo già coperto tutto, fermati
      if (
        covered.blades.size >= missing.blades.length &&
        covered.ratchets.size >= missing.ratchets.length &&
        covered.bits.size >= missing.bits.length
      ) {
        break;
      }

      // Controlla se questo prodotto aggiunge nuovi pezzi mancanti
      let addsNew = false;
      product.provides.forEach(p => {
        if (p.type === 'blade' && !covered.blades.has(p.name)) addsNew = true;
        if (p.type === 'ratchet' && !covered.ratchets.has(p.name)) addsNew = true;
        if (p.type === 'bit' && !covered.bits.has(p.name)) addsNew = true;
      });

      if (addsNew) {
        selected.push(product);

        // Marca componenti come coperti
        product.provides.forEach(p => {
          if (p.type === 'blade') covered.blades.add(p.name);
          if (p.type === 'ratchet') covered.ratchets.add(p.name);
          if (p.type === 'bit') covered.bits.add(p.name);
        });
      }
    }

    return selected;
  }

  /**
   * METODO 7: Calcola alternative Budget/Premium
   */
  calculateAlternatives(missing, allCandidates, optimalSolution) {
    const alternatives = [];

    try {
      // Alternativa Budget (solo A e B tier)
      const budgetCandidates = allCandidates.filter(p => ['A', 'B'].includes(p.tier));
      if (budgetCandidates.length > 0) {
        const budgetSolution = this.greedySelect(missing, budgetCandidates);
        if (budgetSolution.length > 0) {
          alternatives.push({
            name: 'Soluzione Budget',
            description: 'Prodotti economici (Tier A-B)',
            products: budgetSolution,
            totalCost: budgetSolution.reduce((sum, p) => sum + p.priceAvg, 0)
          });
        }
      }

      // Alternativa Premium (solo S+ e S tier)
      const premiumCandidates = allCandidates.filter(p => ['S+', 'S'].includes(p.tier));
      if (premiumCandidates.length > 0) {
        const premiumSolution = this.greedySelect(missing, premiumCandidates);
        if (premiumSolution.length > 0) {
          alternatives.push({
            name: 'Soluzione Premium',
            description: 'Prodotti top tier (S+/S)',
            products: premiumSolution,
            totalCost: premiumSolution.reduce((sum, p) => sum + p.priceAvg, 0)
          });
        }
      }

      // Alternativa Max Coverage (massimo pezzi per prodotto)
      const coverageCandidates = allCandidates
        .filter(p => p.coverageScore >= 2) // Solo prodotti che forniscono 2+ pezzi
        .sort((a, b) => b.coverageScore - a.coverageScore);

      if (coverageCandidates.length > 0) {
        const coverageSolution = this.greedySelect(missing, coverageCandidates);
        if (coverageSolution.length > 0) {
          alternatives.push({
            name: 'Massima Copertura',
            description: 'Prodotti con più componenti',
            products: coverageSolution,
            totalCost: coverageSolution.reduce((sum, p) => sum + p.priceAvg, 0)
          });
        }
      }

    } catch (error) {
      console.error('Errore calcolo alternative:', error);
    }

    return alternatives;
  }

  /**
   * Helper: Parse prezzo medio
   */
  parsePrice(priceString) {
    if (!priceString) return 0;

    const match = priceString.match(/(\d+)-(\d+)€/);
    if (match) {
      const min = parseInt(match[1]);
      const max = parseInt(match[2]);
      return (min + max) / 2;
    }

    // Fallback: cerca qualsiasi numero nel prezzo
    const numberMatch = priceString.match(/(\d+)€/);
    return numberMatch ? parseInt(numberMatch[1]) : 0;
  }

  /**
   * Helper: Calcola risparmio
   */
  calculateSavings(optimalCost, alternatives) {
    if (alternatives.length === 0) {
      return { amount: 0, percentage: 0, maxCost: optimalCost };
    }

    const allCosts = [optimalCost, ...alternatives.map(a => a.totalCost)];
    const maxCost = Math.max(...allCosts);
    const savings = maxCost - optimalCost;
    const percentage = maxCost > 0 ? Math.round((savings / maxCost) * 100) : 0;

    return { amount: savings, percentage, maxCost };
  }

  /**
   * METODO 8: Invalida cache quando cambia qualcosa
   */
  invalidateCache() {
    this.cache = {
      products: null,
      ownedProducts: null,
      availableComponents: null,
      lastUpdate: null
    };
  }

  /**
   * METODO 9: Carica prodotti personalizzati
   */
  async loadCustomProducts() {
    try {
      // Per ora non ci sono prodotti custom, restituisce array vuoto
      // In futuro implementare gestione prodotti personalizzati
      return [];
    } catch (error) {
      console.error('Errore caricamento prodotti personalizzati:', error);
      return [];
    }
  }

  /**
   * METODO 10: Statistiche complete del sistema
   */
  async getSystemStats() {
    try {
      const [allProducts, ownedComponents] = await Promise.all([
        this.getAllAvailableProducts(),
        this.getOwnedComponents()
      ]);

      const stats = {
        totalProducts: allProducts.length,
        ownedProducts: ownedComponents.products.length,
        uniqueBladesOwned: ownedComponents.blades.size,
        uniqueRatchetsOwned: ownedComponents.ratchets.size,
        uniqueBitsOwned: ownedComponents.bits.size,
        totalUniquePiecesOwned: ownedComponents.blades.size + ownedComponents.ratchets.size + ownedComponents.bits.size,
        productsByTier: {},
        productsByFormat: {},
        completionRate: 0
      };

      // Calcola statistiche per tier
      allProducts.forEach(product => {
        stats.productsByTier[product.tier] = (stats.productsByTier[product.tier] || 0) + 1;
        stats.productsByFormat[product.format] = (stats.productsByFormat[product.format] || 0) + 1;
      });

      // Calcola tasso completamento
      const totalPossiblePieces = new Set([
        ...allProducts.map(p => p.blade?.name),
        ...allProducts.map(p => p.ratchet?.name),
        ...allProducts.map(p => p.bit?.name)
      ].filter(Boolean)).size;

      if (totalPossiblePieces > 0) {
        stats.completionRate = Math.round((stats.totalUniquePiecesOwned / totalPossiblePieces) * 100);
      }

      return stats;
    } catch (error) {
      console.error('Errore calcolo statistiche sistema:', error);
      return null;
    }
  }
}

// Singleton globale
export const UnifiedDB = new UnifiedDatabaseSystem();
export default UnifiedDB;