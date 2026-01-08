use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::NaiveDateTime;

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct Role {
    pub id: Uuid,
    pub name: String,
    pub level: i32,
    pub description: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum PolicyStatus {
    Draft,
    Active,
    Archived,
}

impl std::fmt::Display for PolicyStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Draft => write!(f, "draft"),
            Self::Active => write!(f, "active"),
            Self::Archived => write!(f, "archived"),
        }
    }
}

impl std::str::FromStr for PolicyStatus {
    type Err = ();
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "draft" => Ok(Self::Draft),
            "active" => Ok(Self::Active),
            "archived" => Ok(Self::Archived),
            _ => Err(()),
        }
    }
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct Policy {
    pub id: Uuid,
    pub policy_number: i32,
    pub name: String,
    pub description: Option<String>,
    pub status: String,
    pub is_archived: bool,
    pub current_version: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    #[sqlx(default)]
    pub allow_count: i64,
    #[sqlx(default)]
    pub deny_count: i64,
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct PolicyRule {
    pub id: Uuid,
    pub policy_id: Uuid,
    pub effect: String, // "allow" or "deny"
    pub resource: String,
    pub action: String,
    pub conditions: Option<serde_json::Value>,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct PolicyBinding {
    pub id: Uuid,
    pub policy_id: Uuid,
    pub subject_type: String, // "role" or "user"
    pub subject_id: Uuid,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AuthContext {
    pub department: Option<String>,
    pub location: Option<String>,
    pub time: String,
    pub resource_owner_id: Option<Uuid>,
}

#[derive(Serialize, Debug, Clone)]
pub struct Decision {
    pub allowed: bool,
    pub reason: String,
    pub policy_id: Option<Uuid>,
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token: String,
    pub expires_at: NaiveDateTime,
    pub created_at: NaiveDateTime,
}
