import { userService, roleLabel } from "../services.js";
import {
  closeModal,
  emptyState,
  errorState,
  escapeHtml,
  formatDate,
  initials,
  loadingState,
  openModal,
  toast,
} from "../ui.js";

/**
 * Users page (administrators only) — backed by /usuarios.
 * One table for every role; the "Cargo" column tells them apart.
 * Only administrators reach this page; the backend enforces the same rule.
 */

const filters = { search: "", role: "" };

const roleBadge = (role) =>
  `<span class="badge-role badge-role--${escapeHtml(role)}">${escapeHtml(roleLabel(role))}</span>`;

function userForm(user = {}, { currentUser }) {
  const editing = Boolean(user.id);
  const editingSelf = editing && Number(user.id) === Number(currentUser.id);
  // New users are always aluno/professor. Administrators keep their role
  // when edited; nobody gets promoted to administrador from this form.
  const roleOptions = user.role === "administrador"
    ? `<option value="administrador" selected>Administrador</option>`
    : ["aluno", "professor"]
        .map((role) => `<option value="${role}" ${user.role === role ? "selected" : ""}>${roleLabel(role)}</option>`)
        .join("");

  return `
    <form id="userForm" class="modal-form" novalidate>
      <div class="field field--full">
        <label for="uName">Nome completo</label>
        <input id="uName" name="name" required autocomplete="off" value="${escapeHtml(user.name ?? "")}" />
      </div>
      <div class="field">
        <label for="uEmail">E-mail</label>
        <input id="uEmail" name="email" type="email" required autocomplete="off" value="${escapeHtml(user.email ?? "")}" />
      </div>
      <div class="field">
        <label for="uRole">Cargo</label>
        <select id="uRole" name="role" ${editingSelf || user.role === "administrador" ? "disabled" : ""}>${roleOptions}</select>
      </div>
      <div class="field field--full">
        <label for="uPassword">${editing ? "Nova senha (deixe em branco para manter)" : "Senha"}</label>
        <input id="uPassword" name="password" type="password" minlength="6" autocomplete="new-password" ${editing ? "" : "required"} placeholder="mínimo 6 caracteres" />
      </div>
      <div class="field">
        <label for="uPhone">Celular</label>
        <input id="uPhone" name="phone" placeholder="+55 00 00000-0000" value="${escapeHtml(user.phone ?? "")}" />
      </div>
      <div class="field">
        <label for="uBirth">Data de nascimento</label>
        <input id="uBirth" name="birthDate" type="date" value="${escapeHtml(user.birthDate ?? "")}" />
      </div>
      <div class="field field--full">
        <label for="uCpf">CPF</label>
        <input id="uCpf" name="cpf" placeholder="000.000.000-00" value="${escapeHtml(user.cpf ?? "")}" />
      </div>
      <div class="modal-actions field--full">
        <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>
        <button class="btn btn--primary" type="submit"><i class="fa-solid fa-check"></i> ${editing ? "Salvar alterações" : "Criar usuário"}</button>
      </div>
    </form>`;
}

