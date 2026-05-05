import React, { useState } from 'react';
import { Search, Plus, MapPin, Edit2, Trash2, Filter, MoreHorizontal, ChevronRight } from 'lucide-react';

const Setores = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const setores = [
    { id: 1, nome: 'Desossa', codigo: 'DES-01', unidade: 'Planta Principal', equipes: 12, responsavel: 'Gilberto Silva' },
    { id: 2, nome: 'Abate', codigo: 'ABA-02', unidade: 'Planta Principal', equipes: 8, responsavel: 'Marcos Almeida' },
    { id: 3, nome: 'Embalagem', codigo: 'EMB-03', unidade: 'Planta Principal', equipes: 5, responsavel: 'Ana Paula' },
    { id: 4, nome: 'Expedição', codigo: 'EXP-04', unidade: 'Logística Sul', equipes: 4, responsavel: 'Ricardo Santos' },
    { id: 5, nome: 'Corte e Refile', codigo: 'CRT-05', unidade: 'Planta Principal', equipes: 10, responsavel: 'Sonia Maria' },
  ];

  const filteredSetores = setores.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight text-white">Cadastro de <span className="text-blue-500">Setores</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Gerenciamento das áreas físicas e unidades produtivas</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2">
          <Plus size={20} /> NOVO SETOR
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Table Header / Filters */}
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center gap-4 bg-slate-900/50">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              className="block w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white flex items-center gap-2 transition-all font-bold text-sm">
            <Filter size={18} /> FILTROS
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/30 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                <th className="px-8 py-5">Código / Nome</th>
                <th className="px-8 py-5">Unidade</th>
                <th className="px-8 py-5 text-center">Nº Equipes</th>
                <th className="px-8 py-5">Responsável</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredSetores.map((setor) => (
                <tr key={setor.id} className="hover:bg-blue-600/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-colors">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-white font-black">{setor.nome}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-wider">{setor.codigo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-slate-300 font-medium">{setor.unidade}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-black min-w-[32px]">
                      {setor.equipes}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-slate-300 font-medium">{setor.responsavel}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-300 transition-all">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-bold">Mostrando {filteredSetores.length} de {setores.length} setores ativos</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs font-black disabled:opacity-30" disabled>ANTERIOR</button>
            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-black hover:bg-slate-700 flex items-center gap-1">PRÓXIMO <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setores;
