package model.dao;

import java.util.List;

import model.entities.Exercicios;

public interface ExerciciosDAO {
	void insert(Exercicios exercicio);
	void delete(Integer id);
	List<Exercicios> findByTreino(Integer treinoId);
}
