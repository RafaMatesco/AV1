"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../models/enums");
const Funcionario_1 = __importDefault(require("./Funcionario"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Etapa {
    constructor(nome, status, prazo) {
        this.funcionarios = [];
        this.nome = nome;
        this.status = status;
        this.prazo = prazo;
    }
    iniciar() {
        this.status = enums_1.StatusEtapa.ANDAMENTO;
    }
    finalizar() {
        this.status = enums_1.StatusEtapa.CONCLUIDA;
    }
    associarFuncionario(funcionario) {
        const existe = this.funcionarios.some(f => f.id === funcionario.id);
        if (existe) {
            throw new Error(`Funcionário com ID ${funcionario.id} já está associado a esta etapa.`);
        }
        this.funcionarios.push(funcionario);
    }
    listarFuncionarios() {
        return this.funcionarios;
    }
    static lerLista() {
        fs.mkdirSync(path.dirname(Etapa.filePath), { recursive: true });
        if (fs.existsSync(Etapa.filePath)) {
            return JSON.parse(fs.readFileSync(Etapa.filePath, 'utf-8'));
        }
        return [];
    }
    static salvarLista(lista) {
        fs.writeFileSync(Etapa.filePath, JSON.stringify(lista, null, 2));
    }
    salvar() {
        const lista = Etapa.lerLista();
        const index = lista.findIndex((e) => e.nome === this.nome);
        const data = {
            nome: this.nome,
            status: this.status,
            funcionarios: this.funcionarios.map(f => ({
                id: f.id,
                nome: f.nome,
                telefone: f.telefone,
                endereco: f.endereco,
                usuario: f.usuario,
                senha: f.senha,
                nivelPermissao: f.nivelPermissao
            }))
        };
        if (index >= 0) {
            lista[index] = data;
        }
        else {
            lista.push(data);
        }
        Etapa.salvarLista(lista);
    }
    carregar(nome) {
        const lista = Etapa.lerLista();
        const data = lista.find((e) => e.nome === nome);
        if (data) {
            this.nome = data.nome;
            this.status = data.status;
            this.funcionarios = data.funcionarios.map((f) => new Funcionario_1.default(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
        }
        else {
            throw new Error(`Etapa com nome ${nome} não encontrada.`);
        }
    }
    static carregarTodas() {
        //the one piece is real
        const lista = Etapa.lerLista();
        return lista.map((e) => {
            const etapa = new Etapa(e.nome, e.status, e.prazo);
            etapa.funcionarios = e.funcionarios.map((f) => new Funcionario_1.default(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
            return etapa;
        });
    }
}
Etapa.filePath = path.join(__dirname, '../../data/etapas.json');
exports.default = Etapa;
