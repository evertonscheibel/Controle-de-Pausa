import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Operacao from './pages/Operacao';
import Setores from './pages/Setores';
import Equipes from './pages/Equipes';
import Relatorios from './pages/Relatorios';
import Colaboradores from './pages/Colaboradores';

// Placeholder components for other routes
const Placeholder = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
    <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
    <p>Este módulo está sendo preparado para o ambiente de demonstração.</p>
  </div>
);

function App() {
  const isAuthenticated = () => !!localStorage.getItem('bridge_token');

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="operacao" element={<Operacao />} />
          <Route path="programacao" element={<Placeholder name="Programação de Pausas" />} />
          <Route path="excecoes" element={<Placeholder name="Gestão de Exceções" />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="setores" element={<Setores />} />
          <Route path="equipes" element={<Equipes />} />
          <Route path="colaboradores" element={<Colaboradores />} />
          <Route path="tipos-pausa" element={<Placeholder name="Tipos de Pausa" />} />
          <Route path="regras" element={<Placeholder name="Regras de Pausa" />} />
          <Route path="configuracoes" element={<Placeholder name="Configurações do Sistema" />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
