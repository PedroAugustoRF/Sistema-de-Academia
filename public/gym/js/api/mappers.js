/**
 * Translation layer between the backend entities (pt-BR field names, coming
 * from Sistema-de-Academia) and the shapes the UI works with.
 *
 * Backend entities:
 *   Usuarios   { id, nome, cpf, email, celular, aniversario, cargo }  (senha never returned)
 *   Maquinas   { id, nome, agrupamento, fabricante }
 *   Treino     { id, usuario: Usuarios, diaSemana, exercicios: Exercicios[] }
 *   Exercicios { id, treino, maquina: Maquinas, series, repeticoes, carga }
 */

/** Enum Agrupamento (muscle group) exactly as defined by the backend. */
export const MUSCLE_GROUPS = [
  "PEITO",
  "COSTAS",
  "OMBRO",
  "BICEPS",
  "TRICEPS",
  "ANTEBRACO",
  "ABDOMEN",
  "QUADRICEPS",
  "POSTERIOR_COXA",
  "GLUTEO",
  "PANTURRILHA",
];

const MUSCLE_GROUP_LABEL = {
  PEITO: "Peito",
  COSTAS: "Costas",
  OMBRO: "Ombro",
  BICEPS: "Bíceps",
  TRICEPS: "Tríceps",
  ANTEBRACO: "Antebraço",
  ABDOMEN: "Abdômen",
  QUADRICEPS: "Quadríceps",
  POSTERIOR_COXA: "Posterior de coxa",
  GLUTEO: "Glúteo",
  PANTURRILHA: "Panturrilha",
};

/** Enum DiasSemana exactly as defined by the backend. */
export const WEEK_DAYS = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"];

const WEEK_DAY_LABEL = {
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

export const muscleGroupLabel = (value) => MUSCLE_GROUP_LABEL[value] ?? (value || "—");
export const weekDayLabel = (value) => WEEK_DAY_LABEL[value] ?? (value || "—");

/** MySQL DATE values arrive as ISO strings — keep only the calendar day. */
const toIsoDate = (value) => {
  if (!value) return "";
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/* --------------------------------- users ---------------------------------- */

/** One shape for every role; a "student" is simply a user with role "aluno". */
export const toUser = (row) =>
  row && {
    id: row.id,
    name: row.nome ?? "",
    email: row.email ?? "",
    role: row.cargo ?? "aluno",
    cpf: row.cpf ?? "",
    phone: row.celular ?? "",
    birthDate: toIsoDate(row.aniversario),
  };

/**
 * Builds the body for POST/PUT /usuarios. The password is only sent when the
 * form filled it in (create, or an explicit change on edit).
 */
export const toUserPayload = (user) => {
  const blank = (value) => (value === undefined || value === null || String(value).trim() === "" ? null : String(value).trim());
  const payload = {
    ...(user.id ? { id: Number(user.id) } : {}),
    nome: user.name?.trim() ?? "",
    email: user.email?.trim().toLowerCase() ?? "",
    cargo: user.role,
    cpf: blank(user.cpf),
    celular: blank(user.phone),
    aniversario: user.birthDate || null,
  };
  if (user.password) payload.senha = user.password;
  return payload;
};

export const toStudent = toUser;
export const toStudentPayload = (student) => toUserPayload({ ...student, role: "aluno" });

/* -------------------------------- machines -------------------------------- */

export const toMachine = (row) =>
  row && {
    id: row.id,
    name: row.nome ?? "",
    muscleGroup: row.agrupamento ?? "",
    manufacturer: row.fabricante ?? "",
  };

export const toMachinePayload = (machine) => ({
  ...(machine.id ? { id: Number(machine.id) } : {}),
  nome: machine.name?.trim() ?? "",
  agrupamento: machine.muscleGroup ?? "",
  fabricante: machine.manufacturer?.trim() ?? "",
});

/* -------------------------------- workouts -------------------------------- */

export const toExercise = (row) =>
  row && {
    id: row.id,
    machineId: row.maquina?.id ?? row.maquinaid ?? null,
    machine: row.maquina ? toMachine(row.maquina) : null,
    sets: toNumber(row.series, 0),
    reps: toNumber(row.repeticoes, 0),
    load: toNumber(row.carga, 0),
  };

export const toWorkout = (row) =>
  row && {
    id: row.id,
    studentId: row.usuario?.id ?? row.usuarioid ?? null,
    student: row.usuario ? toUser(row.usuario) : null,
    day: row.diaSemana ?? "",
    exercises: (row.exercicios ?? []).map(toExercise),
  };

export const toWorkoutPayload = (workout) => ({
  ...(workout.id ? { id: Number(workout.id) } : {}),
  usuarioid: workout.studentId ? Number(workout.studentId) : null,
  diaSemana: workout.day,
});

export const toExercisePayload = (exercise, workoutId) => ({
  ...(exercise.id && !String(exercise.id).startsWith("tmp-") ? { id: Number(exercise.id) } : {}),
  treinoid: Number(workoutId),
  maquinaid: Number(exercise.machineId),
  series: toNumber(exercise.sets, 1),
  repeticoes: toNumber(exercise.reps, 1),
  carga: toNumber(exercise.load, 0),
});
