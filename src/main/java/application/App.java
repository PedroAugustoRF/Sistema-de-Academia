package application;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import model.dao.AlunosDAO;
import model.dao.ExerciciosDAO;
import model.dao.MaquinasDAO;
import model.dao.TreinoDAO;
import model.dao.implement.AlunosDAOHibernate;
import model.dao.implement.ExerciciosDAOHibernate;
import model.dao.implement.MaquinasDAOHibernate;
import model.dao.implement.TreinoDAOHibernate;
import model.entities.Alunos;
import model.entities.Exercicios;
import model.entities.Maquinas;
import model.entities.Treino;
import model.enums.Agrupamento;
import model.enums.DiasSemana;

public class App {
	public static Scanner sc = new Scanner(System.in);

	public static DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

	public static AlunosDAO alunosDAO = new AlunosDAOHibernate();
	public static MaquinasDAO maquinasDAO = new MaquinasDAOHibernate();
	public static TreinoDAO treinoDAO = new TreinoDAOHibernate();
	public static ExerciciosDAO exerciciosDAO = new ExerciciosDAOHibernate();

	public static void main(String[] args) {
		int opcao;

		do {
			System.out.println();
			System.out.println("  ╔════════════════════════════════════╗");
			System.out.println("  ║       SISTEMA DE ACADEMIA          ║");
			System.out.println("  ╠════════════════════════════════════╣");
			System.out.println("  ║  [1]  Gerenciar Alunos             ║");
			System.out.println("  ║  [2]  Gerenciar Maquinario         ║");
			System.out.println("  ║  [3]  Gerenciar Treinos            ║");
			System.out.println("  ║  [0]  Sair                         ║");
			System.out.println("  ╚════════════════════════════════════╝");
			System.out.print("  Escolha uma opcao: ");

			opcao = lerInt();

			switch (opcao) {

			case 1:
				menuAlunos();
				break;

			case 2:
				menuMaquinas();
				break;

			case 3:
				menuTreinos();
				break;

			case 0:
				System.out.println("\n  Ate logo!");
				break;

			default:
				System.out.println("\n  Opcao invalida.");
			}
		} while (opcao != 0);
		sc.close();
	}

	public static void menuAlunos() {
		int opcao;

		do {
			System.out.println();
			System.out.println("  ╔════════════════════════════════════╗");
			System.out.println("  ║          MENU DE ALUNOS            ║");
			System.out.println("  ╠════════════════════════════════════╣");
			System.out.println("  ║  [1]  Cadastrar Aluno              ║");
			System.out.println("  ║  [2]  Listar Alunos                ║");
			System.out.println("  ║  [3]  Buscar Aluno                 ║");
			System.out.println("  ║  [4]  Atualizar Aluno              ║");
			System.out.println("  ║  [5]  Remover Aluno                ║");
			System.out.println("  ║  [0]  Voltar                       ║");
			System.out.println("  ╚════════════════════════════════════╝");
			System.out.print("  Escolha uma opcao: ");

			opcao = lerInt();

			switch (opcao) {

			case 1:
				cadastrarAluno();
				break;

			case 2:
				listarAlunos();
				break;

			case 3:
				buscarAluno();
				break;

			case 4:
				atualizarAluno();
				break;

			case 5:
				removerAluno();
				break;

			case 0:
				break;

			default:
				System.out.println("\n  Opcao invalida.");
			}

		} while (opcao != 0);
	}

	public static void cadastrarAluno() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   CADASTRAR ALUNO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Nome: ");
		String nome = sc.nextLine();

		System.out.print("  CPF: ");
		String cpf = sc.nextLine();

		System.out.print("  Celular: ");
		String celular = sc.nextLine();

		LocalDate aniversario = null;

		while (aniversario == null) {

			System.out.print("  Data de nascimento: ");

			try {
				aniversario = LocalDate.parse(sc.nextLine(), FORMATO_DATA);
			}

			catch (DateTimeParseException e) {
				System.out.println("  Data invalida.");
			}
		}

