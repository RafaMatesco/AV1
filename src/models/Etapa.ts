import { StatusEtapa } from "../models/enums";
import Funcionario from "./Funcionario";
import * as fs from 'fs';
import * as path from 'path';

class Etapa {
  public nome: string;
  public status: StatusEtapa;
  public prazo: string
  public funcionarios: Funcionario[] = [];
  private static filePath = path.join(__dirname, '../../data/etapas.json');

  constructor(nome: string, status: StatusEtapa, prazo: string) {
    this.nome = nome;
    this.status = status;
    this.prazo = prazo
  }

  iniciar(): void {
    this.status = StatusEtapa.ANDAMENTO;
  }

  finalizar(): void {
    this.status = StatusEtapa.CONCLUIDA;
  }

  associarFuncionario(funcionario: Funcionario): void {
    const existe = this.funcionarios.some(f => f.id === funcionario.id);
    if (existe) {
      throw new Error(`Funcionário com ID ${funcionario.id} já está associado a esta etapa.`);
    }
    this.funcionarios.push(funcionario);
  }

  listarFuncionarios(): Funcionario[] {
    return this.funcionarios;
  }

  private static lerLista(): any[] {
    fs.mkdirSync(path.dirname(Etapa.filePath), { recursive: true });
    if (fs.existsSync(Etapa.filePath)) {
      return JSON.parse(fs.readFileSync(Etapa.filePath, 'utf-8'));
    }
    return [];
  }

  private static salvarLista(lista: any[]) {
    fs.writeFileSync(Etapa.filePath, JSON.stringify(lista, null, 2));
  }

  salvar() {
    const lista = Etapa.lerLista();
    const index = lista.findIndex((e: any) => e.nome === this.nome);
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
    } else {
      lista.push(data);
    }
    Etapa.salvarLista(lista);
  }

  carregar(nome: string) {
    const lista = Etapa.lerLista();
    const data = lista.find((e: any) => e.nome === nome);
    if (data) {
      this.nome = data.nome;
      this.status = data.status;
      this.funcionarios = data.funcionarios.map((f: any) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
    } else {
      throw new Error(`Etapa com nome ${nome} não encontrada.`);
    }
  }

  static carregarTodas(): Etapa[] {
    //the one piece is real
    const lista = Etapa.lerLista();
    return lista.map((e: any) => {
      const etapa = new Etapa(e.nome, e.status, e.prazo);
      etapa.funcionarios = e.funcionarios.map((f: any) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
      return etapa;
    });
  }
}

export default Etapa;
