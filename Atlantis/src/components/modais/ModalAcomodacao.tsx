import React, { FormEvent, useEffect, useState } from "react";
import { ModalBase } from "../ui/ModalBase";
import { Botao } from "../ui/Botao";
import { Acomodacao, CategoriaAcomodacao, FormularioAcomodacao } from "../../types/hospede";
import css from "../../styles/modals/ModalHospede.module.css";

interface ModalAcomodacaoProps {
  aberto: boolean;
  acomodacao?: Acomodacao | null;
  onFechar: () => void;
  onSalvar: (dados: FormularioAcomodacao) => void;
}

const formularioInicial: FormularioAcomodacao = {
  nome: "",
  descricao: "",
  camaSolteiro: 0,
  camaCasal: 0,
  suite: 1,
  climatizacao: true,
  garagem: 0,
  categoria: "solteiro",
};

const categorias: CategoriaAcomodacao[] = ["solteiro", "casal", "familia"];

const categoriaLabel: Record<CategoriaAcomodacao, string> = {
  solteiro: "Solteiro(a)",
  casal: "Casal",
  familia: "Família",
};

export function ModalAcomodacao({ aberto, acomodacao, onFechar, onSalvar }: ModalAcomodacaoProps) {
  const [dados, setDados] = useState<FormularioAcomodacao>(formularioInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;

    if (acomodacao) {
      setDados({
        nome: acomodacao.nome,
        descricao: acomodacao.descricao,
        camaSolteiro: acomodacao.camaSolteiro,
        camaCasal: acomodacao.camaCasal,
        suite: acomodacao.suite,
        climatizacao: acomodacao.climatizacao,
        garagem: acomodacao.garagem,
        categoria: acomodacao.categoria,
      });
    } else {
      setDados(formularioInicial);
    }

    setErro("");
  }, [aberto, acomodacao]);

  function fechar() {
    setDados(formularioInicial);
    setErro("");
    onFechar();
  }

  function alterarCampo(campo: keyof FormularioAcomodacao, valor: string | number | boolean) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  function validarFormulario() {
    if (!dados.nome.trim()) return "Informe o nome da acomodação.";
    if (!dados.descricao.trim()) return "Informe a descrição da acomodação.";
    if (dados.camaSolteiro < 0 || dados.camaCasal < 0 || dados.suite < 0 || dados.garagem < 0) {
      return "As quantidades não podem ser negativas.";
    }
    if (dados.camaSolteiro + dados.camaCasal === 0) return "Informe pelo menos uma cama.";
    return "";
  }

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    onSalvar(dados);
    fechar();
  }

  const rodape = (
    <>
      <Botao variant="ghost" type="button" onClick={fechar}>Cancelar</Botao>
      <Botao variant="primario" type="submit" form="form-acomodacao">
        {acomodacao ? "Salvar alterações" : "Cadastrar acomodação"}
      </Botao>
    </>
  );

  return (
    <ModalBase
      aberto={aberto}
      onFechar={fechar}
      titulo={acomodacao ? "Editar Acomodação" : "Nova Acomodação"}
      subtitulo="Cadastre ou ajuste os tipos de acomodação do resort"
      largura="lg"
      rodape={rodape}
    >
      <form id="form-acomodacao" className={css.formulario} onSubmit={salvar}>
        {erro && <div className={css.erro}>{erro}</div>}

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Dados da acomodação</h3>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="nomeAcomodacao">Nome</label>
              <input
                id="nomeAcomodacao"
                className={css.input}
                value={dados.nome}
                onChange={(evento) => alterarCampo("nome", evento.target.value)}
                required
              />
            </div>

            <div className={css.campo}>
              <label htmlFor="categoriaAcomodacao">Categoria</label>
              <select
                id="categoriaAcomodacao"
                className={css.select}
                value={dados.categoria}
                onChange={(evento) => alterarCampo("categoria", evento.target.value as CategoriaAcomodacao)}
              >
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>{categoriaLabel[categoria]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={css.campo}>
            <label htmlFor="descricaoAcomodacao">Descrição</label>
            <input
              id="descricaoAcomodacao"
              className={css.input}
              value={dados.descricao}
              onChange={(evento) => alterarCampo("descricao", evento.target.value)}
              required
            />
          </div>
        </section>

        <section className={css.bloco}>
          <div className={css.blocoHeader}>
            <h3 className={css.blocoTitulo}>Estrutura</h3>
            <p className={css.blocoDescricao}>Esses campos representam a tabela de acomodações da AV3.</p>
          </div>

          <div className={css.grid3}>
            <div className={css.campo}>
              <label htmlFor="camaSolteiro">Cama solteiro</label>
              <input
                id="camaSolteiro"
                type="number"
                min={0}
                className={css.input}
                value={dados.camaSolteiro}
                onChange={(evento) => alterarCampo("camaSolteiro", Number(evento.target.value))}
              />
            </div>

            <div className={css.campo}>
              <label htmlFor="camaCasal">Cama casal</label>
              <input
                id="camaCasal"
                type="number"
                min={0}
                className={css.input}
                value={dados.camaCasal}
                onChange={(evento) => alterarCampo("camaCasal", Number(evento.target.value))}
              />
            </div>

            <div className={css.campo}>
              <label htmlFor="suite">Suítes</label>
              <input
                id="suite"
                type="number"
                min={0}
                className={css.input}
                value={dados.suite}
                onChange={(evento) => alterarCampo("suite", Number(evento.target.value))}
              />
            </div>
          </div>

          <div className={css.grid2}>
            <div className={css.campo}>
              <label htmlFor="garagem">Garagem</label>
              <input
                id="garagem"
                type="number"
                min={0}
                className={css.input}
                value={dados.garagem}
                onChange={(evento) => alterarCampo("garagem", Number(evento.target.value))}
              />
            </div>

            <label className={css.checkboxInline}>
              <input
                type="checkbox"
                checked={dados.climatizacao}
                onChange={(evento) => alterarCampo("climatizacao", evento.target.checked)}
              />
              Possui climatização
            </label>
          </div>
        </section>
      </form>
    </ModalBase>
  );
}
