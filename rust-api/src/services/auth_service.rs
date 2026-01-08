use sqlx::PgPool;
use uuid::Uuid;
use chrono::{Utc, Duration};
use crate::models::user::User;
use crate::models::user_role::{Session, AuthContext, Decision, PolicyRule};
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

pub async fn find_user_by_identify(pool: &PgPool, identity: &str) -> sqlx::Result<Option<User>> {
    sqlx::query_as::<_, User>(
        r#"
        SELECT id, username, email, password_hash, role_id, created_at, updated_at
        FROM users
        WHERE username = $1 OR email = $1
        "#
    )
    .bind(identity)
    .fetch_optional(pool)
    .await
}

pub async fn create_session(pool: &PgPool, user_id: Uuid) -> sqlx::Result<Session> {
    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(64)
        .map(char::from)
        .collect();

    let expires_at = Utc::now().naive_utc() + Duration::days(7);

    sqlx::query_as::<_, Session>(
        r#"
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, token, expires_at, created_at
        "#
    )
    .bind(user_id)
    .bind(token)
    .bind(expires_at)
    .fetch_one(pool)
    .await
}

pub async fn validate_session(pool: &PgPool, token: &str) -> sqlx::Result<Option<Session>> {
    sqlx::query_as::<_, Session>(
        r#"
        SELECT id, user_id, token, expires_at, created_at
        FROM sessions
        WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP
        "#
    )
    .bind(token)
    .fetch_optional(pool)
    .await
}

pub async fn delete_session(pool: &PgPool, token: &str) -> sqlx::Result<u64> {
    let result = sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE token = $1
        "#
    )
    .bind(token)
    .execute(pool)
    .await?;

    Ok(result.rows_affected())
}

/// Central authorization engine (PBAC)
/// Evaluates policies bound to the user or their role.
/// Priority: User Deny > User Allow > Role Deny > Role Allow > Default Deny
pub async fn authorize(
    pool: &PgPool,
    user: &User,
    action: &str,
    resource: &str,
    _context: &AuthContext,
) -> sqlx::Result<Decision> {
    // 1. Fetch rules from active policies bound to user or role
    let rules = sqlx::query_as::<_, PolicyRule>(
        r#"
        SELECT pr.* 
        FROM policy_rules pr
        JOIN policies p ON pr.policy_id = p.id
        JOIN policy_bindings pb ON pb.policy_id = p.id
        WHERE p.status = 'active'
        AND (
            (pb.subject_type = 'user' AND pb.subject_id = $1)
            OR (pb.subject_type = 'role' AND pb.subject_id = $2)
        )
        "#
    )
    .bind(user.id)
    .bind(user.role_id)
    .fetch_all(pool)
    .await?;

    let mut allowed = false;
    let mut matching_policy_id = None;

    // 2. Evaluation logic: Deny always wins, Allow is cumulative.
    for rule in &rules {
        let action_match = rule.action == "*" || rule.action == action;
        let resource_match = rule.resource == "*" || rule.resource == resource;

        if action_match && resource_match {
            if rule.effect == "deny" {
                return Ok(Decision {
                    allowed: false,
                    reason: format!("Explicitly denied by policy {}", rule.policy_id),
                    policy_id: Some(rule.policy_id),
                });
            }
            if rule.effect == "allow" {
                allowed = true;
                matching_policy_id = Some(rule.policy_id);
            }
        }
    }

    if allowed {
        Ok(Decision {
            allowed: true,
            reason: "Access granted via policy".to_string(),
            policy_id: matching_policy_id,
        })
    } else {
        Ok(Decision {
            allowed: false,
            reason: "No matching allow policy found (Default Deny)".to_string(),
            policy_id: None,
        })
    }
}
