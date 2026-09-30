import { machineService } from "../services.js";
import { MUSCLE_GROUPS, muscleGroupLabel } from "../api/mappers.js";
import {
  closeModal,
  emptyState,
  errorState,
  escapeHtml,
  loadingState,
  openModal,
  tag,
  toast,
} from "../ui.js";

/**
 * Machines page — backed by /maquinas (GET, POST, PUT, DELETE).
 * Backend fields: nome, agrupamento (enum), fabricante.
 */

const filters = { search: "", group: "all", manufacturer: "all" };

const machineCard = (machine) => `
  <article class="card machine-card">
    <div class="machine-card__body">
      <h3 class="machine-card__title">${escapeHtml(machine.name)}</h3>
      <p class="machine-card__desc">Equipamento de ${escapeHtml(muscleGroupLabel(machine.muscleGroup).toLowerCase())}${
        machine.manufacturer ? ` · fabricante ${escapeHtml(machine.manufacturer)}` : ""
      }.</p>
      <div class="machine-card__meta">${tag(muscleGroupLabel(machine.muscleGroup))}${
        machine.manufacturer ? tag(machine.manufacturer) : ""
      }</div>
      <div class="machine-card__foot">
        <span class="machine-card__units"><i class="fa-solid fa-hashtag"></i> ${String(machine.id).padStart(4, "0")}</span>
        <button class="btn btn--ghost btn--sm" data-machine="${machine.id}" type="button" style="margin-left:auto">Ver detalhes</button>
      </div>
    </div>
  </article>`;

const machineForm = (machine = {}) => `
  <form id="machineForm" class="modal-form" novalidate>
    <div class="field field--full">
      <label for="mName">Nome da máquina</label>
      <input id="mName" name="name" required value="${escapeHtml(machine.name ?? "")}" />
    </div>
    <div class="field">
      <label for="mGroup">Agrupamento muscular</label>
      <select id="mGroup" name="muscleGroup">
        ${MUSCLE_GROUPS.map(
          (group) =>
            `<option value="${group}" ${group === machine.muscleGroup ? "selected" : ""}>${muscleGroupLabel(group)}</option>`,
        ).join("")}
      </select>
    </div>
    <div class="field">
      <label for="mManufacturer">Fabricante</label>
      <input id="mManufacturer" name="manufacturer" value="${escapeHtml(machine.manufacturer ?? "")}" />
    </div>
    <div class="modal-actions field--full">
      <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>
      <button class="btn btn--primary" type="submit"><i class="fa-solid fa-check"></i> ${machine.id ? "Salvar alterações" : "Adicionar máquina"}</button>
    </div>
  </form>`;

function applyFilters(machines) {
  const term = filters.search.trim().toLowerCase();
  return machines.filter((machine) => {
    const matchesTerm =
      !term ||
      [machine.name, muscleGroupLabel(machine.muscleGroup), machine.manufacturer]
        .join(" ")
        .toLowerCase()
        .includes(term);
    const matchesGroup = filters.group === "all" || machine.muscleGroup === filters.group;
    const matchesManufacturer =
      filters.manufacturer === "all" || machine.manufacturer === filters.manufacturer;
    return matchesTerm && matchesGroup && matchesManufacturer;
  });
}

export const machinesPage = {
  title: "Máquinas",
  subtitle: "Equipamentos por agrupamento muscular e fabricante",

  async render(view) {
    view.innerHTML = loadingState("Carregando máquinas…");

    let machines = [];
    try {
      machines = await machineService.getAll();
    } catch (error) {
      view.innerHTML = errorState(
        error?.message ?? "Não foi possível carregar as máquinas.",
        { retryId: "retryMachines" },
      );
      view.querySelector("#retryMachines").addEventListener("click", () => machinesPage.render(view));
      return;
    }

    const manufacturers = [...new Set(machines.map((m) => m.manufacturer).filter(Boolean))].sort();
    const usedGroups = MUSCLE_GROUPS.filter((group) =>
      machines.some((machine) => machine.muscleGroup === group),
    );

    view.innerHTML = `
      <div class="section-toolbar">
        <label class="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="machineSearch" placeholder="Pesquisar máquinas…" aria-label="Pesquisar máquinas" />
        </label>
        <select class="select-inline" id="machineGroup" aria-label="Filtrar por agrupamento">
          <option value="all">Todos os agrupamentos</option>
          ${usedGroups.map((group) => `<option value="${group}">${muscleGroupLabel(group)}</option>`).join("")}
        </select>
        <select class="select-inline" id="machineManufacturer" aria-label="Filtrar por fabricante">
          <option value="all">Todos os fabricantes</option>
          ${manufacturers.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
        </select>
        <span class="spacer"></span>
        <span class="panel__action" id="machineCount"></span>
        <button class="btn btn--primary" id="addMachine" type="button"><i class="fa-solid fa-plus"></i> Adicionar máquina</button>
      </div>
      <div class="grid-cards" id="machineGrid"></div>`;

    const grid = view.querySelector("#machineGrid");
    const count = view.querySelector("#machineCount");

    const paint = () => {
      const results = applyFilters(machines);
      count.textContent = `${results.length} de ${machines.length} máquinas`;
      grid.innerHTML = results.length
        ? results.map(machineCard).join("")
        : emptyState(
            machines.length
              ? "Nenhuma máquina encontrada com os filtros atuais."
              : "Nenhuma máquina cadastrada ainda.",
            "fa-gears",
          );
    };

    const openForm = (machine) => {
      const body = openModal({
        title: machine ? `Editar ${machine.name}` : "Adicionar máquina",
        body: machineForm(machine ?? { muscleGroup: "PEITO" }),
      });
      body.querySelector("#machineForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const payload = Object.fromEntries(new FormData(form).entries());
        const submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
          if (machine) {
            await machineService.update(machine.id, payload);
            toast(`${payload.name} foi atualizada.`);
          } else {
            await machineService.create(payload);
            toast(`${payload.name} foi cadastrada.`);
          }
          closeModal();
          machinesPage.render(view);
        } catch (error) {
          submit.disabled = false;
          toast(error?.message ?? "Não foi possível salvar a máquina.", "error");
        }
      });
    };

    const showDetails = (machine) => {
      const body = openModal({
        title: machine.name,
        size: "lg",
        body: `
          <dl class="detail-grid">
            <div><dt>Agrupamento muscular</dt><dd>${muscleGroupLabel(machine.muscleGroup)}</dd></div>
            <div><dt>Fabricante</dt><dd>${escapeHtml(machine.manufacturer || "—")}</dd></div>
            <div><dt>Código do equipamento</dt><dd>#MC-${String(machine.id).padStart(4, "0")}</dd></div>
          </dl>
          <div class="modal-actions">
            <button class="btn btn--danger" type="button" id="deleteMachine"><i class="fa-solid fa-trash-can"></i> Excluir</button>
            <button class="btn btn--primary" type="button" id="editMachine"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
          </div>`,
      });
      body.querySelector("#editMachine").addEventListener("click", () => openForm(machine));
      body.querySelector("#deleteMachine").addEventListener("click", async (event) => {
        event.currentTarget.disabled = true;
        try {
          await machineService.remove(machine.id);
          closeModal();
          toast(`${machine.name} foi removida.`, "info");
          machinesPage.render(view);
        } catch (error) {
          event.currentTarget.disabled = false;
          toast(error?.message ?? "Não foi possível excluir a máquina.", "error");
        }
      });
    };

    view.querySelector("#machineSearch").addEventListener("input", (event) => {
      filters.search = event.target.value;
      paint();
    });
    view.querySelector("#machineGroup").addEventListener("change", (event) => {
      filters.group = event.target.value;
      paint();
    });
    view.querySelector("#machineManufacturer").addEventListener("change", (event) => {
      filters.manufacturer = event.target.value;
      paint();
    });
    view.querySelector("#addMachine").addEventListener("click", () => openForm(null));

    grid.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-machine]");
      if (!trigger) return;
      showDetails(machines.find((machine) => machine.id === Number(trigger.dataset.machine)));
    });

    view.querySelector("#machineSearch").value = filters.search;
    view.querySelector("#machineGroup").value = filters.group;
    view.querySelector("#machineManufacturer").value = filters.manufacturer;
    paint();
  },
};
