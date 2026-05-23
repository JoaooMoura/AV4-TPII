import React, { FormEvent, useEffect, useState } from "react";
import { ModalBase } from "../ui/ModalBase";
import { Botao } from "../ui/Botao";
import { FormularioHospede, Hospede, TipoDocumentoHospede } from "../../types/hospede";
import css from "../../styles/modals/ModalHospede.module.css";

interface ModalEditarHospedeProps {
  aberto: boolean;
  hospede: Hospede | null;
  titulares: Hospede[];
  onFechar: () => void;
  onSalvar: (id: number, dados: FormularioHospede) => void;
}

const documentoTipos: TipoDocumentoHospede[] = ["CPF", "RG", "Passaporte"];

const formularioInicial: FormularioHospede = {
  nome: "",
  nomeSocial: "",
  dataNascimento: "",
  documento: {
    tipo: "CPF",
    numero: "",
    dataExpedicao: "",
  },
  endereco: {
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
    codigoPostal: "",
  },
  telefone: {
    ddd: "",
    numero: "",
  },
};

function montarFormulario(hospede: Hospede): FormularioHospede {
  return {
    nome: hospede.nome,
    nomeSocial: hospede.nomeSocial,
    dataNascimento: hospede.dataNascimento,
    documento: hospede.documentos[0] ?? {
      tipo: "CPF",
      numero: "",
      dataExpedicao: "",
    },
    endereco: hospede.endereco,
    telefone: hospede.telefones[0] ?? {
      ddd: "",
      numero: "",
    },
    titularId: hospede.titularId,
  };
}

