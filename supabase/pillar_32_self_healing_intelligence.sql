-- Pillar 32: Self-Healing & Code Intelligence – Assumes prior (e.g., system_logs).
-- Precision: Vectors for code embeddings. Scalability: Partitioning on logs. AI: RLHF for fixes. Adjacents: Impacts for ag/tourism code.

CREATE TABLE IF NOT EXISTS code_repos (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    repo_url TEXT NOT NULL UNIQUE,
    last_scan_date DATE
);
CREATE TRIGGER trig_code_repos_updated_at BEFORE UPDATE ON code_repos FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_code_repos_repo_url ON code_repos(repo_url);

CREATE TABLE IF NOT EXISTS code_flaw_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_name TEXT NOT NULL,
    flaw_type TEXT CHECK (flaw_type IN ('line_limit', 'missing_log', 'security', 'other')),
    description TEXT NOT NULL,
    line_number INTEGER,
    code_embedding VECTOR(384)
) PARTITION BY RANGE (created_at);
CREATE TRIGGER trig_code_flaw_logs_updated_at BEFORE UPDATE ON code_flaw_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_code_flaw_logs_file_name ON code_flaw_logs(file_name);
CREATE INDEX idx_code_flaw_logs_embedding ON code_flaw_logs USING hnsw (code_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS self_healing_actions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    flaw_id INTEGER REFERENCES code_flaw_logs(id) ON DELETE CASCADE NOT NULL,
    suggested_fix TEXT NOT NULL,
    rlhf_feedback DECIMAL(5,4) CHECK (rlhf_feedback BETWEEN -1 AND 1),
    applied BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_self_healing_actions_updated_at BEFORE UPDATE ON self_healing_actions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_self_healing_actions_flaw_id ON self_healing_actions(flaw_id);

CREATE TABLE IF NOT EXISTS notification_workers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    worker_type TEXT CHECK (worker_type IN ('twilio', 'email', 'in_app')),
    status TEXT CHECK (status IN ('active', 'failed')),
    last_run TIMESTAMP
);
CREATE TRIGGER trig_notification_workers_updated_at BEFORE UPDATE ON notification_workers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_notification_workers_worker_type ON notification_workers(worker_type);

CREATE TABLE IF NOT EXISTS cron_schedules (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cron_expression TEXT NOT NULL,
    task_name TEXT NOT NULL,
    last_execution TIMESTAMP,
    success BOOLEAN
);
CREATE TRIGGER trig_cron_schedules_updated_at BEFORE UPDATE ON cron_schedules FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_cron_schedules_task_name ON cron_schedules(task_name);

CREATE TABLE IF NOT EXISTS proactive_alerts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT CHECK (alert_type IN ('flaw_detected', 'system_update', 'growth_milestone', 'other')),
    message TEXT NOT NULL,
    sent BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_proactive_alerts_updated_at BEFORE UPDATE ON proactive_alerts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_proactive_alerts_user_id ON proactive_alerts(user_id);

CREATE TABLE IF NOT EXISTS kernel_configs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    config_type TEXT CHECK (config_type IN ('neo_fine_tune', 'rlhf_loop', 'other')),
    parameters JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE
);
CREATE TRIGGER trig_kernel_configs_updated_at BEFORE UPDATE ON kernel_configs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_kernel_configs_config_type ON kernel_configs(config_type);

CREATE TABLE IF NOT EXISTS self_improvement_loops (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    loop_type TEXT CHECK (loop_type IN ('code_fix', 'data_enrich', 'model_retrain', 'other')),
    input_data JSONB NOT NULL,
    output_fix TEXT,
    applied BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_self_improvement_loops_updated_at BEFORE UPDATE ON self_improvement_loops FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_self_improvement_loops_loop_type ON self_improvement_loops(loop_type);

CREATE TABLE IF NOT EXISTS worker_status (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    worker_id INTEGER REFERENCES notification_workers(id) ON DELETE CASCADE NOT NULL,
    load DECIMAL(5,2) CHECK (load BETWEEN 0 AND 100),
    last_heartbeat TIMESTAMP NOT NULL
);
CREATE TRIGGER trig_worker_status_updated_at BEFORE UPDATE ON worker_status FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_worker_status_worker_id ON worker_status(worker_id);

CREATE TABLE IF NOT EXISTS dynamic_column_requests (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    table_name TEXT NOT NULL,
    column_name TEXT NOT NULL,
    column_type TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    adjacency_impact TEXT
);
CREATE TRIGGER trig_dynamic_column_requests_updated_at BEFORE UPDATE ON dynamic_column_requests FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_dynamic_column_requests_table_name ON dynamic_column_requests(table_name);

