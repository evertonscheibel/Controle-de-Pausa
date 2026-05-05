# Prompt para Antigravity — Bridge PauseControl (PostgreSQL)

Use este workspace como base inicial já criada. Não recrie a estrutura do zero. Continue a partir dos arquivos existentes, respeitando os nomes, responsabilidades e a organização atual das pastas.

## Objetivo

Evoluir este workspace para um sistema web corporativo completo chamado **Bridge PauseControl**, da **BridgeTecnologia**, focado em gestão de pausas térmicas e pausas psicofisiológicas em frigoríficos, principalmente no setor de desossa.

O sistema deve resolver o problema de falta de rastreabilidade, ausência de evidência auditável, inconsistência de registro entre líderes e baixa visibilidade operacional sobre pausas obrigatórias.

## Stack obrigatória

- Frontend em React + Vite
- Backend em Node.js + Express
- Banco de dados **PostgreSQL**
- Acesso ao banco com `pg`
- API REST organizada por domínio
- Estrutura preparada para autenticação JWT e RBAC

## Regra crítica de implementação

O projeto deve permanecer **relacional**. Não converter para MongoDB, Mongoose ou modelagem documental. Toda modelagem deve respeitar o schema relacional definido em `docs/database-schema.md` e a DDL em `docs/schema.sql`.

## Motivo da escolha pelo PostgreSQL

Este produto precisa suportar com consistência:
- usuários e perfis;
- setores;
- equipes;
- colaboradores;
- turnos;
- tipos de pausa;
- locais de pausa;
- regras de pausa;
- programação;
- execução;
- exceções;
- auditoria.

Portanto, o domínio é fortemente relacional e exige integridade referencial, histórico consistente e consultas analíticas seguras.

## Diretrizes de implementação

- Manter a estrutura atual de pastas
- Evoluir os arquivos já existentes antes de criar novos desnecessariamente
- Usar `backend/src/db/` para conexão, queries e seed
- Separar controllers, routes, services e camada de acesso a dados
- Criar validações de entrada com zod
- Preparar migrations futuras, mas usar `docs/schema.sql` como verdade inicial
- Criar interface profissional, premium, responsiva e rápida
- Priorizar controle por equipe/turma/célula
- Separar claramente programação da pausa e execução real
- Toda exceção deve ser registrada com auditoria
- Preparar sistema para relatórios PDF/Excel e integrações futuras

## Perfis de acesso

- Administrador
- RH
- SESMT
- Jurídico
- Supervisor de Produção
- Líder de Equipe
- Consulta/Gerência

## Módulos obrigatórios

1. Dashboard executivo
2. Cadastro de setores
3. Cadastro de equipes
4. Cadastro de líderes
5. Cadastro de colaboradores
6. Cadastro de tipos de pausa
7. Cadastro de regras de pausa
8. Cadastro de locais de pausa
9. Programação diária de pausas
10. Tela operacional para iniciar e encerrar pausas
11. Gestão de exceções
12. Relatórios e auditoria
13. Gestão de usuários e permissões

## Backend esperado

Implementar endpoints coerentes a partir do arquivo `docs/api-spec.md`.

Adicionar gradualmente:
- autenticação e perfil de acesso;
- CRUDs relacionais completos;
- joins para relatórios;
- indicadores agregados para dashboard;
- geração de programação com base em regra + equipe + turno;
- trilha de auditoria.

## Banco de dados esperado

Usar como fonte principal:
- `docs/database-schema.md`
- `docs/schema.sql`

A implementação deve respeitar:
- chaves estrangeiras;
- índices;
- constraints;
- enums como texto controlado por domínio;
- timestamps de auditoria;
- coerência entre schedule, execution e exception.

## Entrega esperada do Antigravity

- frontend funcional com navegação completa;
- backend funcional com PostgreSQL conectado;
- CRUDs principais implementados;
- autenticação básica por perfil;
- seed realista para demonstração comercial;
- dashboard inicial funcional;
- telas principais prontas para demonstração para frigorífico.

## Importante

Este produto precisa parecer real e pronto para ser apresentado a um frigorífico. Não gere uma interface genérica. Gere uma solução vertical para indústria frigorífica, com linguagem visual corporativa, industrial e confiável.
