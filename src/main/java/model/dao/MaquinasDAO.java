package model.dao;

import java.util.List;

import model.entities.Maquinas;
import model.enums.Agrupamento;

public interface MaquinasDAO {

	void insert(Maquinas maquina);

	void update(Maquinas maquina);

	void delete(Integer id);

	Maquinas findById(Integer id);

	List<Maquinas> findAll();

	List<Maquinas> findByAGroup(Agrupamento agrupamento);
}
