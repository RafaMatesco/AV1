import { TipoPeca, StatusPeca } from "../models/enums";
import * as fs from 'fs';
import * as path from 'path';

class Peca {
  public nome: string;
  public tipo: TipoPeca;
  public prazo: string;
  public fornecedor: string;
  public status: StatusPeca;
  private static filePath = path.join(__dirname, '../../data/pecas.json');

  constructor(nome: string, tipo: TipoPeca, prazo: string, fornecedor: string, status: StatusPeca) {
    this.nome = nome;
    this.tipo = tipo;
    this.prazo = prazo;
    this.fornecedor = fornecedor;
    this.status = status;
  }

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
  }

  private static lerLista(): any[] {
    fs.mkdirSync(path.dirname(Peca.filePath), { recursive: true });
    if (fs.existsSync(Peca.filePath)) {
      return JSON.parse(fs.readFileSync(Peca.filePath, 'utf-8'));
    }
    return [];
  }

  private static salvarLista(lista: any[]) {
    fs.writeFileSync(Peca.filePath, JSON.stringify(lista, null, 2));
  }

  salvar() {
    const lista = Peca.lerLista();
    const index = lista.findIndex((p: any) => p.nome === this.nome);
    const data = {
      nome: this.nome,
      tipo: this.tipo,
      prazo: this.prazo,
      fornecedor: this.fornecedor,
      status: this.status
    };
    if (index >= 0) {
      lista[index] = data;
    } else {
      lista.push(data);
    }
    Peca.salvarLista(lista);
  }

  carregar(nome: string) {
    const lista = Peca.lerLista();
    const data = lista.find((p: any) => p.nome === nome);
    if (data) {
      this.nome = data.nome;
      this.tipo = data.tipo;
      this.prazo = data.prazo;
      this.fornecedor = data.fornecedor;
      this.status = data.status;
    } else {
      throw new Error(`Peça com nome ${nome} não encontrada.`);
    }
  }

  static carregarTodas(): Peca[] {
    //the one piece is real
    const lista = Peca.lerLista();
    return lista.map((p: any) => new Peca(p.nome, p.tipo, p.prazo, p.fornecedor, p.status));
  }
}

export default Peca;
