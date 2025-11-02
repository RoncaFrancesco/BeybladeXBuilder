/**
 * Schema di validazione per il database Beyblade X
 * Fornisce funzioni per validare prodotti, metadata e struttura completa
 */

// Configurazione schema
export const BEYBLADE_TYPES = ['Attack', 'Defense', 'Stamina', 'Balance'];
export const TIERS = ['S+', 'S', 'A', 'B'];
export const FORMATS = [
  'UX Starter', 'UX Booster', 'UX Dual Pack',
  'BX Starter', 'BX Booster', 'BX Dual Pack', 'Random Booster',
  'Battle Set', 'CX Starter', 'CX Random', 'Vari formati', 'BX', 'Dual Pack'
];

// Schema per validazione prodotto
export const productSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^prod_\d{3}$/,
    description: 'ID univoco prodotto nel formato prod_XXX'
  },
  name: {
    type: 'string',
    required: true,
    minLength: 5,
    maxLength: 100,
    description: 'Nome completo del prodotto'
  },
  blade: {
    type: 'object',
    required: true,
    properties: {
      name: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 50,
        description: 'Nome della blade'
      },
      type: {
        type: 'enum',
        required: true,
        values: BEYBLADE_TYPES,
        description: 'Tipologia della blade'
      }
    }
  },
  ratchet: {
    type: 'object',
    required: true,
    properties: {
      name: {
        type: 'string',
        required: true,
        pattern: /^\d+-\d+$/,
        description: 'Nome ratchet nel formato X-Y'
      },
      type: {
        type: 'enum',
        required: true,
        values: BEYBLADE_TYPES,
        description: 'Tipologia del ratchet'
      }
    }
  },
  bit: {
    type: 'object',
    required: true,
    properties: {
      name: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 10,
        description: 'Nome del bit'
      },
      type: {
        type: 'enum',
        required: true,
        values: BEYBLADE_TYPES,
        description: 'Tipologia del bit'
      }
    }
  },
  price: {
    type: 'string',
    required: true,
    pattern: /^\d+-\d+€$/,
    description: 'Range prezzo nel formato XX-YY€'
  },
  tier: {
    type: 'enum',
    required: true,
    values: TIERS,
    description: 'Classificazione tier del prodotto'
  },
  format: {
    type: 'string',
    required: true,
    values: FORMATS,
    description: 'Formato di pubblicazione'
  },
  setName: {
    type: 'string|null',
    required: false,
    description: 'Nome del set di appartenenza (null se non applicabile)'
  },
  releaseDate: {
    type: 'string',
    required: true,
    pattern: /^\d{4}-\d{2}$/,
    description: 'Data di uscita nel formato YYYY-MM'
  }
};

// Schema per validazione metadata
export const metadataSchema = {
  version: {
    type: 'string',
    required: true,
    pattern: /^\d+\.\d+\.\d+$/,
    description: 'Versione del database nel formato X.Y.Z'
  },
  lastUpdate: {
    type: 'string',
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    description: 'Data ultimo aggiornamento nel formato YYYY-MM-DD'
  },
  totalProducts: {
    type: 'number',
    required: true,
    min: 1,
    description: 'Numero totale di prodotti nel database'
  },
  description: {
    type: 'string',
    required: true,
    minLength: 10,
    description: 'Descrizione del database'
  },
  formats: {
    type: 'array',
    required: true,
    items: { type: 'string' },
    description: 'Lista formati disponibili'
  },
  tiers: {
    type: 'array',
    required: true,
    items: { type: 'string' },
    description: 'Lista tier disponibili'
  }
};

/**
 * Validatore per singolo campo
 */