export const usersPage = {
  title: "Usuários",
  subtitle: "Administradores, professores e alunos em uma única lista",

  async render(view, { user: currentUser }) {
    view.innerHTML = loadingState("Carregando usuários…");

    let users = [];
    try {
      users = await userService.getAll();
    } catch (error) {
      view.innerHTML = errorState(error?.message ?? "Não foi possível carregar os usuários.", { retryId: "retryUsers" });
      view.querySelector("#retryUsers").addEventListener("click", () => usersPage.render(view, { user: currentUser }));
      return;
    }

    view.innerHTML = `
      <div class="section-toolbar">
        <label class="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="userSearch" placeholder="Pesquisar usuários…" aria-label="Pesquisar usuários" />
        </label>
        <select class="select-inline" id="roleFilter" aria-label="Filtrar por cargo">
          <option value="">Todos os cargos</option>
          <option value="administrador">Administradores</option>
          <option value="professor">Professores</option>
          <option value="aluno">Alunos</option>
        </select>
        <span class="spacer"></span>
        <span class="panel__action" id="userCount"></span>
        <button class="btn btn--primary" id="addUser" type="button"><i class="fa-solid fa-user-plus"></i> Novo usuário</button>
      </div>
      <section class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Cargo</th><th>Ações</th></tr></thead>
            <tbody id="userRows"></tbody>
          </table>
        </div>
      </section>`;

    const tbody = view.querySelector("#userRows");
    const count = view.querySelector("#userCount");

    const visible = () => {
      const term = filters.search.trim().toLowerCase();
      return users.filter(
        (u) =>
          (!filters.role || u.role === filters.role) &&
          (!term || `${u.name} ${u.email}`.toLowerCase().includes(term)),
      );
    };

    const paint = () => {
      const rows = visible();
      count.textContent = `${rows.length} de ${users.length} usuários`;
      tbody.innerHTML = rows.length
        ? rows
            .map((u) => {
              const isSelf = Number(u.id) === Number(currentUser.id);
              return `
        <tr>
          <td>
            <div class="cell-user">
              <span class="avatar">${initials(u.name)}</span>
              <div><p class="cell-user__name">${escapeHtml(u.name)}${isSelf ? ' <span class="list__sub">(você)</span>' : ""}</p></div>
            </div>
          </td>
          <td>${escapeHtml(u.email || "—")}</td>
          <td>${roleBadge(u.role)}</td>
          <td>
            <div class="cell-actions">
              <button class="btn-icon" data-view="${u.id}" type="button" aria-label="Visualizar ${escapeHtml(u.name)}"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-icon" data-edit="${u.id}" type="button" aria-label="Editar ${escapeHtml(u.name)}"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="btn-icon" data-delete="${u.id}" type="button" aria-label="Excluir ${escapeHtml(u.name)}" ${isSelf ? "disabled title='Você não pode excluir a própria conta'" : ""}><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </td>
        </tr>`;
            })
            .join("")
        : `<tr><td colspan="4">${emptyState(
            users.length ? "Nenhum usuário encontrado com este filtro." : "Nenhum usuário cadastrado ainda.",
            "fa-users",
          )}</td></tr>`;
    };

    const refresh = async () => {
      try {
        users = await userService.getAll();
        paint();
      } catch (error) {
        toast(error?.message ?? "Não foi possível atualizar a lista.", "error");
      }
    };

    const openForm = (user) => {
      const body = openModal({
        title: user ? `Editar ${user.name}` : "Novo usuário",
        body: userForm(user ?? {}, { currentUser }),
      });
      body.querySelector("#userForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const payload = Object.fromEntries(new FormData(form).entries());
        payload.role = form.querySelector("#uRole").value; // disabled selects are not in FormData
        if (!payload.password) delete payload.password;
        const submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
          if (user) {
            await userService.update(user.id, payload);
            toast(`Dados de ${payload.name} atualizados.`);
          } else {
            await userService.create(payload);
            toast(`${payload.name} foi criado(a) como ${roleLabel(payload.role).toLowerCase()}.`);
          }
          closeModal();
          refresh();
        } catch (error) {
          submit.disabled = false;
          toast(error?.message ?? "Não foi possível salvar o usuário.", "error");
        }
      });
    };

    const openDetails = (u) =>
      openModal({
        title: u.name,
        body: `
          <div class="cell-user" style="margin-bottom:1rem">
            <span class="avatar avatar--lg">${initials(u.name)}</span>
            <div><p class="cell-user__name">${escapeHtml(u.name)}</p><p class="cell-user__mail">${escapeHtml(u.email)}</p></div>
          </div>
          <dl class="detail-grid">
            <div><dt>Cargo</dt><dd>${roleBadge(u.role)}</dd></div>
            <div><dt>Código</dt><dd>#${String(u.id).padStart(4, "0")}</dd></div>
            <div><dt>Celular</dt><dd>${escapeHtml(u.phone || "—")}</dd></div>
            <div><dt>CPF</dt><dd>${escapeHtml(u.cpf || "—")}</dd></div>
            <div><dt>Nascimento</dt><dd>${formatDate(u.birthDate)}</dd></div>
          </dl>`,
      });

    const confirmDelete = (u) => {
      const body = openModal({
        title: "Excluir usuário",
        body: `
          <p class="list__sub">Tem certeza que deseja excluir <strong>${escapeHtml(u.name)}</strong> (${escapeHtml(roleLabel(u.role))})? Os treinos vinculados também serão removidos. Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>
            <button class="btn btn--danger" type="button" id="confirmDelete"><i class="fa-solid fa-trash-can"></i> Excluir</button>
          </div>`,
      });
      body.querySelector("#confirmDelete").addEventListener("click", async (event) => {
        event.currentTarget.disabled = true;
        try {
          await userService.remove(u.id);
          closeModal();
          toast(`${u.name} foi removido(a).`, "info");
          refresh();
        } catch (error) {
          event.currentTarget.disabled = false;
          toast(error?.message ?? "Não foi possível excluir o usuário.", "error");
        }
      });
    };

    view.querySelector("#userSearch").addEventListener("input", (event) => {
      filters.search = event.target.value;
      paint();
    });
    view.querySelector("#roleFilter").addEventListener("change", (event) => {
      filters.role = event.target.value;
      paint();
    });
    view.querySelector("#addUser").addEventListener("click", () => openForm(null));

    tbody.addEventListener("click", (event) => {
      const find = (attr) => users.find((u) => u.id === Number(attr));
      const viewBtn = event.target.closest("[data-view]");
      const editBtn = event.target.closest("[data-edit]");
      const deleteBtn = event.target.closest("[data-delete]");
      if (viewBtn) openDetails(find(viewBtn.dataset.view));
      if (editBtn) openForm(find(editBtn.dataset.edit));
      if (deleteBtn && !deleteBtn.disabled) confirmDelete(find(deleteBtn.dataset.delete));
    });

    view.querySelector("#userSearch").value = filters.search;
    view.querySelector("#roleFilter").value = filters.role;
    paint();
  },
};
