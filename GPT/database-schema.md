# Database Schema — Bridge PauseControl (PostgreSQL)

## Diretriz

Modelagem relacional para PostgreSQL, com foco em integridade, rastreabilidade, auditoria e expansão futura.

## Tabelas

### users
- id BIGSERIAL PK
- full_name VARCHAR(150)
- email VARCHAR(150) UNIQUE
- password_hash TEXT
- role VARCHAR(50)
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### sectors
- id BIGSERIAL PK
- name VARCHAR(120)
- code VARCHAR(20) UNIQUE
- unit_name VARCHAR(120)
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### shifts
- id BIGSERIAL PK
- name VARCHAR(80)
- start_time TIME
- end_time TIME
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### teams
- id BIGSERIAL PK
- name VARCHAR(120)
- code VARCHAR(20) UNIQUE
- sector_id BIGINT FK -> sectors.id
- leader_user_id BIGINT FK -> users.id NULL
- shift_id BIGINT FK -> shifts.id
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### employees
- id BIGSERIAL PK
- full_name VARCHAR(150)
- registration VARCHAR(40) UNIQUE
- team_id BIGINT FK -> teams.id
- sector_id BIGINT FK -> sectors.id
- role_name VARCHAR(120)
- status VARCHAR(40)
- restrictions TEXT NULL
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### break_types
- id BIGSERIAL PK
- name VARCHAR(120)
- category VARCHAR(40)
- default_duration_minutes INTEGER
- description TEXT
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### break_locations
- id BIGSERIAL PK
- name VARCHAR(120)
- sector_id BIGINT FK -> sectors.id
- min_temperature_celsius NUMERIC(5,2) NULL
- notes TEXT NULL
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### break_rules
- id BIGSERIAL PK
- name VARCHAR(150)
- sector_id BIGINT FK -> sectors.id
- shift_id BIGINT FK -> shifts.id
- team_id BIGINT FK -> teams.id NULL
- break_type_id BIGINT FK -> break_types.id
- work_interval_minutes INTEGER
- duration_minutes INTEGER
- start_tolerance_minutes INTEGER
- return_tolerance_minutes INTEGER
- operational_window_start TIME NULL
- operational_window_end TIME NULL
- active_from DATE
- active_to DATE NULL
- is_active BOOLEAN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### break_schedules
- id BIGSERIAL PK
- schedule_date DATE
- sector_id BIGINT FK -> sectors.id
- shift_id BIGINT FK -> shifts.id
- team_id BIGINT FK -> teams.id
- break_type_id BIGINT FK -> break_types.id
- planned_start TIMESTAMPTZ
- planned_end TIMESTAMPTZ
- location_id BIGINT FK -> break_locations.id
- leader_user_id BIGINT FK -> users.id NULL
- status VARCHAR(30)
- created_by BIGINT FK -> users.id NULL
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### break_executions
- id BIGSERIAL PK
- schedule_id BIGINT FK -> break_schedules.id UNIQUE
- actual_start TIMESTAMPTZ NULL
- actual_end TIMESTAMPTZ NULL
- expected_count INTEGER
- actual_count INTEGER
- started_by BIGINT FK -> users.id NULL
- ended_by BIGINT FK -> users.id NULL
- status VARCHAR(30)
- notes TEXT NULL
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### break_exceptions
- id BIGSERIAL PK
- schedule_id BIGINT FK -> break_schedules.id
- execution_id BIGINT FK -> break_executions.id NULL
- reason VARCHAR(80)
- details TEXT NULL
- created_by BIGINT FK -> users.id NULL
- status VARCHAR(40)
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### audit_logs
- id BIGSERIAL PK
- entity_name VARCHAR(80)
- entity_id BIGINT
- action VARCHAR(40)
- before_state JSONB NULL
- after_state JSONB NULL
- performed_by BIGINT FK -> users.id NULL
- performed_at TIMESTAMPTZ

## Índices recomendados

- sectors(code)
- teams(code)
- employees(registration)
- break_schedules(schedule_date, sector_id, shift_id)
- break_schedules(status)
- break_exceptions(reason, status)
- audit_logs(entity_name, entity_id)
- audit_logs(performed_at)

## Observações de modelagem

- `break_schedules` representa a programação oficial.
- `break_executions` representa a execução real associada à programação.
- `break_exceptions` registra desvios, falhas ou justificativas operacionais.
- `audit_logs` armazena trilha de alteração de entidades críticas.
