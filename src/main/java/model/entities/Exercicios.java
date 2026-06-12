package model.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "exercicios")
public class Exercicios implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "treinoid")
	private Treino treino;
	
	@ManyToOne
	@JoinColumn(name = "maquinaid")
	private Maquinas maquina;
	
	private Integer series;
	private Integer repeticoes;
	private Double carga;
	
	public Exercicios() {}
	
	
	public Exercicios(Integer id, Treino treino, Maquinas maquina, Integer series, Integer repeticoes, Double carga) {
		this.id = id;
		this.treino = treino;
		this.maquina = maquina;
		this.series = series;
		this.repeticoes = repeticoes;
		this.carga = carga;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}

	public Treino getTreino() {
		return treino;
	}
	public void setTreino(Treino treino) {
		this.treino = treino;
	}

	public Maquinas getMaquina() {
		return maquina;
	}
	public void setMaquina(Maquinas maquina) {
		this.maquina = maquina;
	}

	public Integer getSeries() {
		return series;
	}
	public void setSeries(Integer series) {
		this.series = series;
	}

	public Integer getRepeticoes() {
		return repeticoes;
	}
	public void setRepeticoes(Integer repeticoes) {
		this.repeticoes = repeticoes;
	}

	public Double getCarga() {
		return carga;
	}
	public void setCarga(Double carga) {
		this.carga = carga;
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
		Exercicios other = (Exercicios) obj;
		return Objects.equals(id, other.id);
	}
	
	@Override
	public String toString() {
		return "Exercicios:\nId:" + id + ", Treino: " + treino + ", Séries: " + series + ", Repetições: " + repeticoes + ", Carga: " + carga;
	}
}
