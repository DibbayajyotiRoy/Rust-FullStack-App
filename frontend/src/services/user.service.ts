import { ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/http";
import type { User, UserPayload } from "@/types/user";

export const userService = {
  list(): Promise<User[]> {
    return http<User[]>(ENDPOINTS.users.list());
  },

  create(payload: UserPayload): Promise<User> {
    return http<User>(ENDPOINTS.users.create(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: UserPayload): Promise<User> {
    return http<User>(ENDPOINTS.users.byId(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return http<void>(ENDPOINTS.users.byId(id), {
      method: "DELETE",
    });
  },
};
