import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
export const envPath = path.resolve(configDirectory, "../../.env");

function parseValue(rawValue) {
  const value = rawValue.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replaceAll("\\n", "\n");
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }
  return value.replace(/\s+#.*$/, "").trim();
}

/**
 * Carrega o backend/.env com prioridade sobre variáveis globais do sistema.
 * Isso evita colisões comuns com nomes como DB_USER e DB_PASSWORD.
 */
export function loadEnvironment() {
  let content;
  try {
    content = readFileSync(envPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Arquivo de configuração não encontrado: ${envPath}. Copie backend/.env.example para backend/.env.`,
      );
    }
    throw error;
  }

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    process.env[match[1]] = parseValue(match[2]);
  }
}
