import React, { FormEvent, useEffect, useState } from "react";
import { ModalBase } from "../ui/ModalBase";
import { Botao } from "../ui/Botao";
import { FormularioHospede, Hospede, TipoDocumentoHospede } from "../../types/hospede";
import css from "../../styles/modals/ModalHospede.module.css";

interface ModalCriarHospedeProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: (dados: FormularioHospede) => void;
  titulares: Hospede[];
}

type TipoCadastro = "titular" | "dependente";

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

export function ModalCriarHospede({ aberto, onFechar, onSalvar, titulares }: ModalCriarHospedeProps) {
  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>("titular");
  const [dados, setDados] = useState<FormularioHospede>(formularioInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;
    setTipoCadastro("titular");
    setDados(formularioInicial);
    setErro("");
  }, [aberto]);

  function fechar() {
    setTipoCadastro("titular");
    setDados(formularioInicial);
    setErro("");
    onFechar();
  }

  function alterarTipoCadastro(tipo: TipoCadastro) {
    setTipoCadastro(tipo);
    setErro("");
    setDados((atual) => ({
      ...atual,
      titularId: tipo === "dependente" ? titulares[0]?.id : undefined,
    }));
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

    if (tipoCadastro === "dependente") {
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

    onSalvar({
      ...dados,
      titularId: tipoCadastro === "dependente" ? dados.titularId : undefined,
    });
    fechar();
  }

  const titularSelecionado = titulares.find((titular) => titular.id === dados.titularId);
  const enderecoBloqueado = tipoCadastro === "dependente";

  const rodape = (
    <>
      <Botao variant="ghost" type="button" onClick={fechar}>Cancelar</Botao>
      <Botao variant="primario" type="submit" form="form-criar-hospede">Cadastrar hóspede</Botao>
    </>
  );

  return (
    <ModalBase
      aberto={aberto}
      onFechar={fechar}
      titulo="Novo Hóspede"
      subtitulo="Cadastre um titular ou dependente seguindo os dados do modelo do Atlantis"
      largura="lg"
      rodape={rodape}
    >
      <form id="form-criar-hospede" className={css.formulario} onSubmit={salvar}>
        {erro && <div className={css.erro}>{erro}</div>}

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Tipo de cadastro</h3>
            <p className={css.blocoDescricao}>Dependentes herdam endereço e telefone do titular.</p>
          </div>

          <div className={css.tipoGrid}>
            <button
              type="button"
              className={`${css.tipoCard} ${tipoCadastro === "titular" ? css.tipoCardAtivo : ""}`}
              onClick={() => alterarTipoCadastro("titular")}
            >
              <span className={css.tipoTitulo}>Titular</span>
              <span className={css.tipoDescricao}>Hóspede responsável pelo endereço, telefones e dependentes.</span>
            </button>

            <button
              type="button"
              className={`${css.tipoCard} ${tipoCadastro === "dependente" ? css.tipoCardAtivo : ""}`}
              onClick={() => alterarTipoCadastro("dependente")}
              disabled={titulares.length === 0}
            >
              <span className={css.tipoTitulo}>Dependente</span>
              <span className={css.tipoDescricao}>Hóspede vinculado a um titular já cadastrado.</span>
            </button>
          </div>
        </section>

        {tipoCadastro === "dependente" && (
          <section className={css.bloco}>
            <div className={css.campo}>
              <label htmlFor="titularId">Titular responsável</label>
              <select
                id="titularId"
                className={css.select}
                value={dados.titularId ?? ""}
                onChange={(evento) => alterarCampo("titularId", Number(evento.target.value))}
                required
              >
                {titulares.map((titular) => (
                  <option key={titular.id} value={titular.id}>{titular.nome}</option>
                ))}
              </select>
            </div>

            <div className={css.infoBox}>
              Endereço e telefone serão clonados do titular selecionado
              {titularSelecionado ? <strong> {titularSelecionado.nome}</strong> : ""}, mantendo a regra de dependentes do Atlantis.
            </div>
          </section>
        )}

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Dados pessoais</h3>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                className={css.input}
                value={dados.nome}
                onChange={(evento) => alterarCampo("nome", evento.target.value)}
                required
              />
            </div>

            <div className={css.campo}>
              <label htmlFor="nomeSocial">Nome social</label>
              <input
                id="nomeSocial"
                className={css.input}
                value={dados.nomeSocial}
                onChange={(evento) => alterarCampo("nomeSocial", evento.target.value)}
              />
            </div>
          </div>

          <div className={css.grid3}>
            <div className={css.campo}>
              <label htmlFor="dataNascimento">Nascimento</label>
              <input
                id="dataNascimento"
                type="date"
                className={css.input}
                value={dados.dataNascimento}
                onChange={(evento) => alterarCampo("dataNascimento", evento.target.value)}
                required
              />
            </div>

            <div className={css.campo}>
              <label htmlFor="documentoTipo">Tipo de documento</label>
              <select
                id="documentoTipo"
                className={css.select}
                value={dados.documento.tipo}
                onChange={(evento) => alterarDocumento("tipo", evento.target.value as TipoDocumentoHospede)}
              >
                {documentoTipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>

            <div className={css.campo}>
              <label htmlFor="documentoNumero">Número</label>
              <input
                id="documentoNumero"
                className={css.input}
                value={dados.documento.numero}
                onChange={(evento) => alterarDocumento("numero", evento.target.value)}
                required
              />
            </div>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="documentoExpedicao">Data de expedição</label>
              <input
                id="documentoExpedicao"
                type="date"
                className={css.input}
                value={dados.documento.dataExpedicao}
                onChange={(evento) => alterarDocumento("dataExpedicao", evento.target.value)}
                required
              />
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
              <label htmlFor="rua">Rua</label>
              <input id="rua" className={css.input} value={dados.endereco.rua} onChange={(evento) => alterarEndereco("rua", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="bairro">Bairro</label>
              <input id="bairro" className={css.input} value={dados.endereco.bairro} onChange={(evento) => alterarEndereco("bairro", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>

          <div className={css.grid3}>
            <div className={css.campo}>
              <label htmlFor="cidade">Cidade</label>
              <input id="cidade" className={css.input} value={dados.endereco.cidade} onChange={(evento) => alterarEndereco("cidade", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="estado">Estado</label>
              <input id="estado" className={css.input} value={dados.endereco.estado} onChange={(evento) => alterarEndereco("estado", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="pais">País</label>
              <input id="pais" className={css.input} value={dados.endereco.pais} onChange={(evento) => alterarEndereco("pais", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="codigoPostal">Código postal</label>
              <input id="codigoPostal" className={css.input} value={dados.endereco.codigoPostal} onChange={(evento) => alterarEndereco("codigoPostal", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
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
              <label htmlFor="ddd">DDD</label>
              <input id="ddd" className={css.input} value={dados.telefone.ddd} onChange={(evento) => alterarTelefone("ddd", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
            <div className={css.campo}>
              <label htmlFor="telefone">Número</label>
              <input id="telefone" className={css.input} value={dados.telefone.numero} onChange={(evento) => alterarTelefone("numero", evento.target.value)} disabled={enderecoBloqueado} required={!enderecoBloqueado} />
            </div>
          </div>
        </section>
      </form>
    </ModalBase>
  );
}
