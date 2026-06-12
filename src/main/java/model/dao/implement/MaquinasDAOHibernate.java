package model.dao.implement;

import java.util.List;

import jakarta.persistence.EntityManager;
import model.dao.JPAFactory;
import model.dao.MaquinasDAO;
import model.entities.Maquinas;
import model.enums.Agrupamento;

public class MaquinasDAOHibernate implements MaquinasDAO {

	@Override
	public void insert(Maquinas maquina) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			em.getTransaction().begin();
			em.persist(maquina);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public void update(Maquinas maquina) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			em.getTransaction().begin();
			em.merge(maquina);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public void delete(Integer id) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			em.getTransaction().begin();
			Maquinas maquina = em.find(Maquinas.class, id);
			em.remove(maquina);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public Maquinas findById(Integer id) {
		EntityManager em = JPAFactory.getEntityManager();
		try {
			return em.find(Maquinas.class, id);
		} finally {
			em.close();
		}
	}

	@Override
	public List<Maquinas> findAll() {
		EntityManager em = JPAFactory.getEntityManager();
		try {
			return em.createQuery("FROM Maquinas", Maquinas.class)
					.getResultList();
		} finally {
			em.close();
		}
	}

	@Override
	public List<Maquinas> findByAGroup(Agrupamento agrupamento) {
		EntityManager em = JPAFactory.getEntityManager();
		try {
			return em.createQuery("FROM Maquinas WHERE agrupamento = :agrupamento", Maquinas.class)
					.setParameter("agrupamento", agrupamento)
					.getResultList();
		} finally {
			em.close();
		}
	}

}
