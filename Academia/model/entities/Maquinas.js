import Agrupamento from "../enums/Agrupamento.js";

export default class Maquinas {
    #id;
    #nome;
    #agrupamento;
    #fabricante;

    constructor(id, nome, agrupamento, fabricante) {
        this.#id = id;
        this.nome = nome;
        this.agrupamento = agrupamento;
        this.fabricante = fabricante;
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

    get agrupamento() {
        return this.#agrupamento;
    }
    set agrupamento(valor) {
        this.#agrupamento = valor;
    }

    get fabricante() {
        return this.#fabricante;
    }
    set fabricante(valor) {
        this.#fabricante = valor;
    }
}