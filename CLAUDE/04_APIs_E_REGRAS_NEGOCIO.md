# Bridge PauseControl — APIs REST & Regras de Negócio

## ESTRUTURA BASE DA API

```
Base URL: /api/v1
Auth: Bearer JWT no header Authorization
Content-Type: application/json
```

---

## AUTENTICAÇÃO

### POST /api/v1/auth/login
Body: `{ email, senha }`  
Response: `{ token, refreshToken, usuario: { id, nome, perfil, unidade } }`  
- Gerar JWT com expiração de 8h (duração de 1 turno)  
- Registrar log em `logs_acesso_usuario`  
- Atualizar `ultimo_acesso` do usuário

### POST /api/v1/auth/refresh
Body: `{ refreshToken }`  
Response: `{ token }`

### POST /api/v1/auth/logout
- Invalidar refresh token  
- Registrar log de logout

---

## MÓDULO: DASHBOARD

### GET /api/v1/dashboard/resumo
Query: `?data=YYYY-MM-DD&turno=id&setor=id`  
Response:
```json
{
  "previstas": 24,
  "em_andamento": 3,
  "concluidas": 18,
  "atrasadas": 2,
  "nao_realizadas": 1,
  "taxa_conformidade": 85.7,
  "total_excecoes": 4
}
```

### GET /api/v1/dashboard/equipes-agora
Retorna view `vw_equipes_em_pausa_agora` + equipes em produção  
Response: Array de equipes com status em tempo real

### GET /api/v1/dashboard/alertas-criticos
Query: `?limit=10`  
Response: Lista de alertas não lidos por severidade

### GET /api/v1/dashboard/grafico-conformidade-setor
Query: `?dias=7`  
Response: Array `[{ setor, data, taxa }]` para gráfico de barras

### GET /api/v1/dashboard/grafico-tendencia-excecoes
Query: `?semanas=4`  
Response: Array `[{ semana, total }]` para gráfico de linha

### GET /api/v1/dashboard/grafico-distribuicao-tipos
Query: `?data=YYYY-MM-DD`  
Response: Array `[{ tipo_pausa, quantidade, percentual }]` para pizza

---

## MÓDULO: OPERAÇÃO RÁPIDA

### GET /api/v1/operacao/minhas-equipes
> Retorna equipes do líder logado com status atual  
Response: Array de equipes com status e próxima pausa

### POST /api/v1/operacao/iniciar-pausa
Body:
```json
{
  "id_pausa_programada": "uuid (opcional)",
  "id_equipe": "uuid",
  "id_tipo_pausa": "uuid",
  "id_local_pausa": "uuid",
  "qtd_prevista_pessoas": 18,
  "qtd_real_inicio": 17,
  "observacao": "texto opcional"
}
```
- Criar registro em `pausas_executadas` com status `em_andamento`  
- Gerar alerta se pausa iniciada com atraso > tolerância  
- Log de auditoria

### POST /api/v1/operacao/encerrar-pausa/:id_pausa_executada
Body:
```json
{
  "qtd_real_retorno": 17,
  "observacao_retorno": "texto",
  "observacao_divergencia": "texto (se houver)"
}
```
- Atualizar `horario_real_fim` e `status`  
- Calcular `duracao_real_minutos`  
- Verificar se houve atraso de retorno  
- Gerar exceção automática se atraso > tolerância da regra  
- Log de auditoria

### POST /api/v1/operacao/registrar-excecao
Body:
```json
{
  "id_equipe": "uuid",
  "id_pausa_programada": "uuid (opcional)",
  "id_motivo": "uuid",
  "descricao": "texto",
  "justificativa": "texto"
}
```

### PUT /api/v1/operacao/reprogramar-pausa/:id_pausa_programada
Body: `{ horario_previsto_inicio, horario_previsto_fim, motivo }`

---

## MÓDULO: PROGRAMAÇÃO

### GET /api/v1/programacao/agenda
Query: `?data=YYYY-MM-DD&turno=id&setor=id&equipe=id`  
Response: Array de pausas programadas para a agenda/Gantt

### POST /api/v1/programacao/gerar-automatica
Body: `{ data, id_turno, id_setor }`  
- Buscar regras ativas para o setor/turno  
- Distribuir pausas entre equipes evitando sobreposição  
- Retornar lista gerada (sem salvar) para confirmação

