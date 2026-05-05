-- ============================================================
-- BRIDGE PAUSECONTROL — SCHEMA POSTGRESQL COMPLETO
-- BridgeTecnologia
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE perfil_usuario AS ENUM (
  'administrador',
  'supervisor_producao',
  'rh',
  'sesmt',
  'juridico',
  'lider_equipe',
  'consulta_gerencia'
);

CREATE TYPE status_pausa AS ENUM (
  'prevista',
  'em_andamento',
  'concluida',
  'atrasada',
  'nao_realizada',
  'remarcada',
  'cancelada'
);

CREATE TYPE categoria_pausa AS ENUM (
  'termica',
  'psicofisiologica',
  'refeicao',
  'outro'
);

CREATE TYPE status_excecao AS ENUM (
  'aberta',
  'em_analise',
  'justificada',
  'nao_conformidade',
  'encerrada'
);

CREATE TYPE tipo_acao_auditoria AS ENUM (
  'INSERT',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'EXPORT',
  'VIEW'
);

CREATE TYPE dia_semana AS ENUM (
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
  'domingo'
);

-- ============================================================
-- TABELA: unidades
-- ============================================================
CREATE TABLE unidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(150) NOT NULL,
  cnpj VARCHAR(18),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  responsavel VARCHAR(150),
  telefone VARCHAR(20),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: setores
-- ============================================================
CREATE TABLE setores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_unidade UUID NOT NULL REFERENCES unidades(id),
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  responsavel VARCHAR(150),
  temperatura_media NUMERIC(5,2), -- graus Celsius
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: linhas_celulas
-- ============================================================
CREATE TABLE linhas_celulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_setor UUID NOT NULL REFERENCES setores(id),
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  capacidade_operadores INTEGER,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: turnos
-- ============================================================
CREATE TABLE turnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_unidade UUID NOT NULL REFERENCES unidades(id),
  nome VARCHAR(100) NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  dias_semana dia_semana[] NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: locais_pausa
-- ============================================================
CREATE TABLE locais_pausa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_setor UUID REFERENCES setores(id),
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  capacidade INTEGER,
  temperatura_media NUMERIC(5,2),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: tipos_pausa
-- ============================================================
CREATE TABLE tipos_pausa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(150) NOT NULL,
  categoria categoria_pausa NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  obrigatoria BOOLEAN NOT NULL DEFAULT TRUE,
  cor_hex VARCHAR(7) DEFAULT '#1A6FE8',
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: motivos_excecao
-- ============================================================
CREATE TABLE motivos_excecao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  descricao VARCHAR(200) NOT NULL,
  requer_justificativa BOOLEAN NOT NULL DEFAULT TRUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: usuarios
-- ============================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_unidade UUID REFERENCES unidades(id),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil perfil_usuario NOT NULL,
  matricula VARCHAR(50),
  telefone VARCHAR(20),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_acesso TIMESTAMPTZ,
  senha_temporaria BOOLEAN NOT NULL DEFAULT FALSE,
  refresh_token TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);

-- ============================================================
-- TABELA: lideres
-- ============================================================
CREATE TABLE lideres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario UUID REFERENCES usuarios(id),
  id_setor UUID NOT NULL REFERENCES setores(id),
  nome VARCHAR(150) NOT NULL,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  cpf VARCHAR(14),
  contato VARCHAR(20),
  email VARCHAR(200),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: equipes
-- ============================================================
CREATE TABLE equipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_setor UUID NOT NULL REFERENCES setores(id),
  id_linha UUID REFERENCES linhas_celulas(id),
  id_lider_principal UUID REFERENCES lideres(id),
  id_turno UUID NOT NULL REFERENCES turnos(id),
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  num_membros INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_equipes_setor ON equipes(id_setor);
CREATE INDEX idx_equipes_turno ON equipes(id_turno);

-- ============================================================
-- TABELA: colaboradores
-- ============================================================
CREATE TABLE colaboradores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_equipe UUID NOT NULL REFERENCES equipes(id),
  nome VARCHAR(150) NOT NULL,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  cpf VARCHAR(14) UNIQUE,
  funcao VARCHAR(100),
  restricao_medica BOOLEAN NOT NULL DEFAULT FALSE,
  descricao_restricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_colaboradores_equipe ON colaboradores(id_equipe);
CREATE INDEX idx_colaboradores_matricula ON colaboradores(matricula);

