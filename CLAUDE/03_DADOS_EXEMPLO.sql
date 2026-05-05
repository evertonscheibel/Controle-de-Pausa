-- ============================================================
-- BRIDGE PAUSECONTROL — DADOS DE EXEMPLO (SEED)
-- Execute DEPOIS do schema principal
-- ============================================================

-- ============================================================
-- UNIDADE
-- ============================================================
INSERT INTO unidades (id, nome, cnpj, endereco, cidade, estado, responsavel) VALUES
('a1000000-0000-0000-0000-000000000001', 'Frizelo Frigoríficos', '12.345.678/0001-90', 'Rodovia BR-262, Km 512', 'Campo Grande', 'MS', 'Carlos Eduardo Faria');

-- ============================================================
-- SETORES
-- ============================================================
INSERT INTO setores (id, id_unidade, nome, descricao, responsavel, temperatura_media) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Desossa', 'Setor de desossa manual de carcaças bovinas', 'Ricardo Alves', 4.0),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Pendura', 'Setor de pendura e fluxo de carcaças', 'Marcos Souza', 2.0),
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Embalagem', 'Setor de embalagem e expedição', 'Fernanda Lima', 8.0);

-- ============================================================
-- LINHAS / CÉLULAS
-- ============================================================
INSERT INTO linhas_celulas (id, id_setor, nome, capacidade) VALUES
('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Linha A - Dianteiro', 18),
('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Linha B - Traseiro', 18),
('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Linha C - Miúdos', 12),
('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Pendura Principal', 10),
('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'Embalagem Primária', 15);

-- ============================================================
-- TURNOS
-- ============================================================
INSERT INTO turnos (id, id_unidade, nome, horario_inicio, horario_fim, dias_semana) VALUES
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Manhã', '05:00', '14:00', '{segunda,terca,quarta,quinta,sexta,sabado}'),
('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Tarde', '14:00', '23:00', '{segunda,terca,quarta,quinta,sexta,sabado}'),
('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Noturno', '23:00', '05:00', '{segunda,terca,quarta,quinta,sexta}');

-- ============================================================
-- LOCAIS DE PAUSA
-- ============================================================
INSERT INTO locais_pausa (id, id_setor, nome, capacidade, temperatura_media) VALUES
('e1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Sala de Pausa Desossa A', 30, 20.0),
('e1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Sala de Pausa Desossa B', 20, 20.0),
('e1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Sala de Pausa Pendura', 15, 18.0),
('e1000000-0000-0000-0000-000000000004', NULL, 'Refeitório Central', 100, 22.0);

-- ============================================================
-- TIPOS DE PAUSA
-- ============================================================
INSERT INTO tipos_pausa (id, nome, categoria, duracao_minutos, obrigatoria, cor_hex) VALUES
('f1000000-0000-0000-0000-000000000001', 'Pausa Térmica', 'termica', 20, TRUE, '#0DDBFF'),
('f1000000-0000-0000-0000-000000000002', 'Pausa Psicofisiológica', 'psicofisiologica', 10, TRUE, '#22C55E'),
('f1000000-0000-0000-0000-000000000003', 'Almoço/Janta', 'refeicao', 60, TRUE, '#F5A623'),
('f1000000-0000-0000-0000-000000000004', 'Pausa para Ginástica Laboral', 'outro', 15, FALSE, '#1A6FE8');

-- ============================================================
-- MOTIVOS DE EXCEÇÃO
-- ============================================================
INSERT INTO motivos_excecao (id, descricao, requer_justificativa) VALUES
('g1000000-0000-0000-0000-000000000001', 'Linha não pôde parar — demanda produtiva', TRUE),
('g1000000-0000-0000-0000-000000000002', 'Falta de cobertura operacional', TRUE),
('g1000000-0000-0000-0000-000000000003', 'Colaborador ausente', FALSE),
('g1000000-0000-0000-0000-000000000004', 'Colaborador remanejado', FALSE),
('g1000000-0000-0000-0000-000000000005', 'Retorno atrasado — sem justificativa', TRUE),
('g1000000-0000-0000-0000-000000000006', 'Pausa remarcada por supervisão', TRUE),
('g1000000-0000-0000-0000-000000000007', 'Pausa não realizada', TRUE),
('g1000000-0000-0000-0000-000000000008', 'Equipe incompleta', FALSE),
('g1000000-0000-0000-0000-000000000009', 'Falha operacional / incidente', TRUE),
('g1000000-0000-0000-0000-000000000010', 'Outro motivo', TRUE);

-- ============================================================
-- USUÁRIOS (senha padrão: Bridge@2025)
-- Hash bcrypt de "Bridge@2025" — substituir por hash real
-- ============================================================
INSERT INTO usuarios (id, id_unidade, nome, email, senha_hash, perfil, matricula) VALUES
('u1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Administrador Sistema', 'admin@bridgetec.com.br', '$2b$12$dummyhash_admin', 'administrador', 'ADM001'),
('u1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Carlos Supervisor', 'supervisor@frizelo.com.br', '$2b$12$dummyhash_super', 'supervisor_producao', 'SUP001'),
('u1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Ana Paula RH', 'rh@frizelo.com.br', '$2b$12$dummyhash_rh', 'rh', 'RH001'),
('u1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Dr. Marcos SESMT', 'sesmt@frizelo.com.br', '$2b$12$dummyhash_sesmt', 'sesmt', 'SSM001'),
('u1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Dra. Juliana Jurídico', 'juridico@frizelo.com.br', '$2b$12$dummyhash_jur', 'juridico', 'JUR001'),
('u1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'José Líder Desossa A', 'lider.a@frizelo.com.br', '$2b$12$dummyhash_lid1', 'lider_equipe', 'LID001'),
('u1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'Roberto Líder Desossa B', 'lider.b@frizelo.com.br', '$2b$12$dummyhash_lid2', 'lider_equipe', 'LID002'),
('u1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000001', 'Diretoria Geral', 'diretoria@frizelo.com.br', '$2b$12$dummyhash_dir', 'consulta_gerencia', 'DIR001');

-- ============================================================
-- LÍDERES
-- ============================================================
INSERT INTO lideres (id, id_usuario, id_setor, nome, matricula, contato) VALUES
('l1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'José Carlos Pereira', 'LID001', '(67) 99201-1234'),
('l1000000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'Roberto Silva Santos', 'LID002', '(67) 99202-5678'),
('l1000000-0000-0000-0000-000000000003', NULL, 'b1000000-0000-0000-0000-000000000001', 'Antônio Ferreira Lima', 'LID003', '(67) 99203-9012');

-- ============================================================
-- EQUIPES
-- ============================================================
INSERT INTO equipes (id, id_setor, id_linha, id_lider_principal, id_turno, nome, num_membros) VALUES
('eq000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Desossa Manhã - Linha A', 18),
('eq000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Desossa Manhã - Linha B', 18),
('eq000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'l1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Desossa Manhã - Miúdos', 12),
('eq000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 'Desossa Tarde - Linha A', 18),
('eq000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'Desossa Tarde - Linha B', 16),
('eq000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004', NULL, 'd1000000-0000-0000-0000-000000000001', 'Pendura Manhã', 10),
('eq000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005', NULL, 'd1000000-0000-0000-0000-000000000001', 'Embalagem Manhã', 15);

-- ============================================================
-- COLABORADORES (amostra)
-- ============================================================
INSERT INTO colaboradores (id_equipe, nome, matricula, funcao) VALUES
('eq000000-0000-0000-0000-000000000001', 'João Batista Rodrigues', 'COL001', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000001', 'Maria das Graças Silva', 'COL002', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000001', 'Pedro Alves Machado', 'COL003', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000001', 'Luciana Torres Costa', 'COL004', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000001', 'Raimundo Nonato Brito', 'COL005', 'Auxiliar de Desossa'),
('eq000000-0000-0000-0000-000000000002', 'Cleuza Aparecida Fonseca', 'COL006', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000002', 'Marcos Aurélio Pinto', 'COL007', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000002', 'Rosângela Moura Lima', 'COL008', 'Operador de Desossa'),
('eq000000-0000-0000-0000-000000000003', 'Antônio José Carvalho', 'COL009', 'Operador de Miúdos'),
('eq000000-0000-0000-0000-000000000003', 'Edileuza Santos Neves', 'COL010', 'Operador de Miúdos');

-- ============================================================
-- REGRAS DE PAUSA
-- ============================================================
INSERT INTO regras_pausa (id, nome, id_tipo_pausa, duracao_minutos, frequencia_por_turno,
  intervalo_minimo_minutos, tolerancia_inicio_minutos, tolerancia_retorno_minutos,
  janela_inicio, janela_fim, justificativa_obrigatoria) VALUES
('r1000000-0000-0000-0000-000000000001',
  'Pausa Térmica Desossa - 20min a cada 1h40',
  'f1000000-0000-0000-0000-000000000001',
  20, 4, 100, 5, 3, '06:30', '13:30', TRUE),
('r1000000-0000-0000-0000-000000000002',
  'Pausa Psicofisiológica Geral - 10min',
  'f1000000-0000-0000-0000-000000000002',
  10, 2, 120, 5, 3, '07:00', '13:00', TRUE),
('r1000000-0000-0000-0000-000000000003',
  'Almoço Turno Manhã',
  'f1000000-0000-0000-0000-000000000003',
  60, 1, 0, 10, 5, '09:30', '11:00', TRUE);

-- Aplicações das regras
INSERT INTO regras_pausa_aplicacao (id_regra, id_setor) VALUES
('r1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001'),
('r1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001'),
('r1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001');

-- ============================================================
-- PAUSAS PROGRAMADAS (hoje)
-- ============================================================
INSERT INTO pausas_programadas (id, id_regra, id_equipe, id_turno, id_tipo_pausa,
  id_local_pausa, id_lider, data_pausa,
  horario_previsto_inicio, horario_previsto_fim, duracao_prevista_minutos, gerada_automaticamente)
VALUES
-- Equipe Linha A - 4 pausas térmicas
('pp000001-0000-0000-0000-000000000001', 'r1000000-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', CURRENT_DATE, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '20 minutes', 20, TRUE),
('pp000001-0000-0000-0000-000000000002', 'r1000000-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', CURRENT_DATE, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour' + INTERVAL '20 minutes', 20, TRUE),
('pp000001-0000-0000-0000-000000000003', 'r1000000-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000001', CURRENT_DATE, NOW() + INTERVAL '40 minutes', NOW() + INTERVAL '60 minutes', 20, TRUE),
-- Equipe Linha B - pausas
('pp000002-0000-0000-0000-000000000001', 'r1000000-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000002', CURRENT_DATE, NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours 10 minutes', 20, TRUE),
('pp000002-0000-0000-0000-000000000002', 'r1000000-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000002', CURRENT_DATE, NOW() + INTERVAL '10 minutes', NOW() + INTERVAL '30 minutes', 20, TRUE);

-- ============================================================
-- PAUSAS EXECUTADAS (histórico demonstrativo)
-- ============================================================
INSERT INTO pausas_executadas (id_pausa_programada, id_equipe, id_turno, id_tipo_pausa,
  id_local_pausa, id_lider, data_pausa,
  horario_real_inicio, horario_real_fim, duracao_real_minutos,
  qtd_prevista_pessoas, qtd_real_inicio, qtd_real_retorno, status)
VALUES
-- Concluídas
('pp000001-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', CURRENT_DATE, NOW() - INTERVAL '3 hours 2 minutes', NOW() - INTERVAL '2 hours 41 minutes', 21, 18, 18, 18, 'concluida'),
('pp000001-0000-0000-0000-000000000002', 'eq000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', CURRENT_DATE, NOW() - INTERVAL '1 hour 5 minutes', NOW() - INTERVAL '44 minutes', 21, 18, 17, 17, 'concluida'),
-- Em andamento
('pp000002-0000-0000-0000-000000000001', 'eq000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000002', CURRENT_DATE, NOW() - INTERVAL '18 minutes', NULL, NULL, 18, 18, NULL, 'em_andamento'),
-- Atrasada (histórico ontem)
(NULL, 'eq000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000003', CURRENT_DATE - 1, NOW() - INTERVAL '1 day 3 hours 10 minutes', NOW() - INTERVAL '1 day 2 hours 45 minutes', 25, 12, 11, 11, 'atrasada'),
-- Não realizada (histórico)
(NULL, 'eq000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001', NULL, 'l1000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, NULL, NULL, NULL, 18, NULL, NULL, 'nao_realizada');

-- ============================================================
-- EXCEÇÕES
-- ============================================================
INSERT INTO excecoes_pausa (id_equipe, id_motivo, id_lider, descricao, justificativa, status, registrado_por) VALUES
('eq000000-0000-0000-0000-000000000004', 'g1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', 'Pausa não realizada devido ao pico de produção no início do turno da tarde.', 'Supervisão determinou continuidade por 30 minutos extras', 'justificada', 'u1000000-0000-0000-0000-000000000006'),
('eq000000-0000-0000-0000-000000000003', 'g1000000-0000-0000-0000-000000000005', 'l1000000-0000-0000-0000-000000000003', 'Retorno da equipe com 5 minutos de atraso sem justificativa formal.', NULL, 'aberta', 'u1000000-0000-0000-0000-000000000002'),
('eq000000-0000-0000-0000-000000000005', 'g1000000-0000-0000-0000-000000000008', 'l1000000-0000-0000-0000-000000000002', 'Equipe com apenas 12 dos 16 membros na pausa — 4 colaboradores remanejados para cobertura.', 'Remanejamento autorizado pelo supervisor', 'encerrada', 'u1000000-0000-0000-0000-000000000007');

-- ============================================================
-- ALERTAS DE EXEMPLO
-- ============================================================
INSERT INTO alertas (tipo, severidade, titulo, mensagem, id_equipe) VALUES
('retorno_pendente', 'critico', 'Retorno Pendente — Linha B', 'A equipe Desossa Manhã - Linha B está há 18 minutos em pausa. Retorno previsto já expirou.', 'eq000000-0000-0000-0000-000000000002'),
('excecao_aberta', 'alto', 'Exceção Não Tratada', 'A exceção de retorno atrasado da equipe Desossa Manhã - Miúdos está aberta há mais de 24h.', 'eq000000-0000-0000-0000-000000000003'),
('pausa_proxima', 'medio', 'Pausa Térmica em 10 minutos — Linha A', 'A próxima pausa térmica da equipe Desossa Manhã - Linha A está prevista em 10 minutos.', 'eq000000-0000-0000-0000-000000000001');

-- ============================================================
-- CONFIGURAÇÕES DO SISTEMA
-- ============================================================
INSERT INTO configuracoes_sistema (chave, valor, descricao) VALUES
('nome_sistema', 'Bridge PauseControl', 'Nome do sistema'),
('versao', '1.0.0', 'Versão atual do sistema'),
('empresa', 'BridgeTecnologia', 'Empresa desenvolvedora'),
('fuso_horario', 'America/Campo_Grande', 'Fuso horário padrão'),
('tolerancia_global_inicio', '5', 'Tolerância padrão de início em minutos'),
('tolerancia_global_retorno', '3', 'Tolerância padrão de retorno em minutos'),
('dashboard_refresh_segundos', '30', 'Intervalo de atualização automática do dashboard'),
('jwt_expiracao_horas', '8', 'Expiração do token JWT em horas'),
('exportacao_pdf_logo', 'true', 'Incluir logo nos relatórios PDF'),
('notificacoes_ativas', 'true', 'Ativar sistema de notificações');
