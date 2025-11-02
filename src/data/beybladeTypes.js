// Database delle tipologie Beyblade X
// Usato per classificare automaticamente ogni componente

export const beybladeTypes = {
  blades: {
    // Attack (Attacco) - 🔵
    'Soar Phoenix': 'Attack',
    'Dran Sword': 'Attack',
    'Shark Edge': 'Attack',
    'Knight Shield': 'Attack',
    'Dagger Dran': 'Attack',
    'Sting Unicorn': 'Attack',

    // Defense (Difesa) - 🟢
    'Wizard Rod': 'Defense',
    'Wand Wizard': 'Defense',
    'Wizard Arrow': 'Defense',
    'Obsidian Shell': 'Defense',
    'Shelter Drake': 'Defense',

    // Stamina (Resistenza) - 🟠
    'Chain Scythe': 'Stamina',
    'Hells Scythe': 'Stamina',
    'Chain Fire': 'Stamina',
    'Reaper Fire T': 'Stamina',

    // Balance (Equilibrio) - 🔴
    'Sword Dran': 'Balance',
    'Buster Dran': 'Balance',
    'Shadow Shinobi': 'Balance',
    'Knife Shinobi': 'Balance',
    'Circle Ghost': 'Balance',
    'Beat Tyranno': 'Balance',
    'Tackle Goat': 'Balance',
    'Gale Wyvern': 'Balance',
    'Dark Perseus B': 'Balance',
    'Fox Blush J': 'Balance',
    'Tusk Mammoth': 'Balance'
  },

  ratchets: {
    // Attack (bassi e leggeri) - 🔵
    '3-60': 'Attack',
    '4-60': 'Attack',
    '5-60': 'Attack',
    '9-60': 'Attack',
    '1-60': 'Attack',

    // Defense (alti e pesanti) - 🟢
    '5-80': 'Defense',
    '6-80': 'Defense',
    '7-80': 'Defense',
    '4-80': 'Defense',
    '3-80': 'Defense',
    '1-80': 'Defense',
    '0-80': 'Defense',

    // Stamina (medi) - 🟠
    '5-70': 'Stamina',
    '4-70': 'Stamina',
    '2-70': 'Stamina',
    '9-70': 'Stamina'
  },

  bits: {
    // Attack - 🔵
    'F': 'Attack',
    'LF': 'Attack',
    'GF': 'Attack',
    'A': 'Attack',
    'Q': 'Attack',
    'K': 'Attack',

    // Defense - 🟢
    'B': 'Defense',
    'DB': 'Defense',
    'GB': 'Defense',
    'D': 'Defense',
    'HN': 'Defense',

    // Stamina - 🟠
    'P': 'Stamina',
    'GP': 'Stamina',
    'T': 'Stamina',
    'HT': 'Stamina',
    'W': 'Stamina',
    'N': 'Stamina',
    'MN': 'Stamina',

    // Balance - 🔴
    'R': 'Balance',
    'GR': 'Balance',
    'H': 'Balance'
  }
};

/**
 * Ottiene la tipologia di un componente Beyblade
 * @param {string} componentType - 'blade', 'ratchet', 'bit'
 * @param {string} componentName - Nome del componente
 * @returns {string} Tipologia: 'Attack', 'Defense', 'Stamina', 'Balance'
 */
export function getComponentType(componentType, componentName) {
  if (!componentType || !componentName) {
    return 'Balance';
  }

  return beybladeTypes[componentType + 's']?.[componentName] || 'Balance';
}

/**
 * Ottiene il colore CSS per una tipologia Beyblade
 * @param {string} type - Tipologia Beyblade
 * @returns {string} Classe CSS Tailwind per il colore
 */
export function getTypeColor(type) {
  const colors = {
    'Attack': 'text-blue-600',
    'Defense': 'text-green-600',
    'Stamina': 'text-orange-600',
    'Balance': 'text-red-600'
  };
  return colors[type] || 'text-gray-600';
}

/**
 * Ottiene il colore di sfondo per badge tipologia
 * @param {string} type - Tipologia Beyblade
 * @returns {string} Classe CSS Tailwind per lo sfondo
 */
export function getTypeBgColor(type) {
  const colors = {
    'Attack': 'bg-blue-100 border-blue-300',
    'Defense': 'bg-green-100 border-green-300',
    'Stamina': 'bg-orange-100 border-orange-300',
    'Balance': 'bg-red-100 border-red-300'
  };
  return colors[type] || 'bg-gray-100 border-gray-300';
}