		Alunos aluno = new Alunos(null, nome, cpf, celular, aniversario);

		alunosDAO.insert(aluno);

		System.out.println("\n  Aluno cadastrado!");
	}

	public static void listarAlunos() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   LISTA DE ALUNOS");
		System.out.println("  ══════════════════════════════════════");

		List<Alunos> alunos = alunosDAO.findAll();

		if (alunos.isEmpty()) {
			System.out.println("  Nenhum aluno cadastrado.");
			return;
		}

		System.out.printf("  %-5s %-25s %-15s %-15s %-12s%n", "ID", "NOME", "CPF", "CELULAR", "NASCIMENTO");

		System.out.println("  " + "-".repeat(80));

		for (Alunos aluno : alunos) {

			System.out.printf("  %-5d %-25s %-15s %-15s %-12s%n", aluno.getId(), aluno.getNome(), aluno.getCpf(),
					aluno.getCelular(), aluno.getAniversario().format(FORMATO_DATA));
		}
	}

	public static void buscarAluno() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   BUSCAR ALUNO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Matricula: ");

		Alunos aluno = alunosDAO.findById(lerInt());

		if (aluno == null) {
			System.out.println("  Aluno nao encontrado.");
			return;
		}

		System.out.println();
		System.out.println("  Nome: " + aluno.getNome());
		System.out.println("  CPF: " + aluno.getCpf());
		System.out.println("  Celular: " + aluno.getCelular());
		System.out.println("  Nascimento: " + aluno.getAniversario().format(FORMATO_DATA));
	}

	public static void atualizarAluno() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   ATUALIZAR ALUNO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Matricula: ");

		int id = lerInt();

		Alunos aluno = alunosDAO.findById(id);

		if (aluno == null) {
			System.out.println("  Aluno nao encontrado.");
			return;
		}

		System.out.print("  Novo nome: ");
		aluno.setNome(sc.nextLine());

		System.out.print("  Novo CPF: ");
		aluno.setCpf(sc.nextLine());

		System.out.print("  Novo celular: ");
		aluno.setCelular(sc.nextLine());

		alunosDAO.update(aluno);

		System.out.println("\n  Aluno atualizado!");
	}

	public static void removerAluno() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   REMOVER ALUNO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Matricula: ");

		int id = lerInt();

		Alunos aluno = alunosDAO.findById(id);

		if (aluno == null) {
			System.out.println("  Aluno nao encontrado.");
			return;
		}

		alunosDAO.delete(id);

		System.out.println("\n  Aluno removido!");
	}

	public static void menuMaquinas() {
		int opcao;

		do {
			System.out.println();
			System.out.println("  ╔════════════════════════════════════╗");
			System.out.println("  ║        MENU DE MAQUINARIO          ║");
			System.out.println("  ╠════════════════════════════════════╣");
			System.out.println("  ║  [1]  Cadastrar Maquina            ║");
			System.out.println("  ║  [2]  Listar Maquinas              ║");
			System.out.println("  ║  [0]  Voltar                       ║");
			System.out.println("  ╚════════════════════════════════════╝");
			System.out.print("  Escolha uma opcao: ");

			opcao = lerInt();

			switch (opcao) {

			case 1:
				cadastrarMaquina();
				break;

			case 2:
				listarMaquinas();
				break;

			case 0:
				break;

			default:
				System.out.println("\n  Opcao invalida.");
			}

		} while (opcao != 0);
	}

	public static void cadastrarMaquina() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   CADASTRAR MAQUINA");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Nome: ");
		String nome = sc.nextLine();

		System.out.print("  Fabricante: ");
		String fabricante = sc.nextLine();

		Agrupamento[] agrupamentos = Agrupamento.values();

		for (int i = 0; i < agrupamentos.length; i++) {
			System.out.printf("  [%d] %s%n", i + 1, agrupamentos[i]);
		}

		System.out.print("  Escolha o agrupamento: ");

		Agrupamento agrupamento = agrupamentos[lerInt() - 1];

		Maquinas maquina = new Maquinas(null, nome, agrupamento, fabricante);

		maquinasDAO.insert(maquina);

		System.out.println("\n  Maquina cadastrada!");
	}

	public static void listarMaquinas() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   LISTA DE MAQUINAS");
		System.out.println("  ══════════════════════════════════════");

		List<Maquinas> maquinas = maquinasDAO.findAll();

		if (maquinas.isEmpty()) {
			System.out.println("  Nenhuma maquina cadastrada.");
			return;
		}

		System.out.printf("  %-5s %-30s %-20s %-20s%n", "ID", "NOME", "AGRUPAMENTO", "FABRICANTE");

		System.out.println("  " + "-".repeat(90));

		for (Maquinas maquina : maquinas) {
			System.out.printf("  %-5d %-30s %-20s %-20s%n", maquina.getId(), maquina.getNome(),
					maquina.getAgrupamento(), maquina.getFabricante());
		}
	}

	public static void menuTreinos() {
		int opcao;

		do {
			System.out.println();
			System.out.println("  ╔════════════════════════════════════╗");
			System.out.println("  ║         MENU DE TREINOS            ║");
			System.out.println("  ╠════════════════════════════════════╣");
			System.out.println("  ║  [1]  Criar Treino                 ║");
			System.out.println("  ║  [2]  Imprimir Treino              ║");
			System.out.println("  ║  [3]  Salvar Treino                ║");
			System.out.println("  ║  [0]  Voltar                       ║");
			System.out.println("  ╚════════════════════════════════════╝");
			System.out.print("  Escolha uma opcao: ");

			opcao = lerInt();

			switch (opcao) {

			case 1:
				criarTreino();
				break;

			case 2:
				imprimirTreino();
				break;

			case 3:
				salvarTreino();
				break;

			case 0:
				break;

			default:
				System.out.println("\n  Opcao invalida.");
			}

		} while (opcao != 0);
	}

	public static void criarTreino() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   CRIAR TREINO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Matricula do aluno: ");

		int alunoId = lerInt();

		Alunos aluno = alunosDAO.findById(alunoId);

		if (aluno == null) {
			System.out.println("  Aluno nao encontrado.");
			return;
		}

		DiasSemana[] dias = DiasSemana.values();

		for (int i = 0; i < dias.length; i++) {
			System.out.printf("  [%d] %s%n", i + 1, dias[i]);
		}

		System.out.print("  Escolha o dia: ");

		DiasSemana dia = dias[lerInt() - 1];

		List<Exercicios> exercicios = new ArrayList<>();

		Treino treino = new Treino(null, aluno, dia, exercicios);

		boolean continuar = true;

		while (continuar) {
			Agrupamento[] agrupamentos = Agrupamento.values();

			for (int i = 0; i < agrupamentos.length; i++) {
				System.out.printf("  [%d] %s%n", i + 1, agrupamentos[i]);
			}

			System.out.print("  Escolha o agrupamento: ");

			Agrupamento agrupamento = agrupamentos[lerInt() - 1];

			List<Maquinas> maquinas = maquinasDAO.findByAGroup(agrupamento);

			for (int i = 0; i < maquinas.size(); i++) {
				System.out.printf("  [%d] %s%n", i + 1, maquinas.get(i).getNome());
			}

			System.out.print("  Escolha a maquina: ");

			Maquinas maquina = maquinas.get(lerInt() - 1);

			System.out.print("  Series: ");
			int series = lerInt();

			System.out.print("  Repeticoes: ");
			int repeticoes = lerInt();

			System.out.print("  Carga: ");
			double carga = lerDouble();

			Exercicios exercicio = new Exercicios(null, treino, maquina, series, repeticoes, carga);

			exercicios.add(exercicio);

			System.out.print("  Adicionar outro exercicio? (s/n): ");

			continuar = sc.nextLine().equalsIgnoreCase("s");
		}

		treino.setExercicios(exercicios);

		treinoDAO.insert(treino);

		System.out.println("\n  Treino salvo!");
	}

	public static void imprimirTreino() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   IMPRIMIR TREINO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Matricula do aluno: ");

		int alunoId = lerInt();

		Alunos aluno = alunosDAO.findById(alunoId);

		if (aluno == null) {
			System.out.println("  Aluno nao encontrado.");
			return;
		}

		List<Treino> treinos = treinoDAO.findByAluno(alunoId);

		if (treinos == null || treinos.isEmpty()) {
			System.out.println("  Nenhum treino encontrado.");
			return;
		}

		System.out.println();
		System.out.println("  ALUNO: " + aluno.getNome());
		System.out.println("  MATRICULA: " + aluno.getId());

		for (Treino treino : treinos) {
			System.out.println();
			System.out.println("  DIA: " + treino.getDiaSemana());

			System.out.println("  " + "-".repeat(60));

			System.out.printf("  %-30s %-8s %-8s %-8s%n", "MAQUINA", "SERIES", "REPS", "CARGA");

			System.out.println("  " + "-".repeat(60));

			List<Exercicios> exercicios = treino.getExercicios();

			if (exercicios == null || exercicios.isEmpty()) {
				System.out.println("  Nenhum exercicio.");
				continue;
			}

			for (Exercicios ex : exercicios) {
				System.out.printf("  %-30s %-8d %-8d %-8.1f%n", ex.getMaquina().getNome(), ex.getSeries(),
						ex.getRepeticoes(), ex.getCarga());
			}
		}
	}

	public static void salvarTreino() {
		System.out.println();
		System.out.println("  ══════════════════════════════════════");
		System.out.println("   SALVAR TREINO");
		System.out.println("  ══════════════════════════════════════");

		System.out.print("  Matricula do aluno: ");

		int alunoId = lerInt();

		Alunos aluno = alunosDAO.findById(alunoId);

		if (aluno == null) {
			System.out.println("  Aluno nao encontrado.");
			return;
		}

		List<Treino> treinos = treinoDAO.findByAluno(alunoId);

		if (treinos == null || treinos.isEmpty()) {
			System.out.println("  Nenhum treino encontrado.");
			return;
		}

		String nomeArquivo = "treino_" + aluno.getNome().replaceAll("\\s+", "_") + ".txt";

		try (PrintWriter pw = new PrintWriter(new FileWriter(nomeArquivo))) {
			pw.println("FICHA DE TREINO");
			pw.println();

			pw.println("Aluno: " + aluno.getNome());
			pw.println("Matricula: " + aluno.getId());

			for (Treino treino : treinos) {
				pw.println();
				pw.println("DIA: " + treino.getDiaSemana());

				for (Exercicios ex : treino.getExercicios()) {
					pw.println(ex.getMaquina().getNome() + " | " + ex.getSeries() + "x" + ex.getRepeticoes() + " | "
							+ ex.getCarga() + "kg");
				}
			}
			System.out.println("\n  Arquivo salvo: " + nomeArquivo);
		} catch (IOException e) {
			System.out.println("\n  Erro ao salvar arquivo.");
		}
	}

	public static int lerInt() {
		while (true) {
			try {
				return Integer.parseInt(sc.nextLine());
			} catch (NumberFormatException e) {
				System.out.print("  Digite um numero valido: ");
			}
		}
	}

	public static double lerDouble() {
		while (true) {
			try {
				return Double.parseDouble(sc.nextLine().replace(",", "."));
			} catch (NumberFormatException e) {
				System.out.print("  Digite um numero valido: ");
			}
		}
	}
}