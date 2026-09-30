/**
 * Application shell: authentication guard, role-based navigation,
 * hash routing, sidebar behaviour and top bar wiring.
 * Pages own their own rendering; this file only orchestrates.
 */

import { qs, qsa, initModal, closeModal, escapeHtml, initials } from "./ui.js";
import { authService, roleLabel } from "./services.js";
import { LOGIN_PAGE } from "./config.js";
import { dashboardPage } from "./pages/dashboard.js";
import { machinesPage } from "./pages/machines.js";
import { workoutsPage } from "./pages/workouts.js";
import { myWorkoutsPage } from "./pages/myWorkouts.js";
import { studentsPage } from "./pages/students.js";
import { usersPage } from "./pages/users.js";
import { settingsPage } from "./pages/settings.js";

/* --------------------------- access control ------------------------------ */

const routes = {
  dashboard: dashboardPage,
  users: usersPage,
  machines: machinesPage,
  workouts: workoutsPage,
  students: studentsPage,
  settings: settingsPage,
  "my-workouts": myWorkoutsPage,
};

/** Sidebar per role — order matters; only allowed routes are listed. */
const NAV_BY_ROLE = {
  administrador: [
    { label: "Gestão" },
    { route: "dashboard", icon: "fa-chart-simple", text: "Painel" },
    { route: "users", icon: "fa-user-shield", text: "Usuários" },
    { route: "machines", icon: "fa-gears", text: "Máquinas" },
    { route: "workouts", icon: "fa-list-check", text: "Treinos" },
    { route: "students", icon: "fa-users", text: "Alunos" },
    { label: "Sistema" },
    { route: "settings", icon: "fa-sliders", text: "Configurações" },
  ],
  professor: [
    { label: "Gestão" },
    { route: "dashboard", icon: "fa-chart-simple", text: "Painel" },
    { route: "students", icon: "fa-users", text: "Alunos" },
    { route: "workouts", icon: "fa-list-check", text: "Treinos" },
  ],
  aluno: [
    { label: "Treino" },
    { route: "my-workouts", icon: "fa-dumbbell", text: "Meus Treinos" },
  ],
};

const allowedRoutes = (role) =>
  (NAV_BY_ROLE[role] ?? []).filter((item) => item.route).map((item) => item.route);

const homeRoute = (role) => allowedRoutes(role)[0] ?? "dashboard";

/** Which pages expose the top bar search, and which local input it drives. */
const TOP_SEARCH = {
  machines: { selector: "#machineSearch", placeholder: "Pesquisar máquinas…" },
  students: { selector: "#studentSearch", placeholder: "Pesquisar alunos…" },
  users: { selector: "#userSearch", placeholder: "Pesquisar usuários…" },
};

const state = { route: "dashboard", user: null };

const view = qs("#view");
const topSearchWrap = qs("#topSearchWrap");
const topSearch = qs("#topSearch");

function setSidebar(open) {
  document.body.classList.toggle("sidebar-open", open);
  qs("#sidebarBackdrop").hidden = !open;
}

function syncTopSearch(route) {
  const config = TOP_SEARCH[route];
  topSearchWrap.hidden = !config;
  if (!config) return;
  topSearch.value = "";
  topSearch.placeholder = config.placeholder;
}

function paintSidebar(user) {
  qs("#sidebarNav").innerHTML = (NAV_BY_ROLE[user.role] ?? [])
    .map((item) =>
      item.label
        ? `<p class="sidebar__label">${escapeHtml(item.label)}</p>`
        : `<button class="nav-item" data-route="${item.route}" type="button"><i class="fa-solid ${item.icon}"></i><span>${escapeHtml(item.text)}</span></button>`,
    )
    .join("");
}

function paintUserChip(user) {
  qs("#userAvatar").textContent = initials(user.name);
  qs("#userName").textContent = user.name;
  qs("#userRole").textContent = roleLabel(user.role);
  qs("#menuName").textContent = user.name;
  qs("#menuEmail").textContent = user.email;
}

function logout() {
  authService.logout();
  window.location.replace(`${LOGIN_PAGE}?logout=1`);
}

async function navigate(route, { updateHash = true } = {}) {
  const allowed = allowedRoutes(state.user.role);
  // Direct access to a route outside the user's role falls back to their home.
  const target = allowed.includes(route) ? route : homeRoute(state.user.role);
  const page = routes[target];
  state.route = target;

  if (updateHash || target !== route) window.location.hash = `#/${target}`;

  qsa(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.route === target));
  qs("#pageTitle").textContent = page.title;
  qs("#pageSubtitle").textContent = page.subtitle;
  syncTopSearch(target);
  closeModal();
  setSidebar(false);
  qs("#userMenu").hidden = true;

  view.classList.remove("content");
  void view.offsetWidth; // restart the enter animation
  view.classList.add("content");

  await page.render(view, { navigate, user: state.user });
}