-- ============================================================
-- TABELA: regras_pausa
-- ============================================================
CREATE TABLE regras_pausa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(200) NOT NULL,
  id_tipo_pausa UUID NOT NULL REFERENCES tipos_pausa(id),
  duracao_minutos INTEGER NOT NULL,
  frequencia_por_turno INTEGER NOT NULL DEFAULT 1,
  intervalo_minimo_minutos INTEGER, -- entre pausas
  tolerancia_inicio_minutos INTEGER NOT NULL DEFAULT 5,
  tolerancia_retorno_minutos INTEGER NOT NULL DEFAULT 3,
  janela_inicio TIME, -- horário mais cedo para iniciar
  janela_fim TIME,    -- horário mais tarde para iniciar
  justificativa_obrigatoria BOOLEAN NOT NULL DEFAULT TRUE,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Regras podem ser vinculadas a setores, turnos ou equipes específicas
CREATE TABLE regras_pausa_aplicacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_regra UUID NOT NULL REFERENCES regras_pausa(id) ON DELETE CASCADE,
  id_setor UUID REFERENCES setores(id),
  id_turno UUID REFERENCES turnos(id),
  id_equipe UUID REFERENCES equipes(id)
);

-- ============================================================
-- TABELA: pausas_programadas
-- ============================================================
CREATE TABLE pausas_programadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_regra UUID REFERENCES regras_pausa(id),
  id_equipe UUID NOT NULL REFERENCES equipes(id),
  id_turno UUID NOT NULL REFERENCES turnos(id),
  id_tipo_pausa UUID NOT NULL REFERENCES tipos_pausa(id),
  id_local_pausa UUID REFERENCES locais_pausa(id),
  id_lider UUID REFERENCES lideres(id),
  data_pausa DATE NOT NULL,
  horario_previsto_inicio TIMESTAMPTZ NOT NULL,
  horario_previsto_fim TIMESTAMPTZ NOT NULL,
  duracao_prevista_minutos INTEGER NOT NULL,
  gerada_automaticamente BOOLEAN NOT NULL DEFAULT FALSE,
  observacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id)
);

CREATE INDEX idx_pausas_prog_equipe ON pausas_programadas(id_equipe);
CREATE INDEX idx_pausas_prog_data ON pausas_programadas(data_pausa);
CREATE INDEX idx_pausas_prog_turno ON pausas_programadas(id_turno);

-- ============================================================
-- TABELA: pausas_executadas
-- ============================================================
CREATE TABLE pausas_executadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_pausa_programada UUID REFERENCES pausas_programadas(id),
  id_equipe UUID NOT NULL REFERENCES equipes(id),
  id_turno UUID NOT NULL REFERENCES turnos(id),
  id_tipo_pausa UUID NOT NULL REFERENCES tipos_pausa(id),
  id_local_pausa UUID REFERENCES locais_pausa(id),
  id_lider UUID REFERENCES lideres(id),
  data_pausa DATE NOT NULL,
  horario_real_inicio TIMESTAMPTZ,
  horario_real_fim TIMESTAMPTZ,
  duracao_real_minutos INTEGER,
  qtd_prevista_pessoas INTEGER,
  qtd_real_inicio INTEGER,
  qtd_real_retorno INTEGER,
  status status_pausa NOT NULL DEFAULT 'prevista',
  atraso_inicio_minutos INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN horario_real_inicio IS NOT NULL AND id_pausa_programada IS NOT NULL THEN NULL
      ELSE NULL
    END
  ) STORED,
  observacao_inicio TEXT,
  observacao_retorno TEXT,
  observacao_divergencia TEXT,
  iniciado_por UUID REFERENCES usuarios(id),
  encerrado_por UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pausas_exec_equipe ON pausas_executadas(id_equipe);
CREATE INDEX idx_pausas_exec_data ON pausas_executadas(data_pausa);
CREATE INDEX idx_pausas_exec_status ON pausas_executadas(status);
CREATE INDEX idx_pausas_exec_turno ON pausas_executadas(id_turno);

-- ============================================================
-- TABELA: excecoes_pausa
-- ============================================================
CREATE TABLE excecoes_pausa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_pausa_programada UUID REFERENCES pausas_programadas(id),
  id_pausa_executada UUID REFERENCES pausas_executadas(id),
  id_equipe UUID NOT NULL REFERENCES equipes(id),
  id_motivo UUID NOT NULL REFERENCES motivos_excecao(id),
  id_lider UUID REFERENCES lideres(id),
  descricao TEXT NOT NULL,
  justificativa TEXT,
  status status_excecao NOT NULL DEFAULT 'aberta',
  data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  registrado_por UUID NOT NULL REFERENCES usuarios(id),
  responsavel_tratativa UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_excecoes_equipe ON excecoes_pausa(id_equipe);
