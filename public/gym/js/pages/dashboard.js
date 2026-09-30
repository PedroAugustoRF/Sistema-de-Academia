import { gymService } from "../services.js";
import { muscleGroupLabel, weekDayLabel } from "../api/mappers.js";
import { escapeHtml, errorState, formatDate, initials, loadingState } from "../ui.js";

const statCard = ({ icon, label, value, delta }) => `
  <article class="card stat-card">
    <div class="stat-card__top">
      <span class="stat-card__icon"><i class="fa-solid ${icon}"></i></span>
      <span class="stat-card__label">${escapeHtml(label)}</span>
    </div>
    <p class="stat-card__value">${escapeHtml(String(value))}</p>
    <p class="stat-card__delta">${delta}</p>
  </article>`;

export const dashboardPage = {
  title: "Painel",
  subtitle: "Visão geral da operação da academia",

  async render(view, { navigate, user }) {
    const isAdmin = user.role === "administrador";
    view.innerHTML = loadingState("Carregando painel…");

    let stats;
    try {
      stats = await gymService.stats();
    } catch (error) {
      view.innerHTML = errorState(
        error?.message ?? "Não foi possível carregar os dados da academia.",
        { retryId: "retryDashboard" },
      );
      view
        .querySelector("#retryDashboard")
        .addEventListener("click", () => dashboardPage.render(view, { navigate, user }));
      return;
    }

    const { students, machines, workouts } = stats;

    const recentStudents = [...students].sort((a, b) => b.id - a.id).slice(0, 5);
    const recentWorkouts = [...workouts].sort((a, b) => b.id - a.id).slice(0, 4);

    const groupCount = machines.reduce((acc, machine) => {
      acc[machine.muscleGroup] = (acc[machine.muscleGroup] ?? 0) + 1;
      return acc;
    }, {});
    const topGroups = Object.entries(groupCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const coverage = stats.totalStudents
      ? Math.round((stats.studentsWithPlan / stats.totalStudents) * 100)
      : 0;

    const withoutPlan = students.filter((student) => !workouts.some((workout) => workout.studentId === student.id));

    const machinesPanel = `
        <section class="card panel">
          <div class="panel__head">
            <h3 class="panel__title">Máquinas por agrupamento</h3>
            <span class="panel__action">${machines.length} máquinas</span>
          </div>
          <div class="list">
            ${
              topGroups.length
                ? topGroups
                    .map(([group, count]) => {
                      const pct = Math.round((count / machines.length) * 100);
                      return `
                  <div class="list__row">
                    <div class="list__main" style="flex:1">
                      <p class="list__title">${muscleGroupLabel(group)}</p>
                      <div class="meter"><div class="meter__fill meter__fill--success" style="width:${pct}%"></div></div>
                    </div>
                    <div class="list__aside">${count}</div>
                  </div>`;
                    })
                    .join("")
                : '<p class="list__sub">Nenhuma máquina cadastrada ainda.</p>'
            }
          </div>
          <button class="btn btn--ghost btn--block btn--sm" data-nav="machines" type="button" style="margin-top:0.9rem">Abrir lista de equipamentos</button>
        </section>
`;

    // Professors see who still needs a plan instead of the equipment breakdown.
    const pendingPanel = `
        <section class="card panel">
          <div class="panel__head">
            <h3 class="panel__title">Alunos sem treino</h3>
            <span class="panel__action">${withoutPlan.length} pendente(s)</span>
          </div>
          <div class="list">
            ${
              withoutPlan.length
                ? withoutPlan
                    .slice(0, 5)
                    .map(
                      (student) => `
              <div class="list__row">
                <span class="avatar">${initials(student.name)}</span>
                <div class="list__main">
                  <p class="list__title">${escapeHtml(student.name)}</p>
                  <p class="list__sub">${escapeHtml(student.email || "sem e-mail")}</p>
                </div>
              </div>`,
                    )
                    .join("")
                : '<p class="list__sub">Todos os alunos já têm treino montado.</p>'
            }
          </div>
          <button class="btn btn--ghost btn--block btn--sm" data-nav="workouts" type="button" style="margin-top:0.9rem">Montar treino</button>
        </section>`;

    view.innerHTML = `
      <section class="hero">
        <p class="hero__eyebrow">${isAdmin ? "GymControl" : `Olá, ${escapeHtml(user.name.split(" ")[0])}`}</p>
        <h2 class="hero__title">${isAdmin ? "Toda a academia em um só lugar" : "Seus alunos e treinos"}</h2>
        <p class="hero__text">${
          isAdmin
            ? "Acompanhe alunos, equipamentos e fichas de treino a partir de um único painel de controle."
            : "Acompanhe os alunos da academia e monte as fichas de treino de cada um."
        }</p>
        <div class="hero__actions">
          <button class="btn btn--primary" data-nav="workouts" type="button"><i class="fa-solid fa-plus"></i> Novo treino</button>
          <button class="btn btn--ghost" data-nav="students" type="button"><i class="fa-solid fa-users"></i> ${isAdmin ? "Gerenciar alunos" : "Ver alunos"}</button>
        </div>
      </section>

      <section class="grid-stats">
        ${statCard({ icon: "fa-users", label: "Alunos cadastrados", value: stats.totalStudents, delta: `${stats.studentsWithPlan} com treino ativo` })}
        ${statCard({ icon: "fa-user-check", label: "Cobertura de treinos", value: `${coverage}%`, delta: "alunos com ficha montada" })}
            ${isAdmin ? statCard({ icon: "fa-gears", label: "Máquinas", value: stats.totalMachines, delta: `${stats.muscleGroups} agrupamentos musculares` }) : statCard({ icon: "fa-user-clock", label: "Sem treino", value: withoutPlan.length, delta: "alunos aguardando ficha" })}
        ${statCard({ icon: "fa-list-check", label: "Fichas de treino", value: stats.totalWorkouts, delta: `${stats.totalExercises} exercícios cadastrados` })}
      </section>

      <div class="grid-split">
        <section class="card panel">
          <div class="panel__head">
            <h3 class="panel__title">Alunos recentes</h3>
            <button class="btn btn--ghost btn--sm" data-nav="students" type="button">Ver todos</button>
          </div>
          <div class="list">
            ${
              recentStudents.length
                ? recentStudents
                    .map(
                      (student) => `
              <div class="list__row">
                <span class="avatar">${initials(student.name)}</span>
                <div class="list__main">
                  <p class="list__title">${escapeHtml(student.name)}</p>
                  <p class="list__sub">${escapeHtml(student.phone || "sem celular")} · nascimento ${formatDate(student.birthDate)}</p>
                </div>
              </div>`,
                    )
                    .join("")
                : '<p class="list__sub">Nenhum aluno cadastrado ainda.</p>'
            }
          </div>
        </section>

        ${isAdmin ? machinesPanel : pendingPanel}
      </div>

      <div class="grid-split">
        <section class="card panel">
          <div class="panel__head">
            <h3 class="panel__title">Treinos recentes</h3>
            <button class="btn btn--ghost btn--sm" data-nav="workouts" type="button">Montar treino</button>
          </div>
          <div class="list">
            ${
              recentWorkouts.length
                ? recentWorkouts
                    .map(
                      (workout) => `
                  <div class="list__row">
                    <span class="stat-card__icon"><i class="fa-solid fa-dumbbell"></i></span>
                    <div class="list__main">
                      <p class="list__title">${escapeHtml(workout.student?.name ?? "Aluno removido")}</p>
                      <p class="list__sub">${weekDayLabel(workout.day)} · ${workout.exercises.length} exercícios</p>
                    </div>
                    <div class="list__aside">#TR-${String(workout.id).padStart(4, "0")}</div>
                  </div>`,
                    )
                    .join("")
                : '<p class="list__sub">Nenhum treino cadastrado ainda.</p>'
            }
          </div>
        </section>

        <section class="card panel">
          <div class="panel__head"><h3 class="panel__title">Resumo</h3></div>
          <div class="summary-line"><span>Alunos cadastrados</span><span>${stats.totalStudents}</span></div>
          <div class="summary-line"><span>Alunos com treino</span><span>${stats.studentsWithPlan}</span></div>
          ${isAdmin ? `<div class="summary-line"><span>Máquinas cadastradas</span><span>${stats.totalMachines}</span></div>` : ""}
          <div class="summary-line"><span>Fichas de treino</span><span>${stats.totalWorkouts}</span></div>
          <div class="summary-line"><span>Exercícios prescritos</span><span>${stats.totalExercises}</span></div>
        </section>
      </div>
    `;

    view.querySelectorAll("[data-nav]").forEach((button) =>
      button.addEventListener("click", () => navigate(button.dataset.nav)),
    );
  },
};
