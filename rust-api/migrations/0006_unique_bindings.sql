-- Migration: Ensure unique policy bindings
ALTER TABLE policy_bindings
ADD CONSTRAINT unique_policy_subject UNIQUE (policy_id, subject_type, subject_id);