### POST /api/v1/programacao/confirmar-automatica
Body: `{ pausas: [...] }` (resultado do endpoint anterior)  
- Salvar em lote com `gerada_automaticamente: true`

### POST /api/v1/programacao/pausa
Body: campos de `pausas_programadas`  
- Criar pausa manual

### PUT /api/v1/programacao/pausa/:id
Body: campos atualizáveis

### DELETE /api/v1/programacao/pausa/:id
- Soft delete (status cancelada)

---

## MÓDULO: EXCEÇÕES

### GET /api/v1/excecoes
Query: `?status=aberta&setor=id&equipe=id&data_inicio=&data_fim=&motivo=id&page=1&limit=20`

### GET /api/v1/excecoes/:id
Detalhe completo com histórico de tratativas

### PUT /api/v1/excecoes/:id/tratar
Body: `{ status_novo, comentario }`  
- Criar registro em `tratativas_excecao`  
- Log de auditoria

---

## MÓDULO: ALERTAS

### GET /api/v1/alertas
Query: `?lido=false&severidade=critico&limit=20`

### PUT /api/v1/alertas/:id/marcar-lido
### PUT /api/v1/alertas/marcar-todos-lidos

---

## MÓDULO: RELATÓRIOS

### GET /api/v1/relatorios/previstas-vs-realizadas
Query: `?data_inicio&data_fim&setor&equipe&turno&tipo_pausa`  
Response: Dados para tabela + totais

### GET /api/v1/relatorios/historico-equipe
Query: `?id_equipe&data_inicio&data_fim&status`

### GET /api/v1/relatorios/historico-colaborador
Query: `?id_colaborador&data_inicio&data_fim`

### GET /api/v1/relatorios/historico-setor
Query: `?id_setor&data_inicio&data_fim`

### GET /api/v1/relatorios/historico-lider
Query: `?id_lider&data_inicio&data_fim`

### GET /api/v1/relatorios/excecoes-por-motivo
Query: `?data_inicio&data_fim&setor&equipe`

### GET /api/v1/relatorios/conformidade-periodo
Query: `?data_inicio&data_fim&setor&turno&agrupar_por=dia|semana|mes`

### GET /api/v1/relatorios/atrasos-inicio
### GET /api/v1/relatorios/atrasos-retorno
### GET /api/v1/relatorios/nao-realizadas

### GET /api/v1/relatorios/juridico-auditavel
Query: `?data_inicio&data_fim&setor&equipe&lider`  
> Relatório completo para jurídico com trilha de auditoria

### GET /api/v1/relatorios/gerencial-executivo
> Resumo executivo com todos os KPIs do período

### POST /api/v1/relatorios/exportar-pdf
Body: `{ tipo_relatorio, filtros, dados }`  
Response: Buffer PDF

### POST /api/v1/relatorios/exportar-excel
Body: `{ tipo_relatorio, filtros, dados }`  
Response: Buffer XLSX

---

## MÓDULO: AUDITORIA

### GET /api/v1/auditoria/logs
Query: `?usuario=id&entidade=&acao=&data_inicio&data_fim&page=1&limit=50`  
> Somente leitura. Nenhuma ação de escrita permitida.

---

## MÓDULO: INDICADORES (BI)

### GET /api/v1/indicadores/kpis
Query: `?data_inicio&data_fim&setor&turno`  
Response:
```json
{
  "pct_conformidade": 87.3,
  "pct_no_horario": 79.1,
  "pct_atrasadas": 11.2,
  "pct_nao_realizadas": 9.7,
  "tempo_medio_real_minutos": 21.4,
  "tempo_medio_atraso_inicio": 3.2,
  "tempo_medio_atraso_retorno": 4.1,
  "total_excecoes": 28
}
```

### GET /api/v1/indicadores/ranking-conformidade-equipe
### GET /api/v1/indicadores/ranking-excecoes-lider
### GET /api/v1/indicadores/tendencia-semanal
### GET /api/v1/indicadores/tendencia-mensal

---

## CRUDs COMPLETOS (padrão REST)

