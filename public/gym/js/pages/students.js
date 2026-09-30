import { studentService, workoutService } from "../services.js";
import { weekDayLabel } from "../api/mappers.js";
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
 * Students page — users with cargo "aluno", backed by /usuarios.
 * Administrators manage students; professors only view them (the backend
 * enforces the same hierarchy).
 */

const filters = { search: "" };

function studentForm(student = {}) {
  return `
    <form id="studentForm" class="modal-form" novalidate>
      <div class="field field--full">
        <label for="sName">Nome completo</label>
        <input id="sName" name="name" required autocomplete="off" value="${escapeHtml(student.name ?? "")}" />
      </div>
      <div class="field">
        <label for="sEmail">E-mail (acesso)</label>
        <input id="sEmail" name="email" type="email" required autocomplete="off" value="${escapeHtml(student.email ?? "")}" />
      </div>
      <div class="field">
        <label for="sPassword">${student.id ? "Nova senha (opcional)" : "Senha"}</label>
        <input id="sPassword" name="password" type="password" minlength="6" autocomplete="new-password" ${student.id ? "" : "required"} placeholder="mínimo 6 caracteres" />
      </div>
      <div class="field">
        <label for="sCpf">CPF</label>
        <input id="sCpf" name="cpf" placeholder="000.000.000-00" value="${escapeHtml(student.cpf ?? "")}" />
      </div>
      <div class="field">
        <label for="sPhone">Celular</label>
        <input id="sPhone" name="phone" placeholder="+55 00 00000-0000" value="${escapeHtml(student.phone ?? "")}" />
      </div>
      <div class="field field--full">
        <label for="sBirth">Data de nascimento</label>
        <input id="sBirth" name="birthDate" type="date" value="${escapeHtml(student.birthDate ?? "")}" />
      </div>
      <div class="modal-actions field--full">
        <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>
        <button class="btn btn--primary" type="submit"><i class="fa-solid fa-check"></i> ${student.id ? "Salvar alterações" : "Adicionar aluno"}</button>
      </div>
    </form>`;
}

