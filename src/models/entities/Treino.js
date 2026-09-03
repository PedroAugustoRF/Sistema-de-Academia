export default class Treino {
    #id;
    #aluno;
    #diaSemana;
    #exercicios;

    constructor(id, aluno, diaSemana, exercicios) {
        this.#id = id;
        this.aluno = aluno;
        this.diaSemana = diaSemana;
        this.exercicios = exercicios;
    }

    get id() {
        return this.#id;
    }

    get aluno() {
        return this.#aluno;
    }
    set aluno(valor) {
        this.#aluno = valor;
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
            aluno: this.#aluno,
            diaSemana: this.#diaSemana,
            exercicios: this.#exercicios
        };
    }
}