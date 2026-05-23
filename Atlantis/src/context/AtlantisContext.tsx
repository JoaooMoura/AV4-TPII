import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { acomodacoesIniciais } from "../data/acomodacoes";
import { hospedesIniciais } from "../data/hospedes";
import {
  Acomodacao,
  EnderecoHospede,
  FormularioAcomodacao,
  FormularioHospede,
  Hospedagem,
  Hospede,
  TelefoneHospede,
} from "../types/hospede";

interface AtlantisContextValue {
  hospedes: Hospede[];
  titulares: Hospede[];
  acomodacoes: Acomodacao[];
  hospedagens: Hospedagem[];
  criarHospede: (dados: FormularioHospede) => void;
  editarHospede: (id: number, dados: FormularioHospede) => void;
  excluirHospede: (id: number) => string | null;
  obterTitular: (hospede: Hospede) => Hospede | undefined;
  listarDependentes: (titularId: number) => Hospede[];
  criarAcomodacao: (dados: FormularioAcomodacao) => void;
  editarAcomodacao: (id: number, dados: FormularioAcomodacao) => void;
  excluirAcomodacao: (id: number) => string | null;
  criarHospedagem: (hospedeIds: number[], acomodacaoId: number) => void;
  excluirHospedagem: (id: number) => void;
  hospedesOcupados: number[];
  acomodacoesOcupadas: number[];
}

const AtlantisContext = createContext<AtlantisContextValue | null>(null);

function clonarEndereco(endereco: EnderecoHospede): EnderecoHospede {
  return { ...endereco };
}

function clonarTelefone(telefone: TelefoneHospede): TelefoneHospede {
  return { ...telefone };
}

function gerarId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function normalizarHospede(dados: FormularioHospede) {
  return {
    nome: dados.nome.trim(),
    nomeSocial: dados.nomeSocial.trim(),
    dataNascimento: dados.dataNascimento,
    documento: {
      ...dados.documento,
      numero: dados.documento.numero.trim(),
    },
    endereco: {
      rua: dados.endereco.rua.trim(),
      bairro: dados.endereco.bairro.trim(),
      cidade: dados.endereco.cidade.trim(),
      estado: dados.endereco.estado.trim(),
      pais: dados.endereco.pais.trim(),
      codigoPostal: dados.endereco.codigoPostal.trim(),
    },
    telefone: {
      ddd: dados.telefone.ddd.trim(),
      numero: dados.telefone.numero.trim(),
    },
    titularId: dados.titularId,
  };
}

function normalizarAcomodacao(dados: FormularioAcomodacao): FormularioAcomodacao {
  return {
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    camaSolteiro: Number(dados.camaSolteiro) || 0,
    camaCasal: Number(dados.camaCasal) || 0,
    suite: Number(dados.suite) || 0,
    climatizacao: Boolean(dados.climatizacao),
    garagem: Number(dados.garagem) || 0,
    categoria: dados.categoria,
  };
}