export function ModalEditarHospede({ aberto, hospede, titulares, onFechar, onSalvar }: ModalEditarHospedeProps) {
  const [dados, setDados] = useState<FormularioHospede>(formularioInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto || !hospede) return;
    setDados(montarFormulario(hospede));
    setErro("");
  }, [aberto, hospede]);

  if (!hospede) return null;

  const ehDependente = Boolean(hospede.titularId);
  const titularesDisponiveis = titulares.filter((titular) => titular.id !== hospede.id);
  const titularSelecionado = titularesDisponiveis.find((titular) => titular.id === dados.titularId);
  const enderecoBloqueado = ehDependente;

  function fechar() {
    setErro("");
    onFechar();
  }

  function alterarCampo(campo: keyof FormularioHospede, valor: string | number | undefined) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  function alterarDocumento(campo: keyof FormularioHospede["documento"], valor: string) {
    setDados((atual) => ({
      ...atual,
      documento: { ...atual.documento, [campo]: valor },
    }));
  }

  function alterarEndereco(campo: keyof FormularioHospede["endereco"], valor: string) {
    setDados((atual) => ({
      ...atual,
      endereco: { ...atual.endereco, [campo]: valor },
    }));
  }

  function alterarTelefone(campo: keyof FormularioHospede["telefone"], valor: string) {
    setDados((atual) => ({
      ...atual,
      telefone: { ...atual.telefone, [campo]: valor },
    }));
  }

  function validarFormulario() {
    if (!dados.nome.trim()) return "Informe o nome do hóspede.";
    if (!dados.dataNascimento) return "Informe a data de nascimento.";
    if (!dados.documento.numero.trim()) return "Informe o número do documento.";
    if (!dados.documento.dataExpedicao) return "Informe a data de expedição do documento.";

    if (ehDependente) {
      if (!dados.titularId) return "Selecione o titular responsável pelo dependente.";
      return "";
    }

    if (!dados.endereco.rua.trim()) return "Informe a rua do endereço.";
    if (!dados.endereco.bairro.trim()) return "Informe o bairro do endereço.";
    if (!dados.endereco.cidade.trim()) return "Informe a cidade do endereço.";
    if (!dados.endereco.estado.trim()) return "Informe o estado do endereço.";
    if (!dados.endereco.pais.trim()) return "Informe o país do endereço.";
    if (!dados.endereco.codigoPostal.trim()) return "Informe o código postal.";
    if (!dados.telefone.ddd.trim()) return "Informe o DDD do telefone.";
    if (!dados.telefone.numero.trim()) return "Informe o número do telefone.";

    return "";
  }

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    onSalvar(hospede!.id, {
      ...dados,
      titularId: ehDependente ? dados.titularId : undefined,
    });
    fechar();
  }

  const rodape = (
    <>
      <Botao variant="ghost" type="button" onClick={fechar}>Cancelar</Botao>
      <Botao variant="primario" type="submit" form="form-editar-hospede">Salvar alterações</Botao>
    </>
  );

  return (
    <ModalBase
      aberto={aberto}
      onFechar={fechar}
      titulo="Editar Hóspede"
      subtitulo="Atualize os dados do hóspede mantendo o relacionamento com titular/dependente"
      largura="lg"
      rodape={rodape}
    >
      <form id="form-editar-hospede" className={css.formulario} onSubmit={salvar}>
        {erro && <div className={css.erro}>{erro}</div>}

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Tipo de cadastro</h3>
            <p className={css.blocoDescricao}>O tipo fica bloqueado na edição para preservar os vínculos existentes.</p>
          </div>

          <div className={css.tipoGrid}>
            <button
              type="button"
              className={`${css.tipoCard} ${!ehDependente ? css.tipoCardAtivo : ""}`}
              disabled
            >
              <span className={css.tipoTitulo}>Titular</span>
              <span className={css.tipoDescricao}>Responsável por endereço, telefones e dependentes.</span>
            </button>

            <button
              type="button"
              className={`${css.tipoCard} ${ehDependente ? css.tipoCardAtivo : ""}`}
              disabled
            >
              <span className={css.tipoTitulo}>Dependente</span>
              <span className={css.tipoDescricao}>Vinculado a um titular já cadastrado.</span>
            </button>
          </div>
        </section>

        {ehDependente && (
          <section className={css.bloco}>
            <div className={css.campo}>
              <label htmlFor="editarTitularId">Titular responsável</label>
              <select
                id="editarTitularId"
                className={css.select}
                value={dados.titularId ?? ""}
                onChange={(evento) => alterarCampo("titularId", Number(evento.target.value))}
                required
              >
                {titularesDisponiveis.map((titular) => (
                  <option key={titular.id} value={titular.id}>{titular.nome}</option>
                ))}
              </select>
            </div>

            <div className={css.infoBox}>
              Endereço e telefone serão clonados do titular selecionado
              {titularSelecionado ? <strong> {titularSelecionado.nome}</strong> : ""}.
            </div>
          </section>
        )}

        {!ehDependente && hospede.dependentesIds.length > 0 && (
          <div className={css.infoBox}>
            Este titular possui <strong>{hospede.dependentesIds.length}</strong> dependente(s). Alterações em endereço e telefone também serão refletidas nos dependentes vinculados.
          </div>
        )}

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Dados pessoais</h3>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="editarNome">Nome</label>
              <input id="editarNome" className={css.input} value={dados.nome} onChange={(evento) => alterarCampo("nome", evento.target.value)} required />
            </div>

            <div className={css.campo}>
              <label htmlFor="editarNomeSocial">Nome social</label>
              <input id="editarNomeSocial" className={css.input} value={dados.nomeSocial} onChange={(evento) => alterarCampo("nomeSocial", evento.target.value)} />
            </div>
          </div>

          <div className={css.grid3}>
            <div className={css.campo}>
              <label htmlFor="editarDataNascimento">Nascimento</label>
              <input id="editarDataNascimento" type="date" className={css.input} value={dados.dataNascimento} onChange={(evento) => alterarCampo("dataNascimento", evento.target.value)} required />
            </div>

            <div className={css.campo}>
              <label htmlFor="editarDocumentoTipo">Tipo de documento</label>
              <select id="editarDocumentoTipo" className={css.select} value={dados.documento.tipo} onChange={(evento) => alterarDocumento("tipo", evento.target.value as TipoDocumentoHospede)}>
                {documentoTipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>

            <div className={css.campo}>
              <label htmlFor="editarDocumentoNumero">Número</label>
              <input id="editarDocumentoNumero" className={css.input} value={dados.documento.numero} onChange={(evento) => alterarDocumento("numero", evento.target.value)} required />
            </div>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="editarDocumentoExpedicao">Data de expedição</label>
              <input id="editarDocumentoExpedicao" type="date" className={css.input} value={dados.documento.dataExpedicao} onChange={(evento) => alterarDocumento("dataExpedicao", evento.target.value)} required />
            </div>
          </div>
        </section>

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Endereço</h3>
            {enderecoBloqueado && <p className={css.blocoDescricao}>Para dependentes, estes dados vêm do titular.</p>}
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="editarRua">Rua</label>
              <input id="editarRua" className={css.input} value={dados.endereco.rua} onChange={(evento) => alterarEndereco("rua", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="editarBairro">Bairro</label>
              <input id="editarBairro" className={css.input} value={dados.endereco.bairro} onChange={(evento) => alterarEndereco("bairro", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>

          <div className={css.grid3}>
            <div className={css.campo}>
              <label htmlFor="editarCidade">Cidade</label>
              <input id="editarCidade" className={css.input} value={dados.endereco.cidade} onChange={(evento) => alterarEndereco("cidade", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="editarEstado">Estado</label>
              <input id="editarEstado" className={css.input} value={dados.endereco.estado} onChange={(evento) => alterarEndereco("estado", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="editarPais">País</label>
              <input id="editarPais" className={css.input} value={dados.endereco.pais} onChange={(evento) => alterarEndereco("pais", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="editarCodigoPostal">Código postal</label>
              <input id="editarCodigoPostal" className={css.input} value={dados.endereco.codigoPostal} onChange={(evento) => alterarEndereco("codigoPostal", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>
        </section>

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Telefone</h3>
            {enderecoBloqueado && <p className={css.blocoDescricao}>Para dependentes, estes dados vêm do titular.</p>}
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="editarDdd">DDD</label>
              <input id="editarDdd" className={css.input} value={dados.telefone.ddd} onChange={(evento) => alterarTelefone("ddd", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="editarTelefone">Número</label>
              <input id="editarTelefone" className={css.input} value={dados.telefone.numero} onChange={(evento) => alterarTelefone("numero", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>
        </section>
      </form>
    </ModalBase>
  );
}
