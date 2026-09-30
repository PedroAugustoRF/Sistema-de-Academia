/**
 * Gym profile and dashboard figures.
 *
 * The backend has NO endpoint for the gym profile, so these details are kept
 * in the browser (localStorage) until an endpoint such as GET/PUT /academia
 * exists. Statistics are derived from the real collections.
 */

import { api } from "./apiClient.js";
import { studentService } from "./userService.js";
import { machineService } from "./machineService.js";
import { workoutService } from "./workoutService.js";

const STORAGE_KEY = "gymcontrol.profile";

const DEFAULT_PROFILE = {
  name: "GymControl",
  email: "",
  phone: "",
  address: "",
  openingHours: "",
};

export const gymService = {
  /** Local until the backend exposes a profile endpoint. */
  async profile() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  },

  async saveProfile(profile) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* storage unavailable */
    }
    return profile;
  },

  /**
   * Health check: GET / on the API answers `{ status: "ok" }` without a token.
   * Used by Configurações to validate a server address before saving it.
   */
  async checkConnection(baseUrl) {
    const url = String(baseUrl ?? "").trim().replace(/\/+$/, "");
    if (!url) throw new Error("Informe o endereço do servidor.");
    return api.public.get("/", { baseUrl: url });
  },

  /** Aggregated from /usuarios (cargo aluno), /maquinas and /treinos. */
  async stats() {
    const [students, machines, workouts] = await Promise.all([
      studentService.getAll(),
      machineService.getAll(),
      workoutService.getAll(),
    ]);

    const studentsWithPlan = new Set(
      workouts.map((workout) => workout.studentId).filter(Boolean),
    );
    const muscleGroups = new Set(machines.map((machine) => machine.muscleGroup).filter(Boolean));
    const exercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);

    return {
      students,
      machines,
      workouts,
      totalStudents: students.length,
      studentsWithPlan: studentsWithPlan.size,
      totalMachines: machines.length,
      muscleGroups: muscleGroups.size,
      totalWorkouts: workouts.length,
      totalExercises: exercises,
    };
  },
};
