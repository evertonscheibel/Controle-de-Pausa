import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('bridge_token', response.data.token);
      localStorage.setItem('bridge_user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Falha na autenticação. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] overflow-hidden relative font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[20%] h-[20%] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex w-full max-w-7xl mx-auto z-10 relative">
        {/* Left Panel: Branding & Impact */}
        <div className="hidden lg:flex flex-col justify-center w-3/5 p-20">
          <div className="space-y-8 max-w-xl">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30">
                 <ShieldCheck size={40} className="text-white" />
               </div>
               <span className="text-3xl font-black text-white tracking-widest uppercase italic">Bridge</span>
             </div>
             
             <h1 className="text-7xl font-black text-white leading-none tracking-tighter">
                CONTROLE DE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500">PAUSA TÉRMICA</span>
             </h1>
             
             <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
                Gerenciamento inteligente de pausas psicofisiológicas e térmicas. Rastreabilidade absoluta e conformidade normativa em tempo real.
             </p>
             
             <div className="space-y-4 pt-4">
                {[
                  'Conformidade com a NR-36',
                  'Auditoria Instantânea',
                  'Gestão por Linha de Produção'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-300 font-bold">
                    <CheckCircle2 size={20} className="text-blue-500" />
                    <span>{item}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-6500 to-cyan-500 translate-y-[-1px] group-hover:translate-y-0 transition-transform duration-500"></div>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-white tracking-tight">Portal de Acesso</h2>
              <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Utilize suas credenciais corporativas</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 transition-colors group-focus-within:text-blue-500">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                    placeholder="exemplo@bridgetec.com.br"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="hidden" />
                  <div className="w-5 h-5 border-2 border-slate-700 rounded-md bg-slate-950 flex items-center justify-center transition-all group-hover:border-blue-500">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm opacity-0 transform scale-50 transition-all"></div>
                  </div>
                  <span className="ml-3 text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Permanecer conectado</span>
                </label>
                <a href="#" className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">Recuperar</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-950 font-black text-lg transition-all transform active:scale-[0.98] shadow-2xl shadow-blue-900/40 relative overflow-hidden"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    ACESSAR O SISTEMA
                    <ChevronRight size={20} className="text-white/50" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">BridgeTecnologia Cloud Infrastructure</p>
               <div className="flex justify-center gap-4 text-[10px] text-slate-800 font-bold">
                  <span>V1.4.2-STABLE</span>
                  <span>ENCRYPTED AES-256</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding for Mobile */}
      <div className="lg:hidden absolute bottom-8 w-full text-center">
         <span className="text-slate-700 text-xs font-black uppercase tracking-widest">Bridge PauseControl</span>
      </div>
    </div>
  );
};

export default Login;
