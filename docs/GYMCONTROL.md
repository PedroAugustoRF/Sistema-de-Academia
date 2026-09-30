# GymControl — Documentação

Sistema de gestão de academia. O front-end (GymControl) é uma aplicação estática em
HTML/CSS/JavaScript (sem framework) que conversa, via Fetch API, com o backend
**Sistema-de-Academia** (Node.js + Express + MySQL).

```text
Navegador (GymControl)  ──HTTP/JSON──▶  API REST (Express, :3000)  ──mysql2──▶  MySQL (academia)
        │                                     │
        └── nunca acessa o banco              └── bcrypt, JWT, regras por cargo
```

## 1. Estrutura

```text
public/gym/                     # Front-end (servido como arquivos estáticos)
  index.html                    # Shell do app (sidebar, topbar, modal, toasts, WhatsApp)
  login.html                    # Tela de login
  css/style.css                 # Design system (charcoal/orange, Barlow Condensed + Inter)
  js/app.js                     # Guarda de autenticação, rotas (#/…), sidebar por cargo
  js/login.js                   # Controlador da tela de login
  js/config.js                  # URL da API, modo demo e sessão (localStorage)
  js/ui.js                      # Modal, toast, estados vazio/erro/carregando, helpers
  js/services.js                # Ponto único de importação dos serviços
  js/data.js                    # Dados do modo demonstração (nunca vão para o banco)
  js/api/apiClient.js           # Único lugar com fetch(): headers, JWT, timeout, erros
  js/api/authService.js         # login / logout / getCurrentUser / refreshCurrentUser
  js/api/userService.js         # userService, studentService, teacherService
  js/api/machineService.js      # /maquinas
  js/api/workoutService.js      # /treinos + /exercicios
  js/api/gymService.js          # estatísticas do painel, perfil local, teste de conexão
  js/api/mappers.js             # tradução backend (pt-BR) ⇄ UI
  js/api/mockRepository.js      # implementação em memória usada só no modo demo
  js/pages/                     # dashboard, users, students, workouts, myWorkouts, machines, settings

backend/                        # API REST (Sistema-de-Academia adaptado)
  src/application/app.js        # Express, CORS, rotas, tratamento de erros
  src/routes/*.js               # usuarios, treinos, exercicios, maquinas (+ middlewares por rota)
  src/controllers/*.js          # regras de negócio e respostas HTTP
  src/dao/*.js                  # SQL (mysql2/promise)
  src/middlewares/auth.js       # autenticar (JWT), autorizarCargos, hierarquia de cargos
  src/database/Connection.js    # pool MySQL lido de variáveis de ambiente
  database/schema.sql           # criação do banco `academia`
  .env.example                  # modelo de configuração
```

## 2. Como executar

### Banco de dados (MySQL/MariaDB)

```bash
mysql -u root -p < backend/database/schema.sql     # cria o banco `academia` e as tabelas
```

### Backend

```bash
# Execute a partir da raiz do projeto
cp backend/.env.example backend/.env
# ajuste DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME e JWT_SECRET
npm install
npm run check
npm test
npm run check:db
npm run dev                   # aplicação: http://localhost:3000/gym/
```

Variáveis (`backend/.env`): `PORT=3000`, `DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER=root`,
`DB_PASSWORD=…`, `DB_NAME=academia`, `JWT_SECRET=…`. Nenhuma dessas credenciais existe no
front-end: o navegador só conhece a URL da API.

`PORT=3000` já é um valor válido. `JWT_SECRET` não é uma senha do MySQL: é uma chave
privada usada para assinar as sessões. Gere uma sequência aleatória longa, por exemplo com
`node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Linhas
iniciadas por `#` são somente comentários.

### Primeiro administrador

O banco começa vazio (não há INSERT de usuários no schema, para que toda senha passe pelo bcrypt).
Enquanto a tabela `usuarios` estiver vazia, `POST /usuarios` é liberado sem token e o cargo é
forçado para `administrador`:

```bash
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" \
  -d '{"nome":"Admin","email":"admin@academia.com","senha":"troque-esta-senha"}'
```

A partir daí, todo cadastro exige login.

### Front-end

