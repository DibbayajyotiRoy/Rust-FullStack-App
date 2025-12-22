export const API_BASE = "/api";

export const ENDPOINTS = {
  users: {
    list: () => `${API_BASE}/users`,
    create: () => `${API_BASE}/users`,
    byId: (id: string) => `${API_BASE}/users/${id}`,
  },
} as const;
