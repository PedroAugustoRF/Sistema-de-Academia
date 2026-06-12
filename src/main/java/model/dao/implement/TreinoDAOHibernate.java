package model.dao.implement;

import java.util.List;

import jakarta.persistence.EntityManager;
import model.dao.JPAFactory;
import model.dao.TreinoDAO;
import model.entities.Treino;
import model.enums.DiasSemana;

public class TreinoDAOHibernate implements TreinoDAO {

	@Override
	public void insert(Treino treino) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			em.getTransaction().begin();
			em.persist(treino);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public void update(Treino treino) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			em.getTransaction().begin();
			em.merge(treino);
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
			Treino treino = em.find(Treino.class, id);
			em.remove(treino);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public Treino findById(Integer id) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			return em.find(Treino.class, id);
		} finally {
			em.close();
		}
	}

	@Override
	public List<Treino> findByAluno(Integer alunoId) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			return em.createQuery("FROM Treino t WHERE t.aluno.id = :alunoId", Treino.class)
					.setParameter("alunoId", alunoId)
					.getResultList();
		} finally {
			em.close();
		}
	}

	@Override
	public List<Treino> findByAlunoDia(Integer alunoId, DiasSemana dia) {
		EntityManager em = JPAFactory.getEntityManager();

		try {
			return em.createQuery("FROM Treino t WHERE t.aluno.id = :alunoId AND t.diaSemana = :dia", Treino.class)
					.setParameter("alunoId", alunoId)
					.setParameter("dia", dia)
					.getResultList();
		} finally {
			em.close();
		}
	}
}
