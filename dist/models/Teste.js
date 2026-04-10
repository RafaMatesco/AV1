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
class Teste {
    constructor(tipo, resultado) {
        this.tipo = tipo;
        this.resultado = resultado;
    }
    static lerLista() {
        fs.mkdirSync(path.dirname(Teste.filePath), { recursive: true });
        if (fs.existsSync(Teste.filePath)) {
            return JSON.parse(fs.readFileSync(Teste.filePath, 'utf-8'));
        }
        return [];
    }
    static salvarLista(lista) {
        fs.writeFileSync(Teste.filePath, JSON.stringify(lista, null, 2));
    }
    salvar() {
        const lista = Teste.lerLista();
        const data = {
            tipo: this.tipo,
            resultado: this.resultado
        };
        lista.push(data);
        Teste.salvarLista(lista);
    }
    static carregarTodos() {
        //the one piece is real
        const lista = Teste.lerLista();
        return lista.map((t) => new Teste(t.tipo, t.resultado));
    }
}
Teste.filePath = path.join(__dirname, '../../data/testes.json');
exports.default = Teste;
