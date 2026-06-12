-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: academia
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos` (
  `aniversario` date DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `celular` varchar(255) DEFAULT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
INSERT INTO `alunos` VALUES ('2003-05-14',1,'62998124001','53148291001','Pedro Augusto Ribeiro'),('2001-11-02',2,'62998124002','19482033002','Lucas Henrique Silva'),('1998-02-18',3,'62998124003','77492011003','Marcos Vinicius Souza'),('2000-09-30',4,'62998124004','11928374004','Joao Gabriel Mendes'),('1997-06-22',5,'62998124005','88492011005','Carlos Eduardo Lima'),('2002-01-13',6,'62998124006','11293847006','Matheus Ferreira Alves'),('1999-03-08',7,'62998124007','77492033007','Gabriel Rodrigues Costa'),('2004-04-19',8,'62998124008','92837465008','Felipe Augusto Rocha'),('2001-07-25',9,'62998124009','18273645009','Rafael Oliveira Santos'),('1996-10-11',10,'62998124010','91827364010','Thiago Henrique Martins'),('1995-08-14',11,'62998124011','82736455011','Bruno Henrique Castro'),('2000-12-02',12,'62998124012','91827364012','Vinicius Moraes Ribeiro'),('1998-06-16',13,'62998124013','56473829013','Anderson Pereira Silva'),('2003-09-28',14,'62998124014','83726194014','Diego Fernandes Rocha'),('1997-02-05',15,'62998124015','92837465015','Leonardo Gomes Freitas'),('2005-01-20',16,'62998124016','74638291016','Ricardo Augusto Lima'),('2001-03-15',17,'62998124017','91827364017','Caio Henrique Souza'),('1999-05-09',18,'62998124018','84736251018','Eduardo Santana Costa'),('2002-07-12',19,'62998124019','92837465019','Murilo Almeida Ribeiro'),('1998-11-30',20,'62998124020','19283746020','Paulo Vitor Mendes'),('2000-02-01',21,'62998124021','91827364021','Arthur Henrique Lopes'),('2003-08-17',22,'62998124022','84736251022','Gustavo Martins Rocha'),('1997-04-27',23,'62998124023','73645182023','Renato Oliveira Castro'),('1996-06-08',24,'62998124024','82736451024','Samuel Henrique Lima'),('2004-09-03',25,'62998124025','91827364025','Daniel Augusto Souza'),('1999-12-11',26,'62998124026','19283746026','Fernando Gomes Silva'),('2002-01-29',27,'62998124027','73645182027','Igor Vinicius Costa'),('2001-05-06',28,'62998124028','84736251028','Julio Cesar Mendes'),('1998-10-18',29,'62998124029','91827364029','Kevin Augusto Rocha'),('1995-07-24',30,'62998124030','73645182030','Leandro Henrique Alves'),('2000-03-14',31,'62998124031','91827364031','Marcelo Vinicius Ribeiro'),('1997-08-09',32,'62998124032','73645182032','Nathan Oliveira Lima'),('2002-02-22',33,'62998124033','84736251033','Otavio Henrique Silva'),('2001-09-01',34,'62998124034','91827364034','Patrick Souza Costa'),('1996-04-13',35,'62998124035','73645182035','Roberto Almeida Rocha'),('2004-05-17',36,'62998124036','91827364036','Alexandre Gomes Castro'),('1999-07-26',37,'62998124037','84736251037','Cristiano Henrique Lima'),('2000-10-05',38,'62998124038','73645182038','Douglas Ferreira Souza'),('1998-12-20',39,'62998124039','91827364039','Everton Augusto Santos'),('2001-01-07',40,'62998124040','84736251040','Fabricio Oliveira Mendes');
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercicios`
--

