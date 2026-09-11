# Sistema de Academia — API (Java/Spring Boot)

Versão em Java do projeto de controle de academia, desenvolvida como parte de um trabalho em grupo (versão principal do projeto está em JavaScript). Esta versão serve como estudo prático de Spring Boot.

## 🎯 Sobre o projeto

API REST para gerenciamento de uma academia, com controle de usuários (alunos, professores e administradores) e seus respectivos treinos.

## 📋 Funcionalidades

- CRUD de usuários (Create, Read, Update, Delete)
- Controle de cargo por usuário (`ALUNO`, `PROFESSOR`, `ADMINISTRADOR`)
- Endpoints REST testados via Postman

## 🚀 Endpoints disponíveis

| Método | Rota            | Descrição                    |
|--------|-----------------|-------------------------------|
| POST   | `/usuarios`     | Cadastra um novo usuário      |
| GET    | `/usuarios`     | Lista todos os usuários       |
| GET    | `/usuarios/{id}`| Busca um usuário por ID       |
| PUT    | `/usuarios/{id}`| Atualiza um usuário existente |
| DELETE | `/usuarios/{id}`| Remove um usuário             |

## ▶️ Como rodar o projeto

1. Clone o repositório
2. Abra no IntelliJ (ou sua IDE de preferência)
3. Rode a classe `AcademiaApplication`
4. A API sobe em `http://localhost:8080`
