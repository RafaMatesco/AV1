import * as fs from "fs";
import * as path from "path";

import { TipoAeronave } from "./enums";
import Peca from "./Peca";
import Etapa from "./Etapa";
import Teste from "./Teste";
import Funcionario from "./Funcionario";



class Aeronave {
  public codigo: string;
  public modelo: string;
  public tipo: TipoAeronave;
  public capacidade: number;
  public alcance: number;
  public pecas: Peca[] = [];
  public etapas: Etapa[] = [];
  public testes: Teste[] = [];

  private static filePath = path.join(__dirname, "../../data/aeronaves.json");

  constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
  }

  detalhes(): string {
    let output = `\n========================================
[AERONAVE] Código: ${this.codigo}
========================================
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance}

--- PEÇAS UTILIZADAS ---
`;

    if (this.pecas.length === 0) output += `  (Nenhuma peça registrada)\n`;
    this.pecas.forEach(p => {
      output += `  - ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status} | Prazo: ${p.prazo}\n`;
    });

    output += `\n--- ETAPAS REALIZADAS ---\n`;
    if (this.etapas.length === 0) output += `  (Nenhuma etapa registrada)\n`;
    this.etapas.forEach(e => {
      output += `  - [${e.status}] ${e.nome} (Prazo: ${e.prazo}) - Funcionários Associados: ${e.funcionarios.length}\n`;
      e.funcionarios.forEach(f => {
        output += `      * ${f.nome} (${f.nivelPermissao})\n`;
      });
    });

    output += `\n--- RESULTADOS DOS TESTES ---\n`;
    if (this.testes.length === 0) output += `  (Nenhum teste registrado)\n`;
    this.testes.forEach(t => {
      output += `  - [${t.resultado}] Teste ${t.tipo}\n`;
    });

    output += `========================================\n`;
    return output;
  }

  private static lerLista(): any[] {
    fs.mkdirSync(path.dirname(Aeronave.filePath), { recursive: true });
    if (fs.existsSync(Aeronave.filePath)) {
      return JSON.parse(fs.readFileSync(Aeronave.filePath, "utf-8"));
    }
    return [];
  }

  private static salvarLista(lista: any[]) {
    fs.writeFileSync(Aeronave.filePath, JSON.stringify(lista, null, 2));
  }

  salvar() {
    const lista = Aeronave.lerLista();
    const index = lista.findIndex((a: any) => a.codigo === this.codigo);
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
    } else {
      lista.push(data);
    }
    Aeronave.salvarLista(lista);
  }

  static carregar(codigo: string): Aeronave {
    const lista = Aeronave.lerLista();
    const data = lista.find((a: any) => a.codigo === codigo);
    if (data) {
      const aeronave = new Aeronave(data.codigo, data.modelo, data.tipo, data.capacidade, data.alcance);
      aeronave.pecas = data.pecas ? data.pecas.map((p: any) => new Peca(p.nome, p.tipo, p.prazo, p.fornecedor, p.status)) : [];
      aeronave.etapas = data.etapas ? data.etapas.map((e: any) => {
        const etapa = new Etapa(e.nome, e.status, e.prazo);
        if (e.funcionarios) {
          etapa.funcionarios = e.funcionarios.map((f: any) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
        }
        return etapa;
      }) : [];
      aeronave.testes = data.testes ? data.testes.map((t: any) => new Teste(t.tipo, t.resultado)) : [];
      return aeronave;
    } else {
      throw new Error(`Aeronave com código ${codigo} não encontrada.`);
    }
  }

  static verificarExistencia(codigo: string) {
    const lista = Aeronave.lerLista();
    const data = lista.find((a: any) => a.codigo === codigo);
    if (data) {
      throw new Error(`Aeronave com código ${codigo} já existe.`);
    }
  }

  static remover(codigo: string): boolean {
    const lista = Aeronave.lerLista();
    const index = lista.findIndex((a: any) => a.codigo === codigo);
    if (index < 0) {
      return false;
    }
    lista.splice(index, 1);
    Aeronave.salvarLista(lista);
    return true;
  }

  static carregarTodas(): Aeronave[] {
    const lista = Aeronave.lerLista();
    return lista.map((aviao: any) => {
      const a = new Aeronave(aviao.codigo, aviao.modelo, aviao.tipo, aviao.capacidade, aviao.alcance);
      a.pecas = aviao.pecas ? aviao.pecas.map((p: any) => new Peca(p.nome, p.tipo, p.prazo, p.fornecedor, p.status)) : [];
      a.etapas = aviao.etapas ? aviao.etapas.map((e: any) => {
        const etapa = new Etapa(e.nome, e.status, e.prazo);
        if (e.funcionarios) {
          etapa.funcionarios = e.funcionarios.map((f: any) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
        }
        return etapa;
      }) : [];
      a.testes = aviao.testes ? aviao.testes.map((t: any) => new Teste(t.tipo, t.resultado)) : [];
      return a;
    });
  }
}

export default Aeronave;
