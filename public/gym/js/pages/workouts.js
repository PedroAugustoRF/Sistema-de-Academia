import { machineService, studentService, workoutService } from "../services.js";
import { WEEK_DAYS, weekDayLabel, muscleGroupLabel } from "../api/mappers.js";
import {
  closeModal,
  emptyState,
  errorState,
  escapeHtml,
  loadingState,
  openModal,
  toast,
} from "../ui.js";

/**
 * Workout builder — backed by /treinos and /exercicios.
 *
 * Backend model:
 *   Treino     { usuarioid, diaSemana }
 *   Exercicios { treinoid, maquinaid, series, repeticoes, carga }
 *
 * Saving a new plan performs POST /treinos and then one POST /exercicios per
 * row; editing performs PUT /treinos/:id and reconciles the exercises.
 * Available to administrators and professors; students use "Meus Treinos".
 */

let draft = createDraft();

function createDraft() {
  return { id: null, studentId: "", day: "SEGUNDA", exercises: [newExercise()] };
}

/** Loads a saved workout into the builder so it can be edited. */
function draftFrom(workout) {
  return {
    id: workout.id,
    studentId: String(workout.studentId ?? ""),
    day: workout.day,
    exercises: workout.exercises.map((exercise) => ({
      id: exercise.id,
      machineId: String(exercise.machine?.id ?? exercise.machineId ?? ""),
      sets: exercise.sets,
      reps: exercise.reps,
      load: exercise.load,
    })),
  };
}

function newExercise() {
  return {
    id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    machineId: "",
    sets: 4,
    reps: 10,
    load: 0,
  };
}

