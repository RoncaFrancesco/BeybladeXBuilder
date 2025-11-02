/**
 * Database Manager per Beyblade X Team Builder
 * Gestisce caricamento, salvataggio e operazioni CRUD sul database
 */

import { validateDatabase, formatValidationErrors, extractUniqueComponents, generateProductId } from '../data/databaseSchema.js';
import officialDatabase from '../data/officialDatabase.json';

// Storage keys
export const STORAGE_KEYS = {
  OFFICIAL_DB: 'beyblade-official-database',
  COLLECTION: 'beyblade-collection',
  CUSTOM_PRODUCTS: 'customProducts',
  BUILD_CACHE: 'beyblade-build-cache'
};

// Cache per ottimizzazione
let dbCache = {
  official: null,
  custom: null,
  collection: null,
  lastLoad: null
};

/**
 * Storage manager con fallback per ambienti diversi
 */
class StorageManager {
  static async get(key) {
    try {
      // Try window.storage first (Claude.ai environment)
      if (window.storage && typeof window.storage.get === 'function') {
        const result = await window.storage.get(key);
        return result?.value ? JSON.parse(result.value) : null;
      }

      // Fallback to localStorage
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Errore caricamento ${key}:`, error);
      return null;
    }
  }

  static async set(key, value) {
    try {
      const serialized = JSON.stringify(value);

      // Try window.storage first (Claude.ai environment)
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set(key, serialized);
        return true;
      }

      // Fallback to localStorage
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Errore salvataggio ${key}:`, error);
      return false;
    }
  }

  static async remove(key) {
    try {
      // Try window.storage first (Claude.ai environment)
      if (window.storage && typeof window.storage.delete === 'function') {
        await window.storage.delete(key);
        return true;
      }

      // Fallback to localStorage
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Errore rimozione ${key}:`, error);
      return false;
    }
  }

  static async list(prefix = null) {
    try {
      // Try window.storage first (Claude.ai environment)
      if (window.storage && typeof window.storage.list === 'function') {
        const keys = await window.storage.list();
        return prefix
          ? keys.filter(k => k.key.startsWith(prefix)).map(k => k.key)
          : keys.map(k => k.key);
      }

      // Fallback to localStorage
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (!prefix || key.startsWith(prefix))) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Errore elenco chiavi:', error);
      return [];
    }
  }
}

/**
 * Gestore del database ufficiale
 */
export class OfficialDatabaseManager {
  static async load() {
    // Check cache first
    if (dbCache.official && dbCache.lastLoad && (Date.now() - dbCache.lastLoad) < 5 * 60 * 1000) {
      return dbCache.official;
    }

    try {
      // Try loading from storage first
      const stored = await StorageManager.get(STORAGE_KEYS.OFFICIAL_DB);
      if (stored) {
        const validation = validateDatabase(stored);
        if (validation.valid) {
          dbCache.official = stored;
          dbCache.lastLoad = Date.now();
          return stored;
        } else {
          console.warn('Database in storage non valido, uso fallback:', formatValidationErrors(validation));
        }
      }

      // Fallback to imported JSON
      const validation = validateDatabase(officialDatabase);
      if (!validation.valid) {
        throw new Error(`Database ufficiale corrotto: ${formatValidationErrors(validation)}`);
      }

      // Cache and store the valid database
      dbCache.official = officialDatabase;
      dbCache.lastLoad = Date.now();
      await StorageManager.set(STORAGE_KEYS.OFFICIAL_DB, officialDatabase);

      return officialDatabase;
    } catch (error) {
      console.error('Errore caricamento database ufficiale:', error);
      throw new Error('Impossibile caricare il database ufficiale');
    }
  }

  static async update(newDatabase) {
    try {
      // Validate new database
      const validation = validateDatabase(newDatabase);
      if (!validation.valid) {
        throw new Error(`Database non valido: ${formatValidationErrors(validation)}`);
      }

      // Store and cache
      dbCache.official = newDatabase;
      dbCache.lastLoad = Date.now();
      const success = await StorageManager.set(STORAGE_KEYS.OFFICIAL_DB, newDatabase);

      if (!success) {
        throw new Error('Errore salvataggio database');
      }

      return true;
    } catch (error) {
      console.error('Errore aggiornamento database:', error);
      throw error;
    }
  }

  static async addProduct(product) {
    try {
      const db = await this.load();

      // Validate product
      const validation = validateDatabase({
        ...db,
        products: [...db.products, product]
      });

      if (!validation.valid) {
        throw new Error(`Prodotto non valido: ${validation.errors.join(', ')}`);
      }

      // Add product with generated ID if needed
      if (!product.id) {
        product.id = generateProductId(db.products.length);
      }

      // Update database
      const updatedDb = {
        ...db,
        products: [...db.products, product],
        metadata: {
          ...db.metadata,
          totalProducts: db.products.length + 1,
          lastUpdate: new Date().toISOString().split('T')[0]
        }
      };

      return await this.update(updatedDb);
    } catch (error) {
      console.error('Errore aggiunta prodotto:', error);
      throw error;
    }
  }

  static async removeProduct(productId) {
    try {
      const db = await this.load();
      const originalLength = db.products.length;

      const updatedDb = {
        ...db,
        products: db.products.filter(p => p.id !== productId),
        metadata: {
          ...db.metadata,
          totalProducts: db.products.length - 1,
          lastUpdate: new Date().toISOString().split('T')[0]
        }
      };

      if (updatedDb.products.length === originalLength) {
        throw new Error(`Prodotto con ID ${productId} non trovato`);
      }

      return await this.update(updatedDb);
    } catch (error) {
      console.error('Errore rimozione prodotto:', error);
      throw error;
    }
  }

  static async export() {
    try {
      const db = await this.load();
      return JSON.stringify(db, null, 2);
    } catch (error) {
      console.error('Errore export database:', error);
      throw error;
    }
  }

  static async import(jsonString) {
    try {
      const database = JSON.parse(jsonString);
      return await this.update(database);
    } catch (error) {
      console.error('Errore import database:', error);
      throw new Error('JSON non valido o database corrotto');
    }
  }

  static getComponents() {
    if (!dbCache.official) {
      return { blades: [], ratchets: [], bits: [] };
    }
    return extractUniqueComponents(dbCache.official);
  }
}

/**
 * Gestore della collezione personale
 */
export class CollectionManager {
  static async load() {
    if (dbCache.collection) {
      return dbCache.collection;
    }

    try {
      const collection = await StorageManager.get(STORAGE_KEYS.COLLECTION);
      dbCache.collection = collection || { ownedProducts: [], lastUpdate: null };
      return dbCache.collection;
    } catch (error) {
      console.error('Errore caricamento collezione:', error);
      dbCache.collection = { ownedProducts: [], lastUpdate: null };
      return dbCache.collection;
    }
  }

  static async save(collection) {
    try {
      const updatedCollection = {
        ...collection,
        lastUpdate: new Date().toISOString()
      };

      dbCache.collection = updatedCollection;
      const success = await StorageManager.set(STORAGE_KEYS.COLLECTION, updatedCollection);

      if (!success) {
        throw new Error('Errore salvataggio collezione');
      }

      return true;
    } catch (error) {
      console.error('Errore salvataggio collezione:', error);
      throw error;
    }
  }

  static async addProduct(productId) {
    try {
      const collection = await this.load();
      if (!collection.ownedProducts.includes(productId)) {
        collection.ownedProducts.push(productId);
        return await this.save(collection);
      }
      return true; // Already owned
    } catch (error) {
      console.error('Errore aggiunta prodotto alla collezione:', error);
      throw error;
    }
  }

  static async removeProduct(productId) {
    try {
      const collection = await this.load();
      const originalLength = collection.ownedProducts.length;

      collection.ownedProducts = collection.ownedProducts.filter(id => id !== productId);

      if (collection.ownedProducts.length === originalLength) {
        return false; // Product not in collection
      }

      return await this.save(collection);
    } catch (error) {
      console.error('Errore rimozione prodotto dalla collezione:', error);
      throw error;
    }
  }

  static async isOwned(productId) {
    try {
      const collection = await this.load();
      return collection.ownedProducts.includes(productId);
    } catch (error) {
      console.error('Errore verifica possesso prodotto:', error);
      return false;
    }
  }

  static async getOwnedProducts() {
    try {
      const collection = await this.load();
      const db = await OfficialDatabaseManager.load();

      return collection.ownedProducts.map(productId =>
        db.products.find(p => p.id === productId)
      ).filter(Boolean);
    } catch (error) {
      console.error('Errore caricamento prodotti posseduti:', error);
      return [];
    }
  }

  static async clear() {
    try {
      dbCache.collection = null;
      return await StorageManager.remove(STORAGE_KEYS.COLLECTION);
    } catch (error) {
      console.error('Errore svuotamento collezione:', error);
      throw error;
    }
  }

  static async exportCollection() {
    try {
      // Carica tutti i prodotti disponibili nel database
      const db = await OfficialDatabaseManager.load();
      const customProducts = await CustomProductsManager.load();
      const collection = await this.load();

      // Carica anche i rating
      const ratings = await this.loadRatings();

      // Combina prodotti ufficiali e personalizzati
      const allProducts = [
        ...db.products.map(p => ({ ...p, source: 'official' })),
        ...customProducts.map(p => ({ ...p, source: 'custom', id: p.id || `custom_${Date.now()}` }))
      ];

      // Marca i prodotti posseduti
      const ownedIds = new Set(collection.ownedProducts);
      allProducts.forEach(product => {
        product.owned = ownedIds.has(product.id);
      });

      // Crea un CSV completo con rating
      const csvRows = allProducts.map(product => ({
        '#': product.id.replace('prod_', ''),
        'NOME PRODOTTO': product.name,
        'BLADE': product.blade.name,
        'RATCHET': product.ratchet.name,
        'BIT': product.bit.name,
        'TIER': product.tier,
        'PREZZO': product.price,
        'FORMATO': product.format,
        'POSSEDUTO?': product.owned ? 'YES' : 'NO',
        'RATING BLADE': ratings.blade[product.blade.name] ? ratings.blade[product.blade.name].rating : '',
        'NOTE BLADE': ratings.blade[product.blade.name]?.notes || '',
        'RATING RATCHET': ratings.ratchet[product.ratchet.name] ? ratings.ratchet[product.ratchet.name].rating : '',
        'NOTE RATCHET': ratings.ratchet[product.ratchet.name]?.notes || '',
        'RATING BIT': ratings.bit[product.bit.name] ? ratings.bit[product.bit.name].rating : '',
        'NOTE BIT': ratings.bit[product.bit.name]?.notes || ''
      }));

      const ownedCount = csvRows.filter(r => r['POSSEDUTO?'] === 'YES').length;
      const ratedBlades = csvRows.filter(r => r['RATING BLADE']).length;
      const ratedRatchets = csvRows.filter(r => r['RATING RATCHET']).length;
      const ratedBits = csvRows.filter(r => r['RATING BIT']).length;

      console.log(`Exportati ${csvRows.length} prodotti (${ownedCount} posseduti, ${ratedBlades} blade valutate, ${ratedRatchets} ratchet valutati, ${ratedBits} bit valutati)`);

      return csvRows;
    } catch (error) {
      console.error('Errore esportazione collezione:', error);
      throw error;
    }
  }

  static async loadRatings() {
    try {
      let ratings = { blade: {}, ratchet: {}, bit: {} };

      // Try window.storage first
      if (window.storage && typeof window.storage.get === 'function') {
        const result = await window.storage.get('beyblade-ratings');
        ratings = result?.value ? JSON.parse(result.value) : ratings;
      } else {
        const stored = localStorage.getItem('beyblade-ratings');
        ratings = stored ? JSON.parse(stored) : ratings;
      }

      return ratings;
    } catch (error) {
      console.error('Errore caricamento rating:', error);
      return { blade: {}, ratchet: {}, bit: {} };
    }
  }

  static async saveRatings(ratings) {
    try {
      // Try window.storage first
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set('beyblade-ratings', JSON.stringify(ratings));
      } else {
        localStorage.setItem('beyblade-ratings', JSON.stringify(ratings));
      }
      return true;
    } catch (error) {
      console.error('Errore salvataggio rating:', error);
      throw error;
    }
  }

  static async importCollection(csvData) {
    try {
      // Validazione base
      if (!Array.isArray(csvData)) {
        throw new Error('Dati non validi');
      }

      // Carica la collezione attuale e i rating attuali
      const currentCollection = await this.load();
      const currentOwnedProducts = new Set(currentCollection.ownedProducts);
      const currentRatings = await this.loadRatings();
      const db = await OfficialDatabaseManager.load();

      // Array per i nuovi prodotti da aggiungere
      const newProductIds = [];
      const existingProductIds = [];
      const notFoundProducts = [];

      // Nuovi rating da importare
      const newRatings = { blade: {}, ratchet: {}, bit: {} };
      const updatedRatingsCount = { blade: 0, ratchet: 0, bit: 0 };

      csvData.forEach((row, index) => {
        try {
          // Supporta sia il nuovo formato ("POSSEDUTO?") che quello vecchio ("owned")
          const isOwned = row['POSSEDUTO?'] === 'YES' || row.owned === 'YES';

          // Estrai i dati dal CSV
          const productNumber = row['#'] || row.id;
          const productName = row['NOME PRODOTTO'] || row.name;
          const bladeName = row['BLADE'] || row.blade_name;
          const ratchetName = row['RATCHET'] || row.ratchet_name;
          const bitName = row['BIT'] || row.bit_name;

          // Cerca il prodotto nel database ufficiale usando diversi metodi
          let foundProduct = null;

          // Metodo 1: Cerca per numero prodotto
          if (productNumber) {
            foundProduct = db.products.find(p => p.id === `prod_${String(productNumber).padStart(3, '0')}`);
          }

          // Metodo 2: Cerca per nome esatto
          if (!foundProduct && productName) {
            foundProduct = db.products.find(p => p.name === productName);
          }

          // Metodo 3: Cerca per combinazione componenti
          if (!foundProduct && bladeName && ratchetName && bitName) {
            foundProduct = db.products.find(p =>
              p.blade.name === bladeName &&
              p.ratchet.name === ratchetName &&
              p.bit.name === bitName
            );
          }

          if (foundProduct) {
            // Gestione collezione (solo se POSSEDUTO? = YES)
            if (isOwned) {
              if (currentOwnedProducts.has(foundProduct.id)) {
                existingProductIds.push(foundProduct.id);
              } else {
                newProductIds.push(foundProduct.id);
              }
            }

            // Gestione rating (sempre, indipendentemente dal possesso)
            if (bladeName) {
              const bladeRating = this.parseRating(row['RATING BLADE']);
              const bladeNotes = (row['NOTE BLADE'] || '').trim();

              if (bladeRating > 0 || bladeNotes) {
                newRatings.blade[bladeName] = {
                  rating: bladeRating,
                  notes: bladeNotes
                };
                if (!currentRatings.blade[bladeName] ||
                    currentRatings.blade[bladeName].rating !== bladeRating ||
                    currentRatings.blade[bladeName].notes !== bladeNotes) {
                  updatedRatingsCount.blade++;
                }
              }
            }

            if (ratchetName) {
              const ratchetRating = this.parseRating(row['RATING RATCHET']);
              const ratchetNotes = (row['NOTE RATCHET'] || '').trim();

              if (ratchetRating > 0 || ratchetNotes) {
                newRatings.ratchet[ratchetName] = {
                  rating: ratchetRating,
                  notes: ratchetNotes
                };
                if (!currentRatings.ratchet[ratchetName] ||
                    currentRatings.ratchet[ratchetName].rating !== ratchetRating ||
                    currentRatings.ratchet[ratchetName].notes !== ratchetNotes) {
                  updatedRatingsCount.ratchet++;
                }
              }
            }

            if (bitName) {
              const bitRating = this.parseRating(row['RATING BIT']);
              const bitNotes = (row['NOTE BIT'] || '').trim();

              if (bitRating > 0 || bitNotes) {
                newRatings.bit[bitName] = {
                  rating: bitRating,
                  notes: bitNotes
                };
                if (!currentRatings.bit[bitName] ||
                    currentRatings.bit[bitName].rating !== bitRating ||
                    currentRatings.bit[bitName].notes !== bitNotes) {
                  updatedRatingsCount.bit++;
                }
              }
            }

          } else {
            notFoundProducts.push(productName || productNumber || `Riga ${index + 1}`);
          }
        } catch (error) {
          console.warn(`Errore elaborazione riga ${index + 1}:`, error);
        }
      });

      // Aggiorna la collezione se ci sono prodotti posseduti
      let collectionResult = null;
      if (newProductIds.length > 0 || existingProductIds.length > 0) {
        const updatedOwnedProducts = [...currentOwnedProducts, ...newProductIds];
        const uniqueProductIds = [...new Set(updatedOwnedProducts)].sort();

        const collection = {
          ownedProducts: uniqueProductIds,
          lastUpdate: new Date().toISOString()
        };

        collectionResult = await this.save(collection);
      }

      // Aggiorna i rating
      await this.saveRatings(newRatings);

      // Log dettagliato
      console.log(`Importazione completata:`);
      console.log(`- Prodotti già presenti: ${existingProductIds.length}`);
      console.log(`- Nuovi prodotti aggiunti: ${newProductIds.length}`);
      console.log(`- Prodotti non trovati: ${notFoundProducts.length}`);
      console.log(`- Rating blade aggiornati: ${updatedRatingsCount.blade}`);
      console.log(`- Rating ratchet aggiornati: ${updatedRatingsCount.ratchet}`);
      console.log(`- Rating bit aggiornati: ${updatedRatingsCount.bit}`);

      if (notFoundProducts.length > 0) {
        console.warn('Prodotti non trovati:', notFoundProducts);
      }

      return collectionResult;
    } catch (error) {
      console.error('Errore importazione collezione:', error);
      throw error;
    }
  }

  // Helper per parsare rating da numero singolo (1-5)
  static parseRating(ratingString) {
    if (!ratingString) return 0;

    const rating = ratingString.toString().trim();

    // Solo formato numerico diretto: 1, 2, 3, 4, 5
    const num = parseInt(rating);
    return isNaN(num) ? 0 : Math.max(0, Math.min(5, num));
  }

  static async getStats() {
    try {
      const collection = await this.load();
      const db = await OfficialDatabaseManager.load();

      const ownedCount = collection.ownedProducts.length;
      const totalCount = db.products.length;
      const percentage = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

      // Stats by tier
      const tierStats = {};
      const ownedProducts = await this.getOwnedProducts();
      ownedProducts.forEach(product => {
        tierStats[product.tier] = (tierStats[product.tier] || 0) + 1;
      });

      // Stats by format
      const formatStats = {};
      ownedProducts.forEach(product => {
        formatStats[product.format] = (formatStats[product.format] || 0) + 1;
      });

      return {
        owned: ownedCount,
        total: totalCount,
        percentage,
        byTier: tierStats,
        byFormat: formatStats,
        lastUpdate: collection.lastUpdate
      };
    } catch (error) {
      console.error('Errore statistiche collezione:', error);
      return {
        owned: 0,
        total: 0,
        percentage: 0,
        byTier: {},
        byFormat: {},
        lastUpdate: null
      };
    }
  }
}

/**
 * Gestore prodotti personalizzati (mantenuto per retrocompatibilità)
 */
export class CustomProductsManager {
  static async load() {
    if (dbCache.custom) {
      return dbCache.custom;
    }

    try {
      const customProducts = await StorageManager.get(STORAGE_KEYS.CUSTOM_PRODUCTS);
      dbCache.custom = customProducts || [];
      return dbCache.custom;
    } catch (error) {
      console.error('Errore caricamento prodotti personalizzati:', error);
      dbCache.custom = [];
      return [];
    }
  }

  static async save(products) {
    try {
      dbCache.custom = products;
      return await StorageManager.set(STORAGE_KEYS.CUSTOM_PRODUCTS, products);
    } catch (error) {
      console.error('Errore salvataggio prodotti personalizzati:', error);
      throw error;
    }
  }

  static async addProduct(product) {
    try {
      const products = await this.load();
      products.push(product);
      return await this.save(products);
    } catch (error) {
      console.error('Errore aggiunta prodotto personalizzato:', error);
      throw error;
    }
  }

  static async removeProduct(index) {
    try {
      const products = await this.load();
      products.splice(index, 1);
      return await this.save(products);
    } catch (error) {
      console.error('Errore rimozione prodotto personalizzato:', error);
      throw error;
    }
  }
}

/**
 * Funzioni utility per l'app
 */
export class DatabaseUtils {
  static async getAllProducts() {
    try {
      const officialDb = await OfficialDatabaseManager.load();
      const customProducts = await CustomProductsManager.load();
      const collection = await CollectionManager.load();

      // Merge official and custom products
      const allProducts = [
        ...officialDb.products.map(p => ({ ...p, source: 'official' })),
        ...customProducts.map(p => ({ ...p, source: 'custom', id: p.id || `custom_${Date.now()}` }))
      ];

      // Add ownership information
      const ownedIds = new Set(collection.ownedProducts);
      allProducts.forEach(product => {
        product.owned = ownedIds.has(product.id);
      });

      return allProducts;
    } catch (error) {
      console.error('Errore caricamento tutti i prodotti:', error);
      return [];
    }
  }

  static async getComponentsWithOwnership() {
    try {
      const collection = await CollectionManager.load();
      const ownedIds = new Set(collection.ownedProducts);
      const officialDb = await OfficialDatabaseManager.load();
      const customProducts = await CustomProductsManager.load();

      // Get all unique components
      const components = extractUniqueComponents(officialDb);

      // Add custom components
      customProducts.forEach(product => {
        if (product.blade && !components.blades.includes(product.blade)) {
          components.blades.push(product.blade);
        }
        if (product.ratchet && !components.ratchets.includes(product.ratchet)) {
          components.ratchets.push(product.ratchet);
        }
        if (product.bit && !components.bits.includes(product.bit)) {
          components.bits.push(product.bit);
        }
      });

      // Sort components
      Object.keys(components).forEach(key => {
        components[key].sort();
      });

      return components;
    } catch (error) {
      console.error('Errore caricamento componenti:', error);
      return { blades: [], ratchets: [], bits: [] };
    }
  }

  static async getProductsByComponent(componentType, componentName) {
    try {
      const allProducts = await this.getAllProducts();

      return allProducts.filter(product => {
        switch (componentType) {
          case 'blade':
            return product.blade?.name === componentName;
          case 'ratchet':
            return product.ratchet?.name === componentName;
          case 'bit':
            return product.bit?.name === componentName;
          default:
            return false;
        }
      });
    } catch (error) {
      console.error('Errore ricerca prodotti per componente:', error);
      return [];
    }
  }

  static async searchProducts(query, filters = {}) {
    try {
      const allProducts = await this.getAllProducts();

      return allProducts.filter(product => {
        // Text search
        const matchesSearch = !query ||
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.blade?.name.toLowerCase().includes(query.toLowerCase()) ||
          product.ratchet?.name.toLowerCase().includes(query.toLowerCase()) ||
          product.bit?.name.toLowerCase().includes(query.toLowerCase());

        // Filters
        const matchesTier = !filters.tier || product.tier === filters.tier;
        const matchesFormat = !filters.format || product.format === filters.format;
        const matchesSource = !filters.source || product.source === filters.source;
        const matchesOwned = !filters.owned === undefined || product.owned === filters.owned;

        return matchesSearch && matchesTier && matchesFormat && matchesSource && matchesOwned;
      });
    } catch (error) {
      console.error('Errore ricerca prodotti:', error);
      return [];
    }
  }

  static clearCache() {
    dbCache = {
      official: null,
      custom: null,
      collection: null,
      lastLoad: null
    };
  }
}

export default {
  OfficialDatabaseManager,
  CollectionManager,
  CustomProductsManager,
  DatabaseUtils,
  StorageManager,
  STORAGE_KEYS
};