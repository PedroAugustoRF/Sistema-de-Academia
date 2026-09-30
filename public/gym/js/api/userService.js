/**
 * Users (backend: /usuarios — GET, GET /:id, POST, PUT /:id, DELETE /:id).
 *
 * Every person in the system lives in this single table; the `cargo`
 * column tells administrators, teachers and students apart. The backend
 * hashes the password with bcrypt and never returns it.
 */

import { api } from "./apiClient.js";
import { isDemoMode } from "../config.js";
import { mockUsuarios } from "./mockRepository.js";
import { toUser, toUserPayload } from "./mappers.js";

const source = () =>
  isDemoMode()
    ? {
        all: () => mockUsuarios.findAll(),
        one: (id) => mockUsuarios.findById(id),
        insert: (payload) => mockUsuarios.insert(payload),
        update: (payload) => mockUsuarios.update(payload),
        remove: (id) => mockUsuarios.remove(id),
      }
    : {
        all: () => api.get("/usuarios"),
        one: (id) => api.get(`/usuarios/${id}`),
        insert: (payload) => api.post("/usuarios", payload),
        update: (payload) => api.put(`/usuarios/${payload.id}`, payload),
        remove: (id) => api.delete(`/usuarios/${id}`),
      };

export const userService = {
  async getAll() {
    const rows = await source().all();
    return (rows ?? []).map(toUser);
  },

  /** Convenience filter — the backend has no server-side search or role filter. */
  async getByRole(role) {
    const users = await userService.getAll();
    return users.filter((user) => user.role === role);
  },

  async getById(id) {
    const row = await source().one(id);
    return row ? toUser(row) : null;
  },

  /** @param {{name, email, password, role, cpf?, phone?, birthDate?}} user */
  async create(user) {
    const created = await source().insert(toUserPayload(user));
    const { password, ...safe } = user;
    return { ...safe, id: created?.id ?? null };
  },

  async update(id, user) {
    await source().update(toUserPayload({ ...user, id }));
    const { password, ...safe } = user;
    return { ...safe, id: Number(id) };
  },

  async remove(id) {
    await source().remove(id);
    return true;
  },
};

/** Same table, fixed role — kept so the pages keep their vocabulary. */
export const studentService = {
  getAll: () => userService.getByRole("aluno"),
  getById: (id) => userService.getById(id),
  create: (student) => userService.create({ ...student, role: "aluno" }),
  update: (id, student) => userService.update(id, { ...student, role: "aluno" }),
  remove: (id) => userService.remove(id),
};
studentService.list = studentService.getAll;

export const teacherService = {
  getAll: () => userService.getByRole("professor"),
  create: (teacher) => userService.create({ ...teacher, role: "professor" }),
  update: (id, teacher) => userService.update(id, { ...teacher, role: "professor" }),
  remove: (id) => userService.remove(id),
};
