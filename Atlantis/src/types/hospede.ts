export type TipoDocumentoHospede = "CPF" | "RG" | "Passaporte";

export interface DocumentoHospede {
  numero: string;
  tipo: TipoDocumentoHospede;
  dataExpedicao: string;
}

export interface EnderecoHospede {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  codigoPostal: string;
}

export interface TelefoneHospede {
  ddd: string;
  numero: string;
}

export interface Hospede {
  id: number;
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  dataCadastro: string;
  telefones: TelefoneHospede[];
  endereco: EnderecoHospede;
  documentos: DocumentoHospede[];
  dependentesIds: number[];
  titularId?: number;
}

export interface FormularioHospede {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  documento: DocumentoHospede;
  endereco: EnderecoHospede;
  telefone: TelefoneHospede;
  titularId?: number;
}

export type CategoriaAcomodacao = "solteiro" | "casal" | "familia";

export interface Acomodacao {
  id: number;
  nome: string;
  descricao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
  categoria: CategoriaAcomodacao;
}

export interface FormularioAcomodacao {
  nome: string;
  descricao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
  categoria: CategoriaAcomodacao;
}

export interface Hospedagem {
  id: number;
  hospedeIds: number[];
  acomodacaoId: number;
  dataEntrada: string;
}
