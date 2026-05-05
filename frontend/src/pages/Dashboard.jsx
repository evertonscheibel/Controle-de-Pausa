import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await api.get('/dashboard/resumo');
        setResumo(response.data);
      } catch (err) {
        console.error('Erro ao buscar resumo:', err);
        // Set mock data if API fails (useful for initial demo)
        setResumo({
          previstas: 24,
          em_andamento: 3,
          concluidas: 18,
          atrasadas: 2,
          nao_realizadas: 1,
          taxa_conformidade: 85.7,
          total_excecoes: 4
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResumo();
  }, []);

  const dataConformidade = [
    { name: 'Seg', valor: 92 },
    { name: 'Ter', valor: 88 },
    { name: 'Qua', valor: 85 },
    { name: 'Qui', valor: 90 },
    { name: 'Sex', valor: 78 },
    { name: 'Sab', valor: 95 },
  ];

  const dataExcecoes = [
    { name: 'Semana 1', total: 12 },
    { name: 'Semana 2', total: 8 },
    { name: 'Semana 3', total: 15 },
    { name: 'Semana 4', total: 4 },
  ];

  const COLORS = ['#22C55E', '#EAB308', '#EF4444', '#334155'];

  const stats = resumo ? [
    { label: 'Conformidade', value: `${resumo.taxa_conformidade}%`, icon: <CheckCircle2 size={24} className="text-green-500" />, trend: '+2.4%', up: true },
    { label: 'Em Andamento', value: resumo.em_andamento, icon: <Clock size={24} className="text-blue-500" />, trend: 'Normal', up: true },
    { label: 'Exceções Hoje', value: resumo.total_excecoes, icon: <AlertTriangle size={24} className="text-yellow-500" />, trend: '-12%', up: false },
    { label: 'Equipes Operantes', value: '12', icon: <Users size={24} className="text-purple-500" />, trend: '100%', up: true },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Executivo</h1>
          <p className="text-slate-400 mt-1">Visão geral do sistema de pausas (Hoje)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
            <Calendar size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-200">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            Atualizar Relatórios
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 transition-colors group-hover:border-slate-700">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-600/10 transition-all"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Tendência de Conformidade</h3>
              <p className="text-slate-500 text-sm mt-1">Últimos 6 dias de operação</p>
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataConformidade}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  cursor={{fill: '#1E293B'}}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#CBD5E1' }}
                />
                <Bar dataKey="valor" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Status das Pausas Hoje</h3>
            <p className="text-slate-500 text-sm mt-1">Distribuição qualitativa</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'No Horário', value: resumo?.concluidas || 18 },
                      { name: 'Atrasadas', value: resumo?.atrasadas || 2 },
                      { name: 'Não Realizadas', value: resumo?.nao_realizadas || 1 },
                      { name: 'Em Aberto', value: resumo?.previstas || 2 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#CBD5E1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-400 font-medium">No Horário</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-slate-400 font-medium">Atrasadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-400 font-medium">Não Realizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <span className="text-xs text-slate-400 font-medium">Em Aberto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        {/* Recent Alerts Table */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Alertas Críticos</h3>
            <span className="text-xs font-bold text-blue-500 hover:underline cursor-pointer">Ver todos</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 transition-all hover:border-slate-700">
                <div className={`p-3 rounded-xl h-fit border ${i === 1 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Retorno Pendente — Linha B</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">A pausa deveria ter encerrado às 11:20.</p>
                  <span className="text-[10px] text-slate-600 mt-2 block font-bold">HÁ 12 MINUTOS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Health Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Resumo Equipes Ativas</h3>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 Produção
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 Em Pausa
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {['Linha A - Dianteiro', 'Linha B - Traseiro', 'Linha C - Miúdos', 'Pendura Principal'].map((team, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-white line-clamp-1">{team}</span>
                      <div className={`w-2 h-2 rounded-full ${idx === 1 ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                   </div>
                   <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Próxima Pausa</span>
                      <span className="text-slate-300">14:20</span>
                   </div>
                   <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '65%' }}></div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