export function AtlantisProvider({ children }: { children: ReactNode }) {
  const [hospedes, setHospedes] = useState<Hospede[]>(hospedesIniciais);
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>(acomodacoesIniciais);
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);

  const titulares = useMemo(() => hospedes.filter((hospede) => !hospede.titularId), [hospedes]);

  const hospedesOcupados = useMemo(
    () => hospedagens.flatMap((hospedagem) => hospedagem.hospedeIds),
    [hospedagens]
  );

  const acomodacoesOcupadas = useMemo(
    () => hospedagens.map((hospedagem) => hospedagem.acomodacaoId),
    [hospedagens]
  );

  function obterTitular(hospede: Hospede) {
    return hospedes.find((item) => item.id === hospede.titularId);
  }

  function listarDependentes(titularId: number) {
    return hospedes.filter((hospede) => hospede.titularId === titularId);
  }

  function criarHospede(dadosFormulario: FormularioHospede) {
    const dados = normalizarHospede(dadosFormulario);

    setHospedes((atuais) => {
      const titular = dados.titularId ? atuais.find((hospede) => hospede.id === dados.titularId) : undefined;
      const novoId = gerarId();

      const novoHospede: Hospede = {
        id: novoId,
        nome: dados.nome,
        nomeSocial: dados.nomeSocial,
        dataNascimento: dados.dataNascimento,
        dataCadastro: new Date().toISOString().slice(0, 10),
        documentos: [{ ...dados.documento }],
        endereco: titular ? clonarEndereco(titular.endereco) : clonarEndereco(dados.endereco),
        telefones: [titular ? clonarTelefone(titular.telefones[0]) : clonarTelefone(dados.telefone)],
        dependentesIds: [],
        titularId: dados.titularId,
      };

      const atualizados = dados.titularId
        ? atuais.map((hospede) =>
            hospede.id === dados.titularId
              ? { ...hospede, dependentesIds: [...hospede.dependentesIds, novoId] }
              : hospede
          )
        : atuais;

      return [...atualizados, novoHospede];
    });
  }

  function editarHospede(id: number, dadosFormulario: FormularioHospede) {
    const dados = normalizarHospede(dadosFormulario);

    setHospedes((atuais) => {
      const original = atuais.find((hospede) => hospede.id === id);
      if (!original) return atuais;

      const novoTitular = dados.titularId ? atuais.find((hospede) => hospede.id === dados.titularId) : undefined;
      const enderecoAtualizado = original.titularId && novoTitular
        ? clonarEndereco(novoTitular.endereco)
        : clonarEndereco(dados.endereco);
      const telefoneAtualizado = original.titularId && novoTitular
        ? clonarTelefone(novoTitular.telefones[0])
        : clonarTelefone(dados.telefone);

      return atuais.map((hospede) => {
        if (hospede.id === id) {
          return {
            ...hospede,
            nome: dados.nome,
            nomeSocial: dados.nomeSocial,
            dataNascimento: dados.dataNascimento,
            documentos: [{ ...dados.documento }],
            endereco: enderecoAtualizado,
            telefones: [telefoneAtualizado],
            titularId: original.titularId ? dados.titularId : undefined,
          };
        }

        if (original.titularId && hospede.id === original.titularId && original.titularId !== dados.titularId) {
          return {
            ...hospede,
            dependentesIds: hospede.dependentesIds.filter((dependenteId) => dependenteId !== id),
          };
        }

        if (original.titularId && dados.titularId && hospede.id === dados.titularId && original.titularId !== dados.titularId) {
          return {
            ...hospede,
            dependentesIds: Array.from(new Set([...hospede.dependentesIds, id])),
          };
        }

        if (!original.titularId && original.dependentesIds.includes(hospede.id)) {
          return {
            ...hospede,
            endereco: clonarEndereco(dados.endereco),
            telefones: [clonarTelefone(dados.telefone)],
          };
        }

        return hospede;
      });
    });
  }

  function excluirHospede(id: number) {
    const hospede = hospedes.find((item) => item.id === id);
    if (!hospede) return "Hóspede não encontrado.";

    if (hospede.dependentesIds.length > 0) {
      return "Não é possível excluir um titular com dependentes vinculados.";
    }

    if (hospedesOcupados.includes(id)) {
      return "Não é possível excluir um hóspede que está em uma hospedagem ativa.";
    }

    setHospedes((atuais) =>
      atuais
        .filter((item) => item.id !== id)
        .map((item) =>
          item.id === hospede.titularId
            ? { ...item, dependentesIds: item.dependentesIds.filter((dependenteId) => dependenteId !== id) }
            : item
        )
    );

    return null;
  }

  function criarAcomodacao(dadosFormulario: FormularioAcomodacao) {
    const dados = normalizarAcomodacao(dadosFormulario);

    setAcomodacoes((atuais) => [
      ...atuais,
      {
        id: gerarId(),
        ...dados,
      },
    ]);
  }

  function editarAcomodacao(id: number, dadosFormulario: FormularioAcomodacao) {
    const dados = normalizarAcomodacao(dadosFormulario);

    setAcomodacoes((atuais) =>
      atuais.map((acomodacao) =>
        acomodacao.id === id
          ? {
              ...acomodacao,
              ...dados,
            }
          : acomodacao
      )
    );
  }

  function excluirAcomodacao(id: number) {
    if (acomodacoesOcupadas.includes(id)) {
      return "Não é possível excluir uma acomodação ocupada por hospedagem ativa.";
    }

    setAcomodacoes((atuais) => atuais.filter((acomodacao) => acomodacao.id !== id));
    return null;
  }

  function criarHospedagem(hospedeIds: number[], acomodacaoId: number) {
    const idsValidos = hospedeIds.filter((id) => !hospedesOcupados.includes(id));
    if (idsValidos.length === 0 || acomodacoesOcupadas.includes(acomodacaoId)) return;

    setHospedagens((atuais) => [
      ...atuais,
      {
        id: gerarId(),
        hospedeIds: idsValidos,
        acomodacaoId,
        dataEntrada: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
  }

  function excluirHospedagem(id: number) {
    setHospedagens((atuais) => atuais.filter((hospedagem) => hospedagem.id !== id));
  }

  const value: AtlantisContextValue = {
    hospedes,
    titulares,
    acomodacoes,
    hospedagens,
    criarHospede,
    editarHospede,
    excluirHospede,
    obterTitular,
    listarDependentes,
    criarAcomodacao,
    editarAcomodacao,
    excluirAcomodacao,
    criarHospedagem,
    excluirHospedagem,
    hospedesOcupados,
    acomodacoesOcupadas,
  };

  return <AtlantisContext.Provider value={value}>{children}</AtlantisContext.Provider>;
}

export function useAtlantis() {
  const context = useContext(AtlantisContext);

  if (!context) {
    throw new Error("useAtlantis precisa estar dentro do AtlantisProvider.");
  }

  return context;
}
