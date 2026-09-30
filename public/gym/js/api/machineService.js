/**
 * Machines (backend: /maquinas — full CRUD available).
 *
 * The backend stores a machine as { nome, agrupamento, fabricante }; there is
 * no status, location, photo or unit count, so the UI does not display any.
 */

import { api } from "./apiClient.js";
import { isDemoMode } from "../config.js";
import { mockMaquinas } from "./mockRepository.js";
import { toMachine, toMachinePayload } from "./mappers.js";

const source = () =>
  isDemoMode()
    ? {
        all: () => mockMaquinas.findAll(),
        one: (id) => mockMaquinas.findById(id),
        insert: (payload) => mockMaquinas.insert(payload),
        update: (payload) => mockMaquinas.update(payload),
        remove: (id) => mockMaquinas.remove(id),
      }
    : {
        all: () => api.get("/maquinas"),
        one: (id) => api.get(`/maquinas/${id}`),
        insert: (payload) => api.post("/maquinas", payload),
        update: (payload) => api.put(`/maquinas/${payload.id}`, payload),
        remove: (id) => api.delete(`/maquinas/${id}`),
      };

export const machineService = {
  async getAll() {
    const rows = await source().all();
    return (rows ?? []).map(toMachine);
  },

  async getById(id) {
    const row = await source().one(id);
    return row ? toMachine(row) : null;
  },

  async create(machine) {
    const created = await source().insert(toMachinePayload(machine));
    return { ...machine, id: created?.id ?? null };
  },

  async update(id, machine) {
    await source().update(toMachinePayload({ ...machine, id }));
    return { ...machine, id: Number(id) };
  },

  async remove(id) {
    await source().remove(id);
    return true;
  },

  /** Derived client-side: the backend has no manufacturers endpoint. */
  async manufacturers() {
    const machines = await machineService.getAll();
    return [...new Set(machines.map((machine) => machine.manufacturer).filter(Boolean))].sort();
  },
};

machineService.list = machineService.getAll;