Sirva a pasta `public/` com qualquer servidor estático (neste projeto o dev server já faz isso e
`/` redireciona para `/gym/`). Abra `/gym/login.html`. A URL da API padrão é
`http://localhost:3000` e pode ser alterada em **Configurações → Conexão com o servidor**
(fica salva em `localStorage`, chave `gymcontrol.apiBaseUrl`).

## 3. Autenticação e sessão

| Etapa | O que acontece |
| --- | --- |
| Login | `POST /usuarios/login` `{ email, senha }` → `200 { token, usuario }` ou `401 { erro }` |
| Sessão | Front guarda `{ token, user }` em `localStorage` (`gymcontrol.session`). A senha nunca é armazenada nem retornada. |
| Requisições | `apiClient` envia `Authorization: Bearer <token>` em todas as chamadas autenticadas. |
| Expiração | Token JWT válido por 8 h. Qualquer resposta `401` limpa a sessão e redireciona para `login.html?expired=1`. |
| Logout | Apenas no cliente (JWT é stateless): limpa a sessão e volta para o login. |
| Revalidação | Ao abrir o app, `GET /usuarios/me` confirma o token e atualiza nome/cargo. |

Senhas: `bcryptjs` com 10 rounds no cadastro e na troca de senha (`hash`), `compare` no login.
O campo `senha` nunca sai do backend (`toJSON` remove antes de responder).

## 4. Cargos e controle de acesso

Tabela única `usuarios` com `cargo ENUM('administrador','professor','aluno')`.
Hierarquia: administrador gerencia professores e alunos; professor não gerencia usuários;
ninguém edita/exclui a si mesmo por esta rota de gestão (auto-exclusão bloqueada).

| Recurso | Administrador | Professor | Aluno |
| --- | --- | --- | --- |
| Sidebar | Painel, Usuários, Máquinas, Treinos, Alunos, Configurações | Painel, Alunos, Treinos | Meus Treinos |
| Usuários (`/usuarios`) | listar, criar (aluno/professor), editar, excluir | listar (somente leitura na UI) | vê só o próprio registro |
| Alunos | CRUD completo | visualizar | — |
| Máquinas (`/maquinas`) | CRUD | leitura (usada no builder) | leitura |
| Treinos (`/treinos`, `/exercicios`) | criar, editar, excluir, ver todos | criar, editar, excluir, ver todos | `GET /treinos/usuario/:proprioId` |
| Configurações | sim | não | não |

O front esconde links e botões sem permissão e redireciona rotas `#/…` não permitidas para a
página inicial do cargo. **A regra de verdade é sempre o backend**: cada rota valida token e
cargo, respondendo `401`/`403`.

## 5. Endpoints

Todas as respostas são JSON. Erros seguem `{ "erro": "mensagem" }`.

### Usuários

| Método | Rota | Quem | Corpo / Resposta |
| --- | --- | --- | --- |
| POST | `/usuarios/login` | público | `{ email, senha }` → `{ token, usuario }` · 401 credenciais inválidas |
| GET | `/usuarios/me` | logado | usuário atual (sem senha) |
| GET | `/usuarios` | logado | lista (aluno recebe só a si mesmo) |
| GET | `/usuarios/:id` | logado | aluno só o próprio id (403 caso contrário) |
| POST | `/usuarios` | admin (ou bootstrap) | `{ nome, email, senha, cargo, cpf?, celular?, aniversario? }` → `201 { id }` · 409 e-mail duplicado · 403 cargo não permitido |
| PUT | `/usuarios/:id` | admin / próprio | mesmos campos; `senha` opcional (re-hash quando enviada) |
| DELETE | `/usuarios/:id` | admin / professor conforme hierarquia | `200` · 403 (auto-exclusão ou cargo superior) · 404 |

Objeto `usuario`: `{ id, nome, cpf, email, celular, aniversario, cargo }`.

### Máquinas

| Método | Rota | Quem |
| --- | --- | --- |
| GET | `/maquinas`, `/maquinas/:id` | logado |
| POST / PUT / DELETE | `/maquinas`, `/maquinas/:id` | administrador |

Objeto: `{ id, nome, agrupamento, fabricante }`. `agrupamento` ∈ PEITO, COSTAS, OMBRO, BICEPS,
TRICEPS, ANTEBRACO, ABDOMEN, QUADRICEPS, POSTERIOR_COXA, GLUTEO, PANTURRILHA.

### Treinos

