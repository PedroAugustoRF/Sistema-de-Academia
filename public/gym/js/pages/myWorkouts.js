import { workoutService } from "../services.js";
import { weekDayLabel, muscleGroupLabel } from "../api/mappers.js";
import { emptyState, errorState, escapeHtml, loadingState } from "../ui.js";

/**
 * "Meus Treinos" — the only page a student sees.
 * Backed by GET /treinos/usuario/:id (the backend rejects any other id).
 * Read-only: students never create or edit plans.
 */

const exerciseTable = (exercises) => `
  <div class="table-wrap">
    <table class="data-table">
      <thead><tr><th>#</th><th>Máquina</th><th>Agrupamento</th><th>Séries</th><th>Reps</th><th>Carga</th></tr></thead>
      <tbody>
        ${
          exercises.length
            ? exercises
                .map(
                  (exercise, index) => `<tr>
                    <td>${index + 1}</td>
                    <td><strong>${escapeHtml(exercise.machine?.name ?? "—")}</strong></td>
                    <td>${muscleGroupLabel(exercise.machine?.muscleGroup)}</td>
                    <td>${exercise.sets}</td>
                    <td>${exercise.reps}</td>
                    <td>${exercise.load ? `${exercise.load} kg` : "—"}</td>
                  </tr>`,
                )
                .join("")
            : `<tr><td colspan="6">${emptyState("Este treino ainda não tem exercícios.", "fa-dumbbell")}</td></tr>`
        }
      </tbody>
    </table>
  </div>`;

export const myWorkoutsPage = {
  title: "Meus Treinos",
  subtitle: "Sua ficha de treino organizada por dia da semana",

  async render(view, { user }) {
    view.innerHTML = loadingState("Carregando seus treinos…");

    let workouts = [];
    try {
      workouts = await workoutService.getByStudent(user.id);
    } catch (error) {
      view.innerHTML = errorState(error?.message ?? "Não foi possível carregar seus treinos.", { retryId: "retryMine" });
      view.querySelector("#retryMine").addEventListener("click", () => myWorkoutsPage.render(view, { user }));
      return;
    }

    const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);

    view.innerHTML = `
      <section class="hero">
        <p class="hero__eyebrow">Olá, ${escapeHtml(user.name.split(" ")[0])}</p>
        <h2 class="hero__title">${workouts.length ? "Seu treino da semana" : "Nenhum treino montado ainda"}</h2>
        <p class="hero__text">${
          workouts.length
            ? `${workouts.length} dia(s) de treino · ${totalExercises} exercícios prescritos pelo seu professor.`
            : "Assim que seu professor montar sua ficha, ela aparecerá aqui."
        }</p>
      </section>
      ${workouts
        .map(
          (workout) => `
        <section class="card panel" style="margin-bottom:1.25rem">
          <div class="panel__head">
            <h3 class="panel__title">${escapeHtml(weekDayLabel(workout.day))}</h3>
            <span class="panel__action">${workout.exercises.length} exercícios · #TR-${String(workout.id).padStart(4, "0")}</span>
          </div>
          ${exerciseTable(workout.exercises)}
        </section>`,
        )
        .join("")}`;
  },
};