Para cada entidade abaixo, implementar os 5 endpoints:
- `GET /api/v1/{entidade}` — listar com filtros e paginação
- `GET /api/v1/{entidade}/:id` — detalhe
- `POST /api/v1/{entidade}` — criar
- `PUT /api/v1/{entidade}/:id` — editar
- `PATCH /api/v1/{entidade}/:id/status` — ativar/inativar

**Entidades:**
- `/unidades`
- `/setores`
- `/linhas-celulas`
- `/turnos`
- `/locais-pausa`
- `/tipos-pausa`
- `/motivos-excecao`
- `/regras-pausa`
- `/equipes`
- `/lideres`
- `/colaboradores`
- `/usuarios`

---

## REGRAS DE NEGÓCIO CRÍTICAS

### RN-01: Separação Programação x Execução
- `pausas_programadas` = o que foi planejado
- `pausas_executadas` = o que aconteceu de fato
- Nunca misturar os dois. Um pode existir sem o outro.

### RN-02: Geração Automática de Pausa
- Ao gerar programação automática, verificar sobreposição entre equipes do mesmo local
- Distribuir pausas com intervalo mínimo de 5 minutos entre equipes no mesmo local
- Respeitar janela de execução da regra (janela_inicio / janela_fim)
- Não gerar pausas conflitantes (2 equipes no mesmo local ao mesmo tempo)

### RN-03: Cálculo de Atraso
- Atraso de início = `horario_real_inicio - horario_previsto_inicio` (em minutos)
- Atraso de retorno = `horario_real_fim - horario_previsto_fim` (em minutos)
- Status `atrasada` = quando atraso de retorno > tolerância da regra

### RN-04: Geração Automática de Exceção
- Se pausa não for iniciada até 15 minutos após horário previsto → gerar exceção automaticamente com motivo "Pausa não realizada"
- Se retorno atrasar mais de tolerância → gerar exceção automaticamente com motivo "Retorno atrasado"
- Exceções automáticas devem ser tratadas pelo supervisor/líder

### RN-05: Controle de Permissões por Ação
| Ação | Perfis Permitidos |
|---|---|
| Iniciar/Encerrar pausa | lider_equipe, supervisor_producao, administrador |
| Registrar exceção | lider_equipe, supervisor_producao, administrador |
| Aprovar exceção | supervisor_producao, rh, sesmt, administrador |
| Gerar programação | supervisor_producao, administrador |
| Ver relatórios | todos exceto lider_equipe (que vê apenas sua equipe) |
| Ver auditoria | juridico, administrador |
| CRUD cadastros | administrador |
| Gestão de usuários | administrador |

### RN-06: Log de Auditoria Obrigatório
Registrar em `logs_auditoria` toda ação de:
- Iniciar pausa
- Encerrar pausa
- Registrar exceção
- Tratar exceção (mudança de status)
- Gerar programação
- Criar/editar/inativar qualquer cadastro
- Login / logout
- Exportar relatório

### RN-07: Taxa de Conformidade
```
taxa_conformidade = (pausas_concluidas / total_pausas_previstas) * 100
```
- Pausas não realizadas = NÃO conformidade
- Pausas concluídas com atraso = conformidade com ressalva (contar como conformidade parcial)

### RN-08: Dashboard em Tempo Real
- Endpoint de resumo deve sempre buscar dados frescos (sem cache)
- Equipes com pausa `em_andamento` há mais de (duração_prevista + tolerância) minutos → status ATRASADO
- Cronômetro no frontend atualiza a cada segundo localmente
- Dashboard refaz chamada API a cada 30 segundos

### RN-09: Validações Obrigatórias
- Não permitir encerrar pausa que não foi iniciada
- Não permitir iniciar nova pausa se equipe já tem pausa `em_andamento`
- Não permitir programar pausa fora da janela da regra
- Quantidade real não pode ser maior que número de membros da equipe + 20%

### RN-10: Exportação de Relatórios
- PDF: usar cabeçalho com logo BridgeTecnologia, nome do relatório, período, data/hora de geração, usuário que gerou
- Excel: aba de dados + aba de resumo com totalizadores
- Registrar em auditoria: usuário, relatório, filtros, data/hora

---

## VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pausecontrol
JWT_SECRET=chave-secreta-forte-minimo-32-chars
JWT_EXPIRACAO=8h
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```