CREATE INDEX idx_excecoes_status ON excecoes_pausa(status);
CREATE INDEX idx_excecoes_data ON excecoes_pausa(data_hora);

-- ============================================================
-- TABELA: tratativas_excecao
-- ============================================================
CREATE TABLE tratativas_excecao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_excecao UUID NOT NULL REFERENCES excecoes_pausa(id) ON DELETE CASCADE,
  id_usuario UUID NOT NULL REFERENCES usuarios(id),
  status_anterior status_excecao,
  status_novo status_excecao NOT NULL,
  comentario TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: controle_individual_pausa
-- ============================================================
CREATE TABLE controle_individual_pausa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_pausa_executada UUID NOT NULL REFERENCES pausas_executadas(id),
  id_colaborador UUID NOT NULL REFERENCES colaboradores(id),
  horario_saida TIMESTAMPTZ,
  horario_retorno TIMESTAMPTZ,
  retorno_atrasado BOOLEAN DEFAULT FALSE,
  ausente BOOLEAN DEFAULT FALSE,
  remanjado BOOLEAN DEFAULT FALSE,
  restricao_medica BOOLEAN DEFAULT FALSE,
  observacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: alertas
-- ============================================================
CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo VARCHAR(100) NOT NULL,
  severidade VARCHAR(20) NOT NULL CHECK (severidade IN ('critico', 'alto', 'medio', 'baixo')),
  titulo VARCHAR(200) NOT NULL,
  mensagem TEXT NOT NULL,
  id_equipe UUID REFERENCES equipes(id),
  id_pausa_executada UUID REFERENCES pausas_executadas(id),
  lido BOOLEAN NOT NULL DEFAULT FALSE,
  lido_por UUID REFERENCES usuarios(id),
  lido_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alertas_lido ON alertas(lido);
CREATE INDEX idx_alertas_criado ON alertas(criado_em DESC);

-- ============================================================
-- TABELA: logs_auditoria
-- ============================================================
CREATE TABLE logs_auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario UUID REFERENCES usuarios(id),
  nome_usuario VARCHAR(150),
  acao tipo_acao_auditoria NOT NULL,
  entidade VARCHAR(100) NOT NULL,
  id_registro UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_origem VARCHAR(45),
  user_agent TEXT,
  detalhes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auditoria_usuario ON logs_auditoria(id_usuario);
CREATE INDEX idx_auditoria_entidade ON logs_auditoria(entidade);
CREATE INDEX idx_auditoria_criado ON logs_auditoria(criado_em DESC);
CREATE INDEX idx_auditoria_acao ON logs_auditoria(acao);

-- ============================================================
-- TABELA: logs_acesso_usuario
-- ============================================================
CREATE TABLE logs_acesso_usuario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario UUID NOT NULL REFERENCES usuarios(id),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('login', 'logout', 'falha_login')),
  ip_origem VARCHAR(45),
  user_agent TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: configuracoes_sistema
-- ============================================================
CREATE TABLE configuracoes_sistema (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  descricao TEXT,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_por UUID REFERENCES usuarios(id)
);

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View: dashboard_pausas_hoje
CREATE OR REPLACE VIEW vw_dashboard_pausas_hoje AS
SELECT
  pe.id,
  pe.data_pausa,
  pe.status,
  e.nome AS equipe,
  s.nome AS setor,
  t.nome AS turno,
  tp.nome AS tipo_pausa,
  tp.categoria,
  pe.horario_real_inicio,
  pe.horario_real_fim,
  pe.duracao_real_minutos,
  pp.horario_previsto_inicio,
  pp.horario_previsto_fim,
  pp.duracao_prevista_minutos,
  l.nome AS lider,
  EXTRACT(EPOCH FROM (pe.horario_real_inicio - pp.horario_previsto_inicio)) / 60 AS atraso_inicio_min
FROM pausas_executadas pe
JOIN equipes e ON pe.id_equipe = e.id
JOIN setores s ON e.id_setor = s.id
JOIN turnos t ON pe.id_turno = t.id
JOIN tipos_pausa tp ON pe.id_tipo_pausa = tp.id
LEFT JOIN pausas_programadas pp ON pe.id_pausa_programada = pp.id
LEFT JOIN lideres l ON pe.id_lider = l.id
WHERE pe.data_pausa = CURRENT_DATE;