function exerciseRow(exercise, index, machines) {
  const machine = machines.find((item) => String(item.id) === String(exercise.machineId));
  return `
    <div class="exercise-row" data-exercise="${exercise.id}">
      <div class="exercise-row__head">
        <span class="exercise-row__index">${index + 1}</span>
        <strong>${escapeHtml(machine?.name ?? "Novo exercício")}</strong>
        <button class="btn btn--danger btn--sm" type="button" data-remove="${exercise.id}" style="margin-left:auto">
          <i class="fa-solid fa-trash-can"></i> Remover
        </button>
      </div>
      <div class="exercise-row__grid">
        <div class="field field--wide">
          <label>Máquina</label>
          <select data-bind="machineId">
            <option value="">Selecione a máquina</option>
            ${machines
              .map(
                (item) =>
                  `<option value="${item.id}" ${String(item.id) === String(exercise.machineId) ? "selected" : ""}>${escapeHtml(item.name)} — ${muscleGroupLabel(item.muscleGroup)}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="field"><label>Séries</label><input type="number" min="1" data-bind="sets" value="${exercise.sets}" /></div>
        <div class="field"><label>Repetições</label><input type="number" min="1" data-bind="reps" value="${exercise.reps}" /></div>
        <div class="field"><label>Carga (kg)</label><input type="number" min="0" step="2.5" data-bind="load" value="${exercise.load}" /></div>
      </div>
    </div>`;
}

export const workoutsPage = {
  title: "Montar Treino",
  subtitle: "Monte fichas de treino a partir do catálogo de máquinas",

  async render(view, context) {
    view.innerHTML = loadingState("Carregando dados do treino…");

    let machines = [];
    let students = [];
    let workouts = [];
    try {
      [machines, students, workouts] = await Promise.all([
        machineService.getAll(),
        studentService.getAll(),
        workoutService.getAll(),
      ]);
    } catch (error) {
      view.innerHTML = errorState(
        error?.message ?? "Não foi possível carregar os treinos.",
        { retryId: "retryWorkouts" },
      );
      view.querySelector("#retryWorkouts").addEventListener("click", () => workoutsPage.render(view, context));
      return;
    }

    view.innerHTML = `
      <div class="builder">
        <section class="card panel">
          <div class="panel__head">
            <h3 class="panel__title">Dados do treino</h3>
            <span class="panel__action">${draft.id ? `Editando #TR-${String(draft.id).padStart(4, "0")}` : "Rascunho"}</span>
          </div>
          <div class="modal-form" style="margin-bottom:1.2rem">
            <div class="field">
              <label for="wStudent">Aluno</label>
              <select id="wStudent" data-plan="studentId">
                <option value="">Selecione o aluno</option>
                ${students
                  .map(
                    (student) =>
                      `<option value="${student.id}" ${String(student.id) === String(draft.studentId) ? "selected" : ""}>${escapeHtml(student.name)}</option>`,
                  )
                  .join("")}
              </select>
            </div>
            <div class="field">
              <label for="wDay">Dia de treino</label>
              <select id="wDay" data-plan="day">
                ${WEEK_DAYS.map(
                  (day) => `<option value="${day}" ${day === draft.day ? "selected" : ""}>${weekDayLabel(day)}</option>`,
                ).join("")}
              </select>
            </div>
          </div>

          <div class="panel__head">
            <h3 class="panel__title">Exercícios</h3>
            <button class="btn btn--ghost btn--sm" id="addExercise" type="button" style="margin-left:auto"><i class="fa-solid fa-plus"></i> Adicionar exercício</button>
          </div>
          <div id="exerciseList"></div>

          <div class="modal-actions">
            <button class="btn btn--ghost" id="clearWorkout" type="button"><i class="fa-solid fa-eraser"></i> ${draft.id ? "Cancelar edição" : "Limpar treino"}</button>
            <button class="btn btn--primary" id="saveWorkout" type="button"><i class="fa-solid fa-floppy-disk"></i> ${draft.id ? "Salvar alterações" : "Salvar treino"}</button>
          </div>
        </section>

        <aside class="card panel">
          <div class="panel__head"><h3 class="panel__title">Treinos salvos</h3></div>
          <div class="list" id="workoutList"></div>
        </aside>
      </div>`;

    const list = view.querySelector("#exerciseList");
    const savedList = view.querySelector("#workoutList");

    const paintExercises = () => {
      list.innerHTML = draft.exercises.length
        ? draft.exercises.map((exercise, index) => exerciseRow(exercise, index, machines)).join("")
        : emptyState("Nenhum exercício ainda — adicione o primeiro.", "fa-dumbbell");
    };

    const paintSaved = () => {
      savedList.innerHTML = workouts.length
        ? workouts
            .map(
              (workout) => `
            <div class="list__row">
              <div class="list__main">
                <p class="list__title">${escapeHtml(workout.student?.name ?? "Aluno removido")}</p>
                <p class="list__sub">${weekDayLabel(workout.day)} · ${workout.exercises.length} exercícios</p>
              </div>
              <div class="list__aside">
                <button class="btn btn--ghost btn--sm" data-plan-view="${workout.id}" type="button">Abrir</button>
                <button class="btn-icon" data-plan-edit="${workout.id}" type="button" aria-label="Editar treino"><i class="fa-regular fa-pen-to-square"></i></button>
              </div>
            </div>`,
            )
            .join("")
        : emptyState("Nenhum treino salvo ainda.", "fa-list-check");
    };

    paintExercises();
    paintSaved();

    view.querySelectorAll("[data-plan]").forEach((input) =>
      input.addEventListener("change", (event) => {
        draft[event.target.dataset.plan] = event.target.value;
      }),
    );

    list.addEventListener("change", (event) => {
      const field = event.target.closest("[data-bind]");
      if (!field) return;
      const rowId = event.target.closest("[data-exercise]").dataset.exercise;
      const exercise = draft.exercises.find((item) => String(item.id) === rowId);
      const key = field.dataset.bind;
      exercise[key] = ["sets", "reps", "load"].includes(key) ? Number(field.value) : field.value;
      if (key === "machineId") paintExercises();
    });

    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove]");
      if (!remove) return;
      draft.exercises = draft.exercises.filter((item) => String(item.id) !== remove.dataset.remove);
      paintExercises();
      toast("Exercício removido.", "info");
    });

    view.querySelector("#addExercise").addEventListener("click", () => {
      draft.exercises.push(newExercise());
      paintExercises();
      list.lastElementChild?.querySelector("select")?.focus();
    });

    view.querySelector("#clearWorkout").addEventListener("click", () => {
      const wasEditing = Boolean(draft.id);
      draft = createDraft();
      workoutsPage.render(view, context);
      toast(wasEditing ? "Edição cancelada." : "Rascunho do treino limpo.", "info");
    });

    view.querySelector("#saveWorkout").addEventListener("click", async (event) => {
      if (!draft.studentId) {
        toast("Selecione o aluno antes de salvar o treino.", "error");
        return;
      }
      if (!draft.exercises.length || draft.exercises.some((exercise) => !exercise.machineId)) {
        toast("Escolha uma máquina para cada exercício.", "error");
        return;
      }
      const button = event.currentTarget;
      button.disabled = true;
      try {
        if (draft.id) await workoutService.update(draft.id, draft);
        else await workoutService.create(draft);
        const student = students.find((item) => String(item.id) === String(draft.studentId));
        const wasEditing = Boolean(draft.id);
        draft = createDraft();
        toast(`Treino de ${student?.name ?? "aluno"} ${wasEditing ? "atualizado" : "salvo"} com sucesso.`);
        workoutsPage.render(view, context);
      } catch (error) {
        button.disabled = false;
        toast(error?.message ?? "Não foi possível salvar o treino.", "error");
      }
    });

    savedList.addEventListener("click", async (event) => {
      const editTrigger = event.target.closest("[data-plan-edit]");
      if (editTrigger) {
        const workout = workouts.find((item) => String(item.id) === editTrigger.dataset.planEdit);
        if (!workout) return;
        draft = draftFrom(workout);
        workoutsPage.render(view, context);
        toast(`Editando treino de ${workout.student?.name ?? "aluno"}.`, "info");
        return;
      }
      const trigger = event.target.closest("[data-plan-view]");
      if (!trigger) return;
      const workout = workouts.find((item) => String(item.id) === trigger.dataset.planView);
      if (!workout) return;

      const body = openModal({
        title: `Treino de ${workout.student?.name ?? "aluno removido"}`,
        size: "lg",
        body: `
          <dl class="detail-grid" style="margin-bottom:1rem">
            <div><dt>Aluno</dt><dd>${escapeHtml(workout.student?.name ?? "—")}</dd></div>
            <div><dt>Dia de treino</dt><dd>${weekDayLabel(workout.day)}</dd></div>
            <div><dt>Exercícios</dt><dd>${workout.exercises.length}</dd></div>
            <div><dt>Código</dt><dd>#TR-${String(workout.id).padStart(4, "0")}</dd></div>
          </dl>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>#</th><th>Máquina</th><th>Agrupamento</th><th>Séries</th><th>Reps</th><th>Carga</th></tr></thead>
              <tbody>
                ${
                  workout.exercises.length
                    ? workout.exercises
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
                    : `<tr><td colspan="6">${emptyState("Treino sem exercícios.", "fa-dumbbell")}</td></tr>`
                }
              </tbody>
            </table>
          </div>
          <div class="modal-actions">
            <button class="btn btn--danger" type="button" id="deleteWorkout"><i class="fa-solid fa-trash-can"></i> Excluir treino</button>
            <button class="btn btn--primary" type="button" id="editWorkout"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
          </div>`,
      });

      body.querySelector("#editWorkout").addEventListener("click", () => {
        draft = draftFrom(workout);
        closeModal();
        workoutsPage.render(view, context);
      });

      body.querySelector("#deleteWorkout").addEventListener("click", async (deleteEvent) => {
        deleteEvent.currentTarget.disabled = true;
        try {
          await workoutService.remove(workout.id);
          closeModal();
          toast("Treino excluído.", "info");
          workoutsPage.render(view, context);
        } catch (error) {
          deleteEvent.currentTarget.disabled = false;
          toast(error?.message ?? "Não foi possível excluir o treino.", "error");
        }
      });
    });
  },
};
