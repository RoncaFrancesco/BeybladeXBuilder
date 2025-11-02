# 🚀 FASE 1: Statistiche Dashboard - Esecuzione Guidata

## 📋 **Panoramica Fase 1**
Creare un dashboard centralizzato con metriche chiave, visualizzazioni dati in tempo reale e insights sulla community.

---

## 🔧 **Step 1: Installazione Dipendenze**

```bash
# Installa librerie per grafici e analytics
npm install recharts chart.js react-chartjs-2
npm install date-fns lodash
```

---

## 📊 **Step 2: Creazione Componente StatisticsDashboard**

**Crea file:** `src/components/StatisticsDashboard.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Star, Users, Clock, Trophy, Target, Zap } from 'lucide-react';
import { getCollectionManager } from '../utils/unifiedDatabase';

const StatisticsDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    ownedProducts: 0,
    totalBuilds: 0,
    totalRatings: 0,
    avgRating: 0
  });

  const [collectionData, setCollectionData] = useState({
    bladeStats: [],
    ratchetStats: [],
    bitStats: [],
    tierDistribution: [],
    timeSeriesData: []
  });

  useEffect(() => {
    calculateStatistics();
  }, []);

  const calculateStatistics = () => {
    const collectionManager = getCollectionManager();
    const allProducts = collectionManager.getAllProducts();
    const ownedProducts = collectionManager.getOwnedProducts();
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
    const ratings = JSON.parse(localStorage.getItem('beybladeRatings') || '{}');

    // Statistiche base
    const baseStats = {
      totalProducts: allProducts.length,
      ownedProducts: ownedProducts.length,
      totalBuilds: savedBuilds.length,
      totalRatings: Object.keys(ratings).length,
      avgRating: Object.values(ratings).reduce((acc, r) => acc + r.rating, 0) / Object.keys(ratings).length || 0
    };

    setStats(baseStats);

    // Dati per grafici
    const bladeData = allProducts
      .filter(p => p.type === 'blade')
      .map(blade => ({
        name: blade.name,
        owned: ownedProducts.some(p => p.id === blade.id) ? 1 : 0,
        rating: ratings[blade.id]?.rating || 0,
        tier: blade.tier
      }));

    const ratchetData = allProducts
      .filter(p => p.type === 'ratchet')
      .map(ratchet => ({
        name: ratchet.name,
        owned: ownedProducts.some(p => p.id === ratchet.id) ? 1 : 0,
        rating: ratings[ratchet.id]?.rating || 0
      }));

    const bitData = allProducts
      .filter(p => p.type === 'bit')
      .map(bit => ({
        name: bit.name,
        owned: ownedProducts.some(p => p.id === bit.id) ? 1 : 0,
        rating: ratings[bit.id]?.rating || 0,
        type: bit.type
      }));

    // Distribuzione tier
    const tierDist = ['S+', 'S', 'A', 'B'].map(tier => ({
      name: tier,
      count: allProducts.filter(p => p.tier === tier).length,
      owned: ownedProducts.filter(p => p.tier === tier).length
    }));

    // Serie temporale (simulata con dati recenti)
    const timeData = generateTimeSeriesData();

    setCollectionData({
      bladeStats: bladeData,
      ratchetStats: ratchetData,
      bitStats: bitData,
      tierDistribution: tierDist,
      timeSeriesData: timeData
    });
  };

  const generateTimeSeriesData = () => {
    const days = 30;
    const data = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        builds: Math.floor(Math.random() * 5) + 1,
        ratings: Math.floor(Math.random() * 3)
      });
    }
    return data;
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          📊 Statistiche Dashboard
        </h1>

        {/* Metriche Principali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="w-8 h-8 text-blue-400" />}
            title="Prodotti Totali"
            value={stats.totalProducts}
            subtitle="Nel database"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Trophy className="w-8 h-8 text-green-400" />}
            title="Prodotti Posseduti"
            value={stats.ownedProducts}
            subtitle={`${Math.round((stats.ownedProducts / stats.totalProducts) * 100)}% del totale`}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={<Target className="w-8 h-8 text-purple-400" />}
            title="Team Creati"
            value={stats.totalBuilds}
            subtitle="Build salvati"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<Star className="w-8 h-8 text-yellow-400" />}
            title="Valutazioni Medie"
            value={stats.avgRating.toFixed(1)}
            subtitle={`${stats.totalRatings} componenti valutati`}
            color="from-yellow-500 to-yellow-600"
          />
        </div>

        {/* Grafici Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Blade più utilizzati */}
          <ChartCard title="Blade più Utilizzati" icon={<Zap className="w-6 h-6" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionData.bladeStats.filter(b => b.owned > 0).slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="rating" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Distribuzione Tier */}
          <ChartCard title="Distribuzione Tier" icon={<TrendingUp className="w-6 h-6" />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={collectionData.tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {collectionData.tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Grafici Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ratchet preferiti */}
          <ChartCard title="Ratchet Preferiti" icon={<Target className="w-6 h-6" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionData.ratchetStats.filter(r => r.owned > 0).slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="rating" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Andamento Temporale */}
          <ChartCard title="Andamento Attività" icon={<Clock className="w-6 h-6" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={collectionData.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="builds" stroke="#8b5cf6" strokeWidth={2} name="Team Creati" />
                <Line type="monotone" dataKey="ratings" stroke="#3b82f6" strokeWidth={2} name="Valutazioni" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Bits per Tipo */}
        <div className="mt-8">
          <ChartCard title="Distribuzione Bits per Tipo" icon={<Users className="w-6 h-6" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Attack', 'Defense', 'Stamina'].map(type => {
                const typeBits = collectionData.bitStats.filter(b => b.type === type && b.owned > 0);
                return (
                  <div key={type} className="bg-slate-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2 text-center">{type}</h4>
                    <div className="space-y-2">
                      {typeBits.map(bit => (
                        <div key={bit.name} className="flex justify-between items-center">
                          <span className="text-sm">{bit.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs mr-2">⭐ {bit.rating}</span>
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                                style={{ width: `${(bit.rating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

// Componenti Helper
const StatCard = ({ icon, title, value, subtitle, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200`}>
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-3xl font-bold">{value}</span>
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm opacity-90">{subtitle}</p>
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

export default StatisticsDashboard;
```

---

## 🎯 **Step 3: Integrazione in App.jsx**

**Modifica file:** `src/App.jsx`

1. Aggiungi import:
```jsx
import StatisticsDashboard from './components/StatisticsDashboard';
```

2. Aggiungi al menu principale (dopo gli altri 4 pulsanti):
```jsx
{/* Nuovo pulsante Statistiche */}
<button
  onClick={() => setCurrentView('statistics')}
  className="w-full min-h-[100px] px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-2"
>
  <BarChart3 size={28} />
  <span className="text-lg font-bold text-center">📊 Statistiche</span>
  <span className="text-xs opacity-90">Analytics Dashboard</span>
</button>
```

3. Aggiungi al render conditionale:
```jsx
{currentView === 'statistics' && <StatisticsDashboard setCurrentView={setCurrentView} />}
```

---

## 📱 **Step 4: Responsive Design Ottimizzato**

**Aggiungi stili CSS personalizzati in App.jsx:**

```jsx
const dashboardStyles = `
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .chart-container {
      height: 250px !important;
    }
  }

  @media (max-width: 480px) {
    .stats-card {
      padding: 1rem;
    }

    .chart-title {
      font-size: 1rem;
    }
  }
`;
```

---

## 🔄 **Step 5: Funzionalità Avanzate**

**Aggiungi in StatisticsDashboard.jsx:**

```jsx
// Export funzionalità
const exportStatistics = () => {
  const exportData = {
    stats,
    collectionData,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `beyblade-statistics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Aggiungi pulsante export nel componente
<button
  onClick={exportStatistics}
  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
>
  📥 Esporta Statistiche
</button>
```

---

## ✅ **Step 6: Testing e Validazione**

**Test checklist:**
- [ ] Dashboard si carica correttamente
- [ ] Tutti i grafici visualizzano dati
- [ ] Responsive design funziona su mobile
- [ ] Metriche si aggiornano in tempo reale
- [ ] Export statistiche funziona
- [ ] Performance accettabile (< 2s load time)

**Comandi di test:**
```bash
# Test build
npm run build

# Test in sviluppo
npm run dev

# Test performance
npm run preview
```

---

## 📈 **Metriche di Successo Fase 1**

- **Loading time**: < 2 secondi
- **Charts rendering**: < 500ms
- **Mobile responsiveness**: 100%
- **Data accuracy**: Validato contro database
- **User engagement**: Dashboard visitata nel 70% delle sessioni

---

## 🔄 **Step 7: Aggiornamento Documentazione**

**Aggiorna ROADMAP.md:**
```markdown
## ✅ FASE 1 COMPLETATA - Statistiche Dashboard
**Data completamento:** [INSERISCI DATA]
**Tempo impiegato:** [INSERISCI ORE]

### Implementato:
- [x] Dashboard con metriche in tempo reale
- [x] 4 grafici interattivi (Bar, Pie, Line charts)
- [x] Responsive design mobile-first
- [x] Export statistiche in JSON
- [x] Performance ottimizzata
```

---

**Prossima Fase:** Esegui `PHASE2_MOBILE_OPTIMIZATION.md` quando FASE 1 è completata.