/**
 * Workouts (backend: /treinos and /exercicios).
 *
 * The backend has no "save a workout with its exercises in one call"
 * endpoint, so creating a plan means: POST /treinos, then one POST
 * /exercicios per exercise, each carrying the returned treinoid. Editing
 * follows the same idea: PUT /treinos/:id, then PUT/POST/DELETE for each
 * exercise that changed.
 *
 * Students may only call GET /treinos/usuario/:id with their own id — the
 * backend enforces this; the UI just avoids the other calls for them.
 */

import { api } from "./apiClient.js";
import { isDemoMode } from "../config.js";
import { mockTreinos, mockExercicios } from "./mockRepository.js";
import { toWorkout, toWorkoutPayload, toExercisePayload, toExercise } from "./mappers.js";

const source = () =>
  isDemoMode()
    ? {
        all: () => mockTreinos.findAll(),
        one: (id) => mockTreinos.findById(id),
        byStudent: (id) => mockTreinos.findByUsuario(id),
        insert: (payload) => mockTreinos.insert(payload),
        update: (payload) => mockTreinos.update(payload),
        remove: (id) => mockTreinos.remove(id),
        exercisesOf: (id) => mockExercicios.findByTreino(id),
        insertExercise: (payload) => mockExercicios.insert(payload),
        updateExercise: (payload) => mockExercicios.update(payload),
        removeExercise: (id) => mockExercicios.remove(id),
      }
    : {
        all: () => api.get("/treinos"),
        one: (id) => api.get(`/treinos/${id}`),
        byStudent: (id) => api.get(`/treinos/usuario/${id}`),
        insert: (payload) => api.post("/treinos", payload),
        update: (payload) => api.put(`/treinos/${payload.id}`, payload),
        remove: (id) => api.delete(`/treinos/${id}`),
        exercisesOf: (id) => api.get(`/exercicios/treino/${id}`),
        insertExercise: (payload) => api.post("/exercicios", payload),
        updateExercise: (payload) => api.put(`/exercicios/${payload.id}`, payload),
        removeExercise: (id) => api.delete(`/exercicios/${id}`),
      };

const isPersisted = (exercise) => exercise.id && !String(exercise.id).startsWith("tmp-");

export const workoutService = {
  async getAll() {
    const rows = await source().all();
    return (rows ?? []).map(toWorkout);
  },

  async getById(id) {
    const row = await source().one(id);
    return row ? toWorkout(row) : null;
  },

  async getByStudent(studentId) {
    const rows = await source().byStudent(studentId);
    return (rows ?? []).map(toWorkout);
  },

  async getExercises(workoutId) {
    const rows = await source().exercisesOf(workoutId);
    return (rows ?? []).map(toExercise);
  },

  /**
   * Creates the plan and every exercise attached to it.
   * @param {{studentId:number, day:string, exercises:Array}} workout
   */
  async create(workout) {
    const created = await source().insert(toWorkoutPayload(workout));
    const workoutId = created?.id;
    if (!workoutId) throw new Error("O servidor não retornou o identificador do treino.");

    for (const exercise of workout.exercises ?? []) {
      await source().insertExercise(toExercisePayload(exercise, workoutId));
    }
    return { ...workout, id: workoutId };
  },

  /**
   * Updates the plan header and reconciles its exercises:
   * rows with a real id are updated, new rows inserted, missing rows deleted.
   */
  async update(id, workout) {
    await source().update(toWorkoutPayload({ ...workout, id }));

    const current = await workoutService.getExercises(id);
    const keep = new Set((workout.exercises ?? []).filter(isPersisted).map((e) => Number(e.id)));

    for (const existing of current) {
      if (!keep.has(Number(existing.id))) await source().removeExercise(existing.id);
    }
    for (const exercise of workout.exercises ?? []) {
      const payload = toExercisePayload(exercise, id);
      if (isPersisted(exercise)) await source().updateExercise(payload);
      else await source().insertExercise(payload);
    }
    return { ...workout, id: Number(id) };
  },

  async addExercise(workoutId, exercise) {
    const created = await source().insertExercise(toExercisePayload(exercise, workoutId));
    return { ...exercise, id: created?.id ?? null };
  },

  async removeExercise(exerciseId) {
    await source().removeExercise(exerciseId);
    return true;
  },

  /** Removes the plan's exercises first, then the plan itself. */
  async remove(id) {
    const exercises = await workoutService.getExercises(id);
    for (const exercise of exercises) {
      await source().removeExercise(exercise.id);
    }
    await source().remove(id);
    return true;
  },
};

workoutService.list = workoutService.getAll;
