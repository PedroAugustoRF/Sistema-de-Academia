/**
 * Authentication (backend: POST /usuarios/login, GET /usuarios/me).
 *
 * The backend answers the login with `{ token, usuario }`. The JWT is kept in
 * localStorage and attached to every request by apiClient. The password is
 * never stored anywhere in the browser.
 */

import { api } from "./apiClient.js";
import { isDemoMode, readSession, writeSession, clearSession } from "../config.js";
import { mockAuth } from "./mockRepository.js";
import { toUser } from "./mappers.js";

export const ROLES = {
  admin: "administrador",
  teacher: "professor",
  student: "aluno",
};

export const ROLE_LABEL = {
  administrador: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export const roleLabel = (role) => ROLE_LABEL[role] ?? (role || "—");

export const authService = {
  /**
   * @returns {Promise<{token:string, user:object}>}
   */
  async login(email, password) {
    const payload = { email: String(email ?? "").trim(), senha: String(password ?? "") };
    const result = isDemoMode() ? await mockAuth.login(payload) : await api.public.post("/usuarios/login", payload);
    const session = { token: result?.token ?? "", user: toUser(result?.usuario) };
    if (!session.token || !session.user) throw new Error("Resposta de login inválida do servidor.");
    writeSession(session);
    return session;
  },

  /** Purely client-side: the backend uses stateless JWTs. */
  logout() {
    clearSession();
  },

  /** The user stored at login time (synchronous, no request). */
  getCurrentUser() {
    return readSession()?.user ?? null;
  },

  isAuthenticated() {
    return Boolean(readSession()?.token);
  },

  /** Re-validates the token against the backend and refreshes the stored user. */
  async refreshCurrentUser() {
    const row = isDemoMode() ? await mockAuth.me(readSession()?.token) : await api.get("/usuarios/me");
    const user = toUser(row);
    const session = readSession();
    if (session && user) writeSession({ ...session, user });
    return user;
  },

  hasRole(...roles) {
    const user = authService.getCurrentUser();
    return Boolean(user && roles.includes(user.role));
  },
};