DROP TABLE IF EXISTS `exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercicios` (
  `carga` double DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `maquinaid` int DEFAULT NULL,
  `repeticoes` int DEFAULT NULL,
  `series` int DEFAULT NULL,
  `treinoid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrt10kvjbrd92n59s8w3m71ixt` (`maquinaid`),
  KEY `FKlbadq7uowg6ark7tmvl55jku2` (`treinoid`),
  CONSTRAINT `FKlbadq7uowg6ark7tmvl55jku2` FOREIGN KEY (`treinoid`) REFERENCES `treinos` (`id`),
  CONSTRAINT `FKrt10kvjbrd92n59s8w3m71ixt` FOREIGN KEY (`maquinaid`) REFERENCES `maquinas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
INSERT INTO `exercicios` VALUES (40,1,1,12,4,1),(45,2,2,10,4,1),(30,3,4,12,3,1),(25,4,5,15,3,1),(50,5,39,8,4,1),(70,6,7,12,4,2),(80,7,9,10,4,2),(75,8,10,10,4,2),(85,9,11,8,4,2),(60,10,38,12,4,2),(180,11,13,12,4,3),(90,12,16,10,4,3),(80,13,17,12,4,3),(120,14,15,8,4,3),(100,15,40,12,4,3),(35,16,25,12,4,4),(18,17,27,15,4,4),(30,18,26,10,4,4),(40,19,28,12,4,5),(35,20,29,10,4,5),(20,21,30,12,4,5),(45,22,31,12,4,6),(35,23,32,10,4,6),(40,24,33,12,4,6),(70,25,20,15,4,7),(65,26,21,15,4,7),(60,27,22,15,4,7),(20,28,34,20,4,8),(0,29,36,60,3,8),(15,30,35,20,4,8),(220,31,13,10,5,9),(140,32,14,8,5,9),(150,33,15,8,5,9),(110,34,18,10,5,9),(160,35,19,6,5,9),(60,36,1,12,4,10),(80,37,7,12,4,10),(180,38,13,12,4,10),(30,39,25,15,4,10),(40,40,31,12,4,10),(120,41,20,15,4,11),(100,42,21,15,4,11),(90,43,22,15,4,11),(80,44,17,12,4,11),(70,45,24,15,4,11),(50,46,1,12,5,12),(90,47,7,10,5,12),(200,48,13,10,5,12),(45,49,25,12,5,12),(50,50,28,12,5,12);
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maquinas`
--

DROP TABLE IF EXISTS `maquinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maquinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fabricante` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `agrupamento` enum('ABDOMEN','ANTEBRACO','BICEPS','COSTAS','GLUTEO','OMBRO','PANTURRILHA','PEITO','POSTERIOR_COXA','QUADRICEPS','TRICEPS') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maquinas`
--

LOCK TABLES `maquinas` WRITE;
/*!40000 ALTER TABLE `maquinas` DISABLE KEYS */;
INSERT INTO `maquinas` VALUES (1,'Movement','Supino Reto','PEITO'),(2,'Movement','Supino Inclinado','PEITO'),(3,'Hammer','Supino Declinado','PEITO'),(4,'Kikos','Crucifixo','PEITO'),(5,'Lion','Cross Over','PEITO'),(6,'Movement','Peck Deck','PEITO'),(7,'Movement','Puxada Frontal','COSTAS'),(8,'Kikos','Pulldown','COSTAS'),(9,'Lion','Remada Baixa','COSTAS'),(10,'Hammer','Remada Articulada','COSTAS'),(11,'Movement','Remada Cavalinho','COSTAS'),(12,'Kikos','Barra Fixa Assistida','COSTAS'),(13,'Movement','Leg Press 45','QUADRICEPS'),(14,'Hammer','Hack Squat','QUADRICEPS'),(15,'Lion','Agachamento Smith','QUADRICEPS'),(16,'Kikos','Cadeira Extensora','QUADRICEPS'),(17,'Movement','Mesa Flexora','POSTERIOR_COXA'),(18,'Hammer','Stiff Guiado','POSTERIOR_COXA'),(19,'Movement','Levantamento Terra','POSTERIOR_COXA'),(20,'Movement','Gluteo Machine','GLUTEO'),(21,'Kikos','Cadeira Abdutora','GLUTEO'),(22,'Movement','Cadeira Adutora','GLUTEO'),(23,'Movement','Panturrilha em Pe','PANTURRILHA'),(24,'Kikos','Panturrilha Sentado','PANTURRILHA'),(25,'Movement','Desenvolvimento','OMBRO'),(26,'Hammer','Arnold Press','OMBRO'),(27,'Kikos','Elevacao Lateral','OMBRO'),(28,'Movement','Rosca Direta','BICEPS'),(29,'Kikos','Rosca Scott','BICEPS'),(30,'Movement','Rosca Martelo','BICEPS'),(31,'Movement','Triceps Pulley','TRICEPS'),(32,'Hammer','Triceps Frances','TRICEPS'),(33,'Movement','Triceps Testa','TRICEPS'),(34,'Movement','Abdominal Maquina','ABDOMEN'),(35,'Kikos','Banco Abdominal','ABDOMEN'),(36,'Movement','Prancha','ABDOMEN'),(37,'Kikos','Flexao de Punho','ANTEBRACO'),(38,'Movement','Remada Unilateral','COSTAS'),(39,'Lion','Chest Press','PEITO'),(40,'Movement','Passada Guiada','QUADRICEPS');
/*!40000 ALTER TABLE `maquinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treinos`
--

DROP TABLE IF EXISTS `treinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treinos` (
  `alunoid` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `diaSemana` enum('DOMINGO','QUARTA','QUINTA','SABADO','SEGUNDA','SEXTA','TERCA') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe566psk5b30nnq0g4oaflknbv` (`alunoid`),
  CONSTRAINT `FKe566psk5b30nnq0g4oaflknbv` FOREIGN KEY (`alunoid`) REFERENCES `alunos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treinos`
--

LOCK TABLES `treinos` WRITE;
/*!40000 ALTER TABLE `treinos` DISABLE KEYS */;
INSERT INTO `treinos` VALUES (1,1,'SEGUNDA'),(1,2,'QUARTA'),(1,3,'SEXTA'),(2,4,'TERCA'),(2,5,'QUINTA'),(2,6,'SABADO'),(3,7,'SEGUNDA'),(3,8,'QUARTA'),(3,9,'SEXTA'),(4,10,'SEGUNDA'),(4,11,'TERCA'),(4,12,'QUINTA'),(5,13,'QUARTA'),(5,14,'SEXTA'),(6,15,'SEGUNDA'),(6,16,'QUARTA'),(6,17,'SEXTA'),(7,18,'TERCA'),(7,19,'QUINTA'),(8,20,'SEGUNDA'),(8,21,'QUARTA'),(8,22,'SEXTA'),(9,23,'SEGUNDA'),(9,24,'QUINTA'),(10,25,'TERCA'),(10,26,'SEXTA'),(11,27,'SEGUNDA'),(11,28,'QUARTA'),(11,29,'SEXTA'),(12,30,'TERCA'),(12,31,'QUINTA'),(13,32,'SEGUNDA'),(13,33,'QUARTA'),(14,34,'TERCA'),(14,35,'SEXTA'),(15,36,'SEGUNDA'),(15,37,'QUARTA'),(15,38,'SEXTA'),(16,39,'SEGUNDA'),(16,40,'QUINTA');
/*!40000 ALTER TABLE `treinos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10 12:09:10
