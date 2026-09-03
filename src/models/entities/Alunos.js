export default class Alunos {
    #id;
    #nome;
    #cpf;
    #celular;
    #aniversario;

    constructor(id, nome, cpf, celular, aniversario) {
        this.#id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.celular = celular;
        this.aniversario = aniversario;
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
    
    toJSON() {
    return {
        id: this.#id,
        nome: this.#nome,
        cpf: this.#cpf,
        celular: this.#celular,
        aniversario: this.#aniversario
    };
}
}