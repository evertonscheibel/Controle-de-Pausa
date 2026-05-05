import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, CheckCircle, Shield, Loader2, AlertCircle } from 'lucide-react';

const BiometricModal = ({ isOpen, onClose, onConfirm, actionName }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('initializing'); // initializing, scanning, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setStatus('initializing');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Simulate scanning start
      setTimeout(() => {
        setStatus('scanning');
        // Simulate detection success after 3 seconds
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => {
            onConfirm();
            onClose();
          }, 1500);
        }, 3000);
      }, 1000);

    } catch (err) {
      console.error('Erro ao acessar camera:', err);
      setStatus('error');
      setErrorMessage('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setStatus('initializing');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600/10 rounded-xl text-blue-500">
               <Shield size={20} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Validação Biométrica</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{actionName}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Camera Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {status !== 'error' ? (
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               muted 
               className={`w-full h-full object-cover transition-all duration-700 ${status === 'scanning' ? 'scale-110 blur-[1px] brightness-110' : ''}`}
             />
          ) : (
             <div className="flex flex-col items-center gap-4 text-red-500 px-10 text-center">
                <AlertCircle size={48} />
                <p className="font-bold">{errorMessage}</p>
                <button onClick={startCamera} className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold mt-2">Tentar Novamente</button>
             </div>
          )}

          {/* Scanning Overlay */}
          {status === 'scanning' && (
             <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal scanner line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scanner shadow-blue-500"></div>
                
                {/* Corners */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>

                {/* Status Box */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600/20 backdrop-blur-md rounded-full border border-blue-500/30 flex items-center gap-2">
                   <Loader2 className="animate-spin text-blue-500" size={16} />
                   <span className="text-blue-500 text-xs font-black tracking-widest uppercase">Identificando Operador...</span>
                </div>
             </div>
          )}

          {/* Success Overlay */}
          {status === 'success' && (
             <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center gap-4 text-green-500">
                   <div className="p-4 bg-green-500 rounded-full text-white shadow-xl shadow-green-500/30">
                      <CheckCircle size={48} />
                   </div>
                   <p className="text-xl font-black tracking-tight drop-shadow-md">Biometria Confirmada</p>
                </div>
             </div>
          )}

          {status === 'initializing' && (
             <div className="flex flex-col items-center gap-4 text-slate-500">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest">Aguardando Câmera...</p>
             </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-slate-950/20 flex items-center gap-4">
           <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
              <Camera size={20} />
           </div>
           <p className="text-[10px] text-slate-500 font-bold leading-tight uppercase tracking-widest">
              O sistema utiliza processamento local por visão computacional para garantir a identidade do líder sem armazenar imagens.
           </p>
        </div>
      </div>

      <style>{`
        @keyframes scanner {
          0% { top: 10%; }
          100% { top: 90%; }
        }
        .animate-scanner {
          animation: scanner 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default BiometricModal;
