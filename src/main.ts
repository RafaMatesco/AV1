import Aeronave from "./models/Aeronave";
import Peca from "./models/Peca";
import Etapa from "./models/Etapa";
import Funcionario from "./models/Funcionario";
import Teste from "./models/Teste";
import Relatorio from "./models/Relatorio";
import { TipoAeronave, TipoPeca, StatusPeca, StatusEtapa, NivelPermissao, TipoTeste, ResultadoTeste } from "./models/enums";

import * as readlineSync from "readline-sync";

function main(): void {
  let menuAtivo = true;
  let funcionarioLogado: Funcionario | null = null;

  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Bem vindo ao sistema Aerocode de gestão da produção de aeronaves!");
  console.log("Iniciando sistema...");

  let resp = "";
  while (menuAtivo) {
    if (!funcionarioLogado) {
      console.log("\n--- Autenticacao Necessaria ---");
      console.log("1. Login");
      console.log("2. Cadastrar Primeiro Funcionario (Primeiro uso)");
      console.log("3. Sair");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");

      resp = readlineSync.question("Digite a opcao escolhida: ");

      switch (resp) {
        case "1": {
          const usuario = readlineSync.question("Usuario: ");
          try {
            const func = Funcionario.carregarUsuario(usuario);
            const senha = readlineSync.question("Senha: ");

            if (func.autenticarUsuario(usuario, senha)) {
              funcionarioLogado = func;
              console.log(func.nome + " Autenticado");
            } else {
              console.log("Usuario ou senha incorretos.");
            }
          } catch (error: any) {
            console.log("Erro: " + error.message);
          }
          break;
        }
        case "2": {
          let funcsCarregados: Funcionario[] = [];
          try {
            funcsCarregados = Funcionario.carregarTodos();
          } catch (e) { }

          if (funcsCarregados.length > 0) {
            console.log("Ja existem funcionarios cadastrados. Faca login ou peca para um administrador cadastra-lo.");
          } else {
            console.log("\nCadastro do primeiro funcionario (Administrador):");
            try {
              const id = readlineSync.question("ID: ");
              const nome = readlineSync.question("Nome: ");
              const telefone = readlineSync.question("Telefone: ");
              const endereco = readlineSync.question("Endereco: ");
              const usuario = readlineSync.question("Usuario: ");
              const senha = readlineSync.question("Senha: ");
              const func = new Funcionario(id, nome, telefone, endereco, usuario, senha, NivelPermissao.ADMINISTRADOR);
              func.salvar();
              console.log("Funcionario administrador registrado com sucesso! Faca login agora.");
            } catch (error: any) {
              console.log(error.message);
            }
          }
          break;
        }
        case "3": {
          menuAtivo = false;
          break;
        }
        default: {
          console.log("Opcao invalida, tente novamente.");
          break;
        }
      }
    } else {
      console.log(`\nBem-vindo(a), ${funcionarioLogado.nome}!`);
      console.log("Escolha uma opcao: ");
      console.log("1. Gerenciar aeronaves");
      console.log("2. Gerenciar pecas");
      console.log("3. Gerenciar etapas");
      console.log("4. Gerenciar funcionarios");
      console.log("5. Gerenciar testes");
      console.log("6. Gerar relatorio final");
      console.log("7. Deslogar");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");

      resp = readlineSync.question("Digite a opcao escolhida: ");

      switch (resp) {
        case "1": {
          gerenciar_aeoronave();
          break;
        }
        case "2": {
          gerenciar_pecas();
          break;
        }
        case "3": {
          gerenciar_etapas();
          break;
        }
        case "4": {
          gerenciar_funcionarios();
          break;
        }
        case "5": {
          gerenciar_testes();
          break;
        }
        case "6": {
          gerar_relatorio();
          break;
        }
        case "7": {
          funcionarioLogado = null;
          console.log("Deslogado com sucesso.");
          break;
        }
        default: {
          console.log("Opcao invalida, tente novamente.");
          break;
        }
      }
    }
  }
}

