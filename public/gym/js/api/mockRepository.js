/**
 * Demo-mode repository.
 *
 * Implements exactly the same responses as the REST API (same field names,
 * same nesting, same error messages), so services can swap between this and
 * `apiClient` without the UI noticing. Only active when demo mode is enabled
 * in Configurações.
 */

import { usuarios, maquinas, treinos, exercicios, DEMO_PASSWORD } from "../data.js";
import { ApiError } from "./apiClient.js";

const LATENCY = 90;

const delay = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(payload)), LATENCY));

const fail = (status, erro) =>
  new Promise((_, reject) => setTimeout(() => reject(new ApiError(erro, { status, detail: erro })), LATENCY));

const nextId = (rows) => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
const byId = (rows, id) => rows.find((row) => row.id === Number(id)) ?? null;

const expandExercicio = (row) => ({
  id: row.id,
  treino: null,
  maquina: byId(maquinas, row.maquinaid),
  series: row.series,
  repeticoes: row.repeticoes,
  carga: row.carga,
});

const expandTreino = (row) => ({
  id: row.id,
  usuario: byId(usuarios, row.usuarioid),
  diaSemana: row.diaSemana,
  exercicios: exercicios.filter((item) => item.treinoid === row.id).map(expandExercicio),
});

const crud = (rows, fields) => ({
  findAll: () => delay(rows),
  findById: (id) => delay(byId(rows, id)),
  insert: (payload) => {
    const row = { id: nextId(rows) };
    fields.forEach((field) => (row[field] = payload[field] ?? null));
    rows.push(row);
    return delay({ id: row.id });
  },
  update: (payload) => {
    const row = byId(rows, payload.id);
    if (!row) return fail(404, "Registro não encontrado");
    fields.forEach((field) => {
      if (payload[field] !== undefined) row[field] = payload[field];
    });
    return delay(true);
  },
  remove: (id) => {
    const index = rows.findIndex((row) => row.id === Number(id));
    if (index >= 0) rows.splice(index, 1);
    return delay(true);
  },
});

/* --------------------------------- users ---------------------------------- */

const usuariosCrud = crud(usuarios, ["nome", "cpf", "email", "celular", "aniversario", "cargo"]);
export const mockUsuarios = {
  ...usuariosCrud,
  insert: (payload) => {
    if (usuarios.some((u) => u.email === payload.email)) {
      return fail(409, "Já existe um usuário com este e-mail");
    }
    return usuariosCrud.insert(payload); // `senha` is intentionally not stored
  },
  remove: (id) => {
    for (const treino of treinos.filter((t) => t.usuarioid === Number(id))) {
      mockTreinos.remove(treino.id);
    }
    return usuariosCrud.remove(id);
  },
};

/** Mirrors POST /usuarios/login and GET /usuarios/me. */
export const mockAuth = {
  login: ({ email, senha }) => {
    const user = usuarios.find((u) => u.email === String(email).trim().toLowerCase());
    if (!user || senha !== DEMO_PASSWORD) return fail(401, "Email ou senha inválidos");
    return delay({ token: `demo-${user.id}`, usuario: user });
  },
  me: (token) => {
    const id = Number(String(token ?? "").replace("demo-", ""));
    const user = byId(usuarios, id);
    return user ? delay(user) : fail(401, "Token inválido ou expirado");
  },
};

/* -------------------------------- machines -------------------------------- */

export const mockMaquinas = crud(maquinas, ["nome", "agrupamento", "fabricante"]);

/* -------------------------------- workouts -------------------------------- */

const treinosCrud = crud(treinos, ["usuarioid", "diaSemana"]);
export const mockTreinos = {
  ...treinosCrud,
  findAll: () => delay(treinos.map(expandTreino)),
  findById: (id) => {
    const row = byId(treinos, id);
    return delay(row ? expandTreino(row) : null);
  },
  findByUsuario: (usuarioId) =>
    delay(treinos.filter((row) => row.usuarioid === Number(usuarioId)).map(expandTreino)),
  remove: (id) => {
    for (let i = exercicios.length - 1; i >= 0; i -= 1) {
      if (exercicios[i].treinoid === Number(id)) exercicios.splice(i, 1);
    }
    return treinosCrud.remove(id);
  },
};

export const mockExercicios = {
  ...crud(exercicios, ["treinoid", "maquinaid", "series", "repeticoes", "carga"]),
  findByTreino: (treinoId) =>
    delay(exercicios.filter((row) => row.treinoid === Number(treinoId)).map(expandExercicio)),
};
