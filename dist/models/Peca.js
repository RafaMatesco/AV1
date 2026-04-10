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
class Peca {
    constructor(nome, tipo, prazo, fornecedor, status) {
        this.nome = nome;
        this.tipo = tipo;
        this.prazo = prazo;
        this.fornecedor = fornecedor;
        this.status = status;
    }
    atualizarStatus(novoStatus) {
        this.status = novoStatus;
    }
    static lerLista() {
        fs.mkdirSync(path.dirname(Peca.filePath), { recursive: true });
        if (fs.existsSync(Peca.filePath)) {
            return JSON.parse(fs.readFileSync(Peca.filePath, 'utf-8'));
        }
        return [];
    }
    static salvarLista(lista) {
        fs.writeFileSync(Peca.filePath, JSON.stringify(lista, null, 2));
    }
    salvar() {
        const lista = Peca.lerLista();
        const index = lista.findIndex((p) => p.nome === this.nome);
        const data = {
            nome: this.nome,
            tipo: this.tipo,
            prazo: this.prazo,
            fornecedor: this.fornecedor,
            status: this.status
        };
        if (index >= 0) {
            lista[index] = data;
        }
        else {
            lista.push(data);
        }
        Peca.salvarLista(lista);
    }
    carregar(nome) {
        const lista = Peca.lerLista();
        const data = lista.find((p) => p.nome === nome);
        if (data) {
            this.nome = data.nome;
            this.tipo = data.tipo;
            this.prazo = data.prazo;
            this.fornecedor = data.fornecedor;
            this.status = data.status;
        }
        else {
            throw new Error(`Peça com nome ${nome} não encontrada.`);
        }
    }
    static carregarTodas() {
        //the one piece is real
        const lista = Peca.lerLista();
        return lista.map((p) => new Peca(p.nome, p.tipo, p.prazo, p.fornecedor, p.status));
    }
}
Peca.filePath = path.join(__dirname, '../../data/pecas.json');
exports.default = Peca;
