export default class Exercicios {
    #id;
    #treino;
    #maquina;
    #series;
    #repeticoes;
    #carga;

    constructor(id, treino, maquina, series, repeticoes, carga) {
        this.#id = id;
        this.treino = treino;
        this.maquina = maquina;
        this.series = series;
        this.repeticoes = repeticoes;
        this.carga = carga;
    }

    get id() {
        return this.#id;
    }

    get treino() {
        return this.#treino;
    }
    set treino(valor) {
        this.#treino = valor;
    }

    get maquina() {
        return this.#maquina;
    }
    set maquina(valor) {
        this.#maquina = valor;
    }

    get series() {
        return this.#series;
    }
    set series(valor) {
        this.#series = valor;
    }

    get repeticoes() {
        return this.#repeticoes;
    }
    set repeticoes(valor) {
        this.#repeticoes = valor;
    }

    get carga() {
        return this.#carga;
    }
    set carga(valor) {
        this.#carga = valor;
    }

    toJSON() {
        return {
            id: this.#id,
            treino: this.#treino,
            maquina: this.#maquina,
            series: this.#series,
            repeticoes: this.#repeticoes,
            carga: this.#carga
        };
    }
}