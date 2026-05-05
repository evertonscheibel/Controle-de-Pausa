import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  Menu,
  Bell,
  User,
  ShieldAlert,
  Thermometer,
  Layers,
  MapPin
} from 'lucide-react';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('bridge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('bridge_token');
    localStorage.removeItem('bridge_user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Operação Rápida', path: '/operacao', icon: <Clock size={20} /> },
    { name: 'Programação', path: '/programacao', icon: <Calendar size={20} /> },
    { name: 'Exceções', path: '/excecoes', icon: <AlertTriangle size={20} /> },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText size={20} /> },
    { type: 'header', name: 'Cadastros' },
    { name: 'Colaboradores', path: '/colaboradores', icon: <Users size={20} /> },
    { name: 'Setores', path: '/setores', icon: <MapPin size={20} /> },
    { name: 'Equipes', path: '/equipes', icon: <Layers size={20} /> },
    { name: 'Tipos de Pausa', path: '/tipos-pausa', icon: <Thermometer size={20} /> },
    { name: 'Regras', path: '/regras', icon: <Settings size={20} /> },
    { type: 'divider' },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings size={20} /> },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldAlert size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Bridge<span className="text-blue-500 italic">P</span></span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <ShieldAlert size={18} className="text-white" />
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            if (item.type === 'header') {
              return !collapsed && (
                <p key={idx} className="px-3 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {item.name}
                </p>
              );
            }
            if (item.type === 'divider') {
              return <hr key={idx} className="my-4 border-slate-800/50" />;
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-500 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className={`${isActive ? 'text-blue-500' : 'group-hover:text-slate-100'}`}>
                  {item.icon}
                </div>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200`}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-bottom border-slate-800 px-6 flex items-center justify-between z-20">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{user.nome}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mt-1">{user.perfil?.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-blue-500 ring-4 ring-slate-900">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
