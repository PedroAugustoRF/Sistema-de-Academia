export default class Treino {
    #id;
    #usuario;
    #diaSemana;
    #exercicios;

    constructor(id, usuario, diaSemana, exercicios) {
        this.#id = id;
        this.usuario = usuario;
        this.diaSemana = diaSemana;
        this.exercicios = exercicios;
    }

    get id() {
        return this.#id;
    }

    get usuario() {
        return this.#usuario;
    }
    set usuario(valor) {
        this.#usuario = valor;
    }

    get diaSemana() {
        return this.#diaSemana;
    }
    set diaSemana(valor) {
        this.#diaSemana = valor;
    }

    get exercicios() {
        return this.#exercicios;
    }
    set exercicios(valor) {
        this.#exercicios = valor;
    }
    
    toJSON() {
        return {
            id: this.#id,
            usuario: this.#usuario,
            diaSemana: this.#diaSemana,
            exercicios: this.#exercicios
        };
    }
}