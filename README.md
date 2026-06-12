# Sistema de Academia

Sistema desenvolvido em Java para gerenciamento de academia, utilizando JPA/Hibernate com persistência em banco de dados MySQL.

O projeto foi criado com foco em organização em camadas, manipulação de entidades relacionais e aplicação prática de conceitos de persistência utilizando Maven.

---

# Tecnologias Utilizadas

* Java 21
* Maven
* Hibernate
* JPA
* MySQL
* Eclipse IDE

---

# Funcionalidades

* Cadastro de alunos
* Cadastro de máquinas
* Cadastro de exercícios
* Criação de treinos personalizados
* Associação de exercícios aos treinos
* Organização de treinos por dia da semana
* Persistência de dados com Hibernate/JPA
* Relacionamentos entre entidades

---

# Estrutura do Projeto

```txt
src/
 ├── application/
 ├── model/
 │    ├── dao/
 │    ├── entities/
 │    └── enums/
```

O projeto segue uma arquitetura em camadas simples utilizando:

* DAO Pattern
* Entidades JPA
* Factory para EntityManager
* Separação entre regras de persistência e aplicação

---

# Configuração do Banco de Dados

1. Crie um banco MySQL.

2. Execute o script:

```sql
academia.sql
```

3. Configure usuário e senha do banco no arquivo:

```txt
persistence.xml
```

---

# Como Executar

## Clonar o repositório

```bash
git clone <url-do-repositorio>
```

## Importar no Eclipse

```txt
File > Import > Existing Maven Projects
```

## Atualizar dependências Maven

```txt
Botão direito no projeto > Maven > Update Project
```

## Executar

Execute a classe:

```txt
App.java
```

---

# Conceitos Aplicados

* JPA
* Hibernate ORM
* Relacionamentos entre entidades
* DAO Pattern
* Maven
* Persistência de dados
* Transações
* Enumeração em banco de dados
* Cascade
* Fetch Types

---

# Objetivo do Projeto

O projeto foi desenvolvido com o objetivo de praticar:

* persistência com Hibernate/JPA;
* modelagem de entidades;
* organização de projetos Java;
* manipulação de banco de dados relacional;
* arquitetura em camadas.

---

# Autores

Eduardo Santana Cruz Almeida
Erik Antonio Rodrigues Pires
Lucas Marques Oliveira
Pedro Augusto Ribeiro Ferreira
Rubio Filho Almeida da Silva
