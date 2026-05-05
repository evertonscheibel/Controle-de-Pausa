import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Users, 
  MapPin, 
  Thermometer, 
  Clock, 
  Timer, 
  AlertCircle, 
  ChevronRight,
  Loader2,
  CheckCheck,
  ArrowRightLeft,
  ScanFace,
  ShieldCheck,
  Key,
  UserCheck
} from 'lucide-react';
import api from '../api/axios';
import BiometricModal from '../components/BiometricModal';

const Operacao = () => {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Modes
  const [operationMode, setOperationMode] = useState('team'); // 'team' or 'individual'
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  // Modals
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  
  // State
  const [pendingAction, setPendingAction] = useState(null);
  const [pinValue, setPinValue] = useState('');
  const [individualHistory, setIndividualHistory] = useState([]);

  const fetchEquipes = async () => {
    try {
      const response = await api.get('/operacao/minhas-equipes');
      setEquipes(response.data);
    } catch (err) {
      console.error('Erro ao buscar equipes:', err);
      // Mock data
      setEquipes([
        { id: 'eq1', nome: 'Desossa Manhã - Linha A', setor_nome: 'Desossa', status_atual: 'prevista', num_membros: 18 },
        { id: 'eq2', nome: 'Desossa Manhã - Linha B', setor_nome: 'Desossa', status_atual: 'em_andamento', num_membros: 18, id_pausa_atual: 'p1', horario_real_inicio: new Date(Date.now() - 12 * 60000).toISOString() },
        { id: 'eq3', nome: 'Linha C - Miúdos', setor_nome: 'Desossa', status_atual: 'prevista', num_membros: 12 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipes();
    const interval = setInterval(fetchEquipes, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleActionRequest = (type, id) => {
    if (operationMode === 'individual') {
      setPendingAction({ type, id });
      if (biometricEnabled) setBioModalOpen(true);
      else setShowPinPad(true);
    } else {
      if (type === 'iniciar') handleIniciar(id);
      else handleEncerrar(id);
    }
  };

  const handleValidationSuccess = () => {
    if (pendingAction) {
       // Mock individual check-in logic
       const name = "Colaborador " + (individualHistory.length + 1);
       const now = new Date();
       setIndividualHistory([{ name, time: now.toLocaleTimeString(), type: pendingAction.type }, ...individualHistory]);
       
       if (operationMode === 'team') {
          if (pendingAction.type === 'iniciar') handleIniciar(pendingAction.id);
          else handleEncerrar(pendingAction.id);
       }
       
       setPendingAction(null);
       setPinValue('');
    }
  };

  const handleIniciar = async (equipeId) => {
    setSubmitting(true);
    try {
      await api.post('/operacao/iniciar-pausa', { id_equipe: equipeId, id_tipo_pausa: 'f1...', qtd_real_inicio: 18 });
      fetchEquipes();
    } catch (err) {
      setError('Erro ao iniciar pausa: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEncerrar = async (pausaId) => {
    setSubmitting(true);
    try {
      await api.post(`/operacao/encerrar-pausa/${pausaId}`, { qtd_real_retorno: 18 });
      fetchEquipes();
    } catch (err) {
      setError('Erro ao encerrar pausa: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const TimerDisplay = ({ startTime }) => {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
      const start = new Date(startTime).getTime();
      const interval = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
      return () => clearInterval(interval);
    }, [startTime]);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return <span className="text-blue-500 font-mono text-2xl font-bold">{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</span>;
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Carregando...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div>
          <h1 className="text-4xl font-black text-white">Monitoramento <span className="text-blue-500">Operacional</span></h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Portal de Execuções e Auditoria 1-para-1</p>
        </div>

        {/* Configuration Hub */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-3 rounded-3xl border border-slate-800">
           <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button 
                onClick={() => setOperationMode('team')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${operationMode === 'team' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-600 hover:text-white'}`}
              >
                Modo Equipe
              </button>
              <button 
                onClick={() => setOperationMode('individual')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${operationMode === 'individual' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-600 hover:text-white'}`}
              >
                Individual 1:1
              </button>
           </div>
           
           <div 
             onClick={() => setBiometricEnabled(!biometricEnabled)}
             className={`flex items-center gap-3 px-4 py-2 rounded-2xl cursor-pointer transition-all border ${biometricEnabled ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
           >
              <ScanFace size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Biometria Facial</span>
              <div className={`w-3 h-3 rounded-full border-2 border-current flex items-center justify-center ${biometricEnabled ? 'bg-blue-500' : ''}`}></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Teams / Individual Check-in Area */}
        <div className="lg:col-span-2 space-y-6">
          {operationMode === 'individual' && (
             <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-blue-500/20 rounded-[2.5rem] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                <div className="flex justify-center">
                   <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                      <ScanFace size={48} />
                   </div>
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white">Check-in Individual</h2>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Aproxime-se para validar sua pausa térmica</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                   <button 
                     onClick={() => { setPendingAction({type: 'check-in'}); setBioModalOpen(true); }}
                     className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 transition-all active:scale-95"
                   >
                     <ScanFace size={24} /> VALIDAR PELA CÂMERA
                   </button>
                   <button 
                     onClick={() => { setPendingAction({type: 'check-in'}); setShowPinPad(true); }}
                     className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-slate-700"
                   >
                     <Key size={24} /> DIGITAR PIN
                   </button>
                </div>
             </div>
          )}

          <div className="grid grid-cols-1 gap-4">
             {equipes.map(eq => (
                <div key={eq.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-slate-600 transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${eq.status_atual === 'em_andamento' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-600'}`}>
                         <Users size={28} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{eq.nome}</h3>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{eq.setor_nome} • {eq.num_membros} Pessoas</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      {eq.status_atual === 'em_andamento' && <TimerDisplay startTime={eq.horario_real_inicio} />}
                      <button 
                         onClick={() => handleActionRequest(eq.status_atual === 'em_andamento' ? 'encerrar' : 'iniciar', eq.status_atual === 'em_andamento' ? eq.id_pausa_atual : eq.id)}
                         className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${eq.status_atual === 'em_andamento' ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                      >
                         {eq.status_atual === 'em_andamento' ? 'FINALIZAR' : 'INICIAR'}
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Right: Real-time Individual Stream */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 flex flex-col h-full max-h-[800px]">
           <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-white flex items-center gap-3 italic">
                 <UserCheck size={20} className="text-blue-500" /> FEED DE AUDITORIA
              </h3>
              <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full border border-blue-500/20">AO VIVO</span>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {individualHistory.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-600 py-20 text-center opacity-50">
                    <Clock size={40} className="mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhum registro<br/>nas últimas 4 horas</p>
                 </div>
              ) : individualHistory.map((h, i) => (
                 <div key={i} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 flex items-center justify-between animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${h.type === 'iniciar' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-blue-500/10 text-blue-500 border border-blue-500/30'}`}>
                          {h.type === 'iniciar' ? 'IN' : 'OT'}
                       </div>
                       <div>
                          <p className="text-xs font-black text-white uppercase">{h.name}</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase">{h.time} • Validado via {biometricEnabled ? 'FACE' : 'PIN'}</p>
                       </div>
                    </div>
                    <CheckCheck size={16} className="text-green-500 opacity-50" />
                 </div>
              ))}
           </div>
           
           <div className="pt-4 border-t border-slate-800">
              <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">Conformidade NR-36 em Tempo Real</p>
           </div>
        </div>
      </div>

      {/* PIN Pad Modal */}
      {showPinPad && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] w-full max-w-sm text-center space-y-8 shadow-2xl ring-1 ring-white/10">
               <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Validação de Acesso</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Informe seu código de 4 dígitos</p>
               </div>
               
               <div className="flex justify-center gap-3">
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${pinValue.length > i ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/30' : 'bg-slate-950 border-slate-800 text-slate-800'}`}>
                        {pinValue.length > i ? '•' : ''}
                     </div>
                  ))}
               </div>

               <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6,7,8,9,'C',0,'OK'].map(num => (
                     <button 
                       key={num}
                       onClick={() => {
                          if (num === 'C') setPinValue('');
                          else if (num === 'OK') handleValidationSuccess();
                          else if (pinValue.length < 4) setPinValue(pinValue + num);
                       }}
                       className={`h-16 rounded-2xl font-black text-xl transition-all active:scale-95 ${num === 'OK' ? 'bg-blue-600 text-white hover:bg-blue-500 col-span-1 shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-800/50'}`}
                     >
                       {num}
                     </button>
                  ))}
               </div>
               
               <button onClick={() => setShowPinPad(false)} className="w-full py-4 text-xs font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Voltar</button>
            </div>
         </div>
      )}

      <BiometricModal 
        isOpen={bioModalOpen}
        onClose={() => setBioModalOpen(false)}
        onConfirm={handleValidationSuccess}
        actionName={pendingAction?.type === 'iniciar' ? 'INÍCIO DE PAUSA' : 'RETORNO DE PAUSA'}
      />
    </div>
  );
};

export default Operacao;