function validateField(value, schema, fieldName) {
  const errors = [];

  // Check required
  if (schema.required && (value === null || value === undefined || value === '')) {
    errors.push(`${fieldName}: Campo obbligatorio mancante`);
    return { valid: false, errors };
  }

  // Skip validation if field is not required and value is null/undefined
  if (!schema.required && (value === null || value === undefined)) {
    return { valid: true, errors: [] };
  }

  // Type validation
  if (schema.type) {
    if (schema.type === 'string' && typeof value !== 'string') {
      errors.push(`${fieldName}: Deve essere una stringa`);
    } else if (schema.type === 'number' && typeof value !== 'number') {
      errors.push(`${fieldName}: Deve essere un numero`);
    } else if (schema.type === 'array' && !Array.isArray(value)) {
      errors.push(`${fieldName}: Deve essere un array`);
    } else if (schema.type === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
      errors.push(`${fieldName}: Deve essere un oggetto`);
    }
  }

  // Pattern validation
  if (schema.pattern && typeof value === 'string' && !schema.pattern.test(value)) {
    errors.push(`${fieldName}: Formato non valido. ${schema.description || ''}`);
  }

  // Length validation
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) {
      errors.push(`${fieldName}: Lunghezza minima ${schema.minLength} caratteri`);
    }
    if (schema.maxLength && value.length > schema.maxLength) {
      errors.push(`${fieldName}: Lunghezza massima ${schema.maxLength} caratteri`);
    }
  }

  // Range validation for numbers
  if (typeof value === 'number') {
    if (schema.min !== undefined && value < schema.min) {
      errors.push(`${fieldName}: Valore minimo ${schema.min}`);
    }
    if (schema.max !== undefined && value > schema.max) {
      errors.push(`${fieldName}: Valore massimo ${schema.max}`);
    }
  }

  // Enum validation
  if (schema.values && !schema.values.includes(value)) {
    errors.push(`${fieldName}: Valore non valido. Valori ammessi: ${schema.values.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validatore per oggetto
 */
function validateObject(obj, schema, objectName) {
  const errors = [];
  const warnings = [];

  // Check required properties
  Object.keys(schema).forEach(key => {
    const fieldSchema = schema[key];
    const value = obj[key];

    if (fieldSchema.required && (value === undefined || value === null)) {
      errors.push(`${objectName}: Proprietà richiesta '${key}' mancante`);
      return;
    }

    if (value !== undefined && value !== null) {
      if (fieldSchema.type === 'object' && fieldSchema.properties) {
        // Nested object validation
        const nestedResult = validateObject(value, fieldSchema.properties, `${objectName}.${key}`);
        errors.push(...nestedResult.errors);
        warnings.push(...nestedResult.warnings);
      } else {
        // Field validation
        const fieldResult = validateField(value, fieldSchema, `${objectName}.${key}`);
        errors.push(...fieldResult.errors);
      }
    }
  });

  // Check for unknown properties
  Object.keys(obj).forEach(key => {
    if (!schema[key]) {
      warnings.push(`${objectName}: Proprietà sconosciuta '${key}'`);
    }
  });

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Valida un singolo prodotto
 */
export function validateProduct(product) {
  if (!product || typeof product !== 'object') {
    return {
      valid: false,
      errors: ['Il prodotto deve essere un oggetto valido'],
      warnings: []
    };
  }

  return validateObject(product, productSchema, 'Prodotto');
}

/**
 * Valida i metadata del database
 */
export function validateMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    return {
      valid: false,
      errors: ['I metadata devono essere un oggetto valido'],
      warnings: []
    };
  }

  const result = validateObject(metadata, metadataSchema, 'Metadata');

  // Additional check: totalProducts should match actual products count
  if (metadata.productsCount && metadata.totalProducts !== metadata.productsCount) {
    result.warnings.push(`Il conteggio prodotti (${metadata.productsCount}) non corrisponde a totalProducts (${metadata.totalProducts})`);
  }

  return result;
}

/**
 * Valida l'intero database
 */
export function validateDatabase(database) {
  const errors = [];
  const warnings = [];

  // Check structure
  if (!database || typeof database !== 'object') {
    return {
      valid: false,
      errors: ['Il database deve essere un oggetto valido'],
      warnings: []
    };
  }

  // Validate metadata
  if (!database.metadata) {
    errors.push('Metadata mancanti dal database');
  } else {
    const metadataResult = validateMetadata(database.metadata);
    errors.push(...metadataResult.errors);
    warnings.push(...metadataResult.warnings);
  }

  // Validate products array
  if (!database.products) {
    errors.push('Array prodotti mancante dal database');
  } else if (!Array.isArray(database.products)) {
    errors.push('Products deve essere un array');
  } else {
    // Check product count
    if (database.metadata && database.metadata.totalProducts !== database.products.length) {
      warnings.push(`Il numero di prodotti (${database.products.length}) non corrisponde a totalProducts nei metadata (${database.metadata.totalProducts})`);
    }

    // Validate each product
    const productIds = new Set();
    const productNames = new Set();

    database.products.forEach((product, index) => {
      const productResult = validateProduct(product);

      if (!productResult.valid) {
        errors.push(`Prodotto ${index + 1} (${product.name || 'N/D'}): ${productResult.errors.join(', ')}`);
      }

      warnings.push(...productResult.warnings.map(w => `Prodotto ${index + 1}: ${w}`));

      // Check for duplicate IDs
      if (product.id) {
        if (productIds.has(product.id)) {
          errors.push(`ID duplicato: ${product.id}`);
        } else {
          productIds.add(product.id);
        }
      }

      // Check for duplicate names
      if (product.name) {
        if (productNames.has(product.name)) {
          warnings.push(`Nome duplicato: ${product.name}`);
        } else {
          productNames.add(product.name);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalProducts: database.products?.length || 0,
      uniqueIds: errors.filter(e => e.includes('ID duplicato')).length === 0 ? (new Set(database.products?.map(p => p.id))).size : 'Errore',
      uniqueNames: (new Set(database.products?.map(p => p.name))).size
    }
  };
}

/**
 * Funzione helper per formattare errori di validazione
 */
export function formatValidationErrors(result) {
  if (result.valid) {
    return '✅ Validazione completata con successo';
  }

  let message = '❌ Errori di validazione:\n';

  if (result.errors && result.errors.length > 0) {
    message += '\n🚫 Errori critici:\n';
    result.errors.forEach(error => {
      message += `  • ${error}\n`;
    });
  }

  if (result.warnings && result.warnings.length > 0) {
    message += '\n⚠️ Avvertimenti:\n';
    result.warnings.forEach(warning => {
      message += `  • ${warning}\n`;
    });
  }

  return message;
}

/**
 * Funzione per validare e formattare un ID prodotto
 */
export function generateProductId(index) {
  return `prod_${String(index + 1).padStart(3, '0')}`;
}

/**
 * Funzione per estrarre componenti unici dal database
 */
export function extractUniqueComponents(database) {
  if (!database?.products) {
    return { blades: [], ratchets: [], bits: [] };
  }

  const blades = new Set();
  const ratchets = new Set();
  const bits = new Set();

  database.products.forEach(product => {
    if (product.blade?.name) blades.add(product.blade.name);
    if (product.ratchet?.name) ratchets.add(product.ratchet.name);
    if (product.bit?.name) bits.add(product.bit.name);
  });

  return {
    blades: Array.from(blades).sort(),
    ratchets: Array.from(ratchets).sort(),
    bits: Array.from(bits).sort()
  };
}

/**
 * Converte riga CSV in oggetto prodotto
 */
export function csvRowToProduct(row, index) {
  // Skip empty rows
  if (!row || Object.keys(row).length === 0) {
    return null;
  }

  // Validate required fields
  if (!row.id || !row.name || !row.blade_name) {
    return null;
  }

  // Clean and validate tier
  let tier = row.tier?.trim();
  if (tier && !TIERS.includes(tier)) {
    console.warn(`Riga ${index + 2}: Tier non valido "${tier}", usa default "A"`);
    tier = 'A';
  }

  // Clean and validate type fields
  const normalizeType = (type) => {
    if (!type) return 'Balance';
    const cleaned = type.trim();
    return BEYBLADE_TYPES.includes(cleaned) ? cleaned : 'Balance';
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
      type: normalizeType(row.blade_type)
    },
    ratchet: {
      name: row.ratchet_name.trim(),
      type: normalizeType(row.ratchet_type)
    },
    bit: {
      name: row.bit_name.trim(),
      type: normalizeType(row.bit_type)
    },
    price: cleanPrice(row.price),
    tier: tier || 'A',
    format: row.format?.trim() || 'UX Booster',
    setName: row.set_name?.trim() || null,
    releaseDate: cleanReleaseDate(row.release_date),
    status: cleanStatus(row.status)
  };
}

/**
 * Converte array prodotti in righe CSV
 */
export function productsToCsvRows(products) {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    blade_name: product.blade.name,
    blade_type: product.blade.type,
    ratchet_name: product.ratchet.name,
    ratchet_type: product.ratchet.type,
    bit_name: product.bit.name,
    bit_type: product.bit.type,
    price: product.price,
    tier: product.tier,
    format: product.format,
    set_name: product.setName || '',
    release_date: product.releaseDate,
    status: product.status || 'active'
  }));
}

/**
 * Genera template CSV con esempi
 */
export function generateCsvTemplate() {
  return [
    {
      id: 'prod_XXX',
      name: 'Nome Prodotto Completo (es: Wizard Rod 5-70DB UX Booster)',
      blade_name: 'Nome Blade (es: Wizard Rod)',
      blade_type: 'Attack|Defense|Stamina|Balance',
      ratchet_name: 'X-Y (es: 5-70)',
      ratchet_type: 'Attack|Defense|Stamina|Balance',
      bit_name: 'Codice (es: DB)',
      bit_type: 'Attack|Defense|Stamina|Balance',
      price: 'XX-YY€ (es: 25-30€)',
      tier: 'S+|S|A|B',
      format: 'UX Starter|BX Booster|Random Booster|etc',
      set_name: '(opzionale - lascia vuoto se non in set)',
      release_date: 'YYYY-MM (es: 2025-11)',
      status: 'active|discontinued|upcoming'
    },
    {
      id: 'prod_001',
      name: 'Wizard Rod 5-70DB (UX Booster)',
      blade_name: 'Wizard Rod',
      blade_type: 'Defense',
      ratchet_name: '5-70',
      ratchet_type: 'Stamina',
      bit_name: 'DB',
      bit_type: 'Defense',
      price: '25-30€',
      tier: 'S+',
      format: 'UX Booster',
      set_name: '',
      release_date: '2025-01',
      status: 'active'
    },
    {
      id: 'prod_002',
      name: 'Thunder Dragon 4-60LF (BX Starter)',
      blade_name: 'Thunder Dragon',
      blade_type: 'Attack',
      ratchet_name: '4-60',
      ratchet_type: 'Attack',
      bit_name: 'LF',
      bit_type: 'Attack',
      price: '22-28€',
      tier: 'S',
      format: 'BX Starter',
      set_name: '',
      release_date: '2025-02',
      status: 'upcoming'
    }
  ];
}

export default {
  productSchema,
  metadataSchema,
  validateProduct,
  validateMetadata,
  validateDatabase,
  formatValidationErrors,
  generateProductId,
  extractUniqueComponents,
  csvRowToProduct,
  productsToCsvRows,
  generateCsvTemplate,
  BEYBLADE_TYPES,
  TIERS,
  FORMATS
};