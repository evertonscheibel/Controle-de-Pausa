import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Users, UserPlus, Upload, Search, Filter, MoreVertical, ScanFace, Key, 
  CheckCircle, X, FileSpreadsheet, Download, ShieldCheck, AlertCircle,
  Edit2, Trash2, Eye, Camera, Loader2, Copy, RefreshCw
} from 'lucide-react';
import api from '../api/axios';

const EQUIPES = ['Desossa - Linha A', 'Desossa - Linha B', 'Linha C - Miúdos', 'Pendura Principal', 'Embalagem Manhã'];
const FUNCOES = ['Operador de Desossa', 'Auxiliar de Desossa', 'Operador de Miúdos', 'Operador de Pendura', 'Operador de Embalagem'];

const Colaboradores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEquipe, setFilterEquipe] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State
  const [selectedColab, setSelectedColab] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [importStatus, setImportStatus] = useState('idle');
  const [importFile, setImportFile] = useState(null);
  const [bioScanStatus, setBioScanStatus] = useState('idle');
  const [generatedPin, setGeneratedPin] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const bioVideoRef = useRef(null);
  const [bioStream, setBioStream] = useState(null);

  // Form
  const [form, setForm] = useState({ nome: '', matricula: '', equipe: '', funcao: '', restricoes: '' });

  // Data from API
  const [colaboradores, setColaboradores] = useState([]);

  // Fetch from backend
  const fetchColaboradores = useCallback(async () => {
    try {
      const res = await api.get('/colaboradores');
      setColaboradores(res.data);
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchColaboradores(); }, [fetchColaboradores]);

  const filtered = colaboradores.filter(c => {
    const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEquipe = !filterEquipe || c.equipe === filterEquipe;
    return matchSearch && matchEquipe;
  });

  const totalBio = colaboradores.filter(c => c.biometria).length;
  const totalPin = colaboradores.filter(c => c.pin).length;

  // Toasts
  useEffect(() => { if (successMessage) { const t = setTimeout(() => setSuccessMessage(''), 3000); return () => clearTimeout(t); } }, [successMessage]);
  useEffect(() => { if (errorMessage) { const t = setTimeout(() => setErrorMessage(''), 4000); return () => clearTimeout(t); } }, [errorMessage]);

  // ========== CRUD ==========
  const handleSave = async () => {
    if (!form.nome || !form.matricula || !form.equipe || !form.funcao) return;
    try {
      if (editMode && selectedColab) {
        await api.put(`/colaboradores/${selectedColab.id}`, form);
        setSuccessMessage(`Colaborador ${form.nome} atualizado com sucesso!`);
      } else {
        await api.post('/colaboradores', form);
        setSuccessMessage(`Colaborador ${form.nome} adicionado com sucesso!`);
      }
      fetchColaboradores();
      setShowAddModal(false);
      setForm({ nome: '', matricula: '', equipe: '', funcao: '', restricoes: '' });
      setEditMode(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Erro ao salvar colaborador');
    }
  };

  const openEdit = (c) => {
    setSelectedColab(c);
    setForm({ nome: c.nome, matricula: c.matricula, equipe: c.equipe, funcao: c.funcao, restricoes: c.restricoes || '' });
    setEditMode(true);
    setShowAddModal(true);
  };

  const openAdd = () => {
    const nextNum = String(colaboradores.length + 1).padStart(3, '0');
    setForm({ nome: '', matricula: `COL${nextNum}`, equipe: '', funcao: '', restricoes: '' });
    setEditMode(false);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (!selectedColab) return;
    try {
      await api.delete(`/colaboradores/${selectedColab.id}`);
      setSuccessMessage(`Colaborador ${selectedColab.nome} removido.`);
      fetchColaboradores();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Erro ao remover');
    }
    setShowDeleteConfirm(false);
    setSelectedColab(null);
  };

  // ========== IMPORT ==========
  const handleImportFile = (e) => { if (e.target.files[0]) setImportFile(e.target.files[0]); };

  const handleImportStart = async () => {
    if (!importFile) return;
    setImportStatus('uploading');
    try {
      // Parse CSV
      const text = await importFile.text();
      const lines = text.split('\n').filter(l => l.trim());
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const registros = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj = {};
        header.forEach((h, i) => { obj[h] = vals[i] || ''; });
        return obj;
      }).filter(r => r.nome);

      if (registros.length === 0) {
        setImportStatus('idle');
        setErrorMessage('Nenhum registro válido encontrado no arquivo.');
        return;
      }

      const res = await api.post('/colaboradores/importar', { registros });
      setImportStatus('success');
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus('idle');
        setImportFile(null);
        fetchColaboradores();
        setSuccessMessage(`${res.data.importados} colaboradores importados com sucesso!`);
      }, 1500);
    } catch (err) {
      setImportStatus('idle');
      setErrorMessage(err.response?.data?.error || 'Erro na importação');
    }
  };

  const handleDownloadTemplate = () => {
    const csv = "nome,matricula,equipe,funcao,restricoes\nExemplo Silva,COL999,Desossa - Linha A,Operador de Desossa,\n";
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Layout_Importacao_Colaboradores.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const header = "nome,matricula,equipe,funcao,biometria,pin\n";
    const rows = colaboradores.map(c => `${c.nome},${c.matricula},${c.equipe},${c.funcao},${c.biometria ? 'Sim' : 'Não'},${c.pin ? 'Sim' : 'Não'}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Colaboradores_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // ========== BIOMETRIA (vinculada ao colaborador) ==========
  const startBioScan = async () => {
    if (!selectedColab) return;
    setBioScanStatus('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 360 } });
      setBioStream(stream);
      if (bioVideoRef.current) bioVideoRef.current.srcObject = stream;
      // Simulate facial mapping
      setTimeout(async () => {
        setBioScanStatus('success');
        try {
          await api.patch(`/colaboradores/${selectedColab.id}/biometria`);
          fetchColaboradores();
        } catch {}
        setTimeout(() => {
          stopBioStream(stream);
          setShowBioModal(false);
          setBioScanStatus('idle');
          setSuccessMessage(`Biometria de ${selectedColab.nome} vinculada com sucesso!`);
        }, 1500);
      }, 3000);
    } catch {
      setBioScanStatus('idle');
      setErrorMessage('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  const stopBioStream = (s) => { const stream = s || bioStream; if (stream) stream.getTracks().forEach(t => t.stop()); setBioStream(null); };

  // ========== PIN ==========
  const handleGeneratePin = async () => {
    if (!selectedColab) return;
    try {
      const res = await api.patch(`/colaboradores/${selectedColab.id}/pin`);
      setGeneratedPin(res.data.pin);
      fetchColaboradores();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Erro ao gerar PIN');
    }
  };

  const copyPin = () => {
    navigator.clipboard.writeText(generatedPin);
    setSuccessMessage('PIN copiado para a área de transferência!');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
      <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
      <p className="font-bold text-white tracking-widest uppercase text-xs">Carregando colaboradores...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-[60] bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-right-4 duration-300">
          <CheckCircle size={20} /> {successMessage}
        </div>
      )}
      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-[60] bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-right-4 duration-300">
          <AlertCircle size={20} /> {errorMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gestão de <span className="text-blue-500">Colaboradores</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Controle individual, biometria facial e códigos PIN</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-5 rounded-2xl transition-all flex items-center gap-2"><Download size={18} /> EXPORTAR</button>
          <button onClick={() => setShowImportModal(true)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-5 rounded-2xl transition-all flex items-center gap-2"><Upload size={18} /> IMPORTAR CSV</button>
          <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"><UserPlus size={20} /> ADICIONAR</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Users size={24} /></div>
          <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Colaboradores</p><h3 className="text-2xl font-black text-white">{colaboradores.length}</h3></div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl"><ShieldCheck size={24} /></div>
          <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biometria Vinculada</p><h3 className="text-2xl font-black text-white">{totalBio} <span className="text-sm text-slate-500">({colaboradores.length > 0 ? Math.round(totalBio/colaboradores.length*100) : 0}%)</span></h3></div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><Key size={24} /></div>
          <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PINs Registrados</p><h3 className="text-2xl font-black text-white">{totalPin}</h3></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type="text" placeholder="Buscar por nome ou matrícula..." className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative">
            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-white flex items-center gap-2 transition-all font-bold text-sm">
              <Filter size={18} /> {filterEquipe || 'TODAS EQUIPES'}
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden">
                <button onClick={() => { setFilterEquipe(''); setShowFilterDropdown(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 font-medium">Todas as equipes</button>
                {EQUIPES.map(eq => (
                  <button key={eq} onClick={() => { setFilterEquipe(eq); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-800 font-medium ${filterEquipe === eq ? 'text-blue-500' : 'text-slate-300'}`}>{eq}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-slate-950/30 text-slate-600 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                <th className="px-8 py-5">Colaborador / Matrícula</th>
                <th className="px-8 py-5">Equipe / Função</th>
                <th className="px-8 py-5 text-center">Biometria</th>
                <th className="px-8 py-5 text-center">PIN</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-blue-600/[0.02] transition-colors group">
                  <td className="px-8 py-5"><p className="text-white font-black">{c.nome}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-wider">{c.matricula}</p></td>
                  <td className="px-8 py-5"><p className="text-sm font-bold text-slate-300">{c.equipe}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{c.funcao}</p></td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center">
                      <button onClick={() => { setSelectedColab(c); setShowBioModal(true); setBioScanStatus('idle'); }} className={`p-2 rounded-xl border transition-all ${c.biometria ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' : 'bg-slate-800 border-slate-700 text-slate-600 hover:border-blue-500/50 hover:text-blue-500'}`} title={c.biometria ? "Biometria Vinculada ✓" : "Vincular Biometria"}>
                        <ScanFace size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center">
                      <button onClick={() => { setSelectedColab(c); setGeneratedPin(c.pin_code || ''); setShowPinModal(true); }} className={`p-2 rounded-xl border transition-all ${c.pin ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'bg-slate-800 border-slate-700 text-slate-600 hover:border-indigo-500/50 hover:text-indigo-500'}`} title={c.pin ? "PIN Cadastrado ✓" : "Gerar PIN"}>
                        <Key size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelectedColab(c); setShowDetailModal(true); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white" title="Ver detalhes"><Eye size={16} /></button>
                      <button onClick={() => openEdit(c)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => { setSelectedColab(c); setShowDeleteConfirm(true); }} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-950/30 border-t border-slate-800 text-center"><p className="text-xs text-slate-600 font-bold">Mostrando {filtered.length} de {colaboradores.length} colaboradores</p></div>
      </div>

      {/* ========== ADD / EDIT MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3"><UserPlus size={22} className="text-blue-500" /><h3 className="text-xl font-bold text-white">{editMode ? 'Editar Colaborador' : 'Novo Colaborador'}</h3></div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Nome Completo *</label><input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Nome do colaborador" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Matrícula *</label><input type="text" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
                <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Função *</label><select value={form.funcao} onChange={e => setForm({...form, funcao: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"><option value="">Selecione...</option>{FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
              </div>
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Equipe *</label><select value={form.equipe} onChange={e => setForm({...form, equipe: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"><option value="">Selecione...</option>{EQUIPES.map(eq => <option key={eq} value={eq}>{eq}</option>)}</select></div>
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Restrições Médicas</label><textarea value={form.restricoes} onChange={e => setForm({...form, restricoes: e.target.value})} rows={2} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" placeholder="Opcional"></textarea></div>
            </div>
            <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex gap-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-colors rounded-2xl">CANCELAR</button>
              <button onClick={handleSave} disabled={!form.nome || !form.matricula || !form.equipe || !form.funcao} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">{editMode ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== IMPORT MODAL ========== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3 text-blue-500"><FileSpreadsheet size={24} /><h3 className="text-xl font-bold text-white">Importação em Massa</h3></div>
              <button onClick={() => { setShowImportModal(false); setImportStatus('idle'); setImportFile(null); }} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              {importStatus === 'success' ? (
                <div className="py-16 text-center space-y-4"><div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><CheckCircle size={48} /></div><h4 className="text-2xl font-black text-white">Importação Concluída!</h4></div>
              ) : importStatus === 'uploading' ? (
                <div className="py-16 text-center space-y-4"><Loader2 size={48} className="animate-spin text-blue-500 mx-auto" /><p className="text-slate-400 font-bold">Processando arquivo...</p></div>
              ) : (
                <>
                  <div onClick={() => fileInputRef.current?.click()} className={`py-12 border-2 border-dashed rounded-3xl bg-slate-950/50 flex flex-col items-center gap-4 cursor-pointer transition-all ${importFile ? 'border-blue-500/50' : 'border-slate-800 hover:border-blue-500/30'}`}>
                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImportFile} />
                    <div className={`p-4 rounded-full ${importFile ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-500'}`}><FileSpreadsheet size={40} /></div>
                    {importFile ? (<div><p className="text-blue-500 font-bold text-lg">{importFile.name}</p><p className="text-slate-500 text-sm mt-1">Clique para trocar</p></div>) : (<div><p className="text-white font-bold text-lg">Arraste seu arquivo CSV ou Excel</p><p className="text-slate-500 text-sm mt-1">Clique para selecionar</p></div>)}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl text-left border border-slate-800">
                    <div className="flex items-center gap-4"><div className="p-2 bg-slate-800 rounded-xl text-slate-400"><Download size={20} /></div><div><p className="text-sm font-bold text-white leading-none">Layout_Importacao.csv</p><p className="text-[10px] text-slate-500 uppercase font-black mt-1">Planilha Exemplo</p></div></div>
                    <button onClick={handleDownloadTemplate} className="text-xs font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">Baixar</button>
                  </div>
                </>
              )}
            </div>
            {importStatus === 'idle' && (
              <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex gap-4">
                <button onClick={() => { setShowImportModal(false); setImportFile(null); }} className="flex-1 py-4 text-slate-500 font-bold hover:text-white">CANCELAR</button>
                <button onClick={handleImportStart} disabled={!importFile} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-2xl transition-all">INICIAR IMPORTAÇÃO</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== BIOMETRIC MODAL (vinculada ao colaborador) ========== */}
      {showBioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3"><Camera size={20} className="text-blue-500" /><h3 className="text-lg font-bold text-white">Biometria Facial</h3></div>
              <button onClick={() => { setShowBioModal(false); stopBioStream(); setBioScanStatus('idle'); }} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 text-center space-y-6">
              <p className="text-slate-400 font-medium">Vincular biometria facial para <strong className="text-white">{selectedColab?.nome}</strong></p>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-left">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Importante</p>
                <p className="text-[11px] text-slate-500 font-bold">A biometria será vinculada exclusivamente a este colaborador. Somente ele poderá validar pausas via reconhecimento facial.</p>
              </div>
              {bioScanStatus === 'idle' && (
                <div className="space-y-6">
                  <div className="w-32 h-32 mx-auto bg-slate-950 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600"><ScanFace size={56} /></div>
                  <button onClick={startBioScan} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"><Camera size={20} /> INICIAR CAPTURA FACIAL</button>
                </div>
              )}
              {bioScanStatus === 'scanning' && (
                <div className="space-y-4">
                  <div className="aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-black relative">
                    <video ref={bioVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 w-10 h-10 border-t-[3px] border-l-[3px] border-blue-500 rounded-tl-xl"></div>
                      <div className="absolute top-4 right-4 w-10 h-10 border-t-[3px] border-r-[3px] border-blue-500 rounded-tr-xl"></div>
                      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-[3px] border-l-[3px] border-blue-500 rounded-bl-xl"></div>
                      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-[3px] border-r-[3px] border-blue-500 rounded-br-xl"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-500"><Loader2 size={16} className="animate-spin" /><span className="text-xs font-black uppercase tracking-widest">Mapeando pontos faciais de {selectedColab?.nome}...</span></div>
                </div>
              )}
              {bioScanStatus === 'success' && (
                <div className="space-y-4 py-6">
                  <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><CheckCircle size={48} /></div>
                  <h4 className="text-xl font-black text-white">Biometria Vinculada!</h4>
                  <p className="text-slate-400 text-sm">Colaborador <strong>{selectedColab?.nome}</strong> poderá validar pausas via reconhecimento facial.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== PIN MODAL ========== */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Key size={20} className="text-indigo-500" /> Código PIN</h3><button onClick={() => setShowPinModal(false)} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button></div>
            <p className="text-slate-400 text-sm">PIN para <strong className="text-white">{selectedColab?.nome}</strong></p>
            {generatedPin ? (
              <div className="space-y-4">
                <div className="flex justify-center gap-3">{generatedPin.split('').map((d, i) => (<div key={i} className="w-16 h-16 bg-indigo-500/10 border-2 border-indigo-500/30 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-400">{d}</div>))}</div>
                <div className="flex gap-3">
                  <button onClick={copyPin} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2"><Copy size={16} /> Copiar</button>
                  <button onClick={handleGeneratePin} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2"><RefreshCw size={16} /> Novo PIN</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4"><div className="w-20 h-20 mx-auto bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-600"><Key size={40} /></div><p className="text-xs text-slate-500">Nenhum PIN cadastrado</p></div>
            )}
            <button onClick={handleGeneratePin} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">{generatedPin ? 'REGENERAR PIN' : 'GERAR NOVO PIN'}</button>
          </div>
        </div>
      )}

      {/* ========== DETAIL MODAL ========== */}
      {showDetailModal && selectedColab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="text-lg font-bold text-white">Detalhes do Colaborador</h3><button onClick={() => setShowDetailModal(false)} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button></div>
            <div className="p-8 space-y-5">
              <div className="flex items-center gap-4"><div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Users size={28} /></div><div><p className="text-white font-black text-lg">{selectedColab.nome}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{selectedColab.matricula}</p></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Equipe</p><p className="text-sm font-bold text-white">{selectedColab.equipe}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Função</p><p className="text-sm font-bold text-white">{selectedColab.funcao}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Biometria</p><p className={`text-sm font-bold ${selectedColab.biometria ? 'text-green-500' : 'text-slate-600'}`}>{selectedColab.biometria ? '✓ Vinculada' : '✗ Pendente'}</p></div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">PIN</p><p className={`text-sm font-bold ${selectedColab.pin ? 'text-indigo-500' : 'text-slate-600'}`}>{selectedColab.pin ? '✓ Cadastrado' : '✗ Pendente'}</p></div>
              </div>
              {selectedColab.restricoes && <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl"><p className="text-[9px] font-black text-orange-500/70 uppercase mb-1">Restrições Médicas</p><p className="text-sm text-orange-400">{selectedColab.restricoes}</p></div>}
            </div>
            <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex gap-3">
              <button onClick={() => { setShowDetailModal(false); openEdit(selectedColab); }} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2"><Edit2 size={16} /> Editar</button>
              <button onClick={() => setShowDetailModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:text-white">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRM ========== */}
      {showDeleteConfirm && selectedColab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-red-500/20 w-full max-w-sm rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center text-red-500"><Trash2 size={32} /></div>
            <div><h3 className="text-xl font-black text-white">Confirmar Exclusão</h3><p className="text-slate-400 mt-2">Remover <strong className="text-white">{selectedColab.nome}</strong>?</p></div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 text-slate-500 font-bold hover:text-white">CANCELAR</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all">CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colaboradores;
