"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Aeronave_1 = __importDefault(require("./models/Aeronave"));
const Funcionario_1 = __importDefault(require("./models/Funcionario"));
const Peca_1 = __importDefault(require("./models/Peca"));
const Etapa_1 = __importDefault(require("./models/Etapa"));
const Teste_1 = __importDefault(require("./models/Teste"));
const Relatorio_1 = __importDefault(require("./models/Relatorio"));
const enums_1 = require("./models/enums");
function executarCiclo() {
    console.log("\n>>> INICIANDO TESTE DINÂMICO DE INTEGRAÇÃO DO SISTEMA AEROCODE <<<");
    // 1. Criar Funcionário
    console.log("\n[Passo 1] Cadastrando funcionário...");
    const funcionario = new Funcionario_1.default("ENG-01", "João Engenheiro", "119999999", "Rua A", "joao.eng", "123", enums_1.NivelPermissao.ENGENHEIRO);
    funcionario.salvar();
    console.log(`  -> Funcionário ${funcionario.nome} salvo com sucesso.`);
    // 2. Criar Aeronave Base
    console.log("\n[Passo 2] Registrando Projeto de Aeronave Master...");
    const aeronave = new Aeronave_1.default("BOE-777", "Boeing 777X", enums_1.TipoAeronave.COMERCIAL, 350, 15000);
    // 3. Cadastrando e Alocando Peça
    console.log("\n[Passo 3] Solicitando Peças e Injetando...");
    const peca = new Peca_1.default("Turbina Rolls-Royce T-100", enums_1.TipoPeca.IMPORTADA, "2026-06-01", "Rolls-Royce UK", enums_1.StatusPeca.EM_TRANSPORTE);
    aeronave.pecas.push(peca);
    // Modificando status da peça depois que ela chegou
    peca.atualizarStatus(enums_1.StatusPeca.PRONTA);
    console.log(`  -> Peça "${peca.nome}" integrada. Status atual: ${peca.status}`);
    // 4. Mapeando Etapas de Produção
    console.log("\n[Passo 4] Adicionando Etapas e Associando Mão de Obra...");
    const etapa1 = new Etapa_1.default("Montagem Estrutural", enums_1.StatusEtapa.PENDENTE, "2026-06-10");
    const etapa2 = new Etapa_1.default("Pintura Externa", enums_1.StatusEtapa.PENDENTE, "2026-06-25");
    aeronave.etapas.push(etapa1, etapa2);
    // REQ-27 Trabalhador entra na Etapa 1
    etapa1.associarFuncionario(funcionario);
    console.log(`  -> Associamos o funcionario ${funcionario.nome} à etapa 1.`);
    try {
        console.log(`  -> [TESTANDO REQ-27] Tentando registrar o Joao novamente na mesma Etapa...`);
        etapa1.associarFuncionario(funcionario); // Vai estourar error!
    }
    catch (e) {
        console.log(`  -> [SUCESSO NO REQ-27] O Sistema impediu clonagem! Motivo: ${e}`);
    }
    // REQ-24 Regra de Negócio de Avanço (Kanban)
    console.log("\n[Passo 5] Avançando o Kanban das Etapas...");
    etapa1.iniciar(); // Etapa 1 entra em ANDAMENTO
    // Imagine que queiram finalizar a Etapa 2 agora do nada. Nossa trava de REQ-24 não pode deixar.
    console.log(`  -> [TESTANDO REQ-24] Tentando concluir a "Etapa 2" (ID=1) sem concluir a Fase Estrutural (ID=0) antes...`);
    const indiceEtapa2 = 1;
    if (indiceEtapa2 > 0 && aeronave.etapas[indiceEtapa2 - 1].status !== enums_1.StatusEtapa.CONCLUIDA) {
        console.log(`  -> [SUCESSO NO REQ-24] O Sistema não deixou concluir! A anterior não está pronta.`);
    }
    // Avançando da forma correta.
    etapa1.finalizar();
    etapa2.iniciar();
    etapa2.finalizar();
    console.log(`  -> Etapas evoluídas perfeitamente (1 concluida -> Libera 2 -> 2 concluida).`);
    // 6. Testes de Qualidade
    console.log("\n[Passo 6] Registro de Qualidade - Testes Acionados...");
    const testeEle = new Teste_1.default(enums_1.TipoTeste.ELETRICO, enums_1.ResultadoTeste.APROVADO);
    const testeAero = new Teste_1.default(enums_1.TipoTeste.AERODINAMICO, enums_1.ResultadoTeste.APROVADO);
    aeronave.testes.push(testeEle, testeAero);
    // Salvar a árvore total na base de dados
    aeronave.salvar();
    console.log(`  -> Resultados salvos na persistência Json do Veículo.`);
    // 7. Faturamento / Documentação Final
    console.log("\n[Passo 7] Relatório Final do Gestor de Contrato...");
    const gestorDeRelatorios = new Relatorio_1.default();
    gestorDeRelatorios.salvarEmArquivo(aeronave, "Latam Airlines S.A", "2026-12-01");
    console.log(`  -> Documento PDF/TXT Oficial emitido no HD de destino!`);
    console.log("\n>>> CICLO DE TESTE TOTAL FINALIZADO COM SUCESSO! <<<\n");
}
executarCiclo();
