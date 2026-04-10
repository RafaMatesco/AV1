import { TipoTeste, ResultadoTeste } from "../models/enums";
import * as fs from 'fs';
import * as path from 'path';

class Teste {
  public tipo: TipoTeste;
  public resultado: ResultadoTeste;
  private static filePath = path.join(__dirname, '../../data/testes.json');

  constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
    this.tipo = tipo;
    this.resultado = resultado;
  }

  private static lerLista(): any[] {
    fs.mkdirSync(path.dirname(Teste.filePath), { recursive: true });
    if (fs.existsSync(Teste.filePath)) {
      return JSON.parse(fs.readFileSync(Teste.filePath, 'utf-8'));
    }
    return [];
  }

  private static salvarLista(lista: any[]) {
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

  static carregarTodos(): Teste[] {
    //the one piece is real
    const lista = Teste.lerLista();
    return lista.map((t: any) => new Teste(t.tipo, t.resultado));
  }
}

export default Teste;
