/**
 * Shared, framework-free UI primitives: escaping, formatting, badges,
 * toasts and the generic modal. Pages compose these instead of duplicating
 * markup helpers.
 */

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]),
  );
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function tag(text) {
  return `<span class="tag">${escapeHtml(text)}</span>`;
}

/* --------------------------------- toast --------------------------------- */

const TOAST_ICON = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  info: "fa-circle-info",
};

export function toast(message, variant = "success") {
  const stack = qs("#toastStack");
  if (!stack) return;
  const node = document.createElement("div");
  node.className = `toast-item toast-item--${variant}`;
  node.setAttribute("role", "status");
  node.innerHTML = `<i class="fa-solid ${TOAST_ICON[variant] ?? TOAST_ICON.info}"></i><p>${escapeHtml(
    message,
  )}</p>`;
  stack.appendChild(node);
  setTimeout(() => {
    node.classList.add("is-leaving");
    node.addEventListener("animationend", () => node.remove(), { once: true });
  }, 3200);
}

/* --------------------------------- modal --------------------------------- */

const modalRoot = () => qs("#modalRoot");

export function openModal({ title, body, size = "md" }) {
  const root = modalRoot();
  qs("#modalTitle").textContent = title;
  qs("#modalBody").innerHTML = body;
  qs(".modal-panel", root).dataset.size = size;
  root.hidden = false;
  requestAnimationFrame(() => root.classList.add("is-open"));
  document.body.classList.add("no-scroll");
  return qs("#modalBody");
}

export function closeModal() {
  const root = modalRoot();
  if (root.hidden) return;
  root.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => {
    root.hidden = true;
    qs("#modalBody").innerHTML = "";
  }, 180);
}

export function initModal() {
  const root = modalRoot();
  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

/* ------------------------------ misc blocks ------------------------------- */

export function emptyState(message, icon = "fa-magnifying-glass") {
  return `<div class="empty-state"><i class="fa-solid ${icon}"></i><p>${escapeHtml(message)}</p></div>`;
}

/* ---------------------------- async page states --------------------------- */

/** Shown while a request is in flight. */
export function loadingState(message = "Carregando…") {
  return `<div class="empty-state"><i class="fa-solid fa-circle-notch fa-spin"></i><p>${escapeHtml(message)}</p></div>`;
}

/** Shown when the API cannot be reached or returns an error. */
export function errorState(message, { retryId = "retryRequest" } = {}) {
  return `
    <div class="empty-state empty-state--error">
      <i class="fa-solid fa-plug-circle-xmark"></i>
      <p>${escapeHtml(message)}</p>
      <button class="btn btn--ghost btn--sm" type="button" id="${retryId}">
        <i class="fa-solid fa-rotate-right"></i> Tentar novamente
      </button>
    </div>`;
}
