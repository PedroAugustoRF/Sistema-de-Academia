package model.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JPAFactory {
	private static EntityManagerFactory emf = Persistence.createEntityManagerFactory("academia");
	
	public static EntityManager getEntityManager() {
		return emf.createEntityManager();
	}
}
