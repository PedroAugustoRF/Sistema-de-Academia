package model.dao;

import java.util.List;

import model.entities.Treino;
import model.enums.DiasSemana;

public interface TreinoDAO {
	void insert(Treino treino);
	void update(Treino treino);
	void delete(Integer id);
	Treino findById(Integer id);
	List<Treino> findByAluno(Integer alunoId);
	List<Treino> findByAlunoDia(Integer alunoId, DiasSemana dia);
}
