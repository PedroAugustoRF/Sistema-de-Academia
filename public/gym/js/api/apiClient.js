/**
 * Single HTTP entry point for the whole front-end.
 * Centralises base URL, headers, JWT, JSON parsing, timeouts and error handling.
 */

import { getApiBaseUrl, getAuthToken, clearSession, REQUEST_TIMEOUT_MS, LOGIN_PAGE } from "../config.js";

export class ApiError extends Error {
  constructor(message, { status = 0, detail = "" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

const OFFLINE_MESSAGE =
  "Não foi possível falar com o servidor. Verifique se a API da academia está em execução.";

/** The backend always answers errors as `{ erro: "mensagem" }`. */
function backendMessage(payload) {
  if (payload && typeof payload === "object" && typeof payload.erro === "string") return payload.erro;
  return "";
}

function friendlyMessage(status, payload) {
  const fromBackend = backendMessage(payload);
  if (fromBackend) return fromBackend;
  if (status === 404) return "Registro não encontrado no servidor.";
  if (status === 400) return "Os dados enviados foram recusados pelo servidor.";
  if (status === 401) return "Sua sessão expirou. Entre novamente.";
  if (status === 403) return "Sem permissão para executar esta operação.";
  if (status === 409) return "Já existe um registro com estes dados.";
  if (status >= 500) return "O servidor encontrou um erro ao processar a solicitação.";
  return "Não foi possível concluir a operação.";
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Sends the user back to the login page when the token is missing/expired. */
function handleUnauthorized() {
  clearSession();
  if (!window.location.pathname.endsWith("login.html")) {
    window.location.replace(`${LOGIN_PAGE}?expired=1`);
  }
}

export async function request(path, { method = "GET", body, auth = true, baseUrl } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? getAuthToken() : "";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${baseUrl ?? getApiBaseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    throw new ApiError(OFFLINE_MESSAGE, { detail: String(error?.message ?? error) });
  } finally {
    clearTimeout(timer);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    // A 401 on an authenticated call means the token is gone/expired.
    // The login endpoint itself also answers 401 for wrong credentials — that
    // one must NOT redirect, so it is called with `auth: false`.
    if (response.status === 401 && auth && token) handleUnauthorized();
    const detail = typeof payload === "string" ? payload : JSON.stringify(payload ?? "");
    throw new ApiError(friendlyMessage(response.status, payload), {
      status: response.status,
      detail,
    });
  }

  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  /** Unauthenticated call (login, health check). */
  public: {
    get: (path, options = {}) => request(path, { ...options, auth: false }),
    post: (path, body) => request(path, { method: "POST", body, auth: false }),
  },
};
