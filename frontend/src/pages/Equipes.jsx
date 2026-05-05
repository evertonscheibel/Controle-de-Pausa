import React, { useState } from 'react';
import { Users, UserPlus, Filter, Search, MoreVertical, ShieldCheck, Thermometer, Clock } from 'lucide-react';

const Equipes = () => {
  const [activeTab, setActiveTab] = useState('all');

  const equipes = [
    { id: 1, nome: 'Desossa Manhã - Linha A', setor: 'Desossa', turno: 'Manhã', membros: 18, lider: 'Carlos Magno', status: 'em_pausa', ultima_pausa: 'Há 12 min' },
    { id: 2, nome: 'Desossa Manhã - Linha B', setor: 'Desossa', turno: 'Manhã', membros: 18, lider: 'Sandra Helena', status: 'operando', ultima_pausa: 'Há 1h 45min' },
    { id: 3, nome: 'Linha C - Miúdos', setor: 'Desossa', turno: 'Integral', membros: 12, lider: 'José Arnaldo', status: 'operando', ultima_pausa: 'Há 2h 10min' },
    { id: 4, nome: 'Pendura Principal', setor: 'Abate', turno: 'Noite', membros: 10, lider: 'Felipe Costa', status: 'atrasada', ultima_pausa: 'Há 4h 05min' },
    { id: 5, nome: 'Corte Traseiro - T1', setor: 'Desossa', turno: 'Manhã', membros: 22, lider: 'Marta Vieira', status: 'operando', ultima_pausa: 'Há 30 min' },
    { id: 6, nome: 'Corte Dianteiro - D2', setor: 'Desossa', turno: 'Tarde', membros: 15, lider: 'Paulo Freire', status: 'em_pausa', ultima_pausa: 'Há 5 min' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_pausa': return 'bg-blue-500';
      case 'atrasada': return 'bg-red-500';
      case 'operando': return 'bg-green-500';
      default: return 'bg-slate-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'em_pausa': return 'EM PAUSA';
      case 'atrasada': return 'PAUSA ATRASADA';
      case 'operando': return 'OPERANDO';
      default: return 'INATIVO';
    }
  };

  const filteredEquipes = activeTab === 'all' ? equipes : equipes.filter(e => e.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Cadastro de <span className="text-blue-500">Equipes</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Gestão de grupos de trabalho e lideranças</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2">
          <UserPlus size={20} /> NOVA EQUIPE
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex p-1 bg-slate-900 rounded-2xl w-fit border border-slate-800">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'operando', label: 'Operando' },
            { id: 'em_pausa', label: 'Em Pausa' },
            { id: 'atrasada', label: 'Atrasadas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input type="text" placeholder="Filtrar por nome ou líder..." className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
           <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white">
              <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipes.map((equipe) => (
          <div key={equipe.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border border-slate-800 ${equipe.status === 'em_pausa' ? 'text-blue-500' : 'text-slate-500'}`}>
                  <Users size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{equipe.nome}</h3>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{equipe.setor} • {equipe.turno}</span>
                </div>
              </div>
              <button className="p-1 hover:bg-slate-800 rounded-lg text-slate-600">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold px-4 py-3 bg-slate-950 rounded-2xl border border-slate-800/50">
                <span className="text-slate-500 uppercase tracking-widest">Status</span>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${getStatusColor(equipe.status)} ${equipe.status !== 'operando' ? 'animate-pulse' : ''}`}></div>
                   <span className={`text-[10px] ${equipe.status === 'atrasada' ? 'text-red-500' : 'text-slate-300'}`}>{getStatusText(equipe.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/50">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1">Membros</p>
                    <p className="text-sm font-black text-white">{equipe.membros} <span className="text-[10px] text-slate-500">Pessoas</span></p>
                 </div>
                 <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/50">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1">Última Pausa</p>
                    <p className="text-sm font-black text-white">{equipe.ultima_pausa}</p>
                 </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                 <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500">
                    <ShieldCheck size={16} />
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Líder Principal</p>
                    <p className="text-xs font-bold text-slate-300">{equipe.lider}</p>
                 </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center bg-transparent">
               <div className="flex gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center" title="Pausa Térmica">
                     <Thermometer size={14} />
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center" title="Pausa NR-36">
                     <Clock size={14} />
                  </div>
               </div>
               <button className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
                  Ver Programação
               </button>
            </div>
            
            {/* Background highlight */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full ${getStatusColor(equipe.status)}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipes;
