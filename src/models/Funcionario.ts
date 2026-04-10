import { NivelPermissao } from "./enums";
import * as fs from 'fs';
import * as path from 'path';

class Funcionario {
  public id: string;
  public nome: string;
  public telefone: string;
  public endereco: string;
  public usuario: string;
  public senha: string;
  public nivelPermissao: NivelPermissao;
  private static filePath = path.join(__dirname, '../../data/funcionarios.json');

  constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.nivelPermissao = nivelPermissao;
  }

  private static lerLista(): any[] {
    fs.mkdirSync(path.dirname(Funcionario.filePath), { recursive: true });
    if (fs.existsSync(Funcionario.filePath)) {
      return JSON.parse(fs.readFileSync(Funcionario.filePath, 'utf-8'));
    }
    return [];
  }

  private static salvarLista(lista: any[]) {
    fs.writeFileSync(Funcionario.filePath, JSON.stringify(lista, null, 2));
  }

  salvar() {
    const lista = Funcionario.lerLista();
    const index = lista.findIndex((f: any) => f.id === this.id);
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
    } else {
      lista.push(data);
    }
    Funcionario.salvarLista(lista);
  }

  autenticarUsuario(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  static carregar(id: string) {
    const lista = Funcionario.lerLista();
    const data = lista.find((f: any) => f.id === id);
    if (data) {
      return new Funcionario(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivelPermissao);
    } else {
      throw new Error(`Funcionário com ID ${id} não encontrado.`);
    }
  }

  static carregarUsuario(usuario: string) {
    const lista = Funcionario.lerLista();
    const data = lista.find((f: any) => f.usuario === usuario);
    if (data) {
      return new Funcionario(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivelPermissao);
    } else {
      throw new Error(`Funcionário com usuario ${usuario} não encontrado.`);
    }
  }

  static carregarTodos(): Funcionario[] {
    //the one piece is real
    const lista = Funcionario.lerLista();
    return lista.map((f: any) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
  }
}

export default Funcionario;
