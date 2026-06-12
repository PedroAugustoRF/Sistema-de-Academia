package model.dao.implement;

import java.util.List;

import jakarta.persistence.EntityManager;
import model.dao.ExerciciosDAO;
import model.dao.JPAFactory;
import model.entities.Exercicios;

public class ExerciciosDAOHibernate implements ExerciciosDAO {

	@Override
	public void insert(Exercicios exercicio) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			em.getTransaction().begin();
			em.persist(exercicio);
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
			Exercicios exercicio = em.find(Exercicios.class, id);
			em.remove(exercicio);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public List<Exercicios> findByTreino(Integer treinoId) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			return em.createQuery("FROM Exercicios e WHERE e.treino.id = :treinoId", Exercicios.class)
					.setParameter("treinoId", treinoId)
					.getResultList();
		} finally {
			em.close();
		}
	}
}
