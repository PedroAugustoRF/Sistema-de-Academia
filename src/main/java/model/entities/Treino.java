package model.entities;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import model.enums.DiasSemana;

@Entity
@Table(name = "treinos")
public class Treino implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "alunoid")
	private Alunos aluno;
	
	@Enumerated(EnumType.STRING)
	private DiasSemana diaSemana;
	
	@OneToMany(mappedBy = "treino",
			cascade = CascadeType.ALL,
			fetch = FetchType.EAGER)
	private List<Exercicios> exercicios;

	public Treino() {}
	public Treino(Integer id, Alunos aluno, DiasSemana diaSemana, List<Exercicios> exercicios) {
		this.id = id;
		this.aluno = aluno;
		this.diaSemana = diaSemana;
		this.exercicios = exercicios;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Alunos getAluno() {
		return aluno;
	}
	public void setAluno(Alunos aluno) {
		this.aluno = aluno;
	}
	
	public DiasSemana getDiaSemana() {
		return diaSemana;
	}
	public void setDiaSemana(DiasSemana diaSemana) {
		this.diaSemana = diaSemana;
	}
	
	public List<Exercicios> getExercicios() {
		return exercicios;
	}
	public void setExercicios(List<Exercicios> exercicios) {
		this.exercicios = exercicios;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Treino other = (Treino) obj;
		return Objects.equals(id, other.id);
	}
	
	@Override
	public String toString() {
		return "Treino:\nId: " + id + ", Aluno: " + aluno + ", Dia da Semana: " + diaSemana + ", Exercicios:" + exercicios;
	}
}