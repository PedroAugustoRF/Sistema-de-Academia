-- ============================================================================
-- GymControl / Sistema de Academia — esquema completo do banco MySQL
-- Execute uma vez:  mysql -u root -p < database/schema.sql
-- ============================================================================

CREATE DATABASE IF NOT EXISTS academia
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academia;

-- Todas as pessoas que usam o sistema (administrador, professor, aluno).
-- A senha é SEMPRE um hash bcrypt gerado pelo backend; nunca texto puro.
CREATE TABLE IF NOT EXISTS usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    cpf         VARCHAR(14)  NULL UNIQUE,
    email       VARCHAR(150) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    celular     VARCHAR(20)  NULL,
    aniversario DATE         NULL,
    cargo       ENUM('administrador', 'professor', 'aluno') NOT NULL DEFAULT 'aluno'
);

CREATE TABLE IF NOT EXISTS maquinas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    agrupamento ENUM('PEITO','COSTAS','OMBRO','BICEPS','TRICEPS','ANTEBRACO',
                     'ABDOMEN','QUADRICEPS','POSTERIOR_COXA','GLUTEO','PANTURRILHA') NOT NULL,
    fabricante  VARCHAR(150) NULL
);

-- Uma ficha de treino pertence a um usuário (aluno) e a um dia da semana.
CREATE TABLE IF NOT EXISTS treinos (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    usuarioid INT NOT NULL,
    diaSemana ENUM('SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO','DOMINGO') NOT NULL,
    CONSTRAINT fk_treinos_usuario FOREIGN KEY (usuarioid)
        REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercicios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    treinoid   INT NOT NULL,
    maquinaid  INT NOT NULL,
    series     INT NOT NULL DEFAULT 1,
    repeticoes INT NOT NULL DEFAULT 1,
    carga      DECIMAL(6,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_exercicios_treino  FOREIGN KEY (treinoid)  REFERENCES treinos(id)  ON DELETE CASCADE,
    CONSTRAINT fk_exercicios_maquina FOREIGN KEY (maquinaid) REFERENCES maquinas(id)
);

-- Não há INSERT de usuários aqui de propósito: o primeiro administrador é
-- criado via POST /usuarios (bootstrap) para que a senha passe pelo bcrypt.
