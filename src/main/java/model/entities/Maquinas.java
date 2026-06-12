package model.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import model.enums.Agrupamento;

@Entity
@Table(name = "maquinas")
public class Maquinas implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String nome;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Agrupamento agrupamento;

	private String fabricante;

	public Maquinas() {}
	public Maquinas(Integer id, String nome, Agrupamento agrupamento, String fabricante) {
		this.id = id;
		this.nome = nome;
		this.agrupamento = agrupamento;
		this.fabricante = fabricante;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public Agrupamento getAgrupamento() {
		return agrupamento;
	}
	public void setAgrupamento(Agrupamento agrupamento) {
		this.agrupamento = agrupamento;
	}
	
	public String getFabricante() {
		return fabricante;
	}
	public void setFabricante(String fabricante) {
		this.fabricante = fabricante;
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
		Maquinas other = (Maquinas) obj;
		return Objects.equals(id, other.id);
	}

	public String toString() {
		return nome;
	}
}