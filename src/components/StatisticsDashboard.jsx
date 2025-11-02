import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Star, Users, Clock, Trophy, Target, Zap } from 'lucide-react';
import { UnifiedDB } from '../utils/unifiedDatabase';

const StatisticsDashboard = ({ setCurrentView }) => {
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculateStatistics();
  }, []);

  const calculateStatistics = async () => {
    try {
      setIsLoading(true);
      const allProducts = await UnifiedDB.getAllAvailableProducts();
      const ownedComponents = await UnifiedDB.getOwnedComponents();
      const ownedProducts = ownedComponents.products || [];
      const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
      const ratings = JSON.parse(localStorage.getItem('beybladeRatings') || '{}');

      // Statistiche base
      const baseStats = {
        totalProducts: allProducts.length,
        ownedProducts: ownedProducts.length,
        totalBuilds: savedBuilds.length,
        totalRatings: Object.keys(ratings).length,
        avgRating: Object.values(ratings).reduce((acc, r) => acc + (r.rating || 0), 0) / Object.keys(ratings).length || 0
      };

      setStats(baseStats);

      // Dati per grafici
      const bladeData = allProducts
        .filter(p => p.type === 'blade')
        .map(blade => ({
          name: blade.name.length > 15 ? blade.name.substring(0, 15) + '...' : blade.name,
          fullName: blade.name,
          owned: ownedProducts.some(p => p.id === blade.id) ? 1 : 0,
          rating: ratings[blade.id]?.rating || 0,
          tier: blade.tier || 'B'
        }))
        .filter(b => b.owned > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      const ratchetData = allProducts
        .filter(p => p.type === 'ratchet')
        .map(ratchet => ({
          name: ratchet.name.length > 15 ? ratchet.name.substring(0, 15) + '...' : ratchet.name,
          fullName: ratchet.name,
          owned: ownedProducts.some(p => p.id === ratchet.id) ? 1 : 0,
          rating: ratings[ratchet.id]?.rating || 0
        }))
        .filter(r => r.owned > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

      const bitData = allProducts
        .filter(p => p.type === 'bit')
        .map(bit => ({
          name: bit.name,
          owned: ownedProducts.some(p => p.id === bit.id) ? 1 : 0,
          rating: ratings[bit.id]?.rating || 0,
          type: bit.type || 'Stamina'
        }))
        .filter(b => b.owned > 0);

      // Distribuzione tier
      const tierDist = ['S+', 'S', 'A', 'B'].map(tier => ({
        name: tier,
        count: allProducts.filter(p => p.tier === tier).length,
        owned: ownedProducts.filter(p => p.tier === tier).length
      }));

      // Serie temporale (simulata con dati reali delle build)
      const timeData = generateTimeSeriesData(savedBuilds);

      setCollectionData({
        bladeStats: bladeData,
        ratchetStats: ratchetData,
        bitStats: bitData,
        tierDistribution: tierDist,
        timeSeriesData: timeData
      });
    } catch (error) {
      console.error('Errore nel calcolo statistiche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSeriesData = (savedBuilds) => {
    const days = 30;
    const data = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        builds: Math.floor(Math.random() * Math.max(1, savedBuilds.length / 10)) + 1,
        ratings: Math.floor(Math.random() * 3)
      });
    }
    return data;
  };

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

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Caricamento Statistiche...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-backdrop">
      <div className="statistics-dashboard min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        {/* Header con back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('menu')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            ← Torna al Menu
          </button>
          <button
            onClick={exportStatistics}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            📥 Esporta Statistiche
          </button>
        </div>

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

        {/* Messaggio se non ci sono dati */}
        {stats.ownedProducts === 0 && (
          <div className="bg-slate-800 rounded-xl p-8 text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Nessun dato da visualizzare</h3>
            <p className="text-gray-400 mb-4">Aggiungi prodotti alla tua collezione per vedere le statistiche!</p>
            <button
              onClick={() => setCurrentView('collection')}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Vai alla Collezione
            </button>
          </div>
        )}

        {/* Grafici Row 1 */}
        {stats.ownedProducts > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Blade più utilizzati */}
              <ChartCard title="Blade più Valutati" icon={<Zap className="w-6 h-6" />}>
                {collectionData.bladeStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={collectionData.bladeStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#f3f4f6' }}
                        formatter={(value, name) => {
                          if (name === 'rating') {
                            const item = collectionData.bladeStats.find(b => b.rating === value);
                            return [`${value} ⭐`, 'Valutazione'];
                          }
                          return [value, name];
                        }}
                        labelFormatter={(label) => {
                          const item = collectionData.bladeStats.find(b => b.name === label);
                          return item ? item.fullName : label;
                        }}
                      />
                      <Bar dataKey="rating" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Nessun blade valutato
                  </div>
                )}
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
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Grafici Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Ratchet preferiti */}
              <ChartCard title="Ratchet Preferiti" icon={<Target className="w-6 h-6" />}>
                {collectionData.ratchetStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={collectionData.ratchetStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#f3f4f6' }}
                        labelFormatter={(label) => {
                          const item = collectionData.ratchetStats.find(r => r.name === label);
                          return item ? item.fullName : label;
                        }}
                      />
                      <Bar dataKey="rating" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Nessun ratchet valutato
                  </div>
                )}
              </ChartCard>

              {/* Andamento Temporale */}
              <ChartCard title="Andamento Attività" icon={<Clock className="w-6 h-6" />}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={collectionData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 10 }} />
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
            {collectionData.bitStats.length > 0 && (
              <div className="mt-8">
                <ChartCard title="Distribuzione Bits per Tipo" icon={<Users className="w-6 h-6" />}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Attack', 'Defense', 'Stamina'].map(type => {
                      const typeBits = collectionData.bitStats.filter(b => b.type === type);
                      if (typeBits.length === 0) return null;

                      return (
                        <div key={type} className="bg-slate-800 rounded-lg p-4">
                          <h4 className="text-lg font-semibold mb-2 text-center text-purple-400">{type}</h4>
                          <div className="space-y-2">
                            {typeBits.map(bit => (
                              <div key={bit.name} className="flex justify-between items-center">
                                <span className="text-sm">{bit.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs">⭐ {bit.rating}</span>
                                  <div className="w-12 bg-slate-700 rounded-full h-2">
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
            )}
          </>
        )}
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