export const studentsPage = {
  title: "Alunos",
  subtitle: "Cadastro de alunos e treinos vinculados",

  async render(view, { user }) {
    const canManage = user.role === "administrador";
    view.innerHTML = loadingState("Carregando alunos…");

    let students = [];
    let workouts = [];
    try {
      [students, workouts] = await Promise.all([studentService.getAll(), workoutService.getAll()]);
    } catch (error) {
      view.innerHTML = errorState(
        error?.message ?? "Não foi possível carregar os alunos.",
        { retryId: "retryStudents" },
      );
      view.querySelector("#retryStudents").addEventListener("click", () => studentsPage.render(view, { user }));
      return;
    }

    const plansOf = (studentId) => workouts.filter((workout) => workout.studentId === studentId);

    view.innerHTML = `
      <div class="section-toolbar">
        <label class="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="studentSearch" placeholder="Pesquisar alunos…" aria-label="Pesquisar alunos" />
        </label>
        <span class="spacer"></span>
        <span class="panel__action" id="studentCount"></span>
        ${canManage ? '<button class="btn btn--primary" id="addStudent" type="button"><i class="fa-solid fa-user-plus"></i> Adicionar aluno</button>' : ""}
      </div>
      <section class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>Aluno</th><th>E-mail</th><th>Celular</th><th>Nascimento</th><th>Treinos</th><th></th></tr>
            </thead>
            <tbody id="studentRows"></tbody>
          </table>
        </div>
      </section>`;

    const tbody = view.querySelector("#studentRows");
    const count = view.querySelector("#studentCount");

    const visible = () => {
      const term = filters.search.trim().toLowerCase();
      if (!term) return students;
      return students.filter((student) =>
        `${student.name} ${student.email} ${student.cpf} ${student.phone}`.toLowerCase().includes(term),
      );
    };

    const paint = () => {
      const rows = visible();
      count.textContent = `${rows.length} de ${students.length} alunos`;
      tbody.innerHTML = rows.length
        ? rows
            .map(
              (student) => `
        <tr>
          <td>
            <div class="cell-user">
              <span class="avatar">${initials(student.name)}</span>
              <div><p class="cell-user__name">${escapeHtml(student.name)}</p></div>
            </div>
          </td>
          <td>${escapeHtml(student.email || "—")}</td>
          <td>${escapeHtml(student.phone || "—")}</td>
          <td>${formatDate(student.birthDate)}</td>
          <td>${plansOf(student.id).length}</td>
          <td>
            <div class="cell-actions">
              <button class="btn-icon" data-view="${student.id}" type="button" aria-label="Ver ${escapeHtml(student.name)}"><i class="fa-regular fa-eye"></i></button>
              ${canManage ? `<button class="btn-icon" data-edit="${student.id}" type="button" aria-label="Editar ${escapeHtml(student.name)}"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="btn-icon" data-delete="${student.id}" type="button" aria-label="Excluir ${escapeHtml(student.name)}"><i class="fa-regular fa-trash-can"></i></button>` : ""}
            </div>
          </td>
        </tr>`,
            )
            .join("")
        : `<tr><td colspan="6">${emptyState(
            students.length ? "Nenhum aluno encontrado com esta pesquisa." : "Nenhum aluno cadastrado ainda.",
            "fa-users",
          )}</td></tr>`;
    };

    const refresh = async () => {
      try {
        [students, workouts] = await Promise.all([studentService.getAll(), workoutService.getAll()]);
        paint();
      } catch (error) {
        toast(error?.message ?? "Não foi possível atualizar a lista.", "error");
      }
    };

    const openForm = (student) => {
      const body = openModal({
        title: student ? `Editar ${student.name}` : "Adicionar aluno",
        body: studentForm(student ?? {}),
      });
      body.querySelector("#studentForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const payload = Object.fromEntries(new FormData(form).entries());
        if (!payload.password) delete payload.password;
        const submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
          if (student) {
            await studentService.update(student.id, payload);
            toast(`Dados de ${payload.name} atualizados.`);
          } else {
            await studentService.create(payload);
            toast(`${payload.name} foi adicionado(a) com sucesso.`);
          }
          closeModal();
          refresh();
        } catch (error) {
          submit.disabled = false;
          toast(error?.message ?? "Não foi possível salvar o aluno.", "error");
        }
      });
    };

    const openDetails = async (student) => {
      const plans = plansOf(student.id);
      openModal({
        title: student.name,
        body: `
          <div class="cell-user" style="margin-bottom:1rem">
            <span class="avatar avatar--lg">${initials(student.name)}</span>
            <div><p class="cell-user__name">${escapeHtml(student.name)}</p>
            <p class="cell-user__mail">${escapeHtml(student.email || "—")}</p></div>
          </div>
          <dl class="detail-grid">
            <div><dt>CPF</dt><dd>${escapeHtml(student.cpf || "—")}</dd></div>
            <div><dt>Celular</dt><dd>${escapeHtml(student.phone || "—")}</dd></div>
            <div><dt>Nascimento</dt><dd>${formatDate(student.birthDate)}</dd></div>
            <div><dt>Treinos vinculados</dt><dd>${plans.length}</dd></div>
            <div><dt>Dias de treino</dt><dd>${
              plans.length ? plans.map((plan) => weekDayLabel(plan.day)).join(", ") : "—"
            }</dd></div>
          </dl>`,
      });
    };

    const confirmDelete = (student) => {
      const body = openModal({
        title: "Excluir aluno",
        body: `
          <p class="list__sub">Tem certeza que deseja excluir <strong>${escapeHtml(student.name)}</strong>? Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>
            <button class="btn btn--danger" type="button" id="confirmDelete"><i class="fa-solid fa-trash-can"></i> Excluir</button>
          </div>`,
      });
      body.querySelector("#confirmDelete").addEventListener("click", async (event) => {
        event.currentTarget.disabled = true;
        try {
          await studentService.remove(student.id);
          closeModal();
          toast(`${student.name} foi removido(a).`, "info");
          refresh();
        } catch (error) {
          event.currentTarget.disabled = false;
          toast(error?.message ?? "Não foi possível excluir o aluno.", "error");
        }
      });
    };

    view.querySelector("#studentSearch").addEventListener("input", (event) => {
      filters.search = event.target.value;
      paint();
    });
    view.querySelector("#addStudent")?.addEventListener("click", () => openForm(null));

    tbody.addEventListener("click", (event) => {
      const find = (attr) => students.find((s) => s.id === Number(attr));
      const viewBtn = event.target.closest("[data-view]");
      const editBtn = event.target.closest("[data-edit]");
      const deleteBtn = event.target.closest("[data-delete]");
      if (viewBtn) openDetails(find(viewBtn.dataset.view));
      if (editBtn && canManage) openForm(find(editBtn.dataset.edit));
      if (deleteBtn && canManage) confirmDelete(find(deleteBtn.dataset.delete));
    });

    view.querySelector("#studentSearch").value = filters.search;
    paint();
  },
};
