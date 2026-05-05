# Bridge PauseControl Workspace

Workspace inicial do sistema **Bridge PauseControl**, da **BridgeTecnologia**, para gestão de pausas térmicas e psicofisiológicas em ambiente frigorífico.

## Stack definida

- `frontend/` → React + Vite
- `backend/` → Node.js + Express + PostgreSQL
- `docs/` → documentação funcional, técnica, SQL e prompt para Antigravity
- `shared/` → contratos compartilhados e enums de domínio

## Banco de dados

Este workspace foi padronizado para **PostgreSQL** por oferecer:
- integridade relacional;
- melhor modelagem para equipes, setores, turnos, regras, programações, execuções e exceções;
- maior aderência a produto corporativo e trilha de auditoria.

A conexão do backend foi preparada com **pg** e organização por camada de acesso ao banco.

## Estrutura

- `docs/product-spec.md` → visão funcional do produto
- `docs/database-schema.md` → modelo relacional detalhado
- `docs/schema.sql` → DDL inicial PostgreSQL
- `docs/api-spec.md` → especificação de endpoints
- `docs/ANTIGRAVITY_PROMPT.md` → prompt para continuação no Antigravity
- `backend/src/db/` → conexão, queries e seed
- `backend/.env.example` → exemplo de configuração

## Como iniciar

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variáveis esperadas no backend

- `PORT`
- `DATABASE_URL`
- `CORS_ORIGIN`
- `JWT_SECRET`

Exemplo:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bridge_pausecontrol
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-me
```

## Próximos passos sugeridos

1. Criar o banco PostgreSQL `bridge_pausecontrol`
2. Executar o script `docs/schema.sql`
3. Ajustar `.env`
4. Subir backend e frontend
5. Colar o prompt `docs/ANTIGRAVITY_PROMPT.md` no Antigravity para continuar a evolução

## Diretriz de produto

Este sistema não deve ser tratado como um simples apontamento de pausas. Ele precisa evoluir como solução vertical para frigoríficos, com foco em:
- conformidade NR-36;
- evidência auditável;
- previsibilidade operacional;
- rastreabilidade jurídica e gerencial.
