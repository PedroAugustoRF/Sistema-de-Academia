/**
 * Local sample repository (demo mode only).
 *
 * The records below mirror the exact table shape of the Sistema-de-Academia
 * backend so the UI behaves identically with or without a live API.
 * This data is NEVER used unless demo mode is explicitly enabled in
 * Configurações — real and sample data are never mixed silently.
 */

/**
 * Demo accounts — every one of them signs in with the password "demo123".
 * Demo mode is explicit (Configurações) and nothing here touches the database.
 */
export const DEMO_PASSWORD = "demo123";

export const usuarios = [
  { id: 1, nome: "Rafael Costa", cpf: null, email: "admin@gymcontrol.com", celular: null, aniversario: null, cargo: "administrador" },
  { id: 2, nome: "Carla Mendes", cpf: null, email: "carla@gymcontrol.com", celular: "+55 11 97700-1122", aniversario: "1989-02-18", cargo: "professor" },
  { id: 3, nome: "Lucas Almeida", cpf: "398.221.470-11", email: "lucas@gymcontrol.com", celular: "+55 11 98812-4410", aniversario: "1994-03-12", cargo: "aluno" },
  { id: 4, nome: "Gabriel Santos", cpf: "512.884.330-07", email: "gabriel@gymcontrol.com", celular: "+55 11 99741-2093", aniversario: "1998-07-22", cargo: "aluno" },
  { id: 5, nome: "Mariana Oliveira", cpf: "704.115.980-46", email: "mariana@gymcontrol.com", celular: "+55 21 98430-7715", aniversario: "1991-11-02", cargo: "aluno" },
  { id: 6, nome: "João Henrique", cpf: "228.640.190-58", email: "joao@gymcontrol.com", celular: "+55 31 99120-8834", aniversario: "1986-05-30", cargo: "aluno" },
  { id: 7, nome: "Ana Beatriz", cpf: "845.339.220-63", email: "ana@gymcontrol.com", celular: "+55 41 98255-6602", aniversario: "2000-09-14", cargo: "aluno" },
];

export const maquinas = [
  { id: 1, nome: "Leg Press 45°", agrupamento: "QUADRICEPS", fabricante: "Movement" },
  { id: 2, nome: "Supino Máquina", agrupamento: "PEITO", fabricante: "Life Fitness" },
  { id: 3, nome: "Puxada Alta", agrupamento: "COSTAS", fabricante: "Technogym" },
  { id: 4, nome: "Desenvolvimento", agrupamento: "OMBRO", fabricante: "Movement" },
  { id: 5, nome: "Crossover", agrupamento: "PEITO", fabricante: "Technogym" },
  { id: 6, nome: "Cadeira Extensora", agrupamento: "QUADRICEPS", fabricante: "Righetto" },
  { id: 7, nome: "Remada Sentada", agrupamento: "COSTAS", fabricante: "Life Fitness" },
  { id: 8, nome: "Mesa Flexora", agrupamento: "POSTERIOR_COXA", fabricante: "Righetto" },
  { id: 9, nome: "Rosca Scott", agrupamento: "BICEPS", fabricante: "Movement" },
  { id: 10, nome: "Tríceps Pulley", agrupamento: "TRICEPS", fabricante: "Technogym" },
];

export const treinos = [
  { id: 1, usuarioid: 3, diaSemana: "SEGUNDA" },
  { id: 2, usuarioid: 4, diaSemana: "TERCA" },
  { id: 3, usuarioid: 5, diaSemana: "QUARTA" },
  { id: 4, usuarioid: 7, diaSemana: "QUINTA" },
];

export const exercicios = [
  { id: 1, treinoid: 1, maquinaid: 2, series: 4, repeticoes: 10, carga: 45 },
  { id: 2, treinoid: 1, maquinaid: 3, series: 4, repeticoes: 12, carga: 50 },
  { id: 3, treinoid: 1, maquinaid: 1, series: 4, repeticoes: 10, carga: 160 },
  { id: 4, treinoid: 2, maquinaid: 7, series: 3, repeticoes: 12, carga: 40 },
  { id: 5, treinoid: 2, maquinaid: 6, series: 3, repeticoes: 15, carga: 35 },
  { id: 6, treinoid: 3, maquinaid: 4, series: 5, repeticoes: 6, carga: 35 },
  { id: 7, treinoid: 3, maquinaid: 5, series: 4, repeticoes: 12, carga: 15 },
  { id: 8, treinoid: 4, maquinaid: 9, series: 3, repeticoes: 12, carga: 20 },
];
