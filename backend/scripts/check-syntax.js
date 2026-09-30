import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = path.resolve(backendDir, "..");
const roots = [path.join(backendDir, "src"), path.join(projectDir, "public", "gym", "js")];

function javascriptFiles(directory) {
  return readdirSync(directory)
    .map((name) => path.join(directory, name))
    .flatMap((entry) => (statSync(entry).isDirectory() ? javascriptFiles(entry) : [entry]))
    .filter((entry) => entry.endsWith(".js"));
}

const files = roots.flatMap(javascriptFiles);

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
}

console.log(`Sintaxe validada em ${files.length} arquivos JavaScript.`);
