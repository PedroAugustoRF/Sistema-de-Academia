package model.dao;

import java.util.List;

import model.entities.Alunos;

public interface AlunosDAO {
	void insert(Alunos aluno);

	void update(Alunos aluno);

	void delete(Integer id);

	Alunos findById(Integer id);

	List<Alunos> findAll();
}
