-- Payslips Table (PostgreSQL)
CREATE TABLE IF NOT EXISTS payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_salary NUMERIC(12,2) NOT NULL,
    deductions NUMERIC(12,2) DEFAULT 0,
    net_salary NUMERIC(12,2) NOT NULL,
    template_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payslips_user ON payslips(user_id);
CREATE INDEX IF NOT EXISTS idx_payslips_period ON payslips(period_start, period_end);
