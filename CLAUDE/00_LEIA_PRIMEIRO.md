# 🚀 Bridge PauseControl — Guia de Uso no Antigravity

## ORDEM DE EXECUÇÃO

Cole e execute os arquivos no Antigravity **nesta ordem:**

---

### PASSO 1 — Schema do banco
**Arquivo:** `02_SCHEMA_POSTGRESQL.sql`

Cole no editor de banco do Antigravity e execute.
Isso cria todas as tabelas, índices, triggers, funções e views.

---

### PASSO 2 — Dados de exemplo
**Arquivo:** `03_DADOS_EXEMPLO.sql`

Execute após o schema. Popula o banco com dados realistas para demonstração.

> ⚠️ Atenção: as senhas no seed são placeholders. O Antigravity ou o backend deve gerar hashes bcrypt reais de "Bridge@2025" para os usuários de exemplo.

---

### PASSO 3 — Prompt principal do sistema
**Arquivo:** `01_PROMPT_PRINCIPAL.md`

Cole no workspace do Antigravity como prompt de geração do sistema completo.
Este arquivo descreve:
- Identidade visual
- Todos os módulos e telas
- Estrutura do menu
- Componentes globais
- Dados de exemplo esperados

---

### PASSO 4 — APIs e Regras de Negócio
**Arquivo:** `04_APIs_E_REGRAS_NEGOCIO.md`

Cole no Antigravity junto com ou logo após o prompt principal.
Este arquivo detalha:
- Todos os endpoints REST necessários
- Regras de negócio críticas (RN-01 a RN-10)
- Variáveis de ambiente necessárias

---

## CREDENCIAIS DE ACESSO PARA DEMO

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@bridgetec.com.br | Bridge@2025 |
| Supervisor | supervisor@frizelo.com.br | Bridge@2025 |
| RH | rh@frizelo.com.br | Bridge@2025 |
| SESMT | sesmt@frizelo.com.br | Bridge@2025 |
| Jurídico | juridico@frizelo.com.br | Bridge@2025 |
| Líder A | lider.a@frizelo.com.br | Bridge@2025 |
| Líder B | lider.b@frizelo.com.br | Bridge@2025 |
| Diretoria | diretoria@frizelo.com.br | Bridge@2025 |

---

## STACK TÉCNICA ESPERADA

| Camada | Tecnologia |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| Banco | PostgreSQL |
| Auth | JWT (8h de expiração) |
| Criptografia | bcrypt (salt 12) |
| API | REST JSON |

---

## OBSERVAÇÃO SOBRE A TELA OPERACIONAL

A tela **"Operação Rápida"** é a mais crítica do sistema.
Informe ao Antigravity que ela deve:
- Ter botões grandes (mínimo 56px de altura)
- Funcionar bem em tablets (touch-first)
- Ter o mínimo de cliques possível
- Mostrar cronômetro em tempo real
- Ter feedback visual imediato a cada ação

---

## ENTIDADE PRINCIPAL DO SISTEMA

O conceito central do sistema gira em torno de duas entidades separadas:

```
pausas_programadas  →  O QUE FOI PLANEJADO
pausas_executadas   →  O QUE ACONTECEU DE FATO
```

Toda a lógica de conformidade, relatórios e auditoria compara essas duas tabelas.
