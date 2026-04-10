import Aeronave from "./Aeronave";
import * as fs from 'fs';
import * as path from 'path';

class Relatorio {
  gerarRelatorio(aeronave: Aeronave, cliente: string, dataEntrega: string): string {
    return `Relatório de Entrega da Aeronave ${aeronave.codigo}
Nome do Cliente: ${cliente}
Data de Entrega: ${dataEntrega}
${aeronave.detalhes()}`;
  }
  
  salvarEmArquivo(aeronave: Aeronave, cliente: string, dataEntrega: string): void {
    const relatorio = this.gerarRelatorio(aeronave, cliente, dataEntrega);
    const filePath = path.join(__dirname, `../../data/relatorios/${aeronave.codigo}.txt`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, relatorio);
  }
}

export default Relatorio;
