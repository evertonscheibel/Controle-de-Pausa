import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Filter, Search, CheckCircle, AlertTriangle, XCircle,
  Clock, ExternalLink, X, Loader2, Eye, Printer
} from 'lucide-react';

const Relatorios = () => {
  const [dateRange, setDateRange] = useState('Hoje');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [exporting, setExporting] = useState(null); // null, 'pdf', 'fiscal'
  const [exportSuccess, setExportSuccess] = useState('');

  const allLogs = [
    { id: 1, equipe: 'Linha A', setor: 'Desossa', tipo: 'Térmica', inicio: '08:00', fim: '08:20', duracao: '20 min', status: 'Concluída', auditoria: 'OK', lider: 'José Carlos Pereira', membros_inicio: 18, membros_retorno: 18, local: 'Sala A', data: '2026-04-08' },
    { id: 2, equipe: 'Linha B', setor: 'Desossa', tipo: 'Térmica', inicio: '08:30', fim: '08:50', duracao: '20 min', status: 'Atrasada', auditoria: 'Alerta', lider: 'Roberto Silva', membros_inicio: 18, membros_retorno: 17, local: 'Sala B', data: '2026-04-08', obs: 'Retorno com 1 membro a menos' },
    { id: 3, equipe: 'Pendura', setor: 'Abate', tipo: 'Psicofis.', inicio: '09:00', fim: '09:10', duracao: '10 min', status: 'Concluída', auditoria: 'OK', lider: 'Marcos Souza', membros_inicio: 10, membros_retorno: 10, local: 'Sala Pendura', data: '2026-04-08' },
    { id: 4, equipe: 'Linha A', setor: 'Desossa', tipo: 'Térmica', inicio: '10:00', fim: '—', duracao: '—', status: 'Não Realizada', auditoria: 'Crítico', lider: 'José Carlos Pereira', membros_inicio: 0, membros_retorno: 0, local: '—', data: '2026-04-08', obs: 'Pausa não realizada — demanda produtiva' },
    { id: 5, equipe: 'Embalagem', setor: 'Embalagem', tipo: 'NR-36', inicio: '10:30', fim: '10:50', duracao: '20 min', status: 'Concluída', auditoria: 'OK', lider: 'Fernanda Lima', membros_inicio: 15, membros_retorno: 15, local: 'Refeitório', data: '2026-04-08' },
    { id: 6, equipe: 'Linha C', setor: 'Desossa', tipo: 'Térmica', inicio: '11:00', fim: '11:20', duracao: '20 min', status: 'Concluída', auditoria: 'OK', lider: 'Antônio Ferreira', membros_inicio: 12, membros_retorno: 12, local: 'Sala A', data: '2026-04-08' },
    { id: 7, equipe: 'Abate Corredor', setor: 'Abate', tipo: 'Térmica', inicio: '11:30', fim: '11:50', duracao: '20 min', status: 'Concluída', auditoria: 'OK', lider: 'Marcos Souza', membros_inicio: 10, membros_retorno: 10, local: 'Sala Pendura', data: '2026-04-08' },
    { id: 8, equipe: 'Linha B', setor: 'Desossa', tipo: 'Térmica', inicio: '12:00', fim: '12:20', duracao: '20 min', status: 'Concluída', auditoria: 'OK', lider: 'Roberto Silva', membros_inicio: 18, membros_retorno: 18, local: 'Sala B', data: '2026-04-07' },
    { id: 9, equipe: 'Linha A', setor: 'Desossa', tipo: 'Psicofis.', inicio: '13:00', fim: '13:10', duracao: '10 min', status: 'Atrasada', auditoria: 'Alerta', lider: 'José Carlos Pereira', membros_inicio: 17, membros_retorno: 17, local: 'Sala A', data: '2026-04-07', obs: 'Início 8 min atrasado' },
  ];

  const filteredByDate = allLogs.filter(l => {
    if (dateRange === 'Hoje') return l.data === '2026-04-08';
    if (dateRange === 'Semana') return true;
    return true;
  });

  const filteredLogs = filteredByDate.filter(l => {
    const matchSearch = !searchTerm || l.equipe.toLowerCase().includes(searchTerm.toLowerCase()) || l.setor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total de Pausas', value: filteredLogs.length, icon: <FileText size={20} />, trend: '+12', color: 'blue' },
    { label: 'Conformidade', value: `${filteredLogs.length > 0 ? Math.round(filteredLogs.filter(l => l.auditoria === 'OK').length / filteredLogs.length * 100) : 0}%`, icon: <CheckCircle size={20} />, trend: '+0.5%', color: 'green' },
    { label: 'Exceções', value: filteredLogs.filter(l => l.auditoria !== 'OK').length, icon: <AlertTriangle size={20} />, trend: '-3', color: 'yellow' },
    { label: 'Não Realizadas', value: filteredLogs.filter(l => l.status === 'Não Realizada').length, icon: <XCircle size={20} />, trend: '0', color: 'red' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Concluída': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Atrasada': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Não Realizada': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  // Clear success
  useEffect(() => {
    if (exportSuccess) { const t = setTimeout(() => setExportSuccess(''), 3000); return () => clearTimeout(t); }
  }, [exportSuccess]);

  // Export CSV
  const handleExportCSV = () => {
    setExporting('pdf');
    setTimeout(() => {
      const header = "Data,Equipe,Setor,Tipo,Início,Fim,Duração,Status,Auditoria,Líder,Membros Início,Membros Retorno\n";
      const rows = filteredLogs.map(l => `${l.data},${l.equipe},${l.setor},${l.tipo},${l.inicio},${l.fim},${l.duracao},${l.status},${l.auditoria},${l.lider},${l.membros_inicio},${l.membros_retorno}`).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatorio_Pausas_${dateRange}_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(null);
      setExportSuccess('Relatório exportado com sucesso!');
    }, 1200);
  };

  // Export Fiscal (full report)
  const handleExportFiscal = () => {
    setExporting('fiscal');
    setTimeout(() => {
      const header = "=== RELATÓRIO FISCAL NR-36 — BRIDGE PAUSECONTROL ===\nGerado em:," + new Date().toLocaleString() + "\nPeríodo:," + dateRange + "\n\n";
      const summary = `RESUMO\nTotal de Pausas:,${filteredLogs.length}\nConformidade:,${filteredLogs.length > 0 ? Math.round(filteredLogs.filter(l => l.auditoria === 'OK').length / filteredLogs.length * 100) : 0}%\nExceções:,${filteredLogs.filter(l => l.auditoria !== 'OK').length}\nNão Realizadas:,${filteredLogs.filter(l => l.status === 'Não Realizada').length}\n\n`;
      const detailHeader = "Data,Equipe,Setor,Tipo,Início,Fim,Duração,Status,Auditoria,Líder,Membros Início,Membros Retorno,Observações\n";
      const rows = filteredLogs.map(l => `${l.data},${l.equipe},${l.setor},${l.tipo},${l.inicio},${l.fim},${l.duracao},${l.status},${l.auditoria},${l.lider},${l.membros_inicio},${l.membros_retorno},${l.obs || ''}`).join('\n');
      const blob = new Blob([header + summary + detailHeader + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatorio_Fiscal_NR36_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(null);
      setExportSuccess('Relatório Fiscal NR-36 exportado!');
    }, 1800);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Success Toast */}
      {exportSuccess && (
        <div className="fixed top-6 right-6 z-[60] bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-right-4 duration-300">
          <CheckCircle size={20} /> {exportSuccess}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Relatórios e <span className="text-blue-500">Auditoria</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Extração de dados para conformidade NR-36 e fiscalização</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all">
            <Printer size={18} /> IMPRIMIR
          </button>
          <button onClick={handleExportCSV} disabled={!!exporting} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all">
            {exporting === 'pdf' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} EXPORTAR CSV
          </button>
          <button onClick={handleExportFiscal} disabled={!!exporting} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-2.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 transition-all">
            {exporting === 'fiscal' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} RELATÓRIO FISCAL
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-slate-950 rounded-2xl text-blue-500 border border-slate-800">{stat.icon}</div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.color === 'red' ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'}`}>{stat.trend}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center gap-6">
          {/* Date Range Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-2xl w-fit border border-slate-800">
            {['Hoje', 'Semana', 'Mês', 'Personalizado'].map(item => (
              <button key={item} onClick={() => setDateRange(item)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateRange === item ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}>{item}</button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Filtrar por equipe ou setor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button onClick={() => setShowFilterPanel(!showFilterPanel)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-black transition-all ${filterStatus ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}>
              <Filter size={16} /> {filterStatus || 'TODOS STATUS'}
            </button>
            {showFilterPanel && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden">
                <button onClick={() => { setFilterStatus(''); setShowFilterPanel(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 font-medium">Todos</button>
                {['Concluída', 'Atrasada', 'Não Realizada'].map(s => (
                  <button key={s} onClick={() => { setFilterStatus(s); setShowFilterPanel(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-800 font-medium ${filterStatus === s ? 'text-blue-500' : 'text-slate-300'}`}>{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/20 text-slate-600 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                <th className="px-8 py-5">Equipe / Setor</th>
                <th className="px-8 py-5">Horários</th>
                <th className="px-8 py-5">Tipo de Pausa</th>
                <th className="px-8 py-5">Execução</th>
                <th className="px-8 py-5">Auditoria</th>
                <th className="px-8 py-5 text-right">Detalhe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-600 font-bold">Nenhum registro encontrado para os filtros selecionados.</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group cursor-pointer" onClick={() => { setSelectedLog(log); setShowDetailModal(true); }}>
                  <td className="px-8 py-5"><p className="text-sm font-black text-white">{log.equipe}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{log.setor}</p></td>
                  <td className="px-8 py-5"><div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Clock size={12} className="text-blue-500" /><span>{log.inicio} — {log.fim}</span></div></td>
                  <td className="px-8 py-5"><span className="text-xs font-bold text-slate-300">{log.tipo}</span></td>
                  <td className="px-8 py-5"><span className={`inline-flex px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusBadge(log.status)}`}>{log.status}</span></td>
                  <td className="px-8 py-5"><span className={`text-[11px] font-bold ${log.auditoria === 'OK' ? 'text-green-500' : log.auditoria === 'Alerta' ? 'text-yellow-500' : 'text-red-500'}`}>{log.auditoria}</span></td>
                  <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-slate-800 rounded-lg text-slate-600 group-hover:text-blue-500 transition-all"><Eye size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/30 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-bold">Mostrando {filteredLogs.length} registros — Período: {dateRange}</p>
          <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Dados atualizados em tempo real</p>
        </div>
      </div>

      {/* ========== DETAIL MODAL ========== */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Detalhes da Pausa</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{selectedLog.data} • {selectedLog.equipe}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-2xl border text-sm font-black ${getStatusBadge(selectedLog.status)}`}>{selectedLog.status}</div>
                <span className={`text-sm font-bold ${selectedLog.auditoria === 'OK' ? 'text-green-500' : 'text-red-500'}`}>Auditoria: {selectedLog.auditoria}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Setor</p><p className="text-sm font-bold text-white">{selectedLog.setor}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Tipo</p><p className="text-sm font-bold text-white">{selectedLog.tipo}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Início</p><p className="text-sm font-bold text-white">{selectedLog.inicio}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Fim</p><p className="text-sm font-bold text-white">{selectedLog.fim}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Duração</p><p className="text-sm font-bold text-white">{selectedLog.duracao}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Local</p><p className="text-sm font-bold text-white">{selectedLog.local}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Líder</p><p className="text-sm font-bold text-white">{selectedLog.lider}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Membros</p><p className="text-sm font-bold text-white">{selectedLog.membros_inicio} → {selectedLog.membros_retorno}</p></div>
              </div>
              {selectedLog.obs && (
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                  <p className="text-[9px] font-black text-yellow-500/70 uppercase mb-1">Observações</p>
                  <p className="text-sm text-yellow-400">{selectedLog.obs}</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex gap-3">
              <button onClick={() => setShowDetailModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:text-white transition-colors">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;
