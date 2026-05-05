create table if not exists users (
  id bigserial primary key,
  full_name varchar(150) not null,
  email varchar(150) not null unique,
  password_hash text not null,
  role varchar(50) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sectors (
  id bigserial primary key,
  name varchar(120) not null,
  code varchar(20) not null unique,
  unit_name varchar(120) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shifts (
  id bigserial primary key,
  name varchar(80) not null,
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teams (
  id bigserial primary key,
  name varchar(120) not null,
  code varchar(20) not null unique,
  sector_id bigint not null references sectors(id),
  leader_user_id bigint references users(id),
  shift_id bigint not null references shifts(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists employees (
  id bigserial primary key,
  full_name varchar(150) not null,
  registration varchar(40) not null unique,
  team_id bigint not null references teams(id),
  sector_id bigint not null references sectors(id),
  role_name varchar(120) not null,
  status varchar(40) not null,
  restrictions text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists break_types (
  id bigserial primary key,
  name varchar(120) not null,
  category varchar(40) not null,
  default_duration_minutes integer not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists break_locations (
  id bigserial primary key,
  name varchar(120) not null,
  sector_id bigint not null references sectors(id),
  min_temperature_celsius numeric(5,2),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists break_rules (
  id bigserial primary key,
  name varchar(150) not null,
  sector_id bigint not null references sectors(id),
  shift_id bigint not null references shifts(id),
  team_id bigint references teams(id),
  break_type_id bigint not null references break_types(id),
  work_interval_minutes integer not null,
  duration_minutes integer not null,
  start_tolerance_minutes integer not null default 0,
  return_tolerance_minutes integer not null default 0,
  operational_window_start time,
  operational_window_end time,
  active_from date not null,
  active_to date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists break_schedules (
  id bigserial primary key,
  schedule_date date not null,
  sector_id bigint not null references sectors(id),
  shift_id bigint not null references shifts(id),
  team_id bigint not null references teams(id),
  break_type_id bigint not null references break_types(id),
  planned_start timestamptz not null,
  planned_end timestamptz not null,
  location_id bigint references break_locations(id),
  leader_user_id bigint references users(id),
  status varchar(30) not null,
  created_by bigint references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists break_executions (
  id bigserial primary key,
  schedule_id bigint not null unique references break_schedules(id) on delete cascade,
  actual_start timestamptz,
  actual_end timestamptz,
  expected_count integer not null default 0,
  actual_count integer not null default 0,
  started_by bigint references users(id),
  ended_by bigint references users(id),
  status varchar(30) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists break_exceptions (
  id bigserial primary key,
  schedule_id bigint not null references break_schedules(id) on delete cascade,
  execution_id bigint references break_executions(id) on delete set null,
  reason varchar(80) not null,
  details text,
  created_by bigint references users(id),
  status varchar(40) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  entity_name varchar(80) not null,
  entity_id bigint not null,
  action varchar(40) not null,
  before_state jsonb,
  after_state jsonb,
  performed_by bigint references users(id),
  performed_at timestamptz not null default now()
);

create index if not exists idx_sectors_code on sectors(code);
create index if not exists idx_teams_code on teams(code);
create index if not exists idx_employees_registration on employees(registration);
create index if not exists idx_break_schedules_main on break_schedules(schedule_date, sector_id, shift_id);
create index if not exists idx_break_schedules_status on break_schedules(status);
create index if not exists idx_break_exceptions_reason_status on break_exceptions(reason, status);
create index if not exists idx_audit_logs_entity on audit_logs(entity_name, entity_id);
create index if not exists idx_audit_logs_time on audit_logs(performed_at);
