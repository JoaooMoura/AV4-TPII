import { EnderecoHospede, Hospede, TelefoneHospede } from "../types/hospede";

const enderecoJoao: EnderecoHospede = {
  rua: "Rua das Palmeiras",
  bairro: "Jardim Atlântico",
  cidade: "Hortolândia",
  estado: "SP",
  pais: "Brasil",
  codigoPostal: "13184-000",
};

const telefoneJoao: TelefoneHospede = { ddd: "19", numero: "99999-1111" };

export const hospedesIniciais: Hospede[] = [
  {
    id: 1,
    nome: "João Silva",
    nomeSocial: "",
    dataNascimento: "1985-04-12",
    dataCadastro: "2026-05-18",
    documentos: [{ tipo: "CPF", numero: "111.222.333-44", dataExpedicao: "2015-03-10" }],
    endereco: enderecoJoao,
    telefones: [telefoneJoao],
    dependentesIds: [2],
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    nomeSocial: "Maria",
    dataNascimento: "2012-09-21",
    dataCadastro: "2026-05-18",
    documentos: [{ tipo: "RG", numero: "22.333.444-5", dataExpedicao: "2020-07-03" }],
    endereco: { ...enderecoJoao },
    telefones: [{ ...telefoneJoao }],
    dependentesIds: [],
    titularId: 1,
  },
  {
    id: 3,
    nome: "Carlos Mendes",
    nomeSocial: "",
    dataNascimento: "1991-11-05",
    dataCadastro: "2026-05-20",
    documentos: [{ tipo: "CPF", numero: "333.444.555-66", dataExpedicao: "2016-08-14" }],
    endereco: {
      rua: "Avenida Central",
      bairro: "Centro",
      cidade: "Campinas",
      estado: "SP",
      pais: "Brasil",
      codigoPostal: "13010-000",
    },
    telefones: [{ ddd: "19", numero: "98888-2222" }],
    dependentesIds: [],
  },
];
