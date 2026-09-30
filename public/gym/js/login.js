/**
 * Login page controller. Talks to the backend only through authService.
 */

import { authService } from "./services.js";
import { qs } from "./ui.js";
import { getApiBaseUrl, isDemoMode, APP_PAGE } from "./config.js";
import { DEMO_PASSWORD, usuarios } from "./data.js";

const form = qs("#loginForm");
const emailInput = qs("#email");
const passwordInput = qs("#password");
const errorBox = qs("#loginError");
const submit = qs("#loginSubmit");

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function setLoading(loading) {
  submit.disabled = loading;
  submit.classList.toggle("is-loading", loading);
  emailInput.disabled = loading;
  passwordInput.disabled = loading;
}

function init() {
  // Already signed in → straight to the app.
  if (authService.isAuthenticated()) {
    window.location.replace(APP_PAGE);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("expired")) showError("Sua sessão expirou. Entre novamente para continuar.");
  if (params.get("logout")) showError("");

  qs("#apiHint").textContent = isDemoMode() ? "modo demonstração" : getApiBaseUrl();

  if (isDemoMode()) {
    const hint = qs("#demoHint");
    hint.hidden = false;
    hint.innerHTML =
      `<i class="fa-solid fa-flask"></i> Modo demonstração ativo. Contas: ` +
      usuarios.map((u) => `<code>${u.email}</code>`).join(", ") +
      ` — senha <code>${DEMO_PASSWORD}</code>.`;
  }

  qs("#togglePassword").addEventListener("click", () => {
    const visible = passwordInput.type === "text";
    passwordInput.type = visible ? "password" : "text";
    qs("#togglePassword i").className = visible ? "fa-regular fa-eye" : "fa-regular fa-eye-slash";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      showError("Informe e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      window.location.replace(APP_PAGE);
    } catch (error) {
      const message =
        error?.status === 401
          ? "E-mail ou senha inválidos."
          : error?.message ?? "Não foi possível entrar. Tente novamente.";
      showError(message);
      passwordInput.value = "";
      passwordInput.focus();
    } finally {
      setLoading(false);
    }
  });
}

init();
