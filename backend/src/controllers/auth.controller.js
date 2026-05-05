const bcrypt = require('bcrypt');
const db = require('../db');
const { signToken } = require('../utils/auth');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Demo fallback
  if (email === 'admin@bridgetec.com.br' && password === 'Bridge@2025') {
    const token = signToken({
      id: 'mock-admin-id',
      email: 'admin@bridgetec.com.br',
      role: 'administrador',
      name: 'Admin Demo'
    });
    return res.json({
      token,
      user: {
        id: 'mock-admin-id',
        nome: 'Admin Demo',
        email: 'admin@bridgetec.com.br',
        perfil: 'administrador'
      }
    });
  }

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.ativo) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, user.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.perfil,
      name: user.nome
    });

    // Update last login
    await db.query('UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = $1', [user.id]);

    // Log access
    await db.query(
      'INSERT INTO logs_acesso_usuario (id_usuario, tipo) VALUES ($1, $2)',
      [user.id, 'login']
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

module.exports = {
  login
};