-- View: conformidade_por_setor
CREATE OR REPLACE VIEW vw_conformidade_por_setor AS
SELECT
  s.id AS id_setor,
  s.nome AS setor,
  COUNT(pe.id) FILTER (WHERE pe.status = 'concluida') AS concluidas,
  COUNT(pe.id) FILTER (WHERE pe.status = 'nao_realizada') AS nao_realizadas,
  COUNT(pe.id) FILTER (WHERE pe.status = 'atrasada') AS atrasadas,
  COUNT(pe.id) AS total,
  ROUND(
    COUNT(pe.id) FILTER (WHERE pe.status = 'concluida')::NUMERIC /
    NULLIF(COUNT(pe.id), 0) * 100, 2
  ) AS taxa_conformidade
FROM setores s
LEFT JOIN equipes e ON e.id_setor = s.id
LEFT JOIN pausas_executadas pe ON pe.id_equipe = e.id
WHERE pe.data_pausa >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s.id, s.nome;

-- View: equipes_em_pausa_agora
CREATE OR REPLACE VIEW vw_equipes_em_pausa_agora AS
SELECT
  pe.id AS id_pausa,
  e.nome AS equipe,
  s.nome AS setor,
  t.nome AS turno,
  tp.nome AS tipo_pausa,
  pe.horario_real_inicio,
  pp.horario_previsto_fim AS retorno_previsto,
  l.nome AS lider,
  pe.qtd_real_inicio AS pessoas_em_pausa,
  EXTRACT(EPOCH FROM (NOW() - pe.horario_real_inicio)) / 60 AS minutos_em_pausa
FROM pausas_executadas pe
JOIN equipes e ON pe.id_equipe = e.id
JOIN setores s ON e.id_setor = s.id
JOIN turnos t ON pe.id_turno = t.id
JOIN tipos_pausa tp ON pe.id_tipo_pausa = tp.id
LEFT JOIN pausas_programadas pp ON pe.id_pausa_programada = pp.id
LEFT JOIN lideres l ON pe.id_lider = l.id
WHERE pe.status = 'em_andamento';

-- ============================================================
-- FUNÇÃO: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION fn_atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas relevantes
CREATE TRIGGER trg_unidades_updated BEFORE UPDATE ON unidades FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_setores_updated BEFORE UPDATE ON setores FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_linhas_updated BEFORE UPDATE ON linhas_celulas FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_turnos_updated BEFORE UPDATE ON turnos FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_locais_updated BEFORE UPDATE ON locais_pausa FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_tipos_pausa_updated BEFORE UPDATE ON tipos_pausa FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_usuarios_updated BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_lideres_updated BEFORE UPDATE ON lideres FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_equipes_updated BEFORE UPDATE ON equipes FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_colaboradores_updated BEFORE UPDATE ON colaboradores FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_regras_updated BEFORE UPDATE ON regras_pausa FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_prog_updated BEFORE UPDATE ON pausas_programadas FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_exec_updated BEFORE UPDATE ON pausas_executadas FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();
CREATE TRIGGER trg_excecoes_updated BEFORE UPDATE ON excecoes_pausa FOR EACH ROW EXECUTE FUNCTION fn_atualizar_updated_at();

-- ============================================================
-- FUNÇÃO: calcular status de pausa automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION fn_calcular_status_pausa()
RETURNS TRIGGER AS $$
DECLARE
  v_previsto_inicio TIMESTAMPTZ;
  v_duracao INTEGER;
  v_tolerancia_retorno INTEGER;
BEGIN
  IF NEW.id_pausa_programada IS NOT NULL THEN
    SELECT pp.horario_previsto_inicio, pp.duracao_prevista_minutos,
           COALESCE(rp.tolerancia_retorno_minutos, 3)
    INTO v_previsto_inicio, v_duracao, v_tolerancia_retorno
    FROM pausas_programadas pp
    LEFT JOIN regras_pausa rp ON pp.id_regra = rp.id
    WHERE pp.id = NEW.id_pausa_programada;

    IF NEW.horario_real_fim IS NOT NULL AND NEW.horario_real_inicio IS NOT NULL THEN
      NEW.duracao_real_minutos := EXTRACT(EPOCH FROM (NEW.horario_real_fim - NEW.horario_real_inicio)) / 60;
      
      IF (v_previsto_inicio + (v_duracao + v_tolerancia_retorno) * INTERVAL '1 minute') < NEW.horario_real_fim THEN
        NEW.status := 'atrasada';
      ELSE
        NEW.status := 'concluida';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_status_pausa
BEFORE INSERT OR UPDATE ON pausas_executadas
FOR EACH ROW EXECUTE FUNCTION fn_calcular_status_pausa();