function gerenciar_aeoronave(): void {
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Gerenciamento de Aeronaves");
  console.log("\n1. Registrar");
  console.log("2. Buscar por codigo");
  console.log("3. Listar tudo");
  console.log("4. Atualizar");
  console.log("5. Remover\n");
  console.log("Digite qualquer coisa para voltar\n");

  let opcao = readlineSync.question("Digite a opcao escolhida: ");
  switch (opcao) {
    // REGISTRAR AERONAVE
    case "1": {
      try {
        const codigo = readlineSync.question("Codigo: ");
        Aeronave.verificarExistencia(codigo);

        const modelo = readlineSync.question("Modelo: ");

        const tipos = ["COMERCIAL", "MILITAR"];
        const escolhaTipo = readlineSync.keyInSelect(tipos, "Tipo: ");
        const tipoRefinado = escolhaTipo === 0 ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR;
        const capacidade = Number(readlineSync.question("capacidade: "));
        const alcance = Number(readlineSync.question("alcance: "));
        const aeronave = new Aeronave(codigo, modelo, tipoRefinado, capacidade, alcance);
        aeronave.salvar();

        console.log("Aeronave registrada com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // BUSCAR AERONAVE
    case "2": {
      const codigoBusca = readlineSync.question("Digite o codigo da aeronave: ");
      try {
        const aeronave = Aeronave.carregar(codigoBusca);
        console.log(aeronave.detalhes());
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // CARREGAR TODAS AERONAVES
    case "3": {
      try {
        let aeronavesCarregadas = Aeronave.carregarTodas();
        if (aeronavesCarregadas.length > 0) {
          aeronavesCarregadas.forEach((aeronave) => {
            console.log(aeronave.detalhes());
          });
        } else {
          console.log("Nenhum dado encontrado");
        }

      } catch (error: any) { }
      break;
    }
    // ATUALIZAR AERONAVE
    case "4": {
      const codigoAtualizar = readlineSync.question("Digite o codigo da aeronave a ser atualizada: ");
      try {
        const aeronave = Aeronave.carregar(codigoAtualizar);

        const modeloNovo = readlineSync.question(`Modelo (${aeronave.modelo}): `);
        if (modeloNovo.trim().length > 0) aeronave.modelo = modeloNovo;

        const tipos = ["COMERCIAL", "MILITAR"];
        const escolhaTipo = readlineSync.keyInSelect(tipos, `Tipo atual: ${aeronave.tipo}. Selecionar novo tipo:`);
        if (escolhaTipo !== -1) {
          aeronave.tipo = escolhaTipo === 0 ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR;
        }

        const capacidadeNova = readlineSync.question(`Capacidade (${aeronave.capacidade}): `);
        if (capacidadeNova.trim().length > 0) aeronave.capacidade = Number(capacidadeNova);

        const alcanceNovo = readlineSync.question(`Alcance (${aeronave.alcance}): `);
        if (alcanceNovo.trim().length > 0) aeronave.alcance = Number(alcanceNovo);

        aeronave.salvar();
        console.log("Aeronave atualizada com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // REMOVER AERONAVE
    case "5": {
      const codigoRemover = readlineSync.question("Digite o codigo da aeronave a ser removida: ");
      const removido = Aeronave.remover(codigoRemover);
      if (removido) {
        console.log("Aeronave removida com sucesso!");
      } else {
        console.log("Aeronave nao encontrada.");
      }
      break;
    }
    default:
      console.log("\nVoltando");
      break;
  }
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
}

function gerenciar_pecas(): void {
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Gerenciamento de Pecas");
  console.log("\n1. Registrar");
  console.log("2. Buscar por nome");
  console.log("3. Listar tudo");
  console.log("4. Atualizar\n");
  console.log("Digite qualquer coisa para voltar\n");

  let opcao = readlineSync.question("Digite a opcao escolhida: ");
  switch (opcao) {
    // REGISTRAR PECA
    case "1": {
      try {
        // associar a uma aeronave
        const codigoAeronave = readlineSync.question("Digite o codigo da aeronave (Ex: EBM-001): ");
        const aeronave = Aeronave.carregar(codigoAeronave);

        // aqui comeca o cadastro da peca
        const nome = readlineSync.question("Nome: ");
        const tipos = ["NACIONAL", "IMPORTADA"];
        const escolhaTipo = readlineSync.keyInSelect(tipos, "Tipo: ");
        if (escolhaTipo === -1) break;
        const tipoRefinado = escolhaTipo === 0 ? TipoPeca.NACIONAL : TipoPeca.IMPORTADA;

        const prazo = readlineSync.question("Prazo (YYYY-MM-DD): ");
        const fornecedor = readlineSync.question("Fornecedor: ");

        const statusOpcoes = ["EM_PRODUCAO", "EM_TRANSPORTE", "PRONTA"];
        const escolhaStatus = readlineSync.keyInSelect(statusOpcoes, "Status: ");
        if (escolhaStatus === -1) break;
        let statusRefinado = StatusPeca.EM_PRODUCAO;
        if (escolhaStatus === 0) statusRefinado = StatusPeca.EM_PRODUCAO;
        if (escolhaStatus === 1) statusRefinado = StatusPeca.EM_TRANSPORTE;
        if (escolhaStatus === 2) statusRefinado = StatusPeca.PRONTA;

        const peca = new Peca(nome, tipoRefinado, prazo, fornecedor, statusRefinado);

        aeronave.pecas.push(peca);
        aeronave.salvar();
        console.log("Peca registrada na aeronave com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // VISUALIZAR PECA
    case "2": {
      const nomeBusca = readlineSync.question("Digite o nome da peca: ");
      try {
        const pecas = Aeronave.carregarTodas().flatMap((a: Aeronave) => a.pecas);
        const peca = pecas.find((p: Peca) => p.nome === nomeBusca);
        if (peca) {
          console.log(`\nNome: ${peca.nome}\nTipo: ${peca.tipo}\nPrazo: ${peca.prazo}\nFornecedor: ${peca.fornecedor}\nStatus: ${peca.status}\n`);
        } else {
          console.log("Peça não encontrada em nenhuma aeronave.");
        }
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // LISTAR TODAS PECAS
    case "3": {
      try {
        // as pecas sao cadastradas dentro das aeronaves, entao ele pega as pecas do JSON das aeronaves
        let pecasCarregadas = Aeronave.carregarTodas().flatMap((a: Aeronave) => a.pecas);
        if (pecasCarregadas.length > 0) {
          pecasCarregadas.forEach((peca) => {
            console.log(`\nNome: ${peca.nome}\nTipo: ${peca.tipo}\nPrazo: ${peca.prazo}\nFornecedor: ${peca.fornecedor}\nStatus: ${peca.status}`);
          });
        } else {
          console.log("Nenhum dado encontrado");
        }

      } catch (error: any) {
        console.log("Erro ao listar pecas: " + error.message);
      }
      break;
    }
    // ATUALIZAR PECA
    case "4": {
      const codigoAeronave = readlineSync.question("Digite o codigo da aeronave: ");
      try {
        const aeronave = Aeronave.carregar(codigoAeronave);

        const nomeAtualizar = readlineSync.question("Digite o nome da peca a ser atualizada: ");
        const peca = aeronave.pecas.find((p: Peca) => p.nome === nomeAtualizar);
        if (!peca) throw new Error("Aeronave nao possui tal peca.");

        const statusOpcoes = ["EM_PRODUCAO", "EM_TRANSPORTE", "PRONTA"];
        const escolhaStatus = readlineSync.keyInSelect(statusOpcoes, `Status atual: ${peca.status}. Selecionar novo status:`);
        if (escolhaStatus !== -1) {
          if (escolhaStatus === 0) peca.atualizarStatus(StatusPeca.EM_PRODUCAO);
          if (escolhaStatus === 1) peca.atualizarStatus(StatusPeca.EM_TRANSPORTE);
          if (escolhaStatus === 2) peca.atualizarStatus(StatusPeca.PRONTA);
        }

        aeronave.salvar();
        console.log("Peca atualizada com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    default:
      console.log("\nVoltando");
      break;
  }
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
}

function gerenciar_etapas(): void {
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Gerenciamento de Etapas");
  console.log("\n1. Registrar");
  console.log("2. Buscar por nome");
  console.log("3. Listar tudo");
  console.log("4. Atualizar status");
  console.log("5. Associar funcionario\n");
  console.log("Digite qualquer coisa para voltar\n");

  let opcao = readlineSync.question("Digite a opcao escolhida: ");
  switch (opcao) {
    // REGISTRAR ETAPA
    case "1": {
      try {
        //associa uma aeronave ao cadastro
        const codigoAeronave = readlineSync.question("Digite o codigo da aeronave: ");
        const aeronave = Aeronave.carregar(codigoAeronave);

        //inicia o cadastro da etapa
        const nome = readlineSync.question("Nome: ");
        const statusOpcoes = ["PENDENTE", "ANDAMENTO", "CONCLUIDA"];
        const escolhaStatus = readlineSync.keyInSelect(statusOpcoes, "Status: ");
        if (escolhaStatus === -1) break;
        let statusRefinado = StatusEtapa.PENDENTE;
        if (escolhaStatus === 0) statusRefinado = StatusEtapa.PENDENTE;
        if (escolhaStatus === 1) statusRefinado = StatusEtapa.ANDAMENTO;
        if (escolhaStatus === 2) {
          if (aeronave.etapas.length > 0 && aeronave.etapas[aeronave.etapas.length - 1].status !== StatusEtapa.CONCLUIDA) {
            console.log("Erro: Não é possível registrar esta etapa como CONCLUIDA pois a etapa anterior não está concluída.");
            break;
          }
          statusRefinado = StatusEtapa.CONCLUIDA;
        }
        const prazo = readlineSync.question("Prazo: ");

        const etapa = new Etapa(nome, statusRefinado, prazo);

        aeronave.etapas.push(etapa);
        aeronave.salvar();
        console.log("Etapa registrada na aeronave com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // VISUALIZAR ETAPA
    case "2": {
      const nomeBusca = readlineSync.question("Digite o nome da etapa: ");
      try {
        const etapas = Aeronave.carregarTodas().flatMap((a: Aeronave) => a.etapas);
        const etapa = etapas.find((e: Etapa) => e.nome === nomeBusca);
        if (etapa) {
          console.log(`\nNome: ${etapa.nome}\nStatus: ${etapa.status}\nFuncionarios Associados: ${etapa.funcionarios ? etapa.funcionarios.length : 0}\n`);
        } else {
          console.log("Etapa não encontrada");
        }
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // LISTAR TODAS ETAPA
    case "3": {
      try {
        let etapasCarregadas = Aeronave.carregarTodas().flatMap((a: Aeronave) => a.etapas);
        if (etapasCarregadas.length > 0) {
          etapasCarregadas.forEach((etapa) => {
            console.log(`\nNome: ${etapa.nome}\nStatus: ${etapa.status}\nFuncionarios Associados: ${etapa.funcionarios ? etapa.funcionarios.length : 0}`);
          });
        } else {
          console.log("Nenhum dado encontrado");
        }

      } catch (error: any) {
        console.log("Erro ao listar etapas: " + error.message);
      }
      break;
    }
    // ATUALIZAR STATUS ETAPA
    case "4": {
      const codigoAeronave = readlineSync.question("Digite o codigo da aeronave: ");
      try {
        const aeronave = Aeronave.carregar(codigoAeronave);

        const nomeAtualizar = readlineSync.question("Digite o nome da etapa a ser atualizada: ");
        const etapaIndex = aeronave.etapas.findIndex((e: Etapa) => e.nome === nomeAtualizar);
        if (etapaIndex === -1) throw new Error("Aeronave nao possui tal etapa.");
        const etapa = aeronave.etapas[etapaIndex];

        const statusOpcoes = ["Iniciar (ANDAMENTO)", "Finalizar (CONCLUIDA)"];
        const escolhaStatus = readlineSync.keyInSelect(statusOpcoes, `Status atual: ${etapa.status}. Acao:`);
        if (escolhaStatus !== -1) {
          if (escolhaStatus === 0) etapa.iniciar();
          if (escolhaStatus === 1) {
            if (etapaIndex > 0 && aeronave.etapas[etapaIndex - 1].status !== StatusEtapa.CONCLUIDA) {
              throw new Error("Não é possível concluir esta etapa pois a etapa anterior não está concluída.");
            }
            etapa.finalizar();
          }
        }

        aeronave.salvar();
        console.log("Etapa atualizada com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // ASSOCIAR FUNCIONARIO ETAPA
    case "5": {
      const codigoAeronave = readlineSync.question("Digite o codigo da aeronave: ");
      try {
        const aeronave = Aeronave.carregar(codigoAeronave);

        const nomeEtapa = readlineSync.question("Digite o nome da etapa: ");
        const etapa = aeronave.etapas.find((e: Etapa) => e.nome === nomeEtapa);
        if (!etapa) throw new Error("Aeronave nao possui tal etapa.");

        const idFuncionario = readlineSync.question("Digite o id do funcionario a associar: ");
        const funcionario = Funcionario.carregar(idFuncionario);

        etapa.associarFuncionario(funcionario);
        aeronave.salvar();
        console.log("Funcionario associado a etapa com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    default:
      console.log("\nVoltando");
      break;
  }
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
}

function gerenciar_funcionarios(): void {
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Gerenciamento de Funcionarios");
  console.log("\n1. Registrar");
  console.log("2. Buscar por ID");
  console.log("3. Listar tudo");
  console.log("4. Atualizar\n");
  console.log("Digite qualquer coisa para voltar\n");

  let opcao = readlineSync.question("Digite a opcao escolhida: ");
  switch (opcao) {
    // REGISTRAR FUNCIONARIO
    case "1": {
      try {
        const id = readlineSync.question("ID: ");
        const nome = readlineSync.question("Nome: ");
        const telefone = readlineSync.question("Telefone: ");
        const endereco = readlineSync.question("Endereco: ");
        const usuario = readlineSync.question("Usuario: ");
        const senha = readlineSync.question("Senha: ");

        const niveis = ["ADMINISTRADOR", "ENGENHEIRO", "OPERADOR"];
        const escolhaNivel = readlineSync.keyInSelect(niveis, "Nivel de Permissao: ");
        if (escolhaNivel === -1) break;
        let nivelRefinado = NivelPermissao.OPERADOR;
        if (escolhaNivel === 0) nivelRefinado = NivelPermissao.ADMINISTRADOR;
        if (escolhaNivel === 1) nivelRefinado = NivelPermissao.ENGENHEIRO;
        if (escolhaNivel === 2) nivelRefinado = NivelPermissao.OPERADOR;

        const func = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelRefinado);

        func.salvar();
        console.log("Funcionario registrado com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // VISUALIZAR FUNCIONARIO
    case "2": {
      const idBusca = readlineSync.question("Digite o ID do funcionario: ");
      try {
        const func = Funcionario.carregar(idBusca);
        console.log(`\nID: ${func.id}\nNome: ${func.nome}\nTelefone: ${func.telefone}\nPermissao: ${func.nivelPermissao}\n`);
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // LISTAR TODOS FUNCIONARIO
    case "3": {
      try {
        let funcsCarregados = Funcionario.carregarTodos();
        if (funcsCarregados.length > 0) {
          funcsCarregados.forEach((func) => {
            console.log(`\nID: ${func.id}\nNome: ${func.nome}\nTelefone: ${func.telefone}\nPermissao: ${func.nivelPermissao}`);
          });
        } else {
          console.log("Nenhum dado encontrado");
        }

      } catch (error: any) {
        console.log("Erro ao listar funcionarios: " + error.message);
      }
      break;
    }
    // ATUALIZAR FUNCIONARIO
    case "4": {
      const idAtualizar = readlineSync.question("Digite o ID do funcionario a ser atualizado: ");
      try {
        const func = Funcionario.carregar(idAtualizar);

        const nomeNovo = readlineSync.question(`Nome (${func.nome}): `);
        if (nomeNovo.trim().length > 0) func.nome = nomeNovo;

        const telefoneNovo = readlineSync.question(`Telefone (${func.telefone}): `);
        if (telefoneNovo.trim().length > 0) func.telefone = telefoneNovo;

        const niveis = ["ADMINISTRADOR", "ENGENHEIRO", "OPERADOR"];
        const escolhaNivel = readlineSync.keyInSelect(niveis, `Nivel atual: ${func.nivelPermissao}. Selecionar novo nivel:`);
        if (escolhaNivel !== -1) {
          if (escolhaNivel === 0) func.nivelPermissao = NivelPermissao.ADMINISTRADOR;
          if (escolhaNivel === 1) func.nivelPermissao = NivelPermissao.ENGENHEIRO;
          if (escolhaNivel === 2) func.nivelPermissao = NivelPermissao.OPERADOR;
        }

        func.salvar();
        console.log("Funcionario atualizado com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }

    default:
      console.log("Voltando");
      break;
  }
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
}

function gerenciar_testes(): void {
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Gerenciamento de Testes");
  console.log("\n1. Registrar");
  console.log("2. Listar tudo\n");
  console.log("Digite qualquer coisa para voltar\n");

  let opcao = readlineSync.question("Digite a opcao escolhida: ");
  switch (opcao) {
    // REGISTRAR TESTE
    case "1": {
      try {
        const codigoAeronave = readlineSync.question("Digite o codigo da aeronave: ");
        const aeronave = Aeronave.carregar(codigoAeronave);

        const tipos = ["ELETRICO", "HIDRAULICO", "AERODINAMICO"];
        const escolhaTipo = readlineSync.keyInSelect(tipos, "Tipo de Teste: ");
        if (escolhaTipo === -1) break;
        let tipoRefinado = TipoTeste.ELETRICO;
        if (escolhaTipo === 0) tipoRefinado = TipoTeste.ELETRICO;
        if (escolhaTipo === 1) tipoRefinado = TipoTeste.HIDRAULICO;
        if (escolhaTipo === 2) tipoRefinado = TipoTeste.AERODINAMICO;

        const resultados = ["APROVADO", "REPROVADO"];
        const escolhaResultado = readlineSync.keyInSelect(resultados, "Resultado do Teste: ");
        if (escolhaResultado === -1) break;
        let resultadoRefinado = ResultadoTeste.APROVADO;
        if (escolhaResultado === 0) resultadoRefinado = ResultadoTeste.APROVADO;
        if (escolhaResultado === 1) resultadoRefinado = ResultadoTeste.REPROVADO;

        const teste = new Teste(tipoRefinado, resultadoRefinado);

        aeronave.testes.push(teste);
        aeronave.salvar();

        console.log("Teste registrado na aeronave com sucesso!");
      } catch (error: any) {
        console.log(error.message);
      }
      break;
    }
    // LISTAR TODOS TESTE
    case "2": {
      try {
        let testesCarregados = Aeronave.carregarTodas().flatMap((a: Aeronave) => a.testes);
        if (testesCarregados.length > 0) {
          testesCarregados.forEach((teste, index) => {
            console.log(`\n[${index}] Tipo: ${teste.tipo} - Resultado: ${teste.resultado}`);
          });
        } else {
          console.log("Nenhum dado encontrado");
        }
      } catch (error: any) {
        console.log("Erro ao listar testes: " + error.message);
      }
      break;
    }
    default:
      console.log("Voltando");
      break;
  }
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
}

function gerar_relatorio(): void {
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("Gerar Relatório Final");
  try {
    const codigoAeronave = readlineSync.question("Digite o codigo da aeronave: ");
    const aeronave = Aeronave.carregar(codigoAeronave);

    const cliente = readlineSync.question("Nome do cliente: ");
    const dataEntrega = readlineSync.question("Data de entrega (DD/MM/YYYY): ");

    const relatorio = new Relatorio();
    relatorio.salvarEmArquivo(aeronave, cliente, dataEntrega);

    console.log(`Relatorio gerado em data/relatorios/${aeronave.codigo}.txt com sucesso!`);
  } catch (error: any) {
    console.log(error.message);
  }
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
}

main();
//the one piece is real
