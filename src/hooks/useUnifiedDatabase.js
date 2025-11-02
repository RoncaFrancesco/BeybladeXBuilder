import { useState, useEffect, useCallback } from 'react';
import UnifiedDB from '../utils/unifiedDatabase.js';

/**
 * Hook che sincronizza automaticamente database → collezione → ottimizzatore
 * Fornisce un'interfaccia React-friendly per il sistema unificato
 */
export function useUnifiedDatabase(team = null) {
  const [products, setProducts] = useState([]);
  const [ownedComponents, setOwnedComponents] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);

  // Carica dati iniziali
  useEffect(() => {
    loadData();
  }, []);

  // Ri-ottimizza quando cambia il team
  useEffect(() => {
    if (team && team.length > 0 && team.every(bey => bey.blade && bey.ratchet && bey.bit)) {
      optimizeForTeam(team);
    } else {
      setOptimization(null);
    }
  }, [team]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [allProducts, owned, stats] = await Promise.all([
        UnifiedDB.getAllAvailableProducts(),
        UnifiedDB.getOwnedComponents(),
        UnifiedDB.getSystemStats()
      ]);

      setProducts(allProducts);
      setOwnedComponents(owned);
      setSystemStats(stats);

    } catch (err) {
      console.error('Errore caricamento dati unificati:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeForTeam = useCallback(async (teamData) => {
    setOptimizing(true);
    setError(null);

    try {
      const result = await UnifiedDB.optimizePurchase(teamData);
      setOptimization(result);
    } catch (err) {
      console.error('Errore ottimizzazione team:', err);
      setError(err.message);
    } finally {
      setOptimizing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    UnifiedDB.invalidateCache();
    await loadData();

    // Ri-ottimizza se c'è un team attivo
    if (team && team.length > 0) {
      await optimizeForTeam(team);
    }
  }, [loadData, optimizeForTeam, team]);

  const addProductToCollection = useCallback(async (product) => {
    try {
      // Importiamo CollectionManager dinamicamente per evitare circular dependency
      const { CollectionManager } = await import('../utils/databaseManager.js');
      await CollectionManager.addProduct(product.id);

      // Invalida cache e ricarica dati
      UnifiedDB.invalidateCache();
      await refresh();

      return { success: true };
    } catch (err) {
      console.error('Errore aggiunta prodotto alla collezione:', err);
      return { success: false, error: err.message };
    }
  }, [refresh]);

  const removeProductFromCollection = useCallback(async (productId) => {
    try {
      const { CollectionManager } = await import('../utils/databaseManager.js');
      await CollectionManager.removeProduct(productId);

      // Invalida cache e ricarica dati
      UnifiedDB.invalidateCache();
      await refresh();

      return { success: true };
    } catch (err) {
      console.error('Errore rimozione prodotto dalla collezione:', err);
      return { success: false, error: err.message };
    }
  }, [refresh]);

  const checkComponentOwnership = useCallback(async (componentType, componentName) => {
    try {
      return await UnifiedDB.hasComponent(componentType, componentName);
    } catch (err) {
      console.error('Errore verifica possesso componente:', err);
      return false;
    }
  }, []);

  const getTeamAnalysis = useCallback(async (teamData) => {
    try {
      return await UnifiedDB.getMissingComponentsForTeam(teamData);
    } catch (err) {
      console.error('Errore analisi team:', err);
      return null;
    }
  }, []);

  return {
    // Dati
    products,
    ownedComponents,
    optimization,
    systemStats,

    // Stati
    loading,
    optimizing,
    error,

    // Metodi
    refresh,
    optimizeForTeam,
    addProductToCollection,
    removeProductFromCollection,
    checkComponentOwnership,
    getTeamAnalysis,

    // Utility
    invalidateCache: () => UnifiedDB.invalidateCache()
  };
}

/**
 * Hook semplificato per ottenere solo le statistiche del sistema
 */
export function useSystemStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const systemStats = await UnifiedDB.getSystemStats();
        setStats(systemStats);
      } catch (error) {
        console.error('Errore caricamento statistiche:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading };
}

/**
 * Hook per gestione componenti posseduti
 */
export function useOwnedComponents() {
  const [ownedComponents, setOwnedComponents] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshOwnedComponents = useCallback(async () => {
    setLoading(true);
    try {
      const components = await UnifiedDB.getOwnedComponents();
      setOwnedComponents(components);
    } catch (error) {
      console.error('Errore caricamento componenti posseduti:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOwnedComponents();
  }, [refreshOwnedComponents]);

  const checkOwnership = useCallback(async (type, name) => {
    return await UnifiedDB.hasComponent(type, name);
  }, []);

  return {
    ownedComponents,
    loading,
    refresh: refreshOwnedComponents,
    checkOwnership
  };
}

export default useUnifiedDatabase;