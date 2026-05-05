# Bridge PauseControl — Prompt de Inicialização para Antigravity

## INSTRUÇÃO GERAL

Crie um sistema web profissional e completo chamado **Bridge PauseControl**, pertencente à **BridgeTecnologia**. O sistema é uma plataforma de **gestão, controle, monitoramento e evidência auditável de pausas térmicas e psicofisiológicas** em ambientes frigoríficos — especialmente no setor de desossa.

O banco de dados deve ser **PostgreSQL**. O frontend deve ser em **React**. O backend deve ser **Node.js com Express** e **API REST**. Use autenticação com **JWT**. O sistema deve ser completamente responsivo e funcional.

---

## IDENTIDADE VISUAL

- **Nome do sistema:** Bridge PauseControl  
- **Empresa:** BridgeTecnologia  
- **Estilo:** Industrial, tecnológico, corporativo, dark/premium  
- **Paleta principal:**  
  - Fundo: `#0D0F14` (preto grafite profundo)  
  - Sidebar: `#111520` (azul-grafite escuro)  
  - Primário: `#1A6FE8` (azul tecnológico)  
  - Acento: `#0DDBFF` (ciano elétrico)  
  - Surface: `#161B27` (card escuro)  
  - Texto principal: `#E8EDF5`  
  - Texto secundário: `#6B7A99`  
  - Alerta vermelho: `#E84040`  
  - Alerta amarelo: `#F5A623`  
  - Alerta laranja: `#FF6B35`  
  - Sucesso: `#22C55E`  
- **Fontes:** `Exo 2` para títulos (industrial/tech), `DM Sans` para corpo de texto  
- **Efeitos visuais:** glassmorphism sutil nos cards, bordas com glow azul em elementos ativos, ícones Lucide React  

---

## PERFIS DE ACESSO (RBAC)

| Perfil | Nível | Descrição |
|---|---|---|
| Administrador | 1 | Acesso total, configurações, cadastros |
| Supervisor de Produção | 2 | Monitora todas as equipes e exceções |
| RH | 3 | Relatórios, conformidade, histórico |
| SESMT | 4 | Relatórios, conformidade, alertas |
| Jurídico | 5 | Histórico auditável somente leitura |
| Líder de Equipe | 6 | Operação da própria equipe |
| Gerência/Consulta | 7 | Dashboard e relatórios somente leitura |

---

## MÓDULOS E TELAS

### TELA 1 — LOGIN
- Campo de e-mail e senha
- Logo BridgeTecnologia + "PauseControl"
- Botão "Entrar" estilizado
- Fundo: dark com textura sutil e partículas
- Mensagem de erro inline
- Token JWT no localStorage

---

### TELA 2 — DASHBOARD EXECUTIVO

**Cards principais (topo):**
- Pausas Previstas Hoje
- Pausas em Andamento (pulsando em verde)
- Pausas Concluídas
- Pausas Atrasadas (destaque amarelo)
- Pausas Não Realizadas (destaque vermelho)
- Taxa de Conformidade (%) com barra circular

**Seção de alertas críticos:**
- Lista de alertas com severidade (vermelho / amarelo / laranja)
- Badge de contagem no ícone de sino no header

**Gráficos:**
- Gráfico de barras: conformidade por setor (últimos 7 dias)
- Gráfico de linha: trend semanal de exceções
- Gráfico de pizza: distribuição por tipo de pausa

**Tabela "Equipes Agora":**
- Coluna: Equipe | Turno | Status | Pausa | Início | Retorno Previsto | Líder | Ação
- Status com badge colorido: Em Pausa / Em Produção / Retorno Pendente / Atrasado

**Filtros do dashboard:**
- Data, Turno, Setor, Equipe, Tipo de Pausa

---

### TELA 3 — OPERAÇÃO RÁPIDA (CHÃO DE FÁBRICA)

> Esta tela é a mais crítica operacionalmente. Deve ser extremamente rápida, com botões grandes e mínimo de cliques.

**Layout:**
- Header com turno atual, hora em tempo real, nome do líder logado
- Lista de equipes do líder com status visual grande
- Para cada equipe: card grande com botão de ação contextual

**Botões de ação (grandes, coloridos, ícone + texto):**
- 🟢 INICIAR PAUSA (verde)
- 🔴 ENCERRAR PAUSA (vermelho)
- ⚠️ REGISTRAR EXCEÇÃO (amarelo)
- 🔄 REPROGRAMAR (azul)

**Modal "Iniciar Pausa":**
- Equipe (pré-selecionada)
- Tipo de Pausa (select)
- Local de Pausa (select)
- Quantidade prevista de pessoas (número)
- Quantidade real de pessoas (número)
- Observação (textarea - opcional)
- Botão CONFIRMAR grande

**Modal "Encerrar Pausa":**
- Confirmação da equipe
- Horário real de retorno (auto-preenchido, editável)
- Quantidade real retornada
- Observações / divergências
- Botão CONFIRMAR RETORNO

**Indicadores em tempo real:**
- Cronômetro da pausa em andamento
- Alerta visual quando tempo excede o limite

---

### TELA 4 — PROGRAMAÇÃO DIÁRIA DE PAUSAS

**Visualização de agenda operacional:**
- Timeline horizontal por equipe (estilo Gantt simplificado)
- Blocos coloridos por tipo de pausa
- Indicador de status: Prevista / Em andamento / Concluída / Atrasada / Não realizada

**Filtros:**
- Data, Turno, Setor, Equipe

**Ações:**
- Gerar programação automática com base nas regras
- Editar horário previsto de início/fim de pausa individualmente
- Remanejar pausa para outro horário
- Bloquear horário (sem pausa permitida)

**Campos de cada pausa programada:**
- data, id_equipe, id_turno, id_tipo_pausa, horario_previsto_inicio, horario_previsto_fim, id_local_pausa, id_lider, status

---

### TELA 5 — CONTROLE DE PAUSAS EM ANDAMENTO

**Tabela em tempo real:**
- Colunas: Equipe | Setor | Turno | Tipo Pausa | Início Real | Tempo Decorrido | Retorno Previsto | Status | Líder | Ações

**Status com cores:**
- DENTRO DO PRAZO → verde
- ATENÇÃO (últimos 3 min) → amarelo piscando
- ATRASADO → vermelho

**Ação rápida direto na tabela:**
- Botão "Encerrar" por linha
- Botão "Registrar Exceção" por linha

---

### TELA 6 — GESTÃO DE EXCEÇÕES

**Tabela de exceções:**
- Colunas: Data/Hora | Equipe | Setor | Tipo Pausa | Motivo | Descrição | Responsável | Status | Ações

**Status:**
- Aberta | Em Análise | Justificada | Não Conformidade | Encerrada

**Filtros:**
- Período, Setor, Equipe, Motivo, Status

**Modal de tratamento:**
- Visualizar detalhes da exceção
- Alterar status
- Adicionar comentário/justificativa
- Histórico de tratativas

---

### TELA 7 — RELATÓRIOS

**Relatórios disponíveis:**
1. Pausas Previstas x Realizadas
2. Histórico por Equipe
3. Histórico por Colaborador
4. Histórico por Setor
5. Histórico por Líder
6. Exceções por Motivo
7. Conformidade por Período
8. Atrasos de Início
9. Atrasos de Retorno
10. Pausas Não Realizadas
11. Relatório Jurídico/Auditável
12. Relatório Gerencial Executivo

**Para cada relatório:**
- Filtros dinâmicos: período, setor, equipe, turno, líder, tipo de pausa, status
- Prévia em tela com tabela paginada
- Exportar PDF
- Exportar Excel

---

### TELA 8 — AUDITORIA

**Trilha de auditoria completa:**
- Tabela: Data/Hora | Usuário | Ação | Entidade | ID do Registro | Dados Anteriores | Dados Novos | IP

**Filtros:**
- Período, Usuário, Entidade, Tipo de Ação

**Leitura somente — não permite edição.**

---

### TELA 9 — MOTOR DE REGRAS

**Cadastro de regras de pausa:**
- Nome da regra
- Tipo de pausa vinculado
- Duração (minutos)
- Frequência por turno
- Intervalo mínimo entre pausas (minutos)
- Aplicar para: Setor, Atividade, Turno, Equipe específica
- Tolerância de início atrasado (minutos)
- Tolerância de retorno atrasado (minutos)
- Janela permitida de execução (horário início - horário fim)
- Justificativa obrigatória em exceção (sim/não)
- Status: Ativa / Inativa

---

### TELAS 10 A 16 — CADASTROS BASE

Criar CRUD completo com tabela, busca, filtros e formulário modal para cada entidade:

- **Setores** (nome, unidade, responsável, status)
- **Linhas/Células** (nome, setor, capacidade, status)
- **Equipes/Turmas** (nome, setor, linha, turno, líder principal, nº de membros, status)
- **Líderes** (nome, matrícula, setor, equipe, contato, status)
- **Colaboradores** (nome, matrícula, CPF, equipe, função, restrição médica, status)
- **Turnos** (nome, horário início, horário fim, dias da semana, status)
- **Locais de Pausa** (nome, setor, capacidade, temperatura, status)
- **Tipos de Pausa** (nome, categoria: térmica/psicofisiológica/refeição/outro, duração padrão, obrigatória, status)
- **Motivos de Exceção** (descrição, requer justificativa, status)

---

### TELA 17 — USUÁRIOS E PERMISSÕES

- Tabela de usuários com perfil, status, último acesso
- Criar / Editar usuário: nome, e-mail, senha temporária, perfil, unidade, setor vinculado
- Ativar/Inativar
- Reset de senha
- Ver logs de acesso do usuário

---

### TELA 18 — CONFIGURAÇÕES DO SISTEMA

- Nome do sistema
- Logo (upload)
- Unidades / Plantas
- Fuso horário
- Configurações de notificação
- Parâmetros de tolerância global

---

## MENU LATERAL (SIDEBAR)

Estrutura do menu agrupado por categoria com ícones Lucide:

```
🏠  Dashboard

⚡  OPERAÇÃO
    ↳ Operação Rápida (chão de fábrica)
    ↳ Pausas em Andamento
    ↳ Programação Diária

⚙️  GESTÃO
    ↳ Motor de Regras
    ↳ Exceções
    ↳ Controle por Colaborador

📊  ANÁLISE
    ↳ Relatórios
    ↳ Indicadores / BI
    ↳ Auditoria

📁  CADASTROS
    ↳ Setores
    ↳ Equipes
    ↳ Líderes
    ↳ Colaboradores
    ↳ Turnos
    ↳ Locais de Pausa
    ↳ Tipos de Pausa
    ↳ Motivos de Exceção
    ↳ Regras

🔐  ADMINISTRAÇÃO
    ↳ Usuários e Permissões
    ↳ Configurações
```

---

## COMPONENTES GLOBAIS

- **Header:** logo, nome do usuário logado, badge de alertas, relógio em tempo real, botão logout
- **Sidebar colapsável:** ícones + labels, grupo com cor de destaque, item ativo com glow azul
- **Toast notifications:** sucesso (verde), erro (vermelho), alerta (amarelo)
- **Modal padrão:** com backdrop blur, título, conteúdo, botões de ação
- **Tabela padrão:** com busca, filtros, paginação, export, ações por linha
- **Badges de status:** coloridos com dot piscante quando ativo
- **Cards de KPI:** número grande, label, ícone, variação percentual, cor por contexto

---

## DADOS DE EXEMPLO INICIAIS (SEED)

Criar dados realistas para demonstração:
- 1 unidade: "Frizelo Frigoríficos"
- 3 setores: Desossa, Pendura, Embalagem
- 3 turnos: Manhã (05:00–14:00), Tarde (14:00–23:00), Noturno (23:00–05:00)
- 5 equipes por turno no setor Desossa
- 3 líderes cadastrados
- 2 tipos de pausa: Térmica (20 min), Psicofisiológica (10 min)
- Dados de pausas dos últimos 30 dias com status variados
- Exceções com diferentes motivos e status
- Usuários de cada perfil

---

## OBSERVAÇÕES FINAIS

1. O sistema deve funcionar como produto completo e demonstrável.
2. Toda ação de criação, edição ou exclusão deve gerar log na tabela de auditoria.
3. A tela de Operação Rápida é prioridade máxima — deve ser ultra-responsiva e simples.
4. O dashboard deve atualizar automaticamente a cada 30 segundos.
5. Tokens JWT com expiração de 8 horas (duração de 1 turno).
6. O banco de dados é PostgreSQL — usar todas as features adequadas (constraints, índices, foreign keys).
7. Separar claramente na lógica: pausa PROGRAMADA vs pausa EXECUTADA.
