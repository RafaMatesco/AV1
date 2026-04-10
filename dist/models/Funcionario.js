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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Funcionario {
    constructor(id, nome, telefone, endereco, usuario, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    static lerLista() {
        fs.mkdirSync(path.dirname(Funcionario.filePath), { recursive: true });
        if (fs.existsSync(Funcionario.filePath)) {
            return JSON.parse(fs.readFileSync(Funcionario.filePath, 'utf-8'));
        }
        return [];
    }
    static salvarLista(lista) {
        fs.writeFileSync(Funcionario.filePath, JSON.stringify(lista, null, 2));
    }
    salvar() {
        const lista = Funcionario.lerLista();
        const index = lista.findIndex((f) => f.id === this.id);
        const data = {
            id: this.id,
            nome: this.nome,
            telefone: this.telefone,
            endereco: this.endereco,
            usuario: this.usuario,
            senha: this.senha,
            nivelPermissao: this.nivelPermissao
        };
        if (index >= 0) {
            lista[index] = data;
        }
        else {
            lista.push(data);
        }
        Funcionario.salvarLista(lista);
    }
    autenticarUsuario(usuario, senha) {
        return this.usuario === usuario && this.senha === senha;
    }
    static carregar(id) {
        const lista = Funcionario.lerLista();
        const data = lista.find((f) => f.id === id);
        if (data) {
            return new Funcionario(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivelPermissao);
        }
        else {
            throw new Error(`Funcionário com ID ${id} não encontrado.`);
        }
    }
    static carregarUsuario(usuario) {
        const lista = Funcionario.lerLista();
        const data = lista.find((f) => f.usuario === usuario);
        if (data) {
            return new Funcionario(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivelPermissao);
        }
        else {
            throw new Error(`Funcionário com usuario ${usuario} não encontrado.`);
        }
    }
    static carregarTodos() {
        //the one piece is real
        const lista = Funcionario.lerLista();
        return lista.map((f) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
    }
}
Funcionario.filePath = path.join(__dirname, '../../data/funcionarios.json');
exports.default = Funcionario;
