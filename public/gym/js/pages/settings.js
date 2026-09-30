import { gymService } from "../services.js";
import {
  DEFAULT_API_BASE_URL,
  getApiBaseUrl,
  isDemoMode,
  setApiBaseUrl,
  setDemoMode,
} from "../config.js";
import { escapeHtml, toast } from "../ui.js";

export const settingsPage = {
  title: "Configurações",
  subtitle: "Dados da academia e conexão com o servidor",

  async render(view) {
    const gym = await gymService.profile();
    const demo = isDemoMode();

    view.innerHTML = `
      <div class="grid-two">
        <section class="card panel">
          <div class="panel__head"><h3 class="panel__title">Dados da academia</h3></div>
          <form class="modal-form" id="gymForm">
            <div class="field field--full"><label for="gName">Nome da academia</label><input id="gName" name="name" value="${escapeHtml(gym.name)}" /></div>
            <div class="field"><label for="gEmail">E-mail de contato</label><input id="gEmail" name="email" type="email" value="${escapeHtml(gym.email)}" /></div>
            <div class="field"><label for="gPhone">Telefone</label><input id="gPhone" name="phone" value="${escapeHtml(gym.phone)}" /></div>
            <div class="field field--full"><label for="gAddress">Endereço</label><input id="gAddress" name="address" value="${escapeHtml(gym.address)}" /></div>
            <div class="field field--full"><label for="gHours">Horário de funcionamento</label><input id="gHours" name="openingHours" value="${escapeHtml(gym.openingHours)}" /></div>
            <div class="modal-actions field--full">
              <button class="btn btn--primary" type="submit"><i class="fa-solid fa-check"></i> Salvar informações</button>
            </div>
          </form>
          <p class="list__sub" style="margin-top:0.8rem">Estes dados ficam salvos neste navegador enquanto o servidor não oferecer um cadastro da academia.</p>
        </section>

        <section class="card panel">
          <div class="panel__head"><h3 class="panel__title">Conexão com o servidor</h3></div>
          <form class="modal-form" id="apiForm">
            <div class="field field--full">
              <label for="apiUrl">Endereço do servidor</label>
              <input id="apiUrl" name="apiUrl" value="${escapeHtml(getApiBaseUrl())}" placeholder="${DEFAULT_API_BASE_URL}" />
            </div>
            <div class="modal-actions field--full">
              <button class="btn btn--ghost" type="button" id="testApi"><i class="fa-solid fa-plug"></i> Testar conexão</button>
              <button class="btn btn--primary" type="submit"><i class="fa-solid fa-check"></i> Salvar endereço</button>
            </div>
          </form>

          <label class="list__row" style="cursor:pointer">
            <div class="list__main">
              <p class="list__title">Usar dados de demonstração</p>
              <p class="list__sub">Funciona sem servidor, apenas para apresentação. As alterações não são salvas no banco.</p>
            </div>
            <input class="form-check-input" type="checkbox" id="demoToggle" ${demo ? "checked" : ""} />
          </label>

          <div class="panel__head" style="margin-top:1.4rem"><h3 class="panel__title">Situação atual</h3></div>
          <div class="summary-line"><span>Modo</span><span id="modeLabel">${demo ? "Demonstração" : "Servidor real"}</span></div>
          <div class="summary-line"><span>Endereço</span><span>${escapeHtml(getApiBaseUrl())}</span></div>
          <div class="summary-line"><span>Estado</span><span id="apiState">Não verificado</span></div>
        </section>
      </div>`;

    view.querySelector("#gymForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      await gymService.saveProfile(payload);
      toast("Informações da academia salvas.");
    });

    view.querySelector("#apiForm").addEventListener("submit", (event) => {
      event.preventDefault();
      setApiBaseUrl(view.querySelector("#apiUrl").value);
      toast("Endereço do servidor atualizado.");
      settingsPage.render(view);
    });

    view.querySelector("#testApi").addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const state = view.querySelector("#apiState");
      const url = view.querySelector("#apiUrl").value.trim().replace(/\/+$/, "");
      button.disabled = true;
      state.textContent = "Verificando…";
      try {
        await gymService.checkConnection(url);
        state.textContent = "Conectado";
        toast("Conexão com o servidor funcionando.");
      } catch (error) {
        state.textContent = error?.status ? `Erro ${error.status}` : "Sem conexão";
        toast(error?.message ?? "Não foi possível conectar ao servidor.", "error");
      } finally {
        button.disabled = false;
      }
    });

    view.querySelector("#demoToggle").addEventListener("change", (event) => {
      setDemoMode(event.target.checked);
      toast(
        event.target.checked
          ? "Modo demonstração ativado."
          : "Modo demonstração desativado — usando o servidor real.",
        "info",
      );
      settingsPage.render(view);
    });
  },
};
