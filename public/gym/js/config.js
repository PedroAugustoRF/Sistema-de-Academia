/**
 * Runtime configuration for the front-end.
 *
 * The API base URL lives here only. Nothing else in the code should know the
 * backend address. It can be overridden at runtime (Configurações page) or by
 * setting `window.GYMCONTROL_API_URL` before the app boots.
 *
 * Never put database credentials or secrets in this file — the browser talks
 * to the REST API, never to MySQL.
 */

const STORAGE_KEYS = {
  apiBaseUrl: "gymcontrol.apiBaseUrl",
  demoMode: "gymcontrol.demoMode",
  session: "gymcontrol.session",
};

/** Where the login page lives, relative to the app shell. */
export const LOGIN_PAGE = "/gym/login.html";
export const APP_PAGE = "/gym/";

/** Default address of the Sistema-de-Academia Express server. */
export const DEFAULT_API_BASE_URL = "http://localhost:3000";

/** Aborts requests that hang (server down, wrong port, etc.). */
export const REQUEST_TIMEOUT_MS = 8000;

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — fall back to defaults */
  }
};

export function getApiBaseUrl() {
  const stored = read(STORAGE_KEYS.apiBaseUrl);
  const value = stored || window.GYMCONTROL_API_URL || DEFAULT_API_BASE_URL;
  return String(value).replace(/\/+$/, "");
}

export function setApiBaseUrl(url) {
  const clean = String(url ?? "").trim().replace(/\/+$/, "");
  write(STORAGE_KEYS.apiBaseUrl, clean || null);
}

/**
 * Demo mode uses the local sample repository instead of the REST API.
 * It is OFF by default so real and fictional data are never mixed silently.
 */
export function isDemoMode() {
  return read(STORAGE_KEYS.demoMode) === "true";
}

export function setDemoMode(enabled) {
  write(STORAGE_KEYS.demoMode, enabled ? "true" : null);
}

/* ------------------------------- session --------------------------------- */
/** `{ token, user }` — only the JWT and the public user data, never a password. */

export function readSession() {
  try {
    const raw = read(STORAGE_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  write(STORAGE_KEYS.session, session ? JSON.stringify(session) : null);
}

export function clearSession() {
  write(STORAGE_KEYS.session, null);
}

export function getAuthToken() {
  return readSession()?.token ?? "";
}
