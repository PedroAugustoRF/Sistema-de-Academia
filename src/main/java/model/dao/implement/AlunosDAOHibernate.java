package model.dao.implement;

import java.util.List;

import jakarta.persistence.EntityManager;
import model.dao.AlunosDAO;
import model.dao.JPAFactory;
import model.entities.Alunos;

public class AlunosDAOHibernate implements AlunosDAO {

	@Override
	public void insert(Alunos aluno) {
		EntityManager em = JPAFactory.getEntityManager();
		
		try {
			em.getTransaction().begin();
			em.persist(aluno);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public void update(Alunos aluno) {
		EntityManager em = JPAFactory.getEntityManager();
		
		try {
			em.getTransaction().begin();
			em.merge(aluno);
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
			Alunos aluno = em.find(Alunos.class, id);
			em.remove(aluno);
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw e;
		} finally {
			em.close();
		}
	}

	@Override
	public Alunos findById(Integer id) {
		EntityManager em = JPAFactory.getEntityManager();
		
		try {
			return em.find(Alunos.class, id);
		} finally {
			em.close();
		}
	}

	@Override
	public List<Alunos> findAll() {
		EntityManager em = JPAFactory.getEntityManager();
		
		try {
			return em.createQuery("FROM Alunos", Alunos.class)
					.getResultList();
		} finally {
			em.close();
		}
	}

}
