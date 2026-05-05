const db = require('../db');

// In-memory store (persists while server is running)
let colaboradores = [
  { id: 1, nome: 'João Batista Rodrigues', matricula: 'COL001', equipe: 'Desossa - Linha A', funcao: 'Operador de Desossa', biometria: true, pin: true, pin_code: '4821', restricoes: '', ativo: true },
  { id: 2, nome: 'Maria das Graças Silva', matricula: 'COL002', equipe: 'Desossa - Linha A', funcao: 'Operador de Desossa', biometria: true, pin: false, pin_code: '', restricoes: '', ativo: true },
  { id: 3, nome: 'Pedro Alves Machado', matricula: 'COL003', equipe: 'Desossa - Linha A', funcao: 'Operador de Desossa', biometria: false, pin: true, pin_code: '7312', restricoes: 'Esforço limitado', ativo: true },
  { id: 4, nome: 'Luciana Torres Costa', matricula: 'COL004', equipe: 'Desossa - Linha B', funcao: 'Operador de Desossa', biometria: false, pin: false, pin_code: '', restricoes: '', ativo: true },
  { id: 5, nome: 'Raimundo Nonato Brito', matricula: 'COL005', equipe: 'Desossa - Linha B', funcao: 'Auxiliar de Desossa', biometria: true, pin: true, pin_code: '9054', restricoes: '', ativo: true },
  { id: 6, nome: 'Cleuza Aparecida Fonseca', matricula: 'COL006', equipe: 'Linha C - Miúdos', funcao: 'Operador de Miúdos', biometria: false, pin: true, pin_code: '1133', restricoes: '', ativo: true },
  { id: 7, nome: 'Marcos Aurélio Pinto', matricula: 'COL007', equipe: 'Desossa - Linha B', funcao: 'Operador de Desossa', biometria: true, pin: true, pin_code: '5567', restricoes: '', ativo: true },
  { id: 8, nome: 'Rosângela Moura Lima', matricula: 'COL008', equipe: 'Pendura Principal', funcao: 'Operador de Pendura', biometria: false, pin: false, pin_code: '', restricoes: '', ativo: true },
];
let nextId = 9;

// GET all
const listar = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees WHERE is_active = true ORDER BY full_name');
    if (result.rows.length > 0) {
      return res.json(result.rows.map(r => ({
        id: r.id, nome: r.full_name, matricula: r.registration, 
        equipe: r.team_id, funcao: r.role_name, biometria: false, 
        pin: false, pin_code: '', restricoes: r.restrictions || '', ativo: r.is_active
      })));
    }
    return res.json(colaboradores.filter(c => c.ativo));
  } catch {
    res.json(colaboradores.filter(c => c.ativo));
  }
};

// GET by id
const buscarPorId = (req, res) => {
  const c = colaboradores.find(c => c.id === parseInt(req.params.id));
  if (!c || !c.ativo) return res.status(404).json({ error: 'Colaborador não encontrado' });
  res.json(c);
};

// POST create
const criar = (req, res) => {
  const { nome, matricula, equipe, funcao, restricoes } = req.body;
  if (!nome || !matricula || !equipe || !funcao) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, matricula, equipe, funcao' });
  }
  // Check duplicate matricula
  if (colaboradores.find(c => c.matricula === matricula && c.ativo)) {
    return res.status(409).json({ error: 'Matrícula já cadastrada' });
  }
  const novo = {
    id: nextId++,
    nome, matricula, equipe, funcao,
    biometria: false, pin: false, pin_code: '',
    restricoes: restricoes || '', ativo: true,
    created_at: new Date().toISOString()
  };
  colaboradores.push(novo);
  console.log(`[COLABORADOR] Criado: ${nome} (${matricula})`);
  res.status(201).json(novo);
};

// PUT update
const atualizar = (req, res) => {
  const idx = colaboradores.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Colaborador não encontrado' });
  const { nome, matricula, equipe, funcao, restricoes } = req.body;
  colaboradores[idx] = { ...colaboradores[idx], nome, matricula, equipe, funcao, restricoes: restricoes || '' };
  console.log(`[COLABORADOR] Atualizado: ${nome} (${matricula})`);
  res.json(colaboradores[idx]);
};

// DELETE (soft)
const remover = (req, res) => {
  const idx = colaboradores.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Colaborador não encontrado' });
  const nome = colaboradores[idx].nome;
  colaboradores[idx].ativo = false;
  console.log(`[COLABORADOR] Removido: ${nome}`);
  res.json({ message: 'Colaborador removido', id: req.params.id });
};

// POST import (batch)
const importar = (req, res) => {
  const { registros } = req.body;
  if (!registros || !Array.isArray(registros)) {
    return res.status(400).json({ error: 'Envie um array de registros' });
  }
  const criados = [];
  for (const r of registros) {
    if (!r.nome || !r.matricula) continue;
    if (colaboradores.find(c => c.matricula === r.matricula && c.ativo)) continue;
    const novo = {
      id: nextId++,
      nome: r.nome, matricula: r.matricula, 
      equipe: r.equipe || 'Não atribuído', funcao: r.funcao || 'Operador',
      biometria: false, pin: false, pin_code: '',
      restricoes: r.restricoes || '', ativo: true,
      created_at: new Date().toISOString()
    };
    colaboradores.push(novo);
    criados.push(novo);
  }
  console.log(`[IMPORTAÇÃO] ${criados.length} colaboradores importados`);
  res.status(201).json({ importados: criados.length, registros: criados });
};

// PATCH biometria
const vincularBiometria = (req, res) => {
  const idx = colaboradores.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Colaborador não encontrado' });
  colaboradores[idx].biometria = true;
  console.log(`[BIOMETRIA] Vinculada para: ${colaboradores[idx].nome}`);
  res.json({ message: 'Biometria vinculada', colaborador: colaboradores[idx] });
};

// PATCH pin
const gerarPin = (req, res) => {
  const idx = colaboradores.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Colaborador não encontrado' });
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  colaboradores[idx].pin = true;
  colaboradores[idx].pin_code = pin;
  console.log(`[PIN] Gerado para: ${colaboradores[idx].nome} -> ${pin}`);
  res.json({ pin, colaborador: colaboradores[idx] });
};

// POST validate PIN (for break registration)
const validarPin = (req, res) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ error: 'PIN obrigatório' });
  const c = colaboradores.find(c => c.pin_code === pin && c.ativo && c.pin);
  if (!c) return res.status(401).json({ error: 'PIN inválido ou não cadastrado' });
  res.json({ valido: true, colaborador: { id: c.id, nome: c.nome, matricula: c.matricula, equipe: c.equipe } });
};

// POST validate biometria (simulated — checks if colaborador has biometria active)
const validarBiometria = (req, res) => {
  const { colaborador_id } = req.body;
  if (!colaborador_id) return res.status(400).json({ error: 'ID do colaborador obrigatório' });
  const c = colaboradores.find(c => c.id === parseInt(colaborador_id) && c.ativo);
  if (!c) return res.status(404).json({ error: 'Colaborador não encontrado' });
  if (!c.biometria) return res.status(403).json({ error: 'Biometria não cadastrada para este colaborador', nome: c.nome });
  res.json({ valido: true, colaborador: { id: c.id, nome: c.nome, matricula: c.matricula, equipe: c.equipe } });
};

module.exports = {
  listar, buscarPorId, criar, atualizar, remover,
  importar, vincularBiometria, gerarPin, validarPin, validarBiometria
};