function routeFromHash() {
  return window.location.hash.replace(/^#\/?/, "") || homeRoute(state.user.role);
}

async function openNotifications() {
  const { openModal, emptyState } = await import("./ui.js");
  const { gymService } = await import("./services.js");
  const { weekDayLabel } = await import("./api/mappers.js");

  const items = [];
  let failure = null;
  try {
    const stats = await gymService.stats();
    const withoutPlan = stats.students.filter(
      (student) => !stats.workouts.some((workout) => workout.studentId === student.id),
    );
    if (withoutPlan.length) {
      items.push({
        title: `${withoutPlan.length} aluno(s) sem treino montado`,
        sub: withoutPlan.slice(0, 3).map((student) => student.name).join(", "),
      });
    }
    const emptyWorkouts = stats.workouts.filter((workout) => !workout.exercises.length);
    if (emptyWorkouts.length) {
      items.push({
        title: `${emptyWorkouts.length} treino(s) sem exercícios`,
        sub: emptyWorkouts.map((workout) => weekDayLabel(workout.day)).join(", "),
      });
    }
    if (!stats.totalMachines && state.user.role === "administrador") {
      items.push({ title: "Nenhuma máquina cadastrada", sub: "Cadastre os equipamentos da academia" });
    }
  } catch (error) {
    failure = error?.message ?? "Não foi possível carregar as notificações.";
  }

  openModal({
    title: "Notificações",
    body: failure
      ? `<p class="list__sub">${escapeHtml(failure)}</p>`
      : items.length
        ? `<div class="list">${items
            .map(
              (item) =>
                `<div class="list__row"><div class="list__main"><p class="list__title">${escapeHtml(item.title)}</p><p class="list__sub">${escapeHtml(item.sub)}</p></div></div>`,
            )
            .join("")}</div>`
        : emptyState("Tudo em dia — nenhuma pendência.", "fa-bell"),
  });
}

async function init() {
  // ---- authentication guard -------------------------------------------
  if (!authService.isAuthenticated()) {
    window.location.replace(LOGIN_PAGE);
    return;
  }
  state.user = authService.getCurrentUser();

  // Confirms the token is still valid and picks up role changes made by an admin.
  authService
    .refreshCurrentUser()
    .then((user) => {
      if (user && user.role !== state.user.role) window.location.reload();
    })
    .catch(() => {
      /* a 401 is already handled by the API client (redirect to login) */
    });

  initModal();
  paintSidebar(state.user);
  paintUserChip(state.user);

  // Students are not part of the operational alerts; they only see their plans.
  const notificationsBtn = qs("#notificationsBtn");
  if (state.user.role === "aluno") notificationsBtn.hidden = true;
  else notificationsBtn.addEventListener("click", openNotifications);

  qs("#sidebarNav").addEventListener("click", (event) => {
    const item = event.target.closest(".nav-item");
    if (item) navigate(item.dataset.route);
  });

  qs("#sidebarToggle").addEventListener("click", () => setSidebar(true));
  qs("#sidebarClose").addEventListener("click", () => setSidebar(false));
  qs("#sidebarBackdrop").addEventListener("click", () => setSidebar(false));

  // User menu (top right) with sign out.
  const userChip = qs("#userChip");
  const userMenu = qs("#userMenu");
  userChip.addEventListener("click", (event) => {
    event.stopPropagation();
    userMenu.hidden = !userMenu.hidden;
    userChip.setAttribute("aria-expanded", String(!userMenu.hidden));
  });
  document.addEventListener("click", (event) => {
    if (!userMenu.hidden && !userMenu.contains(event.target)) userMenu.hidden = true;
  });
  qs("#logoutBtn").addEventListener("click", logout);

  // Top bar search proxies into the active page's own search input.
  topSearch.addEventListener("input", () => {
    const config = TOP_SEARCH[state.route];
    if (!config) return;
    const target = qs(config.selector, view);
    if (!target) return;
    target.value = topSearch.value;
    target.dispatchEvent(new Event("input", { bubbles: true }));
  });

  window.addEventListener("hashchange", () => navigate(routeFromHash(), { updateHash: false }));
  navigate(routeFromHash(), { updateHash: false });
}

init();
