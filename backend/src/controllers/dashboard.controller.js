const db = require('../db');

const MOCK_RESUMO = {
  previstas: 24,
  em_andamento: 3,
  concluidas: 18,
  atrasadas: 2,
  nao_realizadas: 1,
  taxa_conformidade: 85.7,
  total_excecoes: 4
};

const getResumo = async (req, res) => {
  const { data, turno, setor } = req.query;
  const targetDate = data || new Date().toISOString().split('T')[0];

  try {
    let query = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'prevista') as previstas,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as em_andamento,
        COUNT(*) FILTER (WHERE status = 'concluida') as concluidas,
        COUNT(*) FILTER (WHERE status = 'atrasada') as atrasadas,
        COUNT(*) FILTER (WHERE status = 'nao_realizada') as nao_realizadas
      FROM pausas_executadas
      WHERE data_pausa = $1
    `;
    const params = [targetDate];

    const result = await db.query(query, params);
    const summary = result.rows[0];

    // If query returned all nulls (likely empty table or error)
    if (!summary.previstas && !summary.concluidas) {
        return res.json({ ...MOCK_RESUMO, note: 'Using demo fallback data' });
    }

    const total = parseInt(summary.previstas) + parseInt(summary.concluidas) + parseInt(summary.atrasadas) + parseInt(summary.nao_realizadas);
    const compliance = total > 0 ? (parseInt(summary.concluidas) / total) * 100 : 100;

    res.json({
      ...summary,
      taxa_conformidade: parseFloat(compliance.toFixed(1)),
      total_excecoes: 0
    });
  } catch (err) {
    console.warn('DB error, using mock fallback for dashboard');
    res.json({ ...MOCK_RESUMO, note: 'Using demo fallback data' });
  }
};

const getEquipesAgora = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vw_equipes_em_pausa_agora');
    res.json(result.rows);
  } catch (err) {
    console.warn('DB error, using empty mock for teams now');
    res.json([]);
  }
};

module.exports = {
  getResumo,
  getEquipesAgora
};
