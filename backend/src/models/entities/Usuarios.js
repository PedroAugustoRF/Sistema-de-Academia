export default class Usuarios {
    #id;
    #nome;
    #cpf;
    #email;
    #senha;
    #celular;
    #aniversario;
    #cargo;

    constructor(id, nome, cpf, email, senha, celular, aniversario, cargo) {
        this.#id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.celular = celular;
        this.aniversario = aniversario;
        this.cargo = cargo;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }
    set nome(valor) {
        this.#nome = valor;
    }

    get cpf() {
        return this.#cpf;
    }
    set cpf(valor) {
        this.#cpf = valor;
    }

    get email() {
        return this.#email;
    }
    set email(valor) {
        this.#email = valor;
    }

    get senha() {
        return this.#senha;
    }
    set senha(valor) {
        this.#senha = valor;
    }

    get celular() {
        return this.#celular;
    }
    set celular(valor) {
        this.#celular = valor;
    }

    get aniversario() {
        return this.#aniversario;
    }
    set aniversario(valor) {
        this.#aniversario = valor;
    }

    get cargo() {
        return this.#cargo;
    }
    set cargo(valor) {
        this.#cargo = valor;
    }

    toJSON() {
        // senha nunca é exposta no JSON de retorno da API
        return {
            id: this.#id,
            nome: this.#nome,
            cpf: this.#cpf,
            email: this.#email,
            celular: this.#celular,
            aniversario: this.#aniversario,
            cargo: this.#cargo
        };
    }
}