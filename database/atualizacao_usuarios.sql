-- Caso a tabela já exista como "alunos"/"usuarios" sem as colunas novas,
-- rode estes ALTERs (ajuste os nomes de coluna se já existir algo parecido):

ALTER TABLE usuarios
    ADD COLUMN email VARCHAR(150) NOT NULL UNIQUE,
    ADD COLUMN senha VARCHAR(255) NOT NULL,
    ADD COLUMN cargo ENUM('administrador', 'professor', 'aluno') NOT NULL DEFAULT 'aluno';

-- Caso precise criar a tabela do zero, use esta definição de referência:

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    celular VARCHAR(20),
    aniversario DATE,
    cargo ENUM('administrador', 'professor', 'aluno') NOT NULL DEFAULT 'aluno'
);