| Método | Rota | Quem |
| --- | --- | --- |
| GET | `/treinos` | admin, professor |
| GET | `/treinos/usuario/:usuarioId` | logado (aluno só o próprio id) |
| GET | `/treinos/:id` | logado (aluno só se for dele) |
| POST / PUT / DELETE | `/treinos`, `/treinos/:id` | admin, professor |

Corpo: `{ usuarioid, diaSemana }` com `diaSemana` ∈ SEGUNDA…DOMINGO.
Resposta expandida: `{ id, usuario: {...}, diaSemana, exercicios: [...] }`.

### Exercícios

| Método | Rota | Quem |
| --- | --- | --- |
| GET | `/exercicios` | admin, professor |
| GET | `/exercicios/:id`, `/exercicios/treino/:treinoId` | logado |
| POST / PUT / DELETE | `/exercicios`, `/exercicios/:id` | admin, professor |

Corpo: `{ treinoid, maquinaid, series, repeticoes, carga }`.

Não existe endpoint "salvar treino completo": o front faz `POST /treinos` e depois um
`POST /exercicios` por linha; ao editar, `PUT /treinos/:id` e reconcilia (PUT/POST/DELETE) os
exercícios; ao excluir, apaga os exercícios e depois o treino.

### Códigos HTTP usados

`200/201` sucesso · `400` dados inválidos / referência inexistente · `401` sem token, token
expirado ou credenciais inválidas · `403` cargo sem permissão · `404` não encontrado ·
`409` e-mail duplicado ou registro referenciado · `503` banco indisponível · `500` erro interno.

## 6. Serviços do front-end

| Serviço | Métodos |
| --- | --- |
| `authService` | `login(email, senha)`, `logout()`, `getCurrentUser()`, `isAuthenticated()`, `refreshCurrentUser()`, `hasRole(...)` |
| `userService` | `getAll()`, `getByRole(cargo)`, `getById(id)`, `create(user)`, `update(id, user)`, `remove(id)` |
| `studentService` / `teacherService` | mesmos métodos com o cargo fixo (`aluno` / `professor`) |
| `machineService` | `getAll()`, `getById()`, `create()`, `update()`, `remove()` |
| `workoutService` | `getAll()`, `getById()`, `getByStudent(id)`, `getExercises(id)`, `create()`, `update(id, w)`, `remove()` |
| `gymService` | `stats()`, `profile()`, `saveProfile()`, `checkConnection(url)` |

Páginas nunca chamam `fetch()`; toda comunicação passa por `js/api/apiClient.js`.

## 7. Modo demonstração

Ativado só manualmente em **Configurações**. Troca o `apiClient` pelo `mockRepository`
(memória do navegador). Contas de demonstração e a senha `demo123` aparecem na tela de login
quando o modo está ativo. Nada é enviado ao servidor nem gravado no banco.

## 8. Limitações conhecidas (o backend não oferece)

- **Cadastro da academia** (nome, endereço, horário): não há endpoint; os dados de
  Configurações ficam no `localStorage` do navegador. Não recriar esse cadastro como se fosse
  do servidor.
- **Busca no servidor**: `GET /usuarios` e `GET /maquinas` não aceitam filtros; a pesquisa é
  feita no navegador sobre a lista completa.
- **Status do aluno** (ativo/inativo) e **plano do aluno**: não existem colunas nem endpoints.
  Esses campos foram removidos do front e não devem ser reintroduzidos até existirem na API.
- **Descanso/observações por exercício**: a tabela `exercicios` só tem séries, repetições e
  carga.
- **Recuperação de senha por e-mail**: não existe; um administrador redefine a senha em
  Usuários → Editar.
- **Logout no servidor / lista de tokens revogados**: JWT stateless, expira em 8 h.

## 9. Segurança — checklist

- Senhas com bcrypt (10 rounds); nunca retornadas nem exibidas.
- Credenciais do MySQL e `JWT_SECRET` só em `backend/.env` (ignorado pelo git).
- Toda rota (exceto login e o bootstrap do primeiro admin) exige `Authorization: Bearer`.
- Cargo verificado no backend; o front apenas esconde o que não pode ser usado.
- Auto-exclusão bloqueada; criação de administradores não é permitida via tela de Usuários.
- Conteúdo dinâmico escapado com `escapeHtml` antes de ir para o DOM.
