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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Peca_1 = __importDefault(require("./Peca"));
const Etapa_1 = __importDefault(require("./Etapa"));
const Teste_1 = __importDefault(require("./Teste"));
const Funcionario_1 = __importDefault(require("./Funcionario"));
class Aeronave {
    constructor(codigo, modelo, tipo, capacidade, alcance) {
        this.pecas = [];
        this.etapas = [];
        this.testes = [];
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    detalhes() {
        let output = `\n========================================
[AERONAVE] Código: ${this.codigo}
========================================
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance}

--- PEÇAS UTILIZADAS ---
`;
        if (this.pecas.length === 0)
            output += `  (Nenhuma peça registrada)\n`;
        this.pecas.forEach(p => {
            output += `  - ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status} | Prazo: ${p.prazo}\n`;
        });
        output += `\n--- ETAPAS REALIZADAS ---\n`;
        if (this.etapas.length === 0)
            output += `  (Nenhuma etapa registrada)\n`;
        this.etapas.forEach(e => {
            output += `  - [${e.status}] ${e.nome} (Prazo: ${e.prazo}) - Funcionários Associados: ${e.funcionarios.length}\n`;
            e.funcionarios.forEach(f => {
                output += `      * ${f.nome} (${f.nivelPermissao})\n`;
            });
        });
        output += `\n--- RESULTADOS DOS TESTES ---\n`;
        if (this.testes.length === 0)
            output += `  (Nenhum teste registrado)\n`;
        this.testes.forEach(t => {
            output += `  - [${t.resultado}] Teste ${t.tipo}\n`;
        });
        output += `========================================\n`;
        return output;
    }
    static lerLista() {
        fs.mkdirSync(path.dirname(Aeronave.filePath), { recursive: true });
        if (fs.existsSync(Aeronave.filePath)) {
            return JSON.parse(fs.readFileSync(Aeronave.filePath, "utf-8"));
        }
        return [];
    }
    static salvarLista(lista) {
        fs.writeFileSync(Aeronave.filePath, JSON.stringify(lista, null, 2));
    }
    salvar() {
        const lista = Aeronave.lerLista();
        const index = lista.findIndex((a) => a.codigo === this.codigo);
        const data = {
            codigo: this.codigo,
            modelo: this.modelo,
            tipo: this.tipo,
            capacidade: this.capacidade,
            alcance: this.alcance,
            pecas: this.pecas,
            etapas: this.etapas,
            testes: this.testes
        };
        if (index >= 0) {
            lista[index] = data;
        }
        else {
            lista.push(data);
        }
        Aeronave.salvarLista(lista);
    }
    static carregar(codigo) {
        const lista = Aeronave.lerLista();
        const data = lista.find((a) => a.codigo === codigo);
        if (data) {
            data.codigo = data.codigo;
            data.modelo = data.modelo;
            data.tipo = data.tipo;
            data.capacidade = data.capacidade;
            data.alcance = data.alcance;
            data.pecas = data.pecas ? data.pecas.map((p) => new Peca_1.default(p.nome, p.tipo, p.prazo, p.fornecedor, p.status)) : [];
            data.etapas = data.etapas ? data.etapas.map((e) => {
                const etapa = new Etapa_1.default(e.nome, e.status, e.prazo);
                if (e.funcionarios) {
                    etapa.funcionarios = e.funcionarios.map((f) => new Funcionario_1.default(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
                }
                return new Aeronave(data.codigo, data.modelo, data.tipo, data.capacidade, data.alcance);
            }) : [];
            data.testes = data.testes ? data.testes.map((t) => new Teste_1.default(t.tipo, t.resultado)) : [];
            return data;
        }
        else {
            throw new Error(`Aeronave com código ${codigo} não encontrada.`);
        }
    }
    static verificarExistencia(codigo) {
        const lista = Aeronave.lerLista();
        const data = lista.find((a) => a.codigo === codigo);
        if (data) {
            throw new Error(`Aeronave com código ${codigo} já existe.`);
        }
    }
    static remover(codigo) {
        const lista = Aeronave.lerLista();
        const index = lista.findIndex((a) => a.codigo === codigo);
        if (index < 0) {
            return false;
        }
        lista.splice(index, 1);
        Aeronave.salvarLista(lista);
        return true;
    }
    static carregarTodas() {
        const lista = Aeronave.lerLista();
        return lista.map((aviao) => {
            const a = new Aeronave(aviao.codigo, aviao.modelo, aviao.tipo, aviao.capacidade, aviao.alcance);
            a.pecas = aviao.pecas ? aviao.pecas.map((p) => new Peca_1.default(p.nome, p.tipo, p.prazo, p.fornecedor, p.status)) : [];
            a.etapas = aviao.etapas ? aviao.etapas.map((e) => {
                const etapa = new Etapa_1.default(e.nome, e.status, e.prazo);
                if (e.funcionarios) {
                    etapa.funcionarios = e.funcionarios.map((f) => new Funcionario_1.default(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
                }
                return etapa;
            }) : [];
            a.testes = aviao.testes ? aviao.testes.map((t) => new Teste_1.default(t.tipo, t.resultado)) : [];
            return a;
        });
    }
}
Aeronave.filePath = path.join(__dirname, "../../data/aeronaves.json");
exports.default = Aeronave